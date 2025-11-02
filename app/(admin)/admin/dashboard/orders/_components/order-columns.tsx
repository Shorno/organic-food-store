"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Order } from "@/db/schema/order"
import { OrderItem } from "@/db/schema/order"
import { Payment } from "@/db/schema/payment"
import ViewOrderDialog from "./view-order-dialog"
import UpdateOrderStatusDialog from "./update-order-status-dialog"
import DeleteOrderDialog from "./delete-order-dialog"

export interface OrderWithDetails extends Order {
    items: OrderItem[]
    payment: Payment | null
    itemCount: number
    paymentMethod: string | null
    paymentStatus: string | null
}

const statusVariants = {
    pending: "secondary",
    confirmed: "default",
    processing: "default",
    shipped: "default",
    delivered: "default",
    cancelled: "destructive",
    refunded: "outline",
} as const

const paymentStatusVariants = {
    pending: "secondary",
    processing: "secondary",
    completed: "default",
    failed: "destructive",
    refunded: "outline",
    partially_refunded: "outline",
    cancelled: "destructive",
} as const

export const orderColumns: ColumnDef<OrderWithDetails>[] = [
    {
        accessorKey: "orderNumber",
        header: ({ column }) => {
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Order #
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => (
            <div className="font-medium text-center">{row.getValue("orderNumber")}</div>
        ),
    },
    {
        accessorKey: "customerFullName",
        header: () => <div className="text-center">Customer</div>,
        cell: ({ row }) => {
            const order = row.original
            return (
                <div className="text-center">
                    <div className="font-medium">{order.customerFullName}</div>
                    <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                </div>
            )
        },
    },
    {
        accessorKey: "itemCount",
        header: () => <div className="text-center">Items</div>,
        cell: ({ row }) => (
            <div className="text-center">{row.getValue("itemCount")}</div>
        ),
    },
    {
        accessorKey: "totalAmount",
        header: ({ column }) => {
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Total
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("totalAmount"))
            const formatted = new Intl.NumberFormat("en-BD", {
                style: "currency",
                currency: "BDT",
            }).format(amount)
            return <div className="text-center font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center">Order Status</div>,
        cell: ({ row }) => {
            const status = row.getValue("status") as keyof typeof statusVariants
            return (
                <div className="flex justify-center">
                    <Badge variant={statusVariants[status] || "secondary"}>
                        {status}
                    </Badge>
                </div>
            )
        },
    },
    {
        accessorKey: "paymentMethod",
        header: () => <div className="text-center">Payment</div>,
        cell: ({ row }) => {
            const order = row.original
            const paymentStatus = order.paymentStatus as keyof typeof paymentStatusVariants | null
            return (
                <div className="text-center">
                    <div className="text-sm font-medium">
                        {order.paymentMethod || "N/A"}
                    </div>
                    {paymentStatus && (
                        <Badge
                            variant={paymentStatusVariants[paymentStatus] || "secondary"}
                            className="mt-1"
                        >
                            {paymentStatus}
                        </Badge>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Created
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"))
            return (
                <div className="text-center text-sm">
                    {date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </div>
            )
        },
    },
    {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        enableHiding: false,
        cell: ({ row }) => {
            const order = row.original

            return (
                <div className="flex justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <ViewOrderDialog order={order} />
                            <UpdateOrderStatusDialog order={order} />
                            <DeleteOrderDialog
                                orderId={order.id}
                                orderNumber={order.orderNumber}
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]

