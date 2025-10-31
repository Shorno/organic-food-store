import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db/config"
import { order, payment } from "@/db/schema"
import { eq } from "drizzle-orm"

// This endpoint receives payment notifications from SSLCommerz
export async function POST(request: NextRequest) {
    try {
        const body = await request.formData()

        const status = body.get("status") as string
        const tranId = body.get("tran_id") as string
        console.log(tranId)
        const valId = body.get("val_id") as string
        const amount = body.get("amount") as string
        const orderId = parseInt(body.get("value_a") as string)

        console.log("IPN Received:", { status, tranId, valId, amount, orderId })

        if (status === "VALID" || status === "VALIDATED") {
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

            return NextResponse.json({ success: true, message: "Payment confirmed" })
        } else if (status === "FAILED") {
            // Update payment as failed
            await db
                .update(payment)
                .set({
                    status: "failed",
                    failedAt: new Date(),
                })
                .where(eq(payment.orderId, orderId))

            return NextResponse.json({ success: false, message: "Payment failed" })
        }

        return NextResponse.json({ success: false, message: "Unknown status" })
    } catch (error) {
        console.error("IPN Error:", error)
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        )
    }
}

