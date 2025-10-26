import {Badge} from "@/components/ui/badge";
import {Minus, Plus, Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {type CartItem, useCartActions} from "@/stote/cart-sotre";
import {formatPrice} from "@/utils/currency";

interface CartItemProps {
    item: CartItem;
}

export default function CartItem({item}: CartItemProps) {
    const {increment, decrement, removeItem} = useCartActions()

    return (
        <div
            className="flex items-center gap-4 p-4 border-b rounded-xs shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex-shrink-0 relative">
                <div className="relative overflow-hidden rounded-lg border-2">
                    <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover"
                    />
                </div>
                {item.quantity > 1 && (
                    <Badge
                        variant="secondary"
                        className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center p-0 bg-blue-500 text-white text-xs font-bold rounded-full border-2 border-white"
                    >
                        {item.quantity}
                    </Badge>
                )}
            </div>

            <div className="flex-1 min-w-0 space-y-2">
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                    {item.name}
                </h3>

                <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                        <Button
                            onClick={() => decrement(item.id)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-200 rounded-l-lg rounded-r-none"
                            disabled={item.quantity <= 1}
                        >
                            <Minus className="h-3.5 w-3.5"/>
                        </Button>

                        <div
                            className="flex items-center justify-center min-w-[40px] h-8 px-2 text-sm font-medium text-gray-900 bg-white border-x border-gray-300">
                            {item.quantity}
                        </div>

                        <Button
                            onClick={() => increment(item.id)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-200 rounded-r-lg rounded-l-none"
                        >
                            <Plus className="h-3.5 w-3.5"/>
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeItem(item.id)}
                    >
                        <Trash2 className="h-4 w-4"/>
                    </Button>
                </div>
            </div>

            <div className="flex-shrink-0 text-right">
                <p className="text-base font-bold text-gray-900">
                    {formatPrice(item.subtotal)}
                </p>
            </div>
        </div>
    );
}
