"use client"

import {ColumnDef} from "@tanstack/react-table"
import {ArrowUpDown, Eye, MoreHorizontal} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Badge} from "@/components/ui/badge"
import {Category, SubCategory} from "@/db/schema/category"
import NewSubcategoryDialog from "./new-subcategory-dialog"

interface CategoryWithSubcategories extends Category {
    subCategory: SubCategory[]
}


export const categoryColumn: ColumnDef<CategoryWithSubcategories>[] = [
    {
        accessorKey: "image",
        header: "Image",
        cell: ({row}) => (
            <div className="w-16 h-16 relative">
                <Image
                    src={row.getValue("image")}
                    alt={row.getValue("name")}
                    fill
                    className="object-cover rounded-md"
                />
            </div>
        ),
        enableSorting: false,
        size: 80,
    },
    {
        accessorKey: "name",
        header: ({column}) => {
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4"/>
                    </Button>
                </div>
            )
        },
        cell: ({row}) => (
            <div className="text-center font-medium">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "slug",
        header: () => <div className="text-center">Slug</div>,
        cell: ({row}) => (
            <div className="text-center text-muted-foreground">{row.getValue("slug")}</div>
        ),
    },
    {
        accessorKey: "isActive",
        header: () => <div className="text-center">Status</div>,
        cell: ({row}) => {
            const isActive = row.getValue("isActive") as boolean
            return (
                <div className="flex justify-center">
                    <Badge variant={isActive ? "default" : "secondary"}>
                        {isActive ? "Active" : "Inactive"}
                    </Badge>
                </div>
            )
        },
        size: 100,
    },
    {
        accessorKey: "displayOrder",
        header: ({column}) => {
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Display Order
                        <ArrowUpDown className="ml-2 h-4 w-4"/>
                    </Button>
                </div>
            )
        },
        cell: ({row}) => (
            <div className="text-center">{row.getValue("displayOrder")}</div>
        ),
        size: 150,
    },
    {
        id: "subcategories",
        header: () => <div className="text-center">Subcategories</div>,
        cell: ({row}) => {
            const category = row.original
            return (
                <div className="flex justify-center gap-2">
                    {
                        category.subCategory.length > 0 ? (
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/admin/dashboard/category/${category.id}`}>
                                    <Eye className="h-4 w-4 mr-1"/>
                                    View ({category.subCategory.length})
                                </Link>
                            </Button>
                        ) : (
                            <Button variant="ghost" size="sm" className={"text-muted-foreground"}>
                                    N/A
                            </Button>
                        )
                    }
                    <NewSubcategoryDialog
                        categoryId={category.id}
                        categoryName={category.name}
                    />
                </div>
            )
        },
        size: 180,
    },
    {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        enableHiding: false,
        cell: ({row}) => {
            const category = row.original

            return (
                <div className="flex justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit category</DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem className="text-destructive">
                                Delete category
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
        size: 80,
    },
]
