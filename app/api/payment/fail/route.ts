import { NextRequest, NextResponse } from "next/server"

// Bridge route: receives POST from SSLCommerz when payment fails
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()

        // Extract data from SSLCommerz POST
        const orderId = formData.get("value_a")
        const tranId = formData.get("tran_id")
        const status = formData.get("status")
        const failedReason = formData.get("error")

        console.log("Fail callback received:", { orderId, tranId, status, failedReason })

        // Build fail page URL with query parameters
        const failUrl = new URL("/checkout/payment/failed", request.url)
        if (orderId) failUrl.searchParams.set("id", orderId as string)
        if (tranId) failUrl.searchParams.set("tran_id", tranId as string)
        if (status) failUrl.searchParams.set("status", status as string)
        if (failedReason) failUrl.searchParams.set("reason", failedReason as string)

        // 303 redirect (See Other)
        return NextResponse.redirect(failUrl, 303)
    } catch (error) {
        console.error("Fail callback error:", error)
        const failUrl = new URL("/checkout/payment/failed", request.url)
        failUrl.searchParams.set("reason", "processing_error")
        return NextResponse.redirect(failUrl, 303)
    }
}

