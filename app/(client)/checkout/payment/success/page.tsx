"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2, Package, AlertCircle } from "lucide-react"
import Link from "next/link"
import { verifyPayment } from "@/app/actions/payment"
import { formatPrice } from "@/utils/currency"

export default function PaymentSuccessPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isVerifying, setIsVerifying] = useState(true)
    const [orderDetails, setOrderDetails] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Get all parameters from SSLCommerz redirect
        const valId = searchParams.get("val_id")
        const tranId = searchParams.get("tran_id")
        const orderId = searchParams.get("value_a")
        const status = searchParams.get("status")

        // Log all parameters for debugging
        const allParams = Object.fromEntries(searchParams.entries())
        console.log("Payment success page loaded")
        console.log("All URL parameters:", allParams)
        console.log("Extracted values:", { valId, tranId, orderId, status })

        // Check if we have any payment parameters
        if (!valId && !tranId && !orderId) {
            console.error("No payment parameters found in URL")
            setError("No payment information received. The payment gateway did not return the expected data.")
            setIsVerifying(false)
            return
        }

        // If we have val_id, verify the payment
        if (valId) {
            console.log("Verifying payment with val_id:", valId)
            verifyPaymentStatus(valId)
        } else if (orderId) {
            // Fallback: if we only have orderId but no val_id (sandbox issue)
            console.log("No val_id found, but have orderId:", orderId)
            setError("Payment verification ID missing. This may be a sandbox environment issue.")
            setIsVerifying(false)
        } else {
            setError("Payment verification failed. Missing required parameters.")
            setIsVerifying(false)
        }
    }, [searchParams])

    const verifyPaymentStatus = async (valId: string) => {
        try {
            console.log("Calling verifyPayment server action...")
            const result = await verifyPayment(valId)
            console.log("Verification result:", result)

            if (result.success && result.order) {
                setOrderDetails(result.order)
            } else {
                setError(result.error || "Payment verification failed")
            }
        } catch (err) {
            console.error("Verification error:", err)
            setError("Failed to verify payment: " + (err instanceof Error ? err.message : "Unknown error"))
        } finally {
            setIsVerifying(false)
        }
    }

    if (isVerifying) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardContent className="pt-6">
                        <div className="text-center py-8">
                            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                            <p className="text-sm text-muted-foreground">
                                Verifying your payment...
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Please wait while we confirm your transaction
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-5 w-5" />
                            Payment Verification Issue
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                            <p className="text-sm text-destructive">{error}</p>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-sm text-yellow-800 font-medium mb-2">
                                Testing in Sandbox Mode?
                            </p>
                            <p className="text-xs text-yellow-700">
                                SSLCommerz sandbox may not redirect properly to localhost. Your payment might still be recorded. Check your orders page.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={() => router.push("/account/orders")}
                                className="w-full"
                            >
                                View My Orders
                            </Button>
                            <Button
                                onClick={() => router.push("/")}
                                variant="outline"
                                className="w-full"
                            >
                                Back to Home
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Success Card */}
                <Card className="border-green-200 bg-green-50/50">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-10 w-10 text-green-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-green-900 mb-2">
                                    Payment Successful!
                                </h1>
                                <p className="text-green-700">
                                    Your order has been confirmed and payment received
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Order Details */}
                {orderDetails && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Order Number</p>
                                    <p className="font-medium">{orderDetails.orderNumber}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Total Amount</p>
                                    <p className="font-medium text-lg">
                                        {formatPrice(parseFloat(orderDetails.totalAmount))}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Payment Method</p>
                                    <p className="font-medium">Online Payment</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Status</p>
                                    <p className="font-medium text-green-600">Paid</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t space-y-3">
                                <p className="text-sm text-muted-foreground">
                                    A confirmation email has been sent to <strong>{orderDetails.customerEmail}</strong>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    You can track your order status in your orders page.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        asChild
                        className="flex-1"
                        size="lg"
                    >
                        <Link href={orderDetails ? `/account/orders/${orderDetails.id}` : "/account/orders"}>
                            <Package className="h-4 w-4 mr-2" />
                            View Order Details
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        className="flex-1"
                        size="lg"
                    >
                        <Link href="/">
                            Continue Shopping
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
