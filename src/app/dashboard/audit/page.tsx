import { Sidebar } from "@/components/dashboard/sidebar";
import { getAuditLogs, getAuditActions } from "@/lib/actions/audit";
import { Shield } from "lucide-react";
import { AuditTable } from "@/components/dashboard/audit-table";
import { AuditFilters } from "@/components/dashboard/audit-filters";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: { 
    page?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  };
}) {
  const page = parseInt(searchParams.page || "1");
  const action = searchParams.action;
  const startDate = searchParams.startDate;
  const endDate = searchParams.endDate;

  const [logsRes, actionsRes] = await Promise.all([
    getAuditLogs({ 
      page, 
      pageSize: 50, 
      action, 
      startDate, 
      endDate 
    }),
    getAuditActions()
  ]);
  
  const logs = logsRes.success ? logsRes.data : [];
  const pagination = logsRes.success ? logsRes.pagination : { total: 0, pageCount: 0, currentPage: 1, pageSize: 50 };
  const availableActions = actionsRes.success ? actionsRes.data : [];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-10 text-foreground">
          <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest mb-2">
             <Shield className="w-3 h-3" />
             Immutable Audit Matrix
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">System Ledger</h1>
          <p className="text-muted-foreground font-bold tracking-tight">Cryptographically sequenced event log of every operational mutation.</p>
        </header>

        <AuditFilters availableActions={availableActions as string[]} />

        <AuditTable 
          initialLogs={logs} 
          pagination={pagination as any} 
        />
      </main>
    </div>
  );
}
