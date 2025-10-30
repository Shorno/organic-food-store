"use server"

import { db } from "@/db/config"
import { order, orderItem, payment } from "@/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { CreateOrderData, OrderResponse } from "@/lib/types/order"

function generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 7).toUpperCase()
    return `ORD-${timestamp}-${random}`
}

export async function createOrder(data: CreateOrderData): Promise<OrderResponse> {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user?.id) {
            return {
                success: false,
                error: "You must be logged in to place an order"
            }
        }

        const { shipping, items } = data

        if (!items || items.length === 0) {
            return {
                success: false,
                error: "Cart is empty"
            }
        }

        // Calculate totals
        const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0)
        const shippingAmount = 0
        const totalAmount = subtotal + shippingAmount

        // Generate order number
        const orderNumber = generateOrderNumber()

        // Create order in database
        const [newOrder] = await db.insert(order).values({
            orderNumber,
            userId: session.user.id,
            status: "pending",
            subtotal: subtotal.toString(),
            shippingAmount: shippingAmount.toString(),
            totalAmount: totalAmount.toString(),
            customerFullName: shipping.fullName,
            customerEmail: shipping.email,
            customerPhone: shipping.phone,
            shippingAddressLine: shipping.addressLine,
            shippingCity: shipping.city,
            shippingArea: shipping.area,
            shippingPostalCode: shipping.postalCode,
            shippingCountry: shipping.country,
        }).returning()

        // Create order items
        const orderItemsData = items.map(item => ({
            orderId: newOrder.id,
            productId: item.id,
            productName: item.name,
            productSize: item.size || "N/A",
            productImage: item.image || "",
            quantity: item.quantity,
            unitPrice: item.price.toString(),
            subtotal: item.subtotal.toString(),
            totalAmount: item.subtotal.toString(),
        }))

        await db.insert(orderItem).values(orderItemsData)

        // Create payment record
        await db.insert(payment).values({
            orderId: newOrder.id,
            paymentMethod: shipping.paymentType === "cod" ? "cod" : "bkash",
            paymentProvider: shipping.paymentType === "cod" ? "COD" : null,
            status: shipping.paymentType === "cod" ? "pending" : "pending",
            amount: totalAmount.toString(),
            currency: "BDT",
        })

        return {
            success: true,
            orderId: newOrder.id,
            orderNumber: newOrder.orderNumber,
        }
    } catch (error) {
        console.error("Error creating order:", error)
        return {
            success: false,
            error: "Failed to create order. Please try again."
        }
    }
}

export async function getOrderById(orderId: number) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user?.id) {
            return null
        }

        const [orderData] = await db.query.order.findMany({
            where: (order, { eq, and }) => and(
                eq(order.id, orderId),
                eq(order.userId, session.user.id)
            ),
            with: {
                items: true,
            },
        })

        return orderData
    } catch (error) {
        console.error("Error fetching order:", error)
        return null
    }
}

export async function getUserOrders() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user?.id) {
            return []
        }

        return await db.query.order.findMany({
            where: (order, { eq }) => eq(order.userId, session.user.id),
            with: {
                items: true,
            },
            orderBy: (order, { desc }) => [desc(order.created_at)],
        })
    } catch (error) {
        console.error("Error fetching orders:", error)
        return []
    }
}
