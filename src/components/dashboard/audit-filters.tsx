"use client";

import { useState, useEffect } from "react";
import { Filter, Calendar, Search, RotateCcw } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface AuditFiltersProps {
  availableActions: string[];
}

export function AuditFilters({ availableActions }: AuditFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [filters, setFilters] = useState({
    action: searchParams.get("action") || "ALL",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  });

  const updateFilters = (newFilters: any) => {
    const merged = { ...filters, ...newFilters };
    setFilters(merged);

    const params = new URLSearchParams(searchParams.toString());
    Object.keys(merged).forEach(key => {
      if (merged[key] && merged[key] !== "ALL") {
        params.set(key, merged[key]);
      } else {
        params.delete(key);
      }
    });
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const resetFilters = () => {
    setFilters({ action: "ALL", startDate: "", endDate: "" });
    router.push(pathname);
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-6 mb-8 shadow-xl">
      <div className="flex flex-wrap items-end gap-6">
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1 flex items-center gap-2">
            <Filter className="w-3 h-3" /> Audit Type
          </label>
          <select 
            value={filters.action}
            onChange={(e) => updateFilters({ action: e.target.value })}
            className="w-full bg-secondary/50 border border-border rounded-xl py-3 px-4 font-bold text-xs uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
          >
            <option value="ALL">ALL_OPERATIONS</option>
            {availableActions.map(action => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1 flex items-center gap-2">
            <Calendar className="w-3 h-3" /> From Date
          </label>
          <input 
            type="date"
            value={filters.startDate}
            onChange={(e) => updateFilters({ startDate: e.target.value })}
            className="w-full bg-secondary/50 border border-border rounded-xl py-3 px-4 font-bold text-xs outline-none focus:ring-2 focus:ring-primary/20 [color-scheme:dark]"
          />
        </div>

        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1 flex items-center gap-2">
            <Calendar className="w-3 h-3" /> To Date
          </label>
          <input 
            type="date"
            value={filters.endDate}
            onChange={(e) => updateFilters({ endDate: e.target.value })}
            className="w-full bg-secondary/50 border border-border rounded-xl py-3 px-4 font-bold text-xs outline-none focus:ring-2 focus:ring-primary/20 [color-scheme:dark]"
          />
        </div>

        <button 
          onClick={resetFilters}
          className="p-3.5 rounded-xl border border-border bg-secondary/30 hover:bg-secondary transition-colors group"
          title="Reset Filters"
        >
          <RotateCcw className="w-4 h-4 text-muted-foreground group-hover:rotate-[-90deg] transition-transform duration-500" />
        </button>
      </div>
    </div>
  );
}

