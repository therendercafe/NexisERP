import { getOrders, getFinancialPerformance } from "@/lib/actions/orders";
import { OrderTable } from "@/components/dashboard/order-table";

export const dynamic = "force-dynamic";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { 
    page?: string; 
    sortBy?: string; 
    order?: 'asc' | 'desc';
    status?: string;
    startDate?: string;
    endDate?: string;
  };
}) {
  const page = parseInt(searchParams.page || "1");
  const sortBy = searchParams.sortBy || 'createdAt';
  const order = searchParams.order || 'desc';
  const status = searchParams.status;
  const startDate = searchParams.startDate;
  const endDate = searchParams.endDate;

  const [ordersRes, statsRes] = await Promise.all([
    getOrders({ page, pageSize: 50, sortBy, order, status, startDate, endDate }),
    getFinancialPerformance()
  ]);

  const orders = ordersRes.success ? ordersRes.data : [];
  const pagination = ordersRes.success ? ordersRes.pagination : { total: 0, pageCount: 0, currentPage: 1, pageSize: 50 };
  const stats = statsRes.success ? statsRes.data : {
    totalRevenue: 0,
    netMargin: "0%",
    orderCount: 0
  };

  return (
    <OrderTable initialOrders={orders} stats={stats} pagination={pagination} />
  );
}
