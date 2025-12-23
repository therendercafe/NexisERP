"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { RevenueChart, InventoryVelocityPie } from "@/components/dashboard/charts";
import { AnimatedProgress } from "@/components/dashboard/animated-progress";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Activity,
  UserCircle2,
  TrendingUp,
  Zap,
  BarChart3,
  History,
  Download,
  Calendar,
  Filter,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RevenueDistribution } from "@/components/dashboard/revenue-charts";
import { AuditDetailModal } from "@/components/dashboard/audit-detail-modal";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

export default function DashboardContent({ data, analytics, recentMutations }: { data: any, analytics: any, recentMutations: any[] }) {
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExporting, setIsExporting] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const [dateFrom, setDateFrom] = useState(searchParams.get("from") || "");
  const [dateTo, setDateTo] = useState(searchParams.get("to") || "");

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (dateFrom) params.set("from", dateFrom);
    else params.delete("from");
    if (dateTo) params.set("to", dateTo);
    else params.delete("to");
    router.push(`/dashboard?${params.toString()}`);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // 1. HEADER (Branded)
      doc.setFillColor(15, 23, 42); // bg-background (approx)
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("NEXIS COMMAND", 14, 25);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("ENTERPRISE RESOURCE PLANNING & REVENUE ORCHESTRATION", 14, 32);
      doc.text(`REPORTING WINDOW: ${dateFrom || 'ALL'} TO ${dateTo || 'PRESENT'}`, 140, 32, { align: 'right' });

      // 2. SUMMARY METRICS
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Executive Summary", 14, 55);
      
      autoTable(doc, {
        startY: 60,
        head: [['Metric', 'Value', 'Performance Status']],
        body: [
          ['Total Gross Revenue', `$${data.totalRevenue.toLocaleString()}`, 'STABLE'],
          ['Active SKU Inventory', data.activeSKUs.toString(), 'MONITORED'],
          ['Order Fulfillment', data.newOrders.toString(), 'ACTIVE'],
          ['Operating Net Margin', `${data.grossMargin}%`, 'OPTIMIZED'],
        ],
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129], fontStyle: 'bold' }, // Emerald-500
        styles: { fontSize: 9 }
      });

      // 3. CAPTURE CHARTS (Visual Intelligence)
      const revenueChartElement = document.getElementById('revenue-chart-container');
      if (revenueChartElement) {
        const canvas = await html2canvas(revenueChartElement, {
          backgroundColor: '#0f172a', // Match theme background
          scale: 2,
          logging: false,
          useCORS: true
        });
        const imgData = canvas.toDataURL('image/png');
        doc.text("Revenue Velocity Visual", 14, (doc as any).lastAutoTable.finalY + 15);
        doc.addImage(imgData, 'PNG', 14, (doc as any).lastAutoTable.finalY + 20, 182, 60);
      }

      // 4. TRANSACTIONAL LEDGER (Actual Orders for the period)
      doc.addPage();
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Transactional Ledger (Filtered Period)", 14, 20);
      
      const orderData = (data.filteredOrders || []).map((o: any) => [
        new Date(o.createdAt).toLocaleDateString(),
        `#${o.id.slice(-8).toUpperCase()}`,
        o.customerName,
        `$${o.totalSales.toLocaleString()}`,
        `$${(o.totalSales - o.totalCost).toLocaleString()}`,
        o.status
      ]);

      autoTable(doc, {
        startY: 25,
        head: [['Date', 'Ref', 'Customer', 'Revenue', 'Profit', 'Status']],
        body: orderData,
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42], fontStyle: 'bold' },
        styles: { fontSize: 8 },
        columnStyles: {
          3: { halign: 'right', fontStyle: 'bold' },
          4: { halign: 'right', fontStyle: 'bold', textColor: [16, 185, 129] }
        }
      });

      // 5. RECENT MUTATIONS (Audit Context)
      doc.text("Operational Mutations & Security Logs", 14, (doc as any).lastAutoTable.finalY + 15);
      const auditData = recentMutations.map(log => [
        new Date(log.createdAt).toLocaleTimeString(),
        log.action,
        log.entityType,
        log.user?.name || "SYSTEM"
      ]);

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [['Time', 'Action', 'Entity Type', 'Actor']],
        body: auditData,
        theme: 'grid',
        headStyles: { fillColor: [71, 85, 105], fontStyle: 'bold' }, // Slate-600
        styles: { fontSize: 7 }
      });

      doc.save(`NEXIS-INTELLIGENCE-${new Date().getTime()}.pdf`);
    } catch (err) {
      console.error("PDF Export Failure:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const stats = [
    { label: "Total Revenue", value: `$${data.totalRevenue.toLocaleString()}`, change: "+20.1%", trendingUp: true, icon: DollarSign, color: "text-primary" },
    { label: "Active SKUs", value: data.activeSKUs.toLocaleString(), change: `+${data.velocity.lowStock + data.velocity.outOfStock}`, trendingUp: true, icon: Package, color: "text-amber-500" },
    { label: "New Orders", value: data.newOrders.toLocaleString(), change: "-4.3%", trendingUp: false, icon: ShoppingCart, color: "text-rose-500" },
    { label: "Net Margin", value: `${data.grossMargin}%`, change: "+2.4%", trendingUp: true, icon: Activity, color: "text-emerald-500" },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground w-full">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest mb-2">
               <Zap className="w-3 h-3 fill-primary" />
               Strategic Command Overview
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Global Operations</h1>
            <p className="text-muted-foreground font-bold tracking-tight">Real-time revenue orchestration and supply chain velocity.</p>
          </div>

          <div className="flex flex-col md:flex-row items-end gap-4 w-full md:w-auto">
            {/* Shopify-style Date Range */}
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

            <div className="flex items-center gap-3">
              <button 
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex items-center gap-2 px-6 py-3 bg-secondary border border-border rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-border transition-all disabled:opacity-50"
              >
                {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                Export PDF
              </button>
              
              <div className="flex flex-col items-end">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1 leading-none">Matrix Status</p>
                <div className="flex items-center gap-2 text-xs font-black bg-secondary/50 border border-border px-4 py-2 rounded-full leading-none">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   SYSTEM_LIVE_OK
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="p-6 rounded-[2rem] bg-card border border-border group hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <stat.icon className="w-20 h-20" />
              </div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={cn("p-2.5 rounded-2xl bg-secondary group-hover:scale-110 transition-transform", stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className={cn("flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full bg-secondary", stat.trendingUp ? 'text-green-500' : 'text-red-500')}>
                  {stat.change}
                  {stat.trendingUp ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                </div>
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 relative z-10">{stat.label}</p>
              <h3 className="text-3xl font-black tracking-tighter relative z-10">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-card border border-border shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-xl font-black tracking-tighter uppercase">Revenue Analytics</h2>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Global Settlement Velocity</p>
              </div>
              <div className="flex gap-2">
                 <button className="bg-secondary hover:bg-secondary/80 text-[10px] font-black px-4 py-2 rounded-xl transition-colors">7D</button>
                 <button className="bg-background border border-border text-[10px] font-black px-4 py-2 rounded-xl transition-colors">30D</button>
              </div>
            </div>
            <div id="revenue-chart-container">
              <RevenueChart data={data.revenueByDay} />
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-card border border-border flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-6">
                <h2 className="text-sm font-black tracking-tighter uppercase">Supply Velocity</h2>
                <Package className="w-4 h-4 text-muted-foreground opacity-50" />
            </div>
            <InventoryVelocityPie 
              healthy={data.velocity.healthy} 
              lowStock={data.velocity.lowStock} 
              outOfStock={data.velocity.outOfStock} 
            />
            <div className="w-full grid grid-cols-3 gap-2 mt-6">
                <div className="text-center">
                  <p className="text-[8px] font-black text-primary uppercase">Healthy</p>
                  <p className="text-xs font-black">{data.velocity.healthy}</p>
                </div>
                <div className="text-center border-x border-border">
                  <p className="text-[8px] font-black text-amber-500 uppercase">Low</p>
                  <p className="text-xs font-black">{data.velocity.lowStock}</p>
                </div>
                <div className="text-center">
                  <p className="text-[8px] font-black text-rose-500 uppercase">Out</p>
                  <p className="text-xs font-black">{data.velocity.outOfStock}</p>
                </div>
            </div>
          </div>
        </div>

        {/* Bottom Detailed Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-card border border-border rounded-[2.5rem] p-8 overflow-hidden">
               <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary"><BarChart3 className="w-5 h-5" /></div>
                  <h3 className="text-lg font-black tracking-tighter uppercase">Market Share by Category</h3>
               </div>
               <div className="h-[300px]">
                  <RevenueDistribution data={analytics.categories} />
               </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-card border border-border group hover:border-emerald-500/30 transition-all flex flex-col">
                <div className="flex justify-between items-center mb-8">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                         <UserCircle2 className="w-7 h-7" />
                      </div>
                      <h3 className="text-lg font-black tracking-tighter uppercase">Customers</h3>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Global Entity Base</p>
                      <p className="text-3xl font-black">{data.totalClients.toLocaleString()}</p>
                   </div>
                </div>
                <div className="flex-1 flex flex-col justify-center space-y-6">
                   <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                         <span className="font-bold opacity-50 uppercase tracking-widest">Avg Lifetime Value</span>
                         <span className="font-black text-emerald-500">${Math.round(data.avgOrderValue * 2.5).toLocaleString()}</span>
                      </div>
                      <AnimatedProgress width="72%" />
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                         <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Retention</p>
                         <p className="text-lg font-black text-emerald-500">98.4%</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                         <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Churn Rate</p>
                         <p className="text-lg font-black text-rose-500">1.2%</p>
                      </div>
                   </div>

                   <div className="flex items-center gap-2 text-xs font-black text-emerald-500 pt-2">
                      <TrendingUp className="w-4 h-4" />
                      SYSTEM_STATUS: HIGH_RETENTION_OPTIMIZED
                   </div>
                </div>
             </div>
        </div>

        {/* Recent Mutations Mini-Ledger */}
        <div className="mt-8 bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm text-foreground">
           <div className="p-6 border-b border-border bg-secondary/30 flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-primary/10 rounded-xl text-primary"><History className="w-5 h-5" /></div>
                 <h3 className="text-lg font-black tracking-tighter uppercase">Recent Operational Mutations</h3>
              </div>
              <button className="text-[10px] font-black text-primary uppercase hover:underline">View System Ledger</button>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-border bg-secondary/10">
                       <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Timestamp</th>
                       <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Operation</th>
                       <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Entity</th>
                       <th className="p-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-right">Actor</th>
                    </tr>
                 </thead>
                 <tbody>
                    {recentMutations.map((log: any) => (
                       <tr 
                         key={log.id} 
                         onClick={() => setSelectedLog(log)}
                         className="border-b border-border/50 hover:bg-primary/5 transition-colors cursor-pointer group"
                       >
                          <td className="p-4 font-mono text-[10px] font-bold text-muted-foreground">
                             {new Date(log.createdAt).toLocaleTimeString()}
                          </td>
                          <td className="p-4">
                             <span className={cn(
                                "px-2 py-0.5 rounded-full text-[8px] font-black uppercase border transition-all group-hover:scale-105",
                                log.action.includes("CREATE") ? "bg-green-500/10 border-green-500/20 text-green-500" :
                                log.action.includes("UPDATE") ? "bg-blue-500/10 border-blue-500/20 text-blue-500" :
                                "bg-secondary border-border text-muted-foreground"
                             )}>
                                {log.action}
                             </span>
                          </td>
                          <td className="p-4">
                             <div className="flex flex-col">
                                <span className="text-xs font-black uppercase">{log.entityType}</span>
                                <span className="text-[9px] opacity-50 font-mono">ID: {log.entityId.slice(-8).toUpperCase()}</span>
                             </div>
                          </td>
                          <td className="p-4 text-right text-xs font-black">
                             {log.user?.name || "SYSTEM"}
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </main>

      {selectedLog && (
        <AuditDetailModal 
          log={selectedLog}
          open={!!selectedLog}
          onOpenChange={(open) => !open && setSelectedLog(null)}
        />
      )}
    </div>
  );
}
