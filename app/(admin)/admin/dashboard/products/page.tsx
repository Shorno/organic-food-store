import ProductList from "@/app/(admin)/admin/dashboard/products/_components/product-list";
import {Suspense} from "react";
import TableSkeleton from "@/app/(admin)/admin/dashboard/category/_components/table-skeleton";

export default function ProductsPage() {
    return (
        <div className={"container mx-auto"}>
            <h1 className="text-2xl font-bold mb-4">Products</h1>
            <Suspense fallback={<TableSkeleton/>}>
                <ProductList/>
            </Suspense>
        </div>
    )
}