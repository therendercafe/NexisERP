"use client";

import { useState } from "react";
import { 
  Shield, 
  Clock, 
  ChevronLeft,
  ChevronRight,
  Database,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AuditDetailModal } from "./audit-detail-modal";
import { useRouter, useSearchParams } from "next/navigation";

export function AuditTable({ initialLogs, pagination }: { initialOrders?: any[], initialLogs: any[], pagination: any }) {
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/dashboard/audit?${params.toString()}`);
  };

  const Pagination = () => (
    <div className="p-4 bg-secondary/30 border-t border-border flex justify-between items-center text-foreground">
       <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
         Page <span className="text-foreground">{pagination.currentPage}</span> of <span className="text-foreground">{pagination.pageCount}</span>
       </div>
       <div className="flex gap-2">
          <button 
            disabled={pagination.currentPage === 1} 
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            className="p-1.5 rounded-lg border border-border bg-card hover:bg-secondary disabled:opacity-30"
          >
             <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            disabled={pagination.currentPage === pagination.pageCount || pagination.pageCount === 0} 
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            className="p-1.5 rounded-lg border border-border bg-card hover:bg-secondary disabled:opacity-30"
          >
             <ChevronRight className="w-4 h-4" />
          </button>
       </div>
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-4 bg-secondary/30 border-b border-border flex justify-between items-center text-foreground">
         <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
           Total Events Logged: <span className="text-foreground">{pagination.total}</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sync Status:</span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[9px] font-black">
               <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
               REALTIME_STABLE
            </div>
         </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary/10">
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Timestamp</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Identity / Actor</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Operation</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Entity Type</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mutation Payload</th>
            </tr>
          </thead>
          <tbody>
            {initialLogs.map((log: any) => (
              <tr 
                key={log.id} 
                onClick={() => setSelectedLog(log)}
                className="border-b border-border/50 hover:bg-primary/5 transition-colors text-foreground cursor-pointer group"
              >
                <td className="p-4">
                  <div className="flex items-center gap-2 font-mono text-[10px] font-bold">
                    <Clock className="w-3 h-3 opacity-30 group-hover:text-primary transition-colors" />
                    {new Date(log.createdAt).toLocaleString()}
                  </div>
                </td>
                <td className="p-4">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary group-hover:scale-110 transition-transform">
                         {log.user?.name?.charAt(0) || "S"}
                      </div>
                      <div className="flex flex-col text-foreground">
                         <span className="text-xs font-bold tracking-tight">{log.user?.name || "System"}</span>
                         <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{log.user?.role || "SYSTEM"}</span>
                      </div>
                   </div>
                </td>
                <td className="p-4">
                   <span className={cn(
                     "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border transition-colors",
                     log.action.includes("CREATE") ? "bg-green-500/10 border-green-500/20 text-green-500 group-hover:bg-green-500/20" :
                     log.action.includes("UPDATE") ? "bg-blue-500/10 border-blue-500/20 text-blue-500 group-hover:bg-blue-500/20" :
                     "bg-secondary border-border text-muted-foreground"
                   )}>
                     {log.action}
                   </span>
                </td>
                <td className="p-4 font-mono text-[10px] font-bold tracking-tight opacity-50 uppercase">
                   {log.entityType}
                </td>
                <td className="p-4">
                   <div className="max-w-xs truncate font-mono text-[10px] opacity-70 bg-black/40 p-2 rounded border border-white/5 group-hover:border-primary/20 transition-colors">
                      {JSON.stringify(log.metadata)}
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {initialLogs.length === 0 && (
          <div className="p-20 text-center text-foreground">
             <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-10" />
             <h3 className="text-xl font-black tracking-tighter uppercase mb-2">Matrix Empty</h3>
             <p className="text-muted-foreground font-bold text-sm">No operations match your current filter criteria.</p>
          </div>
        )}
      </div>
      
      <Pagination />

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

