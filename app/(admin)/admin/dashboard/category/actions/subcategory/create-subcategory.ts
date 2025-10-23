"use server"

import {checkAuth} from "@/app/actions/auth/checkAuth"
import {CreateSubcategoryFormValues, createSubcategorySchema} from "@/lib/schemas/category.scheam"
import {z} from "zod"
import {db} from "@/db/config"
import {revalidatePath} from "next/cache"
import {subCategory} from "@/db/schema";

export type ActionResult<TData = unknown> =
    | {
    success: true
    status: number
    data: TData
    message?: string
}
    | {
    success: false
    status: number
    error: string
    details?: unknown
}

export default async function createSubcategory(
    formData: CreateSubcategoryFormValues
): Promise<ActionResult<CreateSubcategoryFormValues>> {
    const session = await checkAuth()

    if (!session?.user || session?.user.role !== "admin") {
        return {
            success: false,
            status: 401,
            error: "Unauthorized",
        }
    }

    try {
        const result = createSubcategorySchema.safeParse(formData)

        if (!result.success) {
            return {
                success: false,
                status: 400,
                error: "Validation failed",
                details: z.treeifyError(result.error),
            }
        }

        const validData = result.data


        const newSubcategory = await db.insert(subCategory).values(validData).returning()


        revalidatePath("/admin/dashboard/category")
        revalidatePath(`/admin/dashboard/category/${validData.categoryId}`)
        revalidatePath("/")



        return {
            success: true,
            status: 201,
            data: newSubcategory[0],
            message: "Subcategory created successfully",
        }
    } catch (error) {
        console.error("Error creating subcategory:", error)

        return {
            success: false,
            status: 500,
            error: "An unexpected error occurred",
        }
    }
}
