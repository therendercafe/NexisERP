"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Save, AlertCircle, Loader2, User, Mail, Phone, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateClient, createClient } from "@/lib/actions/crm";
import { useRouter } from "next/navigation";

interface ClientModalProps {
  client?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
}

export function ClientModal({ client, open, onOpenChange, mode }: ClientModalProps) {
  const [isPending, setIsPending] = React.useState(false);
  const router = useRouter();
  
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  React.useEffect(() => {
    if (mode === "edit" && client) {
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone || "",
        address: client.address || "",
      });
    } else {
      setFormData({ name: "", email: "", phone: "", address: "" });
    }
  }, [client, mode, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    
    const result = mode === "edit" 
      ? await updateClient(client.id, formData)
      : await createClient(formData);
    
    if (result.success) {
      onOpenChange(false);
      router.refresh();
    } else {
      alert(result.error);
    }
    setIsPending(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]" />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-0 m-auto w-full max-w-xl h-fit max-h-[90vh] bg-card border border-border rounded-3xl shadow-2xl z-[101] overflow-hidden flex flex-col"
              >
                <Dialog.Title className="sr-only">{mode === "edit" ? "Edit Client" : "Add Client"}</Dialog.Title>
                <Dialog.Description className="sr-only">Manage corporate entity contact details.</Dialog.Description>

                <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                  <div className="p-6 border-b border-border bg-secondary/30 flex justify-between items-center shrink-0">
                    <div>
                      <h2 className="text-xl font-black uppercase tracking-tighter">{mode === "edit" ? "Modify Entity" : "Initialize Entity"}</h2>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">
                        Corporate CRM Relationship Hub
                      </p>
                    </div>
                    <Dialog.Close asChild>
                      <button className="p-2 rounded-full hover:bg-secondary transition-colors"><X className="w-5 h-5" /></button>
                    </Dialog.Close>
                  </div>

                  <div className="p-8 space-y-6 overflow-y-auto text-foreground">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                        <User className="w-3 h-3" /> Corporate Identity
                      </label>
                      <input 
                        required
                        placeholder="Legal Entity Name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-secondary/50 border border-border rounded-xl p-3 font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6 text-foreground">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                          <Mail className="w-3 h-3" /> Procurement Email
                        </label>
                        <input 
                          required
                          type="email"
                          placeholder="procurement@corp.io"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-secondary/50 border border-border rounded-xl p-3 font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                          <Phone className="w-3 h-3" /> Direct Line
                        </label>
                        <input 
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-secondary/50 border border-border rounded-xl p-3 font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 text-foreground">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> Global Headquarters
                      </label>
                      <textarea 
                        rows={2}
                        placeholder="Primary physical address..."
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full bg-secondary/50 border border-border rounded-xl p-3 font-medium text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                      />
                    </div>
                  </div>

                  <div className="p-6 bg-secondary/30 border-t border-border flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                       <AlertCircle className="w-3 h-3 text-primary" />
                       Audit Chain Active
                    </div>
                    <div className="flex gap-3">
                      <Dialog.Close asChild>
                        <button type="button" className="px-6 py-2 rounded-full font-bold text-sm hover:bg-secondary transition-colors text-foreground">Cancel</button>
                      </Dialog.Close>
                      <button 
                        type="submit"
                        disabled={isPending}
                        className="bg-primary text-primary-foreground px-8 py-2 rounded-full font-black text-sm hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50"
                      >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {mode === "edit" ? "Sync Changes" : "Create Entity"}
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

