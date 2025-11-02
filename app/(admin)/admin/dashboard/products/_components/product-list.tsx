"use client";

import getProducts from "@/app/(admin)/admin/dashboard/products/actions/get-products";
import ProductTable from "@/app/(admin)/admin/dashboard/products/_components/product-table";
import { useProductColumns } from "@/app/(admin)/admin/dashboard/products/_components/product-columns";
import { use } from "react";

export default function ProductList({
  productsPromise,
}: {
  productsPromise: Promise<Awaited<ReturnType<typeof getProducts>>>;
}) {
  const products = use(productsPromise);
  const columns = useProductColumns();

  return <ProductTable columns={columns} data={products} />;
}
