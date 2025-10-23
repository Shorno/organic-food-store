import getCategories from "@/app/(admin)/admin/dashboard/category/actions/category/get-categories";
import CategoryTable from "@/app/(admin)/admin/dashboard/category/_components/category/category-table";
import {categoryColumn} from "@/app/(admin)/admin/dashboard/category/_components/category/category-columns";

export default async function CategoryList() {
    const categories = await getCategories()

    return (
        <CategoryTable columns={categoryColumn} data={categories}/>
    )
}