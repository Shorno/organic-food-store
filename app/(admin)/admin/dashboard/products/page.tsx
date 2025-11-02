import ProductList from "@/app/(admin)/admin/dashboard/products/_components/product-list";
import {Suspense} from "react";
import TableSkeleton from "@/app/(admin)/admin/dashboard/category/_components/table-skeleton";
import {getTranslations} from 'next-intl/server';
import getProducts from "@/app/(admin)/admin/dashboard/products/actions/get-products";

export default async function ProductsPage() {
    const t = await getTranslations('products');
    const productsPromise = getProducts();

    return (
        <div className={"container mx-auto"}>
            <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
            <Suspense fallback={<TableSkeleton/>}>
                <ProductList productsPromise={productsPromise} />
            </Suspense>
        </div>
    )
}