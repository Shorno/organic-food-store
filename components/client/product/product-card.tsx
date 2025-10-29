"use client"

import Image from "next/image"
import { ShoppingCart, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {ProductWithRelations} from "@/db/schema";
import {toast} from "sonner";
import {useCartActions, useCartItems} from "@/stote/cart-sotre";
import {formatPrice} from "@/utils/currency";
import {authClient} from "@/lib/auth-client";

interface ProductCardProps {
    product: ProductWithRelations
}

export function ProductCard({ product }: ProductCardProps) {
    const session = authClient.useSession();
    const items = useCartItems()
    const {addItem} = useCartActions()
    const isAuthenticated = !!session.data?.user;


    const handleAddToCart = () => {
        if (!product.inStock || product.stockQuantity === 0) {
            toast.error("Out of stock");
            return;
        }

        const cartItem = items.find(item => item.id === product.id);
        if (cartItem && cartItem.quantity >= (product.stockQuantity ?? Infinity)) {
            toast.warning("Maximum quantity in cart");
            return;
        }

        addItem(product, isAuthenticated);
        toast.success("Added to cart", {
            description: `${product.name} has been added to your cart.`})

    }



    const handleBuyNow = () => {
        toast.success("Proceeding to checkout", {
            description: `Purchasing ${product.name} now.`,
        })
    }

    return (
        <Card className="group h-full flex flex-col py-0 overflow-hidden hover:shadow-lg transition-all duration-300">
            {/* Image Container */}
            <div className="relative w-full aspect-video bg-neutral-100 overflow-hidden">
                {product.isFeatured && <Badge className="absolute top-3 right-3 z-10 bg-amber-500 text-white">Featured</Badge>}

                {/* Product Image */}
                <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
            </div>

            {/* Content Container */}
            <CardContent className="flex flex-col flex-grow p-3 md:p-4">
                {/* Category */}
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">{product.category.name}</p>

                {/* Product Name */}
                <h3 className="text-sm md:text-base font-semibold text-neutral-900 mb-1 line-clamp-2">{product.name}</h3>

                {/* Size */}
                <p className="text-sm text-neutral-500 mb-2">
                    Size: <span className="font-medium text-neutral-700">{product.size}</span>
                </p>

                {/* Price */}
                <div className="mb-3 mt-auto">
                    <p className="text-lg md:text-xl font-light text-neutral-900">
                        {formatPrice(product.price)}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3">
                    <Button
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                        variant="outline"
                        size="icon"
                        className="hover:scale-110 transition-all duration-300 disabled:hover:scale-100"
                    >
                        <ShoppingCart size={16} />
                    </Button>

                    <Button
                        onClick={handleBuyNow}
                        disabled={!product.inStock}
                        className="flex-1 gap-2  hover:scale-105 transition-all duration-300 disabled:hover:scale-100"
                    >
                        <Zap size={16} />
                        Buy Now
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
