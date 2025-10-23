"use server"

import {category} from "@/db/schema/category"
import {eq} from "drizzle-orm"
import {revalidatePath} from "next/cache"
import {db} from "@/db/config";

export default async function deleteCategory(categoryId: number) {
    try {
        // Check if category exists
        const existingCategory = await db
            .select()
            .from(category)
            .where(eq(category.id, categoryId))
            .limit(1)

        if (existingCategory.length === 0) {
            return {
                success: false,
                status: 404,
                error: "Category not found",
            }
        }

        await db
            .delete(category)
            .where(eq(category.id, categoryId))

        revalidatePath("/admin/dashboard/category")
        revalidatePath("/")

        return {
            success: true,
            message: "Category and all subcategories deleted successfully",
        }
    } catch (error) {
        console.error("Error deleting category:", error)
        return {
            success: false,
            status: 500,
            error: "Failed to delete category",
        }
    }
}
