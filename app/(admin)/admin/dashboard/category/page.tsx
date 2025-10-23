import getCategories from "@/app/(admin)/admin/dashboard/category/actions/get-categories";
import CategoryTable from "@/app/(admin)/admin/dashboard/category/_components/category-table";
import {categoryColumn} from "@/app/(admin)/admin/dashboard/category/_components/category-columns";

export default async function CategoryPage() {
    const categories = await getCategories()
    console.log(categories)

    return (
        <div className={"container mx-auto"}>
            <h1 className="text-2xl font-bold mb-4">Categories</h1>
            <CategoryTable columns={categoryColumn} data={categories}/>
        </div>
    )
}