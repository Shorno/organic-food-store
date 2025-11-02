import OrderList from "@/app/(admin)/admin/dashboard/orders/_components/order-list";
import { Suspense } from "react";
import TableSkeleton from "@/app/(admin)/admin/dashboard/category/_components/table-skeleton";

export default function OrdersPage() {
    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">Orders Management</h1>
            <Suspense fallback={<TableSkeleton />}>
                <OrderList />
            </Suspense>
        </div>
    )
}