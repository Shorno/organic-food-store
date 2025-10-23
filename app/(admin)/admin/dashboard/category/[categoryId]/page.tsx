import getSubcategories from "@/app/(admin)/admin/dashboard/category/actions/subcategory/get-subcategories";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import SubcategoryTable from "@/app/(admin)/admin/dashboard/category/_components/subcategory/subcategory-table";
import {subcategoryColumns} from "@/app/(admin)/admin/dashboard/category/_components/subcategory/subcategory-columns";
import getCategoryById from "@/app/(admin)/admin/dashboard/category/actions/category/get-category-by-id";
import {notFound} from "next/navigation";

export default async function SubCategoryPage({params}: {
    params: Promise<{ categoryId: number }>

}) {
    const {categoryId} = await params;
    const category = await getCategoryById(categoryId)
    if (!category) {
        notFound()
    }

    const subcategories = await getSubcategories(categoryId);

    return (
        <div className="container mx-auto py-6">
            <div className="mb-6 space-y-2">
                <Button asChild variant="ghost" size="sm">
                    <Link href="/admin/dashboard/category">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Categories
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">
                    Subcategories for {category.name}
                </h1>
                <p className="text-muted-foreground">
                    Manage subcategories under the {category.name} category.
                </p>
            </div>
            <SubcategoryTable
                columns={subcategoryColumns}
                data={subcategories}
                categoryId={categoryId}
                categoryName={category.name}
            />
        </div>
    )
}