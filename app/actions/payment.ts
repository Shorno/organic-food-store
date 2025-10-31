"use server"

import { db } from "@/db/config"
import { order, payment } from "@/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { eq, and } from "drizzle-orm"

const SSLCOMMERZ_CONFIG = {
    storeId: process.env.STORE_ID!,
    storePassword: process.env.STORE_PASSWORD!,
    isLive: false, // Set to true for production
    successUrl: `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/checkout/payment/success`,
    failUrl: `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/checkout/payment/failed`,
    cancelUrl: `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/checkout/payment/failed`,
    ipnUrl: `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/payment/ipn`,
}

interface PaymentResponse {
    success: boolean
    gatewayUrl?: string
    error?: string
}

export async function initiatePayment(orderId: number): Promise<PaymentResponse> {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user?.id) {
            return {
                success: false,
                error: "You must be logged in"
            }
        }

        // Get order details
        const [orderData] = await db
            .select()
            .from(order)
            .where(
                and(
                    eq(order.id, orderId),
                    eq(order.userId, session.user.id)
                )
            )
            .limit(1)

        if (!orderData) {
            return {
                success: false,
                error: "Order not found"
            }
        }

        // Check if order is already paid
        if (orderData.status !== "pending") {
            return {
                success: false,
                error: "Order is already processed"
            }
        }

        // Generate transaction ID
        const transactionId = `TXN-${orderId}-${Date.now()}`

        // Prepare SSLCommerz payment data
        const paymentData: Record<string, string> = {
            store_id: SSLCOMMERZ_CONFIG.storeId,
            store_passwd: SSLCOMMERZ_CONFIG.storePassword,
            total_amount: orderData.totalAmount,
            currency: "BDT",
            tran_id: transactionId,
            success_url: SSLCOMMERZ_CONFIG.successUrl,
            fail_url: `${SSLCOMMERZ_CONFIG.failUrl}?orderId=${orderId}`,
            cancel_url: `${SSLCOMMERZ_CONFIG.cancelUrl}?orderId=${orderId}`,
            ipn_url: SSLCOMMERZ_CONFIG.ipnUrl,

            // Customer info
            cus_name: orderData.customerFullName,
            cus_email: orderData.customerEmail,
            cus_phone: orderData.customerPhone,
            cus_add1: orderData.shippingAddressLine,
            cus_city: orderData.shippingCity,
            cus_postcode: orderData.shippingPostalCode,
            cus_country: orderData.shippingCountry,

            // Shipping info
            shipping_method: "YES",
            ship_name: orderData.customerFullName,
            ship_add1: orderData.shippingAddressLine,
            ship_city: orderData.shippingCity,
            ship_postcode: orderData.shippingPostalCode,
            ship_country: orderData.shippingCountry,

            // Product info
            product_name: `Order #${orderData.orderNumber}`,
            product_category: "Food",
            product_profile: "general",

            // Additional
            value_a: orderId.toString(),
            value_b: session.user.id,
        }

        // Call SSLCommerz API
        const apiUrl = SSLCOMMERZ_CONFIG.isLive
            ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
            : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(paymentData).toString(),
        })

        const result = await response.json()
        console.log(result)

        if (result.status === "SUCCESS" && result.GatewayPageURL) {
            // Update payment record with transaction ID
            await db
                .update(payment)
                .set({
                    paymentProvider: transactionId,
                    status: "processing",
                })
                .where(eq(payment.orderId, orderId))

            return {
                success: true,
                gatewayUrl: result.GatewayPageURL,
            }
        } else {
            return {
                success: false,
                error: result.failedreason || "Failed to initiate payment",
            }
        }
    } catch (error) {
        console.error("Payment initiation error:", error)
        return {
            success: false,
            error: "Failed to initiate payment. Please try again.",
        }
    }
}

export async function verifyPayment(valId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user?.id) {
            return {
                success: false,
                error: "Unauthorized"
            }
        }

        // Validate payment with SSLCommerz using val_id
        const apiUrl = SSLCOMMERZ_CONFIG.isLive
            ? "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php"
            : "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php"

        const validationParams = new URLSearchParams({
            val_id: valId,
            store_id: SSLCOMMERZ_CONFIG.storeId,
            store_passwd: SSLCOMMERZ_CONFIG.storePassword,
            format: "json",
        })

        console.log("Validating payment with SSLCommerz:", { valId, apiUrl })

        const response = await fetch(`${apiUrl}?${validationParams.toString()}`)

        if (!response.ok) {
            console.error("SSLCommerz validation API error:", response.status, response.statusText)
            return {
                success: false,
                error: "Payment validation API failed"
            }
        }

        const result = await response.json()

        console.log("SSLCommerz validation response:", result)

        if (result.status === "VALID" || result.status === "VALIDATED") {
            const orderId = parseInt(result.value_a)
            const tranId = result.tran_id

            // Update order and payment status
            await db.transaction(async (tx) => {
                await tx
                    .update(order)
                    .set({
                        status: "confirmed",
                        confirmedAt: new Date(),
                    })
                    .where(eq(order.id, orderId))

                await tx
                    .update(payment)
                    .set({
                        status: "completed",
                        completedAt: new Date(),
                        paymentProvider: tranId,
                    })
                    .where(eq(payment.orderId, orderId))
            })

            // Get updated order
            const [orderData] = await db
                .select()
                .from(order)
                .where(eq(order.id, orderId))
                .limit(1)

            return {
                success: true,
                order: orderData,
            }
        } else {
            console.error("Payment validation failed:", result)
            return {
                success: false,
                error: result.error || "Payment validation failed",
            }
        }
    } catch (error) {
        console.error("Payment verification error:", error)
        return {
            success: false,
            error: "Failed to verify payment",
        }
    }
}
