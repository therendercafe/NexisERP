"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateOrderStatus } from "@/lib/actions/orders";
import { useRouter } from "next/navigation";

interface StatusConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  newStatus: string;
  onSuccess: () => void;
}

export function StatusConfirmModal({ open, onOpenChange, orderId, newStatus, onSuccess }: StatusConfirmModalProps) {
  const [isPending, setIsPending] = React.useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    setIsPending(true);
    const res = await updateOrderStatus(orderId, newStatus);
    if (res.success) {
      onSuccess();
      onOpenChange(false);
      router.refresh();
    } else {
      alert("Failed to update status");
    }
    setIsPending(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/95 backdrop-blur-md z-[200]" />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-0 m-auto w-full max-w-md h-fit bg-card border border-border rounded-3xl shadow-2xl z-[201] overflow-hidden p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 text-foreground">Confirm Status Shift</h2>
                <p className="text-sm font-bold text-muted-foreground mb-8 leading-relaxed">
                  You are about to transition this transaction to <span className="text-primary font-black uppercase">{newStatus}</span>. 
                  This operation will be cryptographically signed and logged in the Audit Matrix.
                </p>

                <div className="flex gap-4">
                  <button 
                    onClick={() => onOpenChange(false)}
                    className="flex-1 py-4 rounded-full bg-secondary font-black text-xs uppercase tracking-widest hover:bg-background transition-all text-foreground border border-border"
                  >
                    Abort
                  </button>
                  <button 
                    onClick={handleConfirm}
                    disabled={isPending}
                    className="flex-1 py-4 rounded-full bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Authorize"}
                  </button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

