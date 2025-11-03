import OrderList from "@/app/(admin)/admin/dashboard/orders/_components/order-list";
import {getTranslations} from 'next-intl/server';
import {getOrders} from "@/app/(admin)/admin/dashboard/orders/actions/get-orders";
import {dehydrate, HydrationBoundary} from '@tanstack/react-query';
import {getQueryClient} from "@/utils/get-query-client";

export default async function OrdersPage() {
    const t = await getTranslations('orders');
    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['admin-orders'],
        queryFn: getOrders,
    });

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <OrderList/>
            </HydrationBoundary>
        </div>
    )
}