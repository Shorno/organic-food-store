import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function CategoryPage() {
    return (
        <>
            Category page
            <Button>
                <Link href={"/admin/dashboard/category/new"}>
                    New Category
                </Link>
            </Button>
        </>
    )
}