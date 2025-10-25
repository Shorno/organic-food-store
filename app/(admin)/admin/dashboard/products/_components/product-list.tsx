import getProducts from "@/app/(admin)/admin/dashboard/products/actions/get-products";
import ProductTable from "@/app/(admin)/admin/dashboard/products/_components/product-table";
import {productColumns} from "@/app/(admin)/admin/dashboard/products/_components/product-columns";

export default async function ProductList() {
    const products = await getProducts()

    return (
        <ProductTable columns={productColumns} data={products}/>
    )
}

