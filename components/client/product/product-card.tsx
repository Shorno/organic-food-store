"use client"

import Image from "next/image"
import { ShoppingCart, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {ProductWithRelations} from "@/db/schema";
import {toast} from "sonner";

interface ProductCardProps {
    product: ProductWithRelations
}

export function ProductCard({ product }: ProductCardProps) {
    const handleAddToCart = () => {
        toast.success("Added to cart", {
            description: `${product.name} has been added to your cart.`,
        })
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

                {/* Stock Status */}
                {!product.inStock && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                        <span className="text-white font-semibold text-lg">Out of Stock</span>
                    </div>
                )}

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

                {/* Stock Info */}
                <div className="mb-3">
                    {product.inStock ? (
                        <p className="text-xs text-green-600 font-medium">✓ In Stock ({product.stockQuantity} available)</p>
                    ) : (
                        <p className="text-xs text-red-600 font-medium">Out of Stock</p>
                    )}
                </div>

                {/* Price */}
                <div className="mb-3 mt-auto">
                    <p className="text-lg md:text-xl font-light text-neutral-900">
                        ৳{Number.parseFloat(product.price).toLocaleString()}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3">
                    {/* Add to Cart Button - Icon Only */}
                    <Button
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                        variant="default"
                        size="icon"
                        className="bg-neutral-900 hover:bg-neutral-800 hover:scale-110 transition-all duration-300 disabled:hover:scale-100"
                    >
                        <ShoppingCart size={16} />
                    </Button>

                    {/* Buy Now Button - Full Text */}
                    <Button
                        onClick={handleBuyNow}
                        disabled={!product.inStock}
                        className="flex-1 gap-2 bg-amber-500 hover:bg-amber-600 hover:scale-105 transition-all duration-300 disabled:hover:scale-100"
                    >
                        <Zap size={16} />
                        Buy Now
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
