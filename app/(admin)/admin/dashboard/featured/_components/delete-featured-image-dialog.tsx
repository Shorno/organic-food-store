"use client"

import * as React from "react"
import { toast } from "sonner"
import { Trash2, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { useTransition } from "react"
import {FeaturedImage} from "@/db/schema";
import deleteFeaturedImage from "@/app/(admin)/admin/dashboard/featured/action/delete-featured-image";

interface DeleteFeaturedImageDialogProps {
    featuredImage: FeaturedImage
}

export default function DeleteFeaturedImageDialog({ featuredImage }: DeleteFeaturedImageDialogProps) {
    const [isPending, startTransition] = useTransition()
    const [open, setOpen] = React.useState(false)

    const handleDelete = () => {
        startTransition(async () => {
            try {
                const result = await deleteFeaturedImage(featuredImage.id)
                if (!result.success) {
                    switch (result.status) {
                        case 401:
                            toast.error("You are not authorized to perform this action.")
                            break
                        case 404:
                            toast.error("Featured image not found.")
                            break
                        default:
                            toast.error(result.error || "Failed to delete featured image.")
                    }
                    console.error("Delete failed:", result)
                    return
                }
                toast.success(result.message)
                setOpen(false)
            } catch (error) {
                console.error("Unexpected error:", error)
                toast.error("An unexpected error occurred while deleting the featured image.")
            }
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="p-2 text-destructive"
                    aria-label="Delete featured image"
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-destructive" />
                        Delete {featuredImage.title}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the featured image.
                    </AlertDialogDescription>
                </AlertDialogHeader>
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
                                <Loader className="h-4 w-4 mr-2 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
