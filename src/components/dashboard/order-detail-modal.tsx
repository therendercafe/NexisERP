"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, User, Mail, Phone, Calendar, ShoppingBag, TrendingUp, CheckCircle2, Clock, Ban } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { StatusConfirmModal } from "./status-confirm-modal";

interface OrderDetailModalProps {
  order: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailModal({ order, open, onOpenChange }: OrderDetailModalProps) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [pendingStatus, setPendingStatus] = React.useState("");

  if (!order) return null;

  const totalSales = Number(order.totalSales);
  const totalCost = Number(order.totalCost);
  const profit = totalSales - totalCost;
  const margin = (profit / totalSales) * 100;

  const handleStatusChange = (status: string) => {
    setPendingStatus(status);
    setConfirmOpen(true);
  };

  const statusConfigs = {
    COMPLETED: {
      label: "SETTLE",
      icon: CheckCircle2,
      activeClass: "bg-emerald-600 text-white",
      hoverClass: "hover:bg-emerald-500/20 hover:text-emerald-500",
      color: "emerald"
    },
    PENDING: {
      label: "PENDING",
      icon: Clock,
      activeClass: "bg-amber-500 text-black",
      hoverClass: "hover:bg-amber-500/20 hover:text-amber-500",
      color: "amber"
    },
    CANCELLED: {
      label: "VOID",
      icon: Ban,
      activeClass: "bg-rose-600 text-white",
      hoverClass: "hover:bg-rose-500/20 hover:text-rose-500",
      color: "rose"
    }
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <AnimatePresence>
          {open && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100]" 
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 40 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="fixed inset-0 m-auto w-full max-w-5xl h-fit max-h-[90vh] bg-card border border-white/10 rounded-[2.5rem] shadow-2xl z-[101] overflow-hidden flex flex-col"
                >
                  <Dialog.Title className="sr-only">Order Details: {order.id}</Dialog.Title>
                  <Dialog.Description className="sr-only">Detailed view of enterprise transaction ledger.</Dialog.Description>

                  <div className="p-6 border-b border-border bg-secondary/30 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter text-foreground">Transaction Ledger</h2>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Ref: #{order.id.slice(-12).toUpperCase()}</span>
                           <span className={cn(
                             "px-2 py-0.5 rounded-full text-[9px] font-black uppercase border",
                             order.status === "COMPLETED" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                             order.status === "PENDING" ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                             "bg-rose-500/10 border-rose-500/20 text-rose-500"
                           )}>
                             {order.status === "COMPLETED" ? "SETTLED" : order.status === "PENDING" ? "PENDING" : "VOIDED"}
                           </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                       <div className="flex bg-black/40 p-1.5 rounded-full border border-white/5 mr-4 shadow-inner">
                          {(Object.entries(statusConfigs) as [string, any][]).map(([status, config]) => {
                            const Icon = config.icon;
                            const isActive = order.status === status;
                            
                            return (
                              <motion.button 
                                key={status}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleStatusChange(status)}
                                className={cn(
                                  "px-4 py-2 rounded-full text-[10px] font-black transition-all flex items-center gap-2 relative",
                                  isActive ? config.activeClass : cn("text-muted-foreground", config.hoverClass)
                                )}
                              >
                                <Icon className="w-3.5 h-3.5 relative z-10" /> 
                                <span className="relative z-10 tracking-widest">{config.label}</span>
                              </motion.button>
                            );
                          })}
                       </div>
                       <Dialog.Close asChild>
                         <button className="p-2 rounded-full hover:bg-secondary transition-colors"><X className="w-5 h-5 text-foreground" /></button>
                       </Dialog.Close>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6 border-b border-border bg-black/20 text-foreground">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1"><User className="w-3 h-3" /> Entity Name</span>
                        <p className="text-sm font-black">{order.customerName}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1"><Mail className="w-3 h-3" /> Communication</span>
                        <p className="text-sm font-bold opacity-80">{order.customerEmail}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1"><Phone className="w-3 h-3" /> Direct Line</span>
                        <p className="text-sm font-bold opacity-80">{order.customerPhone || "N/A"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1"><Calendar className="w-3 h-3" /> Execution Date</span>
                        <p className="text-sm font-bold opacity-80">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="p-8">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-primary">Manifest Details</h3>
                      <table className="w-full text-left border-collapse text-foreground">
                        <thead>
                          <tr className="border-b border-border pb-4">
                            <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Product Specification</th>
                            <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">Qty</th>
                            <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-right">Unit Sales</th>
                            <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-right">Unit COGS</th>
                            <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-right">Extended Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item: any) => (
                            <tr key={item.id} className="border-b border-border/30 last:border-0">
                              <td className="py-4">
                                <div className="flex flex-col">
                                  <span className="text-xs font-black tracking-tight">{item.sku.name}</span>
                                  <span className="text-[9px] font-bold text-muted-foreground uppercase">{item.sku.code}</span>
                                </div>
                              </td>
                              <td className="py-4 text-center font-black text-xs">{item.quantity}</td>
                              <td className="py-4 text-right font-mono text-xs font-bold">${Number(item.unitPrice).toFixed(2)}</td>
                              <td className="py-4 text-right font-mono text-xs font-bold opacity-50">${Number(item.unitCost).toFixed(2)}</td>
                              <td className="py-4 text-right font-mono text-xs font-black text-primary">${(Number(item.unitPrice) * item.quantity).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="p-8 bg-secondary/30 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-8 shrink-0">
                    <div className="p-4 rounded-2xl bg-card border border-border flex flex-col gap-1 shadow-inner text-foreground text-foreground">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest text-muted-foreground">Gross Revenue</span>
                      <span className="text-2xl font-black text-foreground">${totalSales.toLocaleString()}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-card border border-border flex flex-col gap-1 shadow-inner text-foreground">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest text-muted-foreground">Operating Cost</span>
                      <span className="text-2xl font-black text-rose-500/80">${totalCost.toLocaleString()}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col gap-1 shadow-xl text-foreground">
                      <div className="flex justify-between items-center text-foreground">
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest text-primary">Net Profit</span>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-black">
                          <TrendingUp className="w-2 h-2 text-emerald-500" />
                          {margin.toFixed(1)}%
                        </div>
                      </div>
                      <span className="text-2xl font-black text-primary">${profit.toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

      <StatusConfirmModal 
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        orderId={order.id}
        newStatus={pendingStatus}
        onSuccess={() => onOpenChange(false)}
      />
    </>
  );
}
