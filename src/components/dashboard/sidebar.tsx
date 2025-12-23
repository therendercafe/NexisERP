"use client";

import { useState, useEffect } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  History,
  LogOut,
  ChevronRight,
  Zap,
  UserCircle2,
  ShieldAlert,
  Shield,
  Settings,
  Users2,
  Sun,
  Monitor,
  Moon,
  MoreVertical,
  BrainCircuit
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard", roles: ["ADMIN"] },
  { icon: BrainCircuit, label: "AI Auditor", href: "/dashboard/ai-auditor", roles: ["ADMIN", "ANALYST"] },
  { icon: Package, label: "Inventory", href: "/dashboard/inventory", roles: ["ADMIN", "MANAGER"] },
  { icon: ShoppingCart, label: "Orders", href: "/dashboard/orders", roles: ["ADMIN", "MANAGER", "ANALYST"] },
  { icon: UserCircle2, label: "Clients", href: "/dashboard/clients", roles: ["ADMIN", "MANAGER", "ANALYST"] },
  { icon: TrendingUp, label: "Revenue", href: "/dashboard/revenue", roles: ["ADMIN", "ANALYST"] },
  { icon: History, label: "Audit Logs", href: "/dashboard/audit", roles: ["ADMIN"] },
  { icon: Settings, label: "Settings", href: "/dashboard/settings", roles: ["ADMIN", "ANALYST"], separator: true },
  { icon: Users2, label: "User Roles", href: "/dashboard/users", roles: ["ADMIN"] },
];

import { signOut } from "next-auth/react";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [demoRole, setDemoRole] = useState<"ADMIN" | "MANAGER" | "ANALYST">("ADMIN");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedRole = localStorage.getItem("nexis-demo-role") as any;
      if (savedRole) {
        setDemoRole(savedRole);
      }
    } catch (e) {
      console.error("LocalStorage error:", e);
    }
    setMounted(true);
  }, []);

  const handleRoleChange = (newRole: "ADMIN" | "MANAGER" | "ANALYST") => {
    setDemoRole(newRole);
    try {
      localStorage.setItem("nexis-demo-role", newRole);
    } catch (e) {
      console.error("LocalStorage save error:", e);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // Fallback for hydration sync
  if (!mounted) {
    return (
      <div className="w-64 h-screen border-r border-border bg-card/50 backdrop-blur-xl flex flex-col p-4 fixed left-0 top-0 z-50">
        <Link href="/" className="flex items-center gap-2 px-2 mb-10 group cursor-pointer hover:opacity-80 transition-opacity">
          <Zap className="text-primary w-6 h-6 fill-current group-hover:animate-pulse" />
          <span className="text-xl font-black tracking-tighter">NEXIS</span>
        </Link>
        <div className="flex-1 space-y-4">
          <div className="h-8 w-full bg-secondary animate-pulse rounded-lg" />
          <div className="h-8 w-full bg-secondary animate-pulse rounded-lg" />
          <div className="h-8 w-full bg-secondary animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  const filteredNavItems = navItems.filter(item => item.roles.includes(demoRole));

  return (
    <div className="w-64 h-screen border-r border-border bg-card/50 backdrop-blur-xl flex flex-col p-4 fixed left-0 top-0 z-50">
      <Link href="/" className="flex items-center gap-2 px-2 mb-10 group cursor-pointer hover:opacity-80 transition-opacity">
        <Zap className="text-primary w-6 h-6 fill-current group-hover:animate-pulse" />
        <span className="text-xl font-black tracking-tighter">NEXIS</span>
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-3 mb-4">Operations</p>
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <div key={item.label}>
              {item.separator && <div className="h-[1px] bg-border mx-3 my-4 opacity-50" />}
              <Link
                href={item.href}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl transition-all group",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "group-hover:text-primary")} />
                  <span className="text-sm font-bold tracking-tight">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-border space-y-6 bg-card/50">
        <div className="px-3">
           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Demo Persona</p>
           <div className="flex bg-secondary p-1 rounded-full border border-border">
              {["ADMIN", "ANALYST"].map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r as any)}
                  className={cn(
                    "flex-1 py-1.5 rounded-full text-[10px] font-black transition-all",
                    demoRole === r ? "bg-background text-primary shadow-sm" : "text-muted-foreground"
                  )}
                >
                  {r}
                </button>
              ))}
           </div>
           <p className="mt-2 text-[9px] font-medium text-muted-foreground leading-tight italic">
             {demoRole === "ADMIN" ? "Showing full-access UI with financial reports." : "Showing restricted UI. Revenue/Audits are hidden."}
           </p>
        </div>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <div className="p-3 bg-secondary/50 rounded-2xl flex items-center gap-3 border border-transparent hover:border-primary/50 transition-all group cursor-pointer mx-1 select-none active:scale-95">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors",
                demoRole === "ADMIN" ? "bg-red-500/10 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]" : "bg-green-500/10 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
              )}>
                {demoRole === "ADMIN" ? <ShieldAlert className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-black truncate uppercase tracking-tighter">Client Demo</p>
                <p className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase truncate">{demoRole} Access</p>
              </div>
              <MoreVertical className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content 
              side="top" 
              align="end" 
              sideOffset={12}
              className="w-56 bg-card/90 backdrop-blur-2xl border border-border rounded-3xl p-2 shadow-2xl z-[100] animate-in slide-in-from-bottom-2 fade-in duration-200"
            >
              <div className="px-3 py-2 mb-1">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Quick Operations</p>
              </div>
              
              <Link href="/dashboard/settings">
                <DropdownMenu.Item className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary outline-none cursor-pointer transition-colors group">
                  <Settings className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                  <span className="text-xs font-bold">System Parameters</span>
                </DropdownMenu.Item>
              </Link>

              <div className="h-[1px] bg-border my-1 mx-2 opacity-50" />

              <div className="px-3 py-2">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2">Aesthetic Mode</p>
                <div className="grid grid-cols-3 gap-1 bg-secondary/50 p-1 rounded-xl">
                  {[
                    { val: "light", icon: Sun },
                    { val: "dark", icon: Zap },
                    { val: "matrix", icon: Monitor }
                  ].map((t) => (
                    <button
                      key={t.val}
                      onClick={() => setTheme(t.val)}
                      className={cn(
                        "flex items-center justify-center py-1.5 rounded-lg transition-all",
                        theme === t.val ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <t.icon className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[1px] bg-border my-1 mx-2 opacity-50" />
              
              <DropdownMenu.Item 
                onClick={handleSignOut}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-500/10 outline-none cursor-pointer transition-colors group mt-1"
              >
                <div className="w-[2px] h-4 bg-red-500/30 group-hover:bg-red-500 mr-1 transition-colors" />
                <LogOut className="w-4 h-4 text-red-500" />
                <span className="text-xs font-black uppercase text-red-500 tracking-widest">Sign Out</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
}
