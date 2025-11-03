import CategoryList from "@/app/(admin)/admin/dashboard/category/_components/category/category-list";
import {Suspense} from "react";
import TableSkeleton from "@/app/(admin)/admin/dashboard/category/_components/table-skeleton";
import {getTranslations} from 'next-intl/server';
import getCategories from "@/app/(admin)/admin/dashboard/category/actions/category/get-categories";
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from "@/utils/get-query-client";

export default async function CategoryPage() {
    const t = await getTranslations('categories');
    const queryClient = getQueryClient();

    queryClient.prefetchQuery({
        queryKey: ['admin-categories'],
        queryFn: getCategories,
    });

    return (
        <div className={"container mx-auto"}>
            <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
            <Suspense fallback={<TableSkeleton/>}>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <CategoryList />
                </HydrationBoundary>
            </Suspense>
        </div>
    )
}