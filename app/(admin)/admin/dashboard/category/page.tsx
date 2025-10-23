import CategoryList from "@/app/(admin)/admin/dashboard/category/_components/category/category-list";
import {Suspense} from "react";
import TableSkeleton from "@/app/(admin)/admin/dashboard/category/_components/table-skeleton";

export default function CategoryPage() {
    return (
        <div className={"container mx-auto"}>
            <h1 className="text-2xl font-bold mb-4">Categories</h1>
            <Suspense fallback={<TableSkeleton/>}>
                <CategoryList/>
            </Suspense>
        </div>
    )
}