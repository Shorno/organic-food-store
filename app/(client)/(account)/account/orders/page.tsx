import OrdersContent from "@/app/(client)/(account)/account/orders/_components/orders-content";


export default function OrdersPage() {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">My Orders</h2>
            <OrdersContent />
        </div>
    )
}
