import OrderCard from "./order-card"

interface Order {
    id: number
    orderNumber: string
    status: string
    totalAmount: string
    created_at: Date
    items: Array<{
        id: number
        productName: string
        productImage: string
        quantity: number
    }>
}

interface OrdersListProps {
    orders: Order[]
}

export default function OrdersList({ orders }: OrdersListProps) {
    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
            ))}
        </div>
    )
}
