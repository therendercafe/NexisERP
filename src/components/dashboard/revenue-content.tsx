"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { RevenueDistribution, ProfitTrend, EfficiencyBar } from "@/components/dashboard/revenue-charts";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  TrendingUp, 
  Zap, 
  Calendar, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  BrainCircuit, 
  Sparkles,
  Download,
  Activity,
  Briefcase,
  ArrowUpDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { OrderDetailModal } from "@/components/dashboard/order-detail-modal";

export default function RevenueContent({ 
  data, 
  searchParams 
}: { 
  data: any, 
  searchParams: { 
    from?: string; 
    to?: string; 
    page?: string;
    sortBy?: string;
    order?: string;
  } 
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [dateFrom, setDateFrom] = useState(searchParams.from || "");
  const [dateTo, setDateTo] = useState(searchParams.to || "");
  const [selectedTx, setSelectedTx] = useState<any>(null);

  const currentSortBy = searchParams.sortBy || "createdAt";
  const currentOrder = searchParams.order || "desc";

  const handlePageChange = (newPage: number) => {
    const nextParams = new URLSearchParams(params.toString());
    nextParams.set("page", newPage.toString());
    router.push(`/dashboard/revenue?${nextParams.toString()}`);
  };

  const handleSort = (field: string) => {
    const nextParams = new URLSearchParams(params.toString());
    const isAsc = currentSortBy === field && currentOrder === "asc";
    nextParams.set("sortBy", field);
    nextParams.set("order", isAsc ? "desc" : "asc");
    nextParams.set("page", "1");
    router.push(`/dashboard/revenue?${nextParams.toString()}`);
  };

  const applyFilters = () => {
    const nextParams = new URLSearchParams(params.toString());
    if (dateFrom) nextParams.set("from", dateFrom);
    else nextParams.delete("from");
    if (dateTo) nextParams.set("to", dateTo);
    else nextParams.delete("to");
    nextParams.set("page", "1"); // Reset to page 1 on filter
    router.push(`/dashboard/revenue?${nextParams.toString()}`);
  };

  const stats = [
    { label: "Aggregate Revenue", value: `$${data.summary.totalRevenue.toLocaleString()}`, change: "+12.5%", trendingUp: true, icon: DollarSign, color: "text-primary" },
    { label: "Net Corporate Profit", value: `$${data.summary.totalProfit.toLocaleString()}`, change: `Margin: ${Math.round((data.summary.totalProfit / data.summary.totalRevenue) * 100)}%`, trendingUp: true, icon: Activity, color: "text-emerald-500" },
    { label: "Avg Transaction Value", value: `$${Math.round(data.summary.avgOrderValue).toLocaleString()}`, change: "Optimized Velocity", trendingUp: true, icon: Briefcase, color: "text-amber-500" },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground w-full">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest mb-2">
               <TrendingUp className="w-3 h-3" />
               Financial Intelligence Unit
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Revenue Analytics</h1>
            <p className="text-muted-foreground font-bold tracking-tight">Real-time fiscal orchestration and market-share visualization.</p>
          </div>

          <div className="flex flex-col md:flex-row items-end gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-card border border-border p-1.5 rounded-2xl shadow-sm w-full md:w-auto">
              <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-xl border border-transparent focus-within:border-primary/50 transition-all">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <input 
                  type="date" 
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="bg-transparent text-[10px] font-black uppercase outline-none w-24"
                />
              </div>
              <div className="text-muted-foreground text-[10px] font-black uppercase">To</div>
              <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-xl border border-transparent focus-within:border-primary/50 transition-all">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <input 
                  type="date" 
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="bg-transparent text-[10px] font-black uppercase outline-none w-24"
                />
              </div>
              <button 
                onClick={applyFilters}
                className="p-2 bg-primary text-primary-foreground rounded-xl hover:scale-105 transition-transform"
              >
                <Filter className="w-3.5 h-3.5" />
              </button>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-secondary border border-border rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-border transition-all">
              <Download className="w-3.5 h-3.5" />
              Generate Fiscal_Report
            </button>
          </div>
        </header>

        {/* 🔮 NEXIS ORACLE: AI AUDITOR GATEWAY */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden p-8 rounded-[2.5rem] bg-primary/5 border border-primary/20 group hover:border-primary/40 transition-all mb-10"
        >
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-1000">
            <BrainCircuit className="w-48 h-48 text-primary" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-primary-foreground shadow-[0_0_30px_-5px_rgba(var(--primary),0.5)] relative">
              <Sparkles className="w-10 h-10 animate-pulse" />
              <div className="absolute -inset-1 bg-primary blur-xl opacity-20 animate-pulse" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-1">NEXIS Oracle <span className="text-[10px] bg-primary text-primary-foreground px-3 py-1 rounded-full ml-3 align-middle tracking-widest">PROTOTYPE_V1</span></h3>
              <p className="text-sm font-bold text-muted-foreground max-w-2xl">
                The AI Internal Auditor is synthesizing your fiscal mutations. The Oracle can identify margin leakages, predict churn velocity, and generate natural-language executive briefings.
              </p>
            </div>
            <Link href="/dashboard/ai-auditor">
              <button className="px-10 py-4 bg-primary text-primary-foreground rounded-full font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-primary/20">
                Query Intelligence
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="p-8 rounded-[2.5rem] bg-card border border-border relative overflow-hidden group hover:border-primary/30 transition-all shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div className={cn("p-3 rounded-2xl bg-secondary", stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={cn("text-[10px] font-black px-3 py-1 rounded-full bg-secondary", stat.trendingUp ? 'text-green-500' : 'text-red-500')}>
                  {stat.change}
                </div>
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-4xl font-black tracking-tighter">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 h-[450px]">
            <ProfitTrend data={data.monthly} />
          </div>
          <div className="h-[450px]">
            <RevenueDistribution data={data.categories} />
          </div>
        </div>

        {/* Operational Performance */}
        <div className="h-[450px] mb-10">
          <EfficiencyBar data={data.monthly} />
        </div>

        {/* Transactional Ledger with Pagination */}
        <div className="bg-card border border-border rounded-[3rem] overflow-hidden shadow-sm">
          <div className="p-8 border-b border-border bg-secondary/20 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tighter">Transactional Ledger</h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Audit-verified revenue mutations</p>
            </div>
            
            {/* Top Pagination */}
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Page {data.pagination.currentPage} of {data.pagination.pages}
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => handlePageChange(data.pagination.currentPage - 1)}
                  disabled={data.pagination.currentPage === 1}
                  className="p-2 bg-secondary border border-border rounded-xl hover:bg-border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handlePageChange(data.pagination.currentPage + 1)}
                  disabled={data.pagination.currentPage === data.pagination.pages}
                  className="p-2 bg-secondary border border-border rounded-xl hover:bg-border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-secondary/10">
                  <th 
                    onClick={() => handleSort("timestamp")}
                    className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Timestamp
                      <ArrowUpDown className={cn("w-3 h-3 transition-opacity", currentSortBy === "timestamp" ? "opacity-100" : "opacity-30")} />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort("reference")}
                    className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Reference
                      <ArrowUpDown className={cn("w-3 h-3 transition-opacity", currentSortBy === "reference" ? "opacity-100" : "opacity-30")} />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort("entity")}
                    className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Entity
                      <ArrowUpDown className={cn("w-3 h-3 transition-opacity", currentSortBy === "entity" ? "opacity-100" : "opacity-30")} />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort("revenue")}
                    className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right cursor-pointer hover:text-primary transition-colors"
                  >
                    <div className="flex items-center justify-end gap-2">
                      Revenue
                      <ArrowUpDown className={cn("w-3 h-3 transition-opacity", currentSortBy === "revenue" ? "opacity-100" : "opacity-30")} />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort("profit")}
                    className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right cursor-pointer hover:text-primary transition-colors"
                  >
                    <div className="flex items-center justify-end gap-2">
                      Profit
                      <ArrowUpDown className={cn("w-3 h-3 transition-opacity", currentSortBy === "profit" ? "opacity-100" : "opacity-30")} />
                    </div>
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.transactions.map((tx: any) => (
                  <tr 
                    key={tx.id} 
                    onClick={() => setSelectedTx(tx)}
                    className="hover:bg-secondary/20 transition-colors group cursor-pointer"
                  >
                    <td className="px-8 py-6 font-mono text-[10px] font-bold text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                    <td className="px-8 py-6 font-mono text-xs font-black uppercase tracking-tighter">
                      #{tx.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black tracking-tight">{tx.customerName}</p>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-sm text-foreground">
                      ${tx.totalSales.toLocaleString()}
                    </td>
                    <td className="px-8 py-6 text-right font-black text-sm text-emerald-500">
                      ${(tx.totalSales - tx.totalCost).toLocaleString()}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                        tx.status === "COMPLETED" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                        tx.status === "PENDING" ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                        "bg-rose-500/10 border-rose-500/20 text-rose-500"
                      )}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Pagination */}
          <div className="p-8 border-t border-border bg-secondary/10 flex justify-between items-center">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Showing {data.transactions.length} of {data.pagination.total} mutations
            </p>
            <div className="flex gap-4 items-center">
               <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Page {data.pagination.currentPage} of {data.pagination.pages}
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => handlePageChange(data.pagination.currentPage - 1)}
                  disabled={data.pagination.currentPage === 1}
                  className="px-4 py-2 bg-secondary border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <button 
                  onClick={() => handlePageChange(data.pagination.currentPage + 1)}
                  disabled={data.pagination.currentPage === data.pagination.pages}
                  className="px-4 py-2 bg-secondary border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {selectedTx && (
        <OrderDetailModal 
          order={selectedTx}
          open={!!selectedTx}
          onOpenChange={(open) => !open && setSelectedTx(null)}
        />
      )}
    </div>
  );
}

