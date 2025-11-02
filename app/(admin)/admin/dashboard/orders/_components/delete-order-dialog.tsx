"use client"

import * as React from "react"
import { useTransition } from "react"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { deleteOrder } from "../actions/update-order"
import { Loader } from "lucide-react"

interface DeleteOrderDialogProps {
    orderId: number
    orderNumber: string
}

export default function DeleteOrderDialog({ orderId, orderNumber }: DeleteOrderDialogProps) {
    const [open, setOpen] = React.useState(false)
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        startTransition(async () => {
            try {
                const result = await deleteOrder(orderId)

                if (result.success) {
                    toast.success("Order deleted successfully")
                    setOpen(false)
                } else {
                    toast.error(result.error || "Failed to delete order")
                }
            } catch (error) {
                toast.error("An error occurred while deleting the order")
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem
                    onSelect={(e) => {
                        e.preventDefault()
                        setOpen(true)
                    }}
                    className="text-destructive"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Order</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete order <strong>#{orderNumber}</strong>? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                        Delete Order
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

