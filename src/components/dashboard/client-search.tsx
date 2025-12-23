"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function ClientSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [value, setValue] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
        params.set("page", "1");
      } else {
        params.delete("search");
      }
      router.push(`${pathname}?${params.toString()}`);
    }, 500);
    return () => clearTimeout(timer);
  }, [value, router, pathname, searchParams]);

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input 
        type="text" 
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by name, email or direct phone..." 
        className="w-full bg-background border border-border rounded-xl py-2 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
      />
    </div>
  );
}

