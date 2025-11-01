import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()

        const orderId = formData.get("value_a")
        const tranId = formData.get("tran_id")
        const amount = formData.get("amount")
        const status = formData.get("status")
        const valId = formData.get("val_id")
        const cardIssuer = formData.get("card_issuer")
        const cardBrand = formData.get("card_brand")

        if (!orderId) {
            const failUrl = new URL("/checkout/payment/failed", request.url)
            failUrl.searchParams.set("reason", "missing_order_id")
            return NextResponse.redirect(failUrl, 303)
        }

        const successUrl = new URL("/checkout/payment/success", request.url)
        successUrl.searchParams.set("value_a", orderId as string)
        if (valId) successUrl.searchParams.set("val_id", valId as string)
        if (tranId) successUrl.searchParams.set("tran_id", tranId as string)
        if (amount) successUrl.searchParams.set("amount", amount as string)
        if (status) successUrl.searchParams.set("status", status as string)
        if (cardBrand) successUrl.searchParams.set("card_brand", cardBrand as string)
        if (cardIssuer) successUrl.searchParams.set("card_issuer", cardIssuer as string)

        return NextResponse.redirect(successUrl, 303)
    } catch (error) {
        console.error("Success callback error:", error)
        const failUrl = new URL("/checkout/payment/failed", request.url)
        failUrl.searchParams.set("reason", "processing_error")
        return NextResponse.redirect(failUrl, 303)
    }
}