import { NextRequest, NextResponse } from "next/server"

// Bridge route: receives POST from SSLCommerz, redirects to page with query params
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()

        // Extract all relevant data from SSLCommerz POST
        const orderId = formData.get("value_a")
        const tranId = formData.get("tran_id")
        const amount = formData.get("amount")
        const status = formData.get("status")
        const valId = formData.get("val_id")
        const cardType = formData.get("card_type")
        const cardBrand = formData.get("card_brand")

        console.log("Success callback received:", { orderId, tranId, amount, status, valId })

        // If orderId is missing, redirect to fail page
        if (!orderId) {
            const failUrl = new URL("/checkout/payment/failed", request.url)
            failUrl.searchParams.set("reason", "missing_order_id")
            return NextResponse.redirect(failUrl, 303)
        }

        // Build success page URL with query parameters (preserve SSLCommerz parameter names)
        const successUrl = new URL("/checkout/payment/success", request.url)
        successUrl.searchParams.set("value_a", orderId as string) // Keep SSLCommerz parameter name
        if (valId) successUrl.searchParams.set("val_id", valId as string)
        if (tranId) successUrl.searchParams.set("tran_id", tranId as string)
        if (amount) successUrl.searchParams.set("amount", amount as string)
        if (status) successUrl.searchParams.set("status", status as string)
        if (cardType) successUrl.searchParams.set("card_type", cardType as string)
        if (cardBrand) successUrl.searchParams.set("card_brand", cardBrand as string)

        // 303 redirect (See Other) - browser will follow with GET request
        return NextResponse.redirect(successUrl, 303)
    } catch (error) {
        console.error("Success callback error:", error)
        const failUrl = new URL("/checkout/payment/failed", request.url)
        failUrl.searchParams.set("reason", "processing_error")
        return NextResponse.redirect(failUrl, 303)
    }
}
