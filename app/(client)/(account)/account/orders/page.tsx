import { Suspense } from "react"

export default function OrdersPage() {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">My Orders</h2>
            <Suspense fallback={<div>Loading orders...</div>}>
                {/* Your orders component */}
                <p className="text-muted-foreground">Your order history will appear here.</p>
            </Suspense>
        </div>
    )
}
