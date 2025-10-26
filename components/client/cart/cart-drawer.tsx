"use client"
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {ShoppingCart} from "lucide-react";
import {Checkbox} from "@/components/ui/checkbox";
import Link from "next/link";
import {useCartItems} from "@/stote/cart-sotre";


export default function CartDrawer() {
    const cartItems = useCartItems()
    console.log(cartItems)
    const cartCount = 0;
    const subtotal = 0;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5"/>
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col">
                {/* Header */}
                <SheetHeader className="border-b px-6 py-4">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-2xl font-serif">Cart</SheetTitle>
                    </div>
                </SheetHeader>

                {/* Cart Content */}
                <div className="flex-1 overflow-y-auto px-6">
                    {cartCount === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <h3 className="text-xl font-medium mb-6">Your cart is empty</h3>
                            <SheetClose asChild>
                                <Button
                                    className="bg-[#8B8378] hover:bg-[#6B6358] text-white px-8 rounded-full"
                                    asChild
                                >
                                    <Link href="/shop">CONTINUE SHOPPING</Link>
                                </Button>
                            </SheetClose>
                        </div>
                    ) : (
                        <div className="py-6 space-y-4">
                            {/* Cart items will go here when cart has items */}
                            dfgdfg
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t px-6 py-4 bg-background">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-lg">
                            <span className="font-medium">SUBTOTAL</span>
                            <span className="font-bold">${subtotal}</span>
                        </div>

                        <div className="flex items-start gap-2">
                            <Checkbox id="age-confirm" className="mt-1"/>
                            <label
                                htmlFor="age-confirm"
                                className="text-sm leading-tight cursor-pointer"
                            >
                                I confirm that I am over 18 years of age
                            </label>
                        </div>

                        <Button
                            className="w-full bg-[#8B8378] hover:bg-[#6B6358] text-white py-6 rounded-full text-base"
                            disabled={cartCount === 0}
                        >
                            CHECKOUT
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
