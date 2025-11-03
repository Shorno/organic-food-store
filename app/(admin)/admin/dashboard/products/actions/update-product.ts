"use server"

import {checkAuth} from "@/app/actions/auth/checkAuth";
import {UpdateProductFormValues, updateProductSchema} from "@/lib/schemas/product.schema";
import {z} from "zod";
import {db} from "@/db/config";
import {product} from "@/db/schema/product";
import {eq} from "drizzle-orm";
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

export default async function updateProduct(
    formData: UpdateProductFormValues
): Promise<ActionResult<UpdateProductFormValues>> {
    const session = await checkAuth()

    if (!session?.user || session?.user.role !== "admin") {
        return {
            success: false,
            status: 401,
            error: "Unauthorized",
        }
    }

    try {
        const result = updateProductSchema.safeParse(formData)

        if (!result.success) {
            return {
                success: false,
                status: 400,
                error: "Validation failed",
                details: z.treeifyError(result.error),
            }
        }

        const validData = result.data
        const { id, ...updateData } = validData

        const updatedProduct = await db
            .update(product)
            .set({
                ...updateData,
                price: updateData.price,
                subCategoryId: updateData.subCategoryId || null,
            })
            .where(eq(product.id, id))
            .returning()

        if (!updatedProduct.length) {
            return {
                success: false,
                status: 404,
                error: "Product not found",
            }
        }

        // Revalidate only client-facing routes (not admin dashboard)
        revalidatePath("/products")
        revalidatePath("/")

        return {
            success: true,
            status: 200,
            data: {
                ...updatedProduct[0],
                subCategoryId: updatedProduct[0].subCategoryId ?? undefined,
            },
            message: "Product updated successfully",
        }
    } catch (error) {
        console.error("Error updating product:", error)

        return {
            success: false,
            status: 500,
            error: "An unexpected error occurred",
        }
    }
}
