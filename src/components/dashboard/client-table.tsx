"use client";

import { useState } from "react";
import { 
  Plus, 
  ChevronLeft,
  ChevronRight,
  Database,
  Mail,
  Phone,
  Globe,
  TrendingUp,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ClientModal } from "./client-modal";
import { ClientSearch } from "./client-search";
import { useRouter, useSearchParams } from "next/navigation";

export function ClientTable({ initialData, pagination }: { initialData: any[], pagination: any }) {
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/dashboard/clients?${params.toString()}`);
  };

  const Pagination = () => (
    <div className="flex items-center justify-between p-4 bg-secondary/20 border-b border-border text-foreground">
      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        Page <span className="text-foreground">{pagination.currentPage}</span> of <span className="text-foreground">{pagination.pageCount}</span>
        <span className="ml-4 opacity-50">Total Entities: {pagination.total}</span>
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
    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
      <Pagination />
      
      <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between gap-4">
        <ClientSearch />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary/10">
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Corporate Identity</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Communication</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Global Location</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Orders</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Lifetime Value (LTV)</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {initialData.map((client: any) => (
              <tr 
                key={client.id} 
                onClick={() => { setSelectedClient(client); setIsEditOpen(true); }}
                className="border-b border-border/50 hover:bg-secondary/20 transition-colors cursor-pointer group"
              >
                <td className="p-4">
                   <div className="flex flex-col">
                      <span className="text-sm font-black tracking-tight group-hover:text-primary transition-colors">{client.name}</span>
                      <span className="text-[9px] font-bold text-primary uppercase tracking-widest">ID: {client.id.slice(-6).toUpperCase()}</span>
                   </div>
                </td>
                <td className="p-4">
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs font-bold opacity-80 italic">
                         <Mail className="w-3 h-3 text-muted-foreground" /> {client.email}
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-2 text-[10px] font-medium opacity-50">
                           <Phone className="w-3 h-3" /> {client.phone}
                        </div>
                      )}
                   </div>
                </td>
                <td className="p-4 text-xs font-bold opacity-70">
                   <div className="flex items-center gap-2">
                      <Globe className="w-3 h-3" /> {client.address || "Global HQ"}
                   </div>
                </td>
                <td className="p-4 text-center font-black text-sm">
                   {client._count.orders}
                </td>
                <td className="p-4">
                   <div className="flex flex-col">
                      <span className="text-sm font-black text-green-500">${client.ltv.toLocaleString()}</span>
                      <div className="flex items-center gap-1 text-[9px] font-black text-muted-foreground">
                         <TrendingUp className="w-2 h-2 text-green-500" />
                         ACTIVE_CLIENT
                      </div>
                   </div>
                </td>
                <td className="p-4 text-right">
                   <button className="p-2 rounded-lg hover:bg-secondary text-primary transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {initialData.length === 0 && (
          <div className="p-20 text-center">
             <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-10" />
             <h3 className="text-xl font-black tracking-tighter uppercase mb-2">CRM Matrix Empty</h3>
             <p className="text-muted-foreground font-bold text-sm">No corporate entities match your current criteria.</p>
          </div>
        )}
      </div>

      <div className="border-t border-border">
        <Pagination />
      </div>

      <ClientModal 
        client={selectedClient} 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        mode="edit" 
      />
    </div>
  );
}

export function CreateClientTrigger() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground font-black text-sm hover:scale-105 transition-transform shadow-lg shadow-primary/20 uppercase tracking-tighter"
      >
        <Plus className="w-4 h-4" />
        New Entity
      </button>
      <ClientModal open={open} onOpenChange={setOpen} mode="create" />
    </>
  );
}
