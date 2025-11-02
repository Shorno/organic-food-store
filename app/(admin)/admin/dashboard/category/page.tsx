import CategoryList from "@/app/(admin)/admin/dashboard/category/_components/category/category-list";
import {Suspense} from "react";
import TableSkeleton from "@/app/(admin)/admin/dashboard/category/_components/table-skeleton";
import {getTranslations} from 'next-intl/server';
import getCategories from "@/app/(admin)/admin/dashboard/category/actions/category/get-categories";

export default async function CategoryPage() {
    const t = await getTranslations('categories');
    const categoriesPromise = getCategories();

    return (
        <div className={"container mx-auto"}>
            <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
            <Suspense fallback={<TableSkeleton/>}>
                <CategoryList categoriesPromise={categoriesPromise} />
            </Suspense>
        </div>
    )
}