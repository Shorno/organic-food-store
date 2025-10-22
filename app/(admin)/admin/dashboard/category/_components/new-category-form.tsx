"use client"

import * as React from "react"
import {useForm} from "@tanstack/react-form"
import {toast} from "sonner"

import {Button} from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field, FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {createCategorySchema} from "@/lib/schemas/category.scheam";
import {Switch} from "@/components/ui/switch";
import ImageUploader from "@/components/ImageUploader";
import {generateSlug} from "@/utils/generate-slug";
import {useTransition} from "react";
import createCategory from "@/app/(admin)/admin/dashboard/category/actions/create-category";
import {Loader} from "lucide-react";
import {useRouter} from "next/navigation";

export default function NewCategoryForm() {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const form = useForm({
        defaultValues: {
            name: "",
            slug: "",
            image: "",
            isActive: true,
            displayOrder: 0,
        },

        validators: {
            onSubmit: createCategorySchema,
        },
        onSubmit: async ({value}) => {
            startTransition(async () => {
                try {
                    const result = await createCategory(value)
                    if (!result.success) {
                        switch (result.status) {
                            case 400:
                                toast.error("Invalid category data.", {
                                    description: "Please check your form inputs.",
                                })
                                break
                            case 401:
                                toast.error("You are not authorized to perform this action.")
                                break
                            default:
                                toast.error(result.error || "Something went wrong.")
                        }
                        console.error("Create category failed:", result)
                        return
                    }
                    toast.success(result.message)
                    form.reset()
                    router.push("/admin/dashboard/category")
                } catch (error) {
                    console.error("Unexpected error:", error)
                    toast.error("An unexpected error occurred while creating the category.")
                }
            })
        }

    })

    const autoGenerateSlugFromName = (value: string) => {
        const generatedSlug = generateSlug(value)

        form.setFieldValue("slug", generatedSlug)
    }

    return (
        <Card className="w-full sm:max-w-4xl">
            <CardHeader>
                <CardTitle>Create New Category</CardTitle>
                <CardDescription>
                    Add a new category to organize your products.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    id="new-category-form"
                    onSubmit={(e) => {
                        e.preventDefault()
                        form.handleSubmit()
                    }}
                >
                    {/* Two Column Layout: Form fields on left, Image uploader on right */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Form Fields */}
                        <FieldGroup className="space-y-4">
                            <form.Field name="name">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>
                                                Category Name *
                                            </FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => {
                                                    field.handleChange(e.target.value)
                                                    autoGenerateSlugFromName(e.target.value)
                                                }}
                                                aria-invalid={isInvalid}
                                                placeholder="Electronics"
                                                autoComplete="off"
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors}/>
                                            )}
                                        </Field>
                                    )
                                }}
                            </form.Field>

                            <form.Field name="slug">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Slug *</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder="electronics"
                                                autoComplete="off"
                                            />
                                            <FieldDescription>
                                                URL-friendly version of the name.
                                            </FieldDescription>
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors}/>
                                            )}
                                        </Field>
                                    )
                                }}
                            </form.Field>
                        </FieldGroup>

                        {/* Right Column - Image Uploader */}
                        <div className="lg:row-span-2">
                            <form.Field name="image">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Category Image</FieldLabel>
                                            <ImageUploader
                                                value={field.state.value}
                                                onChange={field.handleChange}
                                                folder="categories"
                                                maxSizeMB={5}
                                            />
                                            <FieldDescription>
                                                Upload an image (max 5MB)
                                            </FieldDescription>
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors}/>
                                            )}
                                        </Field>
                                    )
                                }}
                            </form.Field>
                        </div>
                    </div>

                    {/* Display Order and Active Status in Same Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        <form.Field name="displayOrder">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Display Order</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            type="number"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) =>
                                                field.handleChange(Number(e.target.value))
                                            }
                                            aria-invalid={isInvalid}
                                            placeholder="0"
                                            min={0}
                                            autoComplete="off"
                                        />
                                        <FieldDescription>
                                            Lower numbers appear first
                                        </FieldDescription>
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors}/>
                                        )}
                                    </Field>
                                )
                            }}
                        </form.Field>

                        <form.Field name="isActive">
                            {(field) => (
                                <Field orientation="horizontal">
                                    <FieldContent>
                                        <FieldLabel htmlFor={field.name}>Active Status</FieldLabel>
                                        <FieldDescription>
                                            Inactive categories won&#39;t be visible
                                        </FieldDescription>
                                    </FieldContent>
                                    <Switch
                                        id="isActive"
                                        checked={field.state.value}
                                        onCheckedChange={field.handleChange}
                                    />
                                </Field>
                            )}
                        </form.Field>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                    Reset
                </Button>
                <Button type="submit" form="new-category-form" disabled={isPending}>
                    {
                        isPending ? <Loader className={"animate-spin"}/> : "Create Category"
                    }
                </Button>
            </CardFooter>
        </Card>
    )
}
