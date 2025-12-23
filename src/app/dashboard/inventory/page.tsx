import { getInventory } from "@/lib/actions/inventory";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ProductTable } from "@/components/dashboard/product-table";
import { InventorySearch } from "@/components/dashboard/inventory-search";
import { AddProductModal } from "@/components/dashboard/add-product-modal";
import { Download, Filter } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: { 
    page?: string; 
    search?: string;
    sortBy?: string;
    order?: string;
  };
}) {
  const page = parseInt(searchParams.page || "1");
  const search = searchParams.search || "";
  const sortBy = searchParams.sortBy || "createdAt";
  const order = (searchParams.order as "asc" | "desc") || "desc";

  const result = await getInventory(page, 50, search, sortBy, order);
  
  const skus = result.success ? result.data : [];
  const pagination = result.success ? result.pagination : { total: 0, pageCount: 0, currentPage: 1, pageSize: 50 };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest mb-2">
               <div className="w-2 h-2 rounded-full bg-primary" />
               Live Inventory Engine
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">SKU Management</h1>
            <p className="text-muted-foreground font-bold tracking-tight">Monitor stock levels, margins, and operational velocity.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card font-bold text-sm hover:bg-secondary transition-colors">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <AddProductModal />
          </div>
        </header>

        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl shadow-black/20">
          <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between gap-4">
            <InventorySearch />
            <div className="flex items-center gap-2">
               <button className="p-2 rounded-xl border border-border hover:bg-background transition-colors">
                 <Filter className="w-4 h-4" />
               </button>
               <div className="h-4 w-[1px] bg-border mx-2" />
               <p className="text-xs font-bold text-muted-foreground tracking-tight">
                 Operational Sync: <span className="text-foreground uppercase tracking-widest text-[10px]">Active</span>
               </p>
            </div>
          </div>

          <ProductTable 
            initialData={skus} 
            pagination={pagination as any} 
          />
        </div>
      </main>
    </div>
  );
}
