"use client";

import { getOrders } from "@/app/(admin)/admin/dashboard/orders/actions/get-orders";
import OrderTable from "@/app/(admin)/admin/dashboard/orders/_components/order-table";
import { useOrderColumns } from "@/app/(admin)/admin/dashboard/orders/_components/order-columns";
import { use } from "react";

export default function OrderList({
  ordersPromise,
}: {
  ordersPromise: Promise<Awaited<ReturnType<typeof getOrders>>>;
}) {
  const orders = use(ordersPromise);
  const columns = useOrderColumns();

  return <OrderTable columns={columns} data={orders} />;
}
