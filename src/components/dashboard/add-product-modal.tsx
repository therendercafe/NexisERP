"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Plus, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createProduct } from "@/lib/actions/inventory";
import { useRouter } from "next/navigation";

export function AddProductModal() {
  const [open, setOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);
  const router = useRouter();
  
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    code: "",
    quantity: "0",
    costPrice: "0",
    sellPrice: "0",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    
    const result = await createProduct(formData);
    
    if (result.success) {
      setOpen(false);
      setFormData({
        name: "",
        description: "",
        code: "",
        quantity: "0",
        costPrice: "0",
        sellPrice: "0",
      });
      router.refresh();
    } else {
      alert(result.error);
    }
    setIsPending(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" />
          Add New SKU
        </button>
      </Dialog.Trigger>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]" 
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-0 m-auto w-full max-w-2xl h-fit max-h-[90vh] bg-card border border-border rounded-3xl shadow-2xl z-[101] overflow-hidden flex flex-col"
              >
                <Dialog.Title className="sr-only">Create New SKU</Dialog.Title>
                <Dialog.Description className="sr-only">Initialize a new enterprise product entity in the database.</Dialog.Description>

                <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                  <div className="p-6 border-b border-border bg-secondary/30 flex justify-between items-center shrink-0">
                    <div>
                      <h2 className="text-xl font-black uppercase tracking-tighter">Initialize Entity</h2>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">
                        Creating new operational SKU
                      </p>
                    </div>
                    <Dialog.Close asChild>
                      <button className="p-2 rounded-full hover:bg-secondary transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <div className="p-8 grid grid-cols-2 gap-6 overflow-y-auto">
                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Identity Name</label>
                      <input 
                        required
                        placeholder="e.g. Quantum Link 900"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-secondary/50 border border-border rounded-xl p-3 font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none placeholder:opacity-30"
                      />
                    </div>

                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Operational Description</label>
                      <textarea 
                        rows={3}
                        placeholder="Provide mission-critical specifications..."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-secondary/50 border border-border rounded-xl p-3 font-medium text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none placeholder:opacity-30"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">SKU Code</label>
                      <input 
                        required
                        placeholder="CAT-XXXXX"
                        value={formData.code}
                        onChange={(e) => setFormData({...formData, code: e.target.value})}
                        className="w-full bg-secondary/50 border border-border rounded-xl p-3 font-mono text-xs focus:ring-2 focus:ring-primary/20 outline-none placeholder:opacity-30"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Initial Units</label>
                      <input 
                        required
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        className="w-full bg-secondary/50 border border-border rounded-xl p-3 font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Unit Cost ($)</label>
                      <input 
                        required
                        type="number"
                        step="0.01"
                        value={formData.costPrice}
                        onChange={(e) => setFormData({...formData, costPrice: e.target.value})}
                        className="w-full bg-secondary/50 border border-border rounded-xl p-3 font-mono text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Retail Price ($)</label>
                      <input 
                        required
                        type="number"
                        step="0.01"
                        value={formData.sellPrice}
                        onChange={(e) => setFormData({...formData, sellPrice: e.target.value})}
                        className="w-full bg-secondary/50 border border-border rounded-xl p-3 font-mono text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-6 bg-secondary/30 border-t border-border flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                       <AlertCircle className="w-3 h-3 text-primary" />
                       New Audit Entry will be initialized
                    </div>
                    <div className="flex gap-3">
                      <Dialog.Close asChild>
                        <button type="button" className="px-6 py-2 rounded-full font-bold text-sm hover:bg-secondary transition-colors">
                          Cancel
                        </button>
                      </Dialog.Close>
                      <button 
                        type="submit"
                        disabled={isPending}
                        className="bg-primary text-primary-foreground px-8 py-2 rounded-full font-black text-sm hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50"
                      >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Create SKU
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

