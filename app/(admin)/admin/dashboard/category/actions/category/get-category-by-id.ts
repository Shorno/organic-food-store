"use server"

import {db} from "@/db/config"
import {category} from "@/db/schema/category"
import {eq} from "drizzle-orm"

export default async function getCategoryById(categoryId: number) {
    try {
        const result = await db
            .select()
            .from(category)
            .where(eq(category.id, categoryId))
            .limit(1)

        return result[0] || null
    } catch (error) {
        console.error("Error fetching category:", error)
        return null
    }
}
