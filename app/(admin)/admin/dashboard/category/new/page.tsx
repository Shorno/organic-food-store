import NewCategoryForm from "@/app/(admin)/admin/dashboard/category/_components/new-category-form";
import {ArrowLeft} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function NewCategoryPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Button asChild variant={"ghost"} className={"mb-4"}>
                <Link href="/admin/dashboard/category">
                    <ArrowLeft className="mr-2"/> Go back
                </Link>
            </Button>

            <div className="max-w-2xl lg:mx-auto">
                <NewCategoryForm/>
            </div>
        </div>
    )
}
