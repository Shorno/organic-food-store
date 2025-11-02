"use server"

import { db } from "@/db/config"
import { order } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"


export async function deleteOrder(orderId: number) {
    try {
        await db
            .delete(order)
            .where(eq(order.id, orderId))

        revalidatePath("/admin/dashboard/orders")

        return {
            success: true,
            message: "Order deleted successfully"
        }
    } catch (error) {
        console.error("Error deleting order:", error)
        return {
            success: false,
            error: "Failed to delete order"
        }
    }
}

