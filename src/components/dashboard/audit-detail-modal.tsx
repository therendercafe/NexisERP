"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Shield, Clock, User, Fingerprint, Database, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AuditDetailModalProps {
  log: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuditDetailModal({ log, open, onOpenChange }: AuditDetailModalProps) {
  if (!log) return null;

  const metadata = log.metadata as any;
  const isUpdate = log.action.includes("UPDATE");

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/90 backdrop-blur-md z-[100]" />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-0 m-auto w-full max-w-3xl h-fit max-h-[90vh] bg-card border border-border rounded-3xl shadow-2xl z-[101] overflow-hidden flex flex-col"
              >
                <Dialog.Title className="sr-only">Audit Detail: {log.id}</Dialog.Title>
                <Dialog.Description className="sr-only">Deep dive into system mutation payload.</Dialog.Description>

                {/* Header */}
                <div className="p-6 border-b border-border bg-secondary/30 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black uppercase tracking-tighter">Event Investigation</h2>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">
                        Trace ID: {log.id.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <Dialog.Close asChild>
                    <button className="p-2 rounded-full hover:bg-secondary transition-colors"><X className="w-5 h-5" /></button>
                  </Dialog.Close>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {/* Actor & Time Grid */}
                  <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-border bg-black/20 text-foreground">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                        <User className="w-3 h-3" /> System Actor
                      </span>
                      <p className="text-sm font-black">{log.user?.name || "System"}</p>
                      <p className="text-[10px] opacity-50 uppercase font-bold tracking-tighter">{log.user?.role || "SYSTEM"}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Timestamp
                      </span>
                      <p className="text-sm font-bold">{new Date(log.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                        <Fingerprint className="w-3 h-3" /> Auth Sig
                      </span>
                      <p className="text-[10px] font-mono opacity-50 truncate">{log.user?.email || "internal@system.exec"}</p>
                    </div>
                  </div>

                  {/* Operation Logic */}
                  <div className="p-8 space-y-8 text-foreground">
                    <div className="flex items-center justify-between">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Mutation Analysis</h3>
                       <span className={cn(
                         "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                         log.action.includes("CREATE") ? "bg-green-500/10 border-green-500/20 text-green-500" :
                         log.action.includes("UPDATE") ? "bg-blue-500/10 border-blue-500/20 text-blue-500" :
                         "bg-secondary border-border text-muted-foreground"
                       )}>
                         {log.action}
                       </span>
                    </div>

                    {isUpdate && metadata?.before && metadata?.after ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-3">
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-2">State Before</span>
                            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 font-mono text-[10px] overflow-hidden">
                               <pre className="opacity-60 whitespace-pre-wrap">{JSON.stringify(metadata.before, null, 2)}</pre>
                            </div>
                         </div>
                         <div className="space-y-3">
                            <span className="text-[9px] font-black text-primary uppercase tracking-widest ml-2 flex items-center gap-2">
                               State After <ArrowRight className="w-2 h-2" />
                            </span>
                            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 font-mono text-[10px] overflow-hidden">
                               <pre className="text-primary whitespace-pre-wrap">{JSON.stringify(metadata.after, null, 2)}</pre>
                            </div>
                         </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                         <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest ml-2">Snapshot Payload</span>
                         <div className="bg-black/40 border border-white/5 rounded-2xl p-6 font-mono text-[10px] overflow-hidden">
                            <pre className="opacity-80 whitespace-pre-wrap">{JSON.stringify(metadata, null, 2)}</pre>
                         </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Status */}
                <div className="p-6 bg-secondary/30 border-t border-border flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                     <Database className="w-3 h-3 text-primary" />
                     Immutable Ledger Record
                  </div>
                  <Dialog.Close asChild>
                    <button className="px-8 py-2 rounded-full font-black text-xs uppercase tracking-widest bg-secondary hover:bg-background transition-all text-foreground border border-border">
                      Close Trace
                    </button>
                  </Dialog.Close>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

