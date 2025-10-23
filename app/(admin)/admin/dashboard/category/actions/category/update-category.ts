"use server"

import {category} from "@/db/schema/category"
import {eq} from "drizzle-orm"
import {revalidatePath} from "next/cache"
import {UpdateCategoryFormValues} from "@/lib/schemas/category.scheam";
import {db} from "@/db/config";

export default async function updateCategory(data: UpdateCategoryFormValues) {
    try {
        // Check if category exists
        const existingCategory = await db
            .select()
            .from(category)
            .where(eq(category.id, data.id))
            .limit(1)

        if (existingCategory.length === 0) {
            return {
                success: false,
                status: 404,
                error: "Category not found",
            }
        }

        await db
            .update(category)
            .set({
                name: data.name,
                slug: data.slug,
                image: data.image,
                isActive: data.isActive,
                displayOrder: data.displayOrder,
                updated_at: new Date(),
            })
            .where(eq(category.id, data.id))

        revalidatePath("/admin/dashboard/category")

        return {
            success: true,
            message: "Category updated successfully",
        }
    } catch (error) {
        console.error("Error updating category:", error)
        return {
            success: false,
            status: 500,
            error: "Failed to update category",
        }
    }
}
