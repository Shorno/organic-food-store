import { getOrders } from "@/app/(admin)/admin/dashboard/orders/actions/get-orders";
import OrderTable from "@/app/(admin)/admin/dashboard/orders/_components/order-table";
import { orderColumns } from "@/app/(admin)/admin/dashboard/orders/_components/order-columns";

export default async function OrderList() {
    const orders = await getOrders()

    return (
        <OrderTable columns={orderColumns} data={orders} />
    )
}

