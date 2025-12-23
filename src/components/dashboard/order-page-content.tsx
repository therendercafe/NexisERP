"use client";

import { NewOrderModal } from "@/components/dashboard/new-order-modal";
import { OrderTable } from "@/components/dashboard/order-table";

export function OrderPageContent({ initialOrders, stats }: { initialOrders: any[], stats: any }) {
  return (
    <div className="flex min-h-screen bg-background">
      <OrderTable initialOrders={initialOrders} stats={stats} />
    </div>
  );
}

