import ProductList from "@/app/(admin)/admin/dashboard/products/_components/product-list";
import {getTranslations} from 'next-intl/server';
import getProducts from "@/app/(admin)/admin/dashboard/products/actions/get-products";
import {dehydrate, HydrationBoundary} from '@tanstack/react-query';
import {getQueryClient} from "@/utils/get-query-client";

export default async function ProductsPage() {
    const t = await getTranslations('products');
    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['admin-products'],
        queryFn: getProducts,
    });

    return (
        <div className={"container mx-auto"}>
            <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <ProductList/>
            </HydrationBoundary>
        </div>
    )
}