"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ShippingForm from "@/app/(client)/checkout/_components/shipping-form"
import CartReview from "@/app/(client)/checkout/_components/cart-review"
import { useCartItems } from "@/stote/cart-sotre"
import {ShippingFormData} from "@/lib/schemas/address.scheam";

export default function CheckoutPage() {
    const router = useRouter()
    const [isProcessing, setIsProcessing] = useState(false)
    const cartItems = useCartItems()

    const handleValidSubmit = (shippingData: ShippingFormData) => {
        setIsProcessing(true)

        const orderData = {
            shipping: shippingData,
            items: cartItems,
        }
        console.log(orderData)

        // Store in sessionStorage for confirmation page
        sessionStorage.setItem('checkoutData', JSON.stringify(orderData))

        // Navigate to confirmation page
        // router.push('/checkout/confirm')
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
