"use server"


import {db} from "@/db/config";
import {cacheLife, cacheTag} from "next/cache";
import {categoryCacheTag} from "@/cache-tags/category";


export default async function getCategoryWithSubcategory(){
    "use cache"
    cacheTag(categoryCacheTag)
    cacheLife("hours")
    return await db.query.category.findMany({
        with : {
            subCategory : true
        }
    })
}