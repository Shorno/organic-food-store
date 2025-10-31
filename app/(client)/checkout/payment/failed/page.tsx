"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, ArrowLeft, RefreshCcw } from "lucide-react"
import Link from "next/link"

export default function PaymentFailedPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const orderId = searchParams.get("orderId")
    const errorMessage = searchParams.get("error") || "Payment processing failed"
    console.log(orderId)

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Failure Card */}
                <Card className="border-red-200 bg-red-50/50">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <XCircle className="h-10 w-10 text-red-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-red-900 mb-2">
                                    Payment Failed
                                </h1>
                                <p className="text-red-700">
                                    {errorMessage}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>What happened?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm text-muted-foreground space-y-2">
                            <p>Your payment could not be processed. This might be due to:</p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                                <li>Insufficient funds in your account</li>
                                <li>Incorrect payment details</li>
                                <li>Payment gateway timeout</li>
                                <li>Network connectivity issues</li>
                            </ul>
                        </div>

                        <div className="pt-4 border-t">
                            <p className="text-sm font-medium mb-2">Your order is still pending</p>
                            <p className="text-sm text-muted-foreground">
                                Don't worry! Your order has been saved. You can try paying again or choose Cash on Delivery.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {orderId && (
                        <Button
                            onClick={() => router.push(`/checkout/payment?orderId=${orderId}`)}
                            className="flex-1"
                            size="lg"
                        >
                            <RefreshCcw className="h-4 w-4 mr-2" />
                            Try Payment Again
                        </Button>
                    )}
                    <Button
                        asChild
                        variant="outline"
                        className="flex-1"
                        size="lg"
                    >
                        <Link href={orderId ? `/account/orders/${orderId}` : "/account/orders"}>
                            View Order
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="ghost"
                        size="lg"
                    >
                        <Link href="/">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

