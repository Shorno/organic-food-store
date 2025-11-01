import {checkAuth} from "@/app/actions/auth/checkAuth";
import {db} from "@/db/config";
import {order} from "@/db/schema";
import {and, eq} from "drizzle-orm";

const SSLCOMMERZ_CONFIG = {
    storeId: process.env.STORE_ID!,
    storePassword: process.env.STORE_PASSWORD!,
    isLive: process.env.IS_LIVE,
    successUrl: `${process.env.BETTER_AUTH_URL}/api/payment/success`,
    failUrl: `${process.env.BETTER_AUTH_URL}/api/payment/fail`,
    cancelUrl: `${process.env.BETTER_AUTH_URL}/api/payment/cancel`,
    ipnUrl: `${process.env.BETTER_AUTH_URL}/api/payment/ipn`,
}

interface PaymentResponse {
    success :boolean,
    gatewayURL? : string,
    error? : string
}

export async function initiatePayment(orderId: number): Promise<PaymentResponse>{
    try {
        const session = await checkAuth()
        if (!session?.user) {
            return {
                success: false,
                error: "You must be logged in"
            }
        }

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

        if (orderData.status !== "pending") {
            return {
                success: false,
                error: "Order is already processed"
            }
        }

        const transactionId = `TXN-${orderId}-${Date.now()}`

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





    }catch (error){
        console.log(error)
    }

}