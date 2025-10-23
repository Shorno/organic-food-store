"use server"


import {db} from "@/db/config";
import {cacheTag} from "next/cache";
import {categoryCacheTag} from "@/cache-tags/category";


export default async function getCategoryWithSubcategory(){
    "use cache"
    cacheTag(categoryCacheTag)
    return await db.query.category.findMany({
        with : {
            subCategory : true
        }
    })
}