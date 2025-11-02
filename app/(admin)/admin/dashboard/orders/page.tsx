import OrderList from "@/app/(admin)/admin/dashboard/orders/_components/order-list";
import { Suspense } from "react";
import TableSkeleton from "@/app/(admin)/admin/dashboard/category/_components/table-skeleton";
import {getTranslations} from 'next-intl/server';
import { getOrders } from "@/app/(admin)/admin/dashboard/orders/actions/get-orders";

export default async function OrdersPage() {
    const t = await getTranslations('orders');
    const ordersPromise = getOrders();

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
            <Suspense fallback={<TableSkeleton />}>
                <OrderList ordersPromise={ordersPromise} />
            </Suspense>
        </div>
    )
}