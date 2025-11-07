"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart, Zap } from "lucide-react"
import { ProductWithRelations } from "@/db/schema"
import { toast } from "sonner"
import { useCartActions, useCartItems } from "@/stote/cart-sotre"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

interface ProductDetailsActionsProps {
    product: ProductWithRelations
}

export function ProductDetailsActions({ product }: ProductDetailsActionsProps) {
    const session = authClient.useSession()
    const router = useRouter()
    const items = useCartItems()
    const { addItem } = useCartActions()
    const isAuthenticated = !!session.data?.user

    const handleAddToCart = () => {
        if (!product.inStock || product.stockQuantity === 0) {
            toast.error("Out of stock")
            return
        }

        const cartItem = items.find(item => item.id === product.id)
        if (cartItem && cartItem.quantity >= (product.stockQuantity ?? Infinity)) {
            toast.warning("Maximum quantity in cart")
            return
        }

        addItem(product, isAuthenticated)
        toast.success("Added to cart", {
            description: `${product.name} has been added to your cart.`
        })
    }

    const handleBuyNow = () => {
        if (!product.inStock || product.stockQuantity === 0) {
            toast.error("Out of stock")
            return
        }

        // Add to cart first
        const cartItem = items.find(item => item.id === product.id)
        if (!cartItem) {
            addItem(product, isAuthenticated)
        }

        // Redirect to checkout
        router.push("/checkout")
        toast.success("Proceeding to checkout")
    }

    return (
        <div className="flex gap-2 flex-wrap">
            <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                variant="outline"
                size="default"
                className="flex-1 min-w-[140px]"
            >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
            </Button>

            <Button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                size="default"
                className="flex-1 min-w-[140px]"
            >
                <Zap className="mr-2 h-4 w-4" />
                Buy Now
            </Button>
        </div>
    )
}
