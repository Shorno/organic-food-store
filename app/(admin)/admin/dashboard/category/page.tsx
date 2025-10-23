import getCategories from "@/app/(admin)/admin/dashboard/category/actions/category/get-categories";
import CategoryTable from "@/app/(admin)/admin/dashboard/category/_components/category/category-table";
import {categoryColumn} from "@/app/(admin)/admin/dashboard/category/_components/category/category-columns";

export default async function CategoryPage() {
    const categories = await getCategories()

    return (
        <div className={"container mx-auto"}>
            <h1 className="text-2xl font-bold mb-4">Categories</h1>
            <CategoryTable columns={categoryColumn} data={categories}/>
        </div>
    )
}