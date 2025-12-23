"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle2, 
  User,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OrderDetailModal } from "@/components/dashboard/order-detail-modal";
import { NewOrderModal } from "@/components/dashboard/new-order-modal";
import { OrderFilters } from "@/components/dashboard/order-filters";
import { useRouter, useSearchParams } from "next/navigation";

export function OrderTable({ initialOrders, stats, pagination }: { initialOrders: any[], stats: any, pagination: any }) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/dashboard/orders?${params.toString()}`);
  };

  const handleSort = (column: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentSort = searchParams.get("sortBy");
    const currentOrder = searchParams.get("order");

    if (currentSort === column) {
      params.set("order", currentOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sortBy", column);
      params.set("order", "desc");
    }
    router.push(`/dashboard/orders?${params.toString()}`);
  };

  const Pagination = () => (
    <div className="flex items-center justify-between p-4 bg-secondary/20 border-b border-border text-foreground">
      <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
        Page <span className="text-foreground">{pagination.currentPage}</span> of <span className="text-foreground">{pagination.pageCount}</span>
        <span className="ml-4 opacity-50">Total Match: {pagination.total}</span>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className="p-2 rounded-lg border border-border bg-card hover:bg-secondary disabled:opacity-30 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.pageCount || pagination.pageCount === 0}
          className="p-2 rounded-lg border border-border bg-card hover:bg-secondary disabled:opacity-30 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background w-full text-foreground">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest mb-2">
               <div className="w-2 h-2 rounded-full bg-primary" />
               Order Execution Hub
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Revenue Streams</h1>
            <p className="text-muted-foreground font-bold tracking-tight">Managing real-time transactional data across the global supply chain.</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-6 bg-card border border-border p-4 rounded-2xl shadow-sm">
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Global Revenue</span>
                   <span className="text-xl font-black">${stats.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="w-[1px] h-8 bg-border" />
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Net Margin</span>
                   <span className="text-xl font-black text-green-500">{stats.netMargin}</span>
                </div>
             </div>
             <NewOrderModal />
          </div>
        </header>

        <OrderFilters />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border p-6 rounded-3xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-24 h-24" />
             </div>
             <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Orders</p>
             <h3 className="text-4xl font-black tracking-tighter">{stats.orderCount}</h3>
          </div>
          <div className="bg-card border border-border p-6 rounded-3xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                <Clock className="w-24 h-24 text-yellow-500" />
             </div>
             <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Processing Time</p>
             <h3 className="text-4xl font-black tracking-tighter">1.2s</h3>
          </div>
          <div className="bg-card border border-border p-6 rounded-3xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-24 h-24 text-green-500" />
             </div>
             <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Fill Rate</p>
             <h3 className="text-4xl font-black tracking-tighter">99.8%</h3>
          </div>
        </div>

        <div className="bg-card border border-border rounded-3xl overflow-hidden">
          <Pagination />
          <div className="p-4 border-b border-border bg-secondary/30">
            <h2 className="text-sm font-black uppercase tracking-widest">Transactional Ledger</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary/10">
                  <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('id')}>
                    <div className="flex items-center gap-2">Order Ref <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('createdAt')}>
                    <div className="flex items-center gap-2">Date <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('customerName')}>
                    <div className="flex items-center gap-2">Entity (Customer) <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground text-center">Items</th>
                  <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('totalSales')}>
                    <div className="flex items-center gap-2">Gross Revenue <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('totalSales')}>
                    <div className="flex items-center gap-2">Net Profit <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {initialOrders.map((order: any) => {
                  const profit = Number(order.totalSales) - Number(order.totalCost);
                  return (
                    <tr 
                      key={order.id} 
                      onClick={() => setSelectedOrder(order)}
                      className="group hover:bg-primary/5 border-b border-border/50 transition-colors cursor-pointer"
                    >
                      <td className="p-4">
                         <span className="font-mono text-sm font-bold text-muted-foreground">#{order.id.slice(-8).toUpperCase()}</span>
                      </td>
                      <td className="p-4">
                         <span className="text-sm font-bold tracking-tight">
                           {new Date(order.createdAt).toLocaleDateString()}
                         </span>
                      </td>
                      <td className="p-4">
                         <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                               <User className="w-4 h-4 opacity-50" />
                            </div>
                            <span className="text-sm font-black tracking-tight group-hover:text-primary transition-colors">{order.customerName}</span>
                         </div>
                      </td>
                      <td className="p-4 text-center font-black text-sm">{order.items.length}</td>
                      <td className="p-4">
                         <span className="text-sm font-black text-emerald-500/80">${Number(order.totalSales).toLocaleString()}</span>
                      </td>
                      <td className="p-4">
                         <span className="text-sm font-black text-primary">${profit.toLocaleString()}</span>
                      </td>
                      <td className="p-4 text-right">
                         <button className="p-2 rounded-lg hover:bg-secondary text-primary transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                         </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {initialOrders.length === 0 && (
              <div className="p-20 text-center text-foreground">
                 <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-10" />
                 <h3 className="text-xl font-black tracking-tighter uppercase mb-2">No Transactions Detected</h3>
                 <p className="text-muted-foreground font-bold text-sm">No orders match your current filter criteria.</p>
              </div>
            )}
          </div>
          <div className="border-t border-border">
            <Pagination />
          </div>
        </div>
      </main>

      {selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder}
          open={!!selectedOrder}
          onOpenChange={(open) => !open && setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
