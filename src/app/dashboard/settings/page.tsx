"use client";

import { useState } from "react";
import { 
  Shield, 
  Zap, 
  Activity, 
  Settings as SettingsIcon, 
  Database, 
  Clock, 
  AlertTriangle,
  Save,
  Loader2,
  CheckCircle2,
  DollarSign,
  TrendingUp
} from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { updateSystemSettings } from "@/lib/actions/settings";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [isPending, setIsPending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [settings, setSettings] = useState({
    churnThreshold: "90",
    lowStockThreshold: "15",
    targetNetMargin: "25",
    taxRate: "8.5",
    forecastingPeriod: "180",
    auditRetention: "365",
    autoVoidDays: "14"
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    const res = await updateSystemSettings(settings);
    if (res.success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
    setIsPending(false);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest mb-2">
               <Shield className="w-3 h-3" />
               Global Logic & Governance
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">System Parameters</h1>
            <p className="text-muted-foreground font-bold tracking-tight">Defining the forensic thresholds and fiscal benchmarks for the Nexis Matrix.</p>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Commit Parameters
          </button>
        </header>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue & Growth Benchmarks */}
          <div className="p-8 rounded-[2.5rem] bg-card border border-border space-y-8">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500"><TrendingUp className="w-5 h-5" /></div>
                <h2 className="text-xl font-black tracking-tighter uppercase">Fiscal Benchmarks</h2>
             </div>

             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target Net Margin (%)</label>
                   <div className="relative">
                      <input 
                        type="number" 
                        value={settings.targetNetMargin}
                        onChange={(e) => setSettings({...settings, targetNetMargin: e.target.value})}
                        className="w-full bg-secondary/50 border border-border rounded-2xl p-4 font-black text-sm outline-none focus:ring-2 focus:ring-primary/20" 
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black">%</span>
                   </div>
                   <p className="text-[9px] text-muted-foreground italic ml-1">Dashboard gauges will turn RED if profit falls below this value.</p>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Churn Inactivity Threshold (Days)</label>
                   <input 
                     type="number" 
                     value={settings.churnThreshold}
                     onChange={(e) => setSettings({...settings, churnThreshold: e.target.value})}
                     className="w-full bg-secondary/50 border border-border rounded-2xl p-4 font-black text-sm outline-none focus:ring-2 focus:ring-primary/20" 
                   />
                   <p className="text-[9px] text-muted-foreground italic ml-1">Clients with no orders for this duration are classified as CHURNED.</p>
                </div>
             </div>
          </div>

          {/* Supply Chain Logic */}
          <div className="p-8 rounded-[2.5rem] bg-card border border-border space-y-8">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500"><Zap className="w-5 h-5" /></div>
                <h2 className="text-xl font-black tracking-tighter uppercase">Operational Logic</h2>
             </div>

             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Low Stock Alert Level</label>
                   <input 
                     type="number" 
                     value={settings.lowStockThreshold}
                     onChange={(e) => setSettings({...settings, lowStockThreshold: e.target.value})}
                     className="w-full bg-secondary/50 border border-border rounded-2xl p-4 font-black text-sm outline-none focus:ring-2 focus:ring-primary/20" 
                   />
                   <p className="text-[9px] text-muted-foreground italic ml-1">SKU counts at or below this number will trigger CRITICAL status.</p>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Auto-Void Unsettled Orders (Days)</label>
                   <input 
                     type="number" 
                     value={settings.autoVoidDays}
                     onChange={(e) => setSettings({...settings, autoVoidDays: e.target.value})}
                     className="w-full bg-secondary/50 border border-border rounded-2xl p-4 font-black text-sm outline-none focus:ring-2 focus:ring-primary/20" 
                   />
                   <p className="text-[9px] text-muted-foreground italic ml-1">PENDING orders older than this will be automatically VOIDED.</p>
                </div>
             </div>
          </div>

          {/* Forensic & Governance */}
          <div className="p-8 rounded-[2.5rem] bg-card border border-border space-y-8">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary"><Shield className="w-5 h-5" /></div>
                <h2 className="text-xl font-black tracking-tighter uppercase">Matrix Governance</h2>
             </div>

             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Audit Log Retention (Days)</label>
                   <input 
                     type="number" 
                     value={settings.auditRetention}
                     onChange={(e) => setSettings({...settings, auditRetention: e.target.value})}
                     className="w-full bg-secondary/50 border border-border rounded-2xl p-4 font-black text-sm outline-none focus:ring-2 focus:ring-primary/20" 
                   />
                   <p className="text-[9px] text-muted-foreground italic ml-1">Duration before historical mutation payloads are purged from the ledger.</p>
                </div>
             </div>
          </div>

          {/* Success Toast Notification */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                className="fixed top-8 right-8 z-[100] flex items-center gap-4 p-6 rounded-[2rem] bg-card/80 backdrop-blur-2xl border border-emerald-500/30 shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)] min-w-[380px]"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-40 animate-pulse" />
                  <div className="relative w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                     <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex-1">
                   <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500 mb-0.5">Parameters Synchronized</p>
                   <p className="text-[11px] font-bold text-muted-foreground leading-tight">
                     System logic has been committed and cryptographically signed in the matrix ledger.
                   </p>
                </div>
                <div className="h-10 w-[1px] bg-border mx-2" />
                <button 
                  onClick={() => setShowSuccess(false)}
                  className="p-2 hover:bg-secondary rounded-xl transition-colors text-muted-foreground"
                >
                  <Zap className="w-4 h-4 fill-current text-emerald-500/50" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </main>
    </div>
  );
}

