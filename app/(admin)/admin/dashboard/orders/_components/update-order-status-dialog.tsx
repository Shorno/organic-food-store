"use client"

import * as React from "react"
import { useTransition } from "react"
import { toast } from "sonner"
import { RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { OrderWithDetails } from "./order-columns"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { updateOrderStatus } from "../actions/update-order-status"
import { Loader } from "lucide-react"
import {OrderStatus} from "@/db/schema";

interface UpdateOrderStatusDialogProps {
    order: OrderWithDetails
}

const orderStatuses = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "refunded", label: "Refunded" },
]

export default function UpdateOrderStatusDialog({ order }: UpdateOrderStatusDialogProps) {
    const [open, setOpen] = React.useState(false)
    const [isPending, startTransition] = useTransition()
    const [selectedStatus, setSelectedStatus] = React.useState<OrderStatus>(order.status)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (selectedStatus === order.status) {
            toast.info("No changes made")
            setOpen(false)
            return
        }

        startTransition(async () => {
            try {
                const result = await updateOrderStatus(order.id, selectedStatus)

                if (result.success) {
                    toast.success("Order status updated successfully")
                    setOpen(false)
                } else {
                    toast.error(result.error || "Failed to update order status")
                }
            } catch {
                toast.error("An error occurred while updating order status")
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault()
                    setOpen(true)
                }}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Update Status
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Update Order Status</DialogTitle>
                        <DialogDescription>
                            Update the status for order #{order.orderNumber}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <Label htmlFor="status">Order Status</Label>
                        <Select
                            value={selectedStatus}
                            onValueChange={(value) => setSelectedStatus(value as OrderStatus)}
                            disabled={isPending}
                        >
                            <SelectTrigger id="status" className="mt-2">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {orderStatuses.map((status) => (
                                    <SelectItem key={status.value} value={status.value}>
                                        {status.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                            Update Status
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

