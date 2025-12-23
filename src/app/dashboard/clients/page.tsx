import { Sidebar } from "@/components/dashboard/sidebar";
import { getClients } from "@/lib/actions/crm";
import { 
  User, 
  Download, 
} from "lucide-react";
import { ClientTable, CreateClientTrigger } from "@/components/dashboard/client-table";

export const dynamic = "force-dynamic";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: { page?: string, search?: string };
}) {
  const page = parseInt(searchParams.page || "1");
  const search = searchParams.search || "";
  const result = await getClients(page, 50, search);
  
  const clients = result.success ? result.data : [];
  const pagination = result.success ? result.pagination : { total: 0, pageCount: 0, currentPage: 1 };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest mb-2">
               <User className="w-3 h-3" />
               Entity Relationship Manager
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Corporate Clients</h1>
            <p className="text-muted-foreground font-bold tracking-tight">Managing global enterprise relationships and lifetime value analytics.</p>
          </div>
          <div className="flex gap-3 text-foreground">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card font-bold text-sm hover:bg-secondary transition-colors">
              <Download className="w-4 h-4" />
              Export CRM
            </button>
            <CreateClientTrigger />
          </div>
        </header>

        <ClientTable 
          initialData={clients} 
          pagination={pagination as any} 
        />
      </main>
    </div>
  );
}
