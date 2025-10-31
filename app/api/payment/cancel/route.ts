import { NextRequest, NextResponse } from "next/server"

// Bridge route: receives POST from SSLCommerz when user cancels payment
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()

        // Extract data from SSLCommerz POST
        const orderId = formData.get("value_a")
        const tranId = formData.get("tran_id")
        const status = formData.get("status")

        console.log("Cancel callback received:", { orderId, tranId, status })

        // Build cancel/fail page URL with query parameters
        const cancelUrl = new URL("/checkout/payment/failed", request.url)
        if (orderId) cancelUrl.searchParams.set("id", orderId as string)
        if (tranId) cancelUrl.searchParams.set("tran_id", tranId as string)
        cancelUrl.searchParams.set("status", "CANCELLED")
        cancelUrl.searchParams.set("reason", "Payment cancelled by user")

        // 303 redirect (See Other)
        return NextResponse.redirect(cancelUrl, 303)
    } catch (error) {
        console.error("Cancel callback error:", error)
        const cancelUrl = new URL("/checkout/payment/failed", request.url)
        cancelUrl.searchParams.set("reason", "processing_error")
        return NextResponse.redirect(cancelUrl, 303)
    }
}

