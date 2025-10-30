import { getUserOrders } from "@/app/actions/order"
import EmptyOrders from "@/app/(client)/(account)/account/orders/_components/empty-order";
import OrdersList from "@/app/(client)/(account)/account/orders/_components/order-list";


export default async function OrdersContent() {
    const orders = await getUserOrders()

    if (!orders || orders.length === 0) {
        return <EmptyOrders />
    }

    return <OrdersList orders={orders} />
}
