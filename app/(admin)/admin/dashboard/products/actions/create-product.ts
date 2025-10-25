"use server"

import {checkAuth} from "@/app/actions/auth/checkAuth";
import {CreateProductFormValues, createProductSchema} from "@/lib/schemas/product.schema";
import {z} from "zod";
import {db} from "@/db/config";
import {product} from "@/db/schema/product";
import {revalidatePath} from "next/cache";

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

export default async function createProduct(
    formData: CreateProductFormValues
): Promise<ActionResult<CreateProductFormValues>> {
    const session = await checkAuth()

    if (!session?.user || session?.user.role !== "admin") {
        return {
            success: false,
            status: 401,
            error: "Unauthorized",
        }
    }

    try {
        const result = createProductSchema.safeParse(formData)

        if (!result.success) {
            return {
                success: false,
                status: 400,
                error: "Validation failed",
                details: z.treeifyError(result.error),
            }
        }

        const validData = result.data

        const newProduct = await db.insert(product).values({
            ...validData,
            price: validData.price,
            subCategoryId: validData.subCategoryId || null,
        }).returning()

        revalidatePath("/admin/dashboard/products")
        revalidatePath("/")

        return {
            success: true,
            status: 201,
            data: {
                ...newProduct[0],
                subCategoryId: newProduct[0].subCategoryId ?? undefined,
            },
            message: "Product created successfully",
        }
    } catch (error) {
        console.error("Error creating product:", error)

        return {
            success: false,
            status: 500,
            error: "An unexpected error occurred",
        }
    }
}

