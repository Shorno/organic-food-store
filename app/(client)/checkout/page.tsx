"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ShippingForm from "@/app/(client)/checkout/_components/shipping-form"
import CartReview from "@/app/(client)/checkout/_components/cart-review"
import { useCartItems, useCartActions } from "@/stote/cart-sotre"
import { ShippingFormData } from "@/lib/schemas/address.scheam"
import { createOrder } from "@/app/actions/order"
import { toast } from "sonner"

export default function CheckoutPage() {
    const router = useRouter()
    const [isProcessing, setIsProcessing] = useState(false)
    const cartItems = useCartItems()
    const { clearCart } = useCartActions()

    const handleValidSubmit = async (shippingData: ShippingFormData) => {
        // Prevent multiple submissions
        if (isProcessing) return

        setIsProcessing(true)

        try {
            // Create order data
            const orderData = {
                shipping: shippingData,
                items: cartItems,
            }

            // Call server action to create order
            const result = await createOrder(orderData)

            if (result.success && result.orderId) {
                // Clear the cart after successful order
                await clearCart(true)

                // Show success message
                toast.success("Order placed successfully!", {
                    description: `Order number: ${result.orderNumber}`,
                })

                // Navigate based on payment type
                if (shippingData.paymentType === "cod") {
                    // COD: Go directly to confirmation page
                    router.push(`/checkout/confirm?orderId=${result.orderId}`)
                } else {
                    // Online Payment: Go to payment gateway
                    router.push(`/checkout/payment?orderId=${result.orderId}`)
                }
            } else {
                // Show error message
                toast.error("Failed to place order", {
                    description: result.error || "Please try again",
                })
                setIsProcessing(false)
            }
        } catch (error) {
            console.error("Error creating order:", error)
            toast.error("An error occurred", {
                description: "Please try again later",
            })
            setIsProcessing(false)
        }
    }

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Left: Shipping Form */}
                    <ShippingForm onValidSubmit={handleValidSubmit} />

                    {/* Right: Order Summary */}
                    <CartReview isProcessing={isProcessing} />
                </div>
            </div>
        </div>
    )
}
