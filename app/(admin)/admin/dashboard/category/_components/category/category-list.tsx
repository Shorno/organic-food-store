"use client";

import getCategories from "@/app/(admin)/admin/dashboard/category/actions/category/get-categories";
import CategoryTable from "@/app/(admin)/admin/dashboard/category/_components/category/category-table";
import { useCategoryColumns } from "@/app/(admin)/admin/dashboard/category/_components/category/category-columns";
import { use } from "react";

export default function CategoryList({
  categoriesPromise,
}: {
  categoriesPromise: Promise<Awaited<ReturnType<typeof getCategories>>>;
}) {
  const categories = use(categoriesPromise);
  const columns = useCategoryColumns();

  return <CategoryTable columns={columns} data={categories} />;
}