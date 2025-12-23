"use client";

import { useState } from "react";
import { 
  MoreHorizontal, 
  TrendingUp,
  History,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ArrowUpDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EditProductModal } from "./edit-product-modal";
import { useRouter, useSearchParams } from "next/navigation";

interface SKU {
  id: string;
  name: string;
  code: string;
  quantity: number;
  costPrice: any;
  sellPrice: any;
  updatedAt: Date;
}

interface ProductTableProps {
  initialData: any[];
  pagination: {
    total: number;
    pageCount: number;
    currentPage: number;
    pageSize: number;
  };
}

export function ProductTable({ initialData, pagination }: ProductTableProps) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSortBy = searchParams.get("sortBy") || "createdAt";
  const currentOrder = searchParams.get("order") || "desc";

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/dashboard/inventory?${params.toString()}`);
  };

  const handleSort = (field: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const isAsc = currentSortBy === field && currentOrder === "asc";
    params.set("sortBy", field);
    params.set("order", isAsc ? "desc" : "asc");
    params.set("page", "1");
    router.push(`/dashboard/inventory?${params.toString()}`);
  };

  const PaginationControls = () => (
    <div className="flex items-center justify-between p-4 bg-secondary/20 border-b border-border">
      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        Page <span className="text-foreground">{pagination.currentPage}</span> of <span className="text-foreground">{pagination.pageCount}</span>
        <span className="ml-4 opacity-50">Total SKUs: {pagination.total}</span>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className="p-2 rounded-lg border border-border bg-card hover:bg-secondary disabled:opacity-30 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1">
          {/* Display logic for page numbers to avoid layout break on many pages */}
          {Array.from({ length: Math.min(pagination.pageCount, 5) }, (_, i) => {
            let pageNum = i + 1;
            // Center active page if more than 5 pages
            if (pagination.pageCount > 5 && pagination.currentPage > 3) {
              pageNum = pagination.currentPage - 3 + i + 1;
              if (pageNum > pagination.pageCount) pageNum = pagination.pageCount - (4 - i);
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={cn(
                  "w-8 h-8 rounded-lg text-[10px] font-black transition-all border",
                  pagination.currentPage === pageNum 
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" 
                    : "bg-card border-border hover:bg-secondary"
                )}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
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
    <>
      <PaginationControls />
      
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary/10">
              <th 
                onClick={() => handleSort("product")}
                className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  SKU / Identity
                  <ArrowUpDown className={cn("w-3 h-3 transition-opacity", currentSortBy === "product" ? "opacity-100" : "opacity-30")} />
                </div>
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
              <th 
                onClick={() => handleSort("quantity")}
                className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  Stock Level
                  <ArrowUpDown className={cn("w-3 h-3 transition-opacity", currentSortBy === "quantity" ? "opacity-100" : "opacity-30")} />
                </div>
              </th>
              <th 
                onClick={() => handleSort("cost")}
                className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  Unit Cost
                  <ArrowUpDown className={cn("w-3 h-3 transition-opacity", currentSortBy === "cost" ? "opacity-100" : "opacity-30")} />
                </div>
              </th>
              <th 
                onClick={() => handleSort("retail")}
                className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  Retail Price
                  <ArrowUpDown className={cn("w-3 h-3 transition-opacity", currentSortBy === "retail" ? "opacity-100" : "opacity-30")} />
                </div>
              </th>
              <th 
                onClick={() => handleSort("margin")}
                className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  Net Margin
                  <ArrowUpDown className={cn("w-3 h-3 transition-opacity", currentSortBy === "margin" ? "opacity-100" : "opacity-30")} />
                </div>
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialData.map((sku) => {
              const cost = Number(sku.costPrice);
              const price = Number(sku.sellPrice);
              const margin = ((price - cost) / price) * 100;
              const isLowStock = sku.quantity < 15;

              return (
                <tr 
                  key={sku.id} 
                  onClick={() => setSelectedProduct(sku)}
                  className="group hover:bg-primary/5 cursor-pointer border-b border-border/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-black tracking-tight group-hover:text-primary transition-colors">
                        {sku.name}
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {sku.code}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                     <div className={cn(
                       "inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                       isLowStock ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"
                     )}>
                       <div className={cn("w-1 h-1 rounded-full", isLowStock ? "bg-red-500" : "bg-green-500")} />
                       {isLowStock ? "Critical Stock" : "Healthy"}
                     </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={cn("text-sm font-black", isLowStock && "text-red-500")}>
                        {sku.quantity}
                      </span>
                      <div className="w-16 h-1 bg-secondary rounded-full overflow-hidden">
                         <div 
                           className={cn("h-full", isLowStock ? "bg-red-500" : "bg-primary")} 
                           style={{ width: `${Math.min((sku.quantity / 50) * 100, 100)}%` }}
                         />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs font-bold">
                    ${cost.toFixed(2)}
                  </td>
                  <td className="p-4 font-mono text-xs font-bold">
                    ${price.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-xs font-black text-green-500">
                      <TrendingUp className="w-3 h-3" />
                      {margin.toFixed(1)}%
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors" title="Audit History">
                         <History className="w-4 h-4" />
                       </button>
                       <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
                         <MoreHorizontal className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {initialData.length === 0 && (
          <div className="p-20 text-center">
            <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-black tracking-tighter uppercase mb-2">No SKUs Detected</h3>
            <p className="text-muted-foreground font-bold text-sm">No results match your current search criteria.</p>
          </div>
        )}
      </div>

      <div className="border-t border-border">
        <PaginationControls />
      </div>

      {selectedProduct && (
        <EditProductModal 
          product={selectedProduct} 
          open={!!selectedProduct} 
          onOpenChange={(open) => !open && setSelectedProduct(null)} 
        />
      )}
    </>
  );
}
