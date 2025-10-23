"use client"

import * as React from "react"
import {toast} from "sonner"
import {Trash2, AlertTriangle} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {useTransition} from "react"
import {Loader} from "lucide-react"
import deleteCategory from "@/app/(admin)/admin/dashboard/category/actions/delete-category"
import {Category, SubCategory} from "@/db/schema/category"

interface DeleteCategoryDialogProps {
    category: Category & { subCategory?: SubCategory[] }
}

export default function DeleteCategoryDialog({category}: DeleteCategoryDialogProps) {
    const [isPending, startTransition] = useTransition()
    const [open, setOpen] = React.useState(false)
    const hasSubcategories = category.subCategory && category.subCategory.length > 0
    const subcategoryCount = category.subCategory?.length || 0

    const handleDelete = () => {
        startTransition(async () => {
            try {
                const result = await deleteCategory(category.id)
                if (!result.success) {
                    switch (result.status) {
                        case 401:
                            toast.error("You are not authorized to perform this action.")
                            break
                        case 404:
                            toast.error("Category not found.")
                            break
                        default:
                            toast.error(result.error || "Failed to delete category.")
                    }
                    console.error("Delete category failed:", result)
                    return
                }
                toast.success(result.message)
                setOpen(false)
            } catch (error) {
                console.error("Unexpected error:", error)
                toast.error("An unexpected error occurred while deleting the category.")
            }
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-destructive hover:text-destructive"
                >
                    <Trash2 className="h-4 w-4 mr-2"/>
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-destructive"/>
                        Delete {category.name}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the category
                        {hasSubcategories && ` and ${subcategoryCount} subcategory(ies)`}.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {hasSubcategories && (
                    <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0"/>
                        <div className="text-sm">
                            <p className="font-semibold text-destructive mb-1">Warning</p>
                            <p className="text-muted-foreground">
                                All {subcategoryCount} subcategory(ies) and their associated data will be permanently deleted.
                            </p>
                        </div>
                    </div>
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            handleDelete()
                        }}
                        disabled={isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isPending ? (
                            <>
                                <Loader className="h-4 w-4 mr-2 animate-spin"/>
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4 mr-2"/>
                                Delete
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
