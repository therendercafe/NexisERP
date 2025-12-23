import { getUsers } from "@/lib/actions/users";
import UserTable from "@/components/dashboard/user-table";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Shield, Users2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest mb-2">
               <Shield className="w-3 h-3" />
               Governance & Identity Management
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">User Matrix</h1>
            <p className="text-muted-foreground font-bold tracking-tight">Provision identities, cryptographically sign access tokens, and define granular page-level permissions.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-card/50 border border-border px-6 py-4 rounded-3xl backdrop-blur-sm">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Identities</span>
                <span className="text-2xl font-black">{users.length}</span>
             </div>
             <div className="w-[1px] h-10 bg-border mx-2" />
             <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <Users2 className="w-6 h-6" />
             </div>
          </div>
        </header>

        <UserTable initialUsers={users} />
      </main>
    </div>
  );
}

