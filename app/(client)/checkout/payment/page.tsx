"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CreditCard, AlertCircle, DollarSign } from "lucide-react"
import { initiatePayment } from "@/app/actions/payment"
import { toast } from "sonner"

export default function PaymentPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const orderId = searchParams.get("orderId")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showDevBypass, setShowDevBypass] = useState(false)

    useEffect(() => {
        if (!orderId) {
            setError("Order ID is missing")
            setIsLoading(false)
            return
        }

        // Show dev bypass option after 2 seconds if in development
        const timer = setTimeout(() => {
            if (process.env.NODE_ENV === 'development') {
                setShowDevBypass(true)
            }
        }, 2000)

        // Auto-initiate payment
        handlePayment()

        return () => clearTimeout(timer)
    }, [orderId])

    const handlePayment = async () => {
        if (!orderId) return

        try {
            setIsLoading(true)
            setError(null)

            const result = await initiatePayment(parseInt(orderId))

            if (result.success && result.gatewayUrl) {
                // Redirect to SSLCommerz payment gateway
                window.location.href = result.gatewayUrl
            } else {
                setError(result.error || "Failed to initiate payment")
                toast.error("Payment initiation failed", {
                    description: result.error,
                })
            }
        } catch (err) {
            console.error("Payment error:", err)
            setError("An unexpected error occurred")
            toast.error("Payment failed", {
                description: "Please try again",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleDevBypass = () => {
        // In development, skip SSLCommerz and go directly to confirm page
        toast.info("Using development bypass", {
            description: "Skipping payment gateway for testing",
        })
        router.push(`/checkout/confirm?orderId=${orderId}`)
    }

    if (!orderId) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-5 w-5" />
                            Invalid Request
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            Order ID is missing. Please try placing your order again.
                        </p>
                        <Button onClick={() => router.push("/checkout")} className="w-full">
                            Back to Checkout
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        {isLoading ? "Processing Payment..." : "Payment Required"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoading ? (
                        <div className="text-center py-8">
                            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                            <p className="text-sm text-muted-foreground">
                                Redirecting to payment gateway...
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Please do not close this window
                            </p>

                            {showDevBypass && (
                                <div className="mt-6">
                                    <p className="text-xs text-yellow-600 mb-2">
                                        SSLCommerz not redirecting? (Localhost issue)
                                    </p>
                                    <Button
                                        onClick={handleDevBypass}
                                        variant="outline"
                                        size="sm"
                                        className="text-xs"
                                    >
                                        <DollarSign className="h-3 w-3 mr-1" />
                                        Skip Payment (Dev Mode)
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : error ? (
                        <div className="space-y-4">
                            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                                <p className="text-sm text-destructive">{error}</p>
                            </div>

                            {process.env.NODE_ENV === 'development' && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-xs text-blue-800 mb-2">
                                        <strong>Development Mode:</strong> SSLCommerz sandbox may not work with localhost.
                                    </p>
                                    <Button
                                        onClick={handleDevBypass}
                                        variant="secondary"
                                        size="sm"
                                        className="w-full"
                                    >
                                        Skip Payment Gateway (Test Mode)
                                    </Button>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    onClick={handlePayment}
                                    className="flex-1"
                                    variant="default"
                                >
                                    Try Again
                                </Button>
                                <Button
                                    onClick={() => router.push(`/account/orders/${orderId}`)}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    View Order
                                </Button>
                            </div>
                        </div>
                    ) : null}
                </CardContent>
            </Card>
        </div>
    )
}
