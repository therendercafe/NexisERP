"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Shield, ArrowRight, Lock } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();

  const handleDemoLogin = (role: string) => {
    localStorage.setItem("nexis-demo-role", role);
    onClose();
    router.push("/dashboard");
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-xl z-[100]"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-0 m-auto w-full max-w-lg h-fit bg-card border border-border rounded-[2.5rem] shadow-2xl z-[101] p-10 outline-none"
              >
                <div className="flex flex-col items-center text-center mb-10">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <Zap className="w-8 h-8 fill-primary" />
                  </div>
                  <Dialog.Title className="text-3xl font-black tracking-tighter uppercase mb-2">
                    NEXIS <span className="text-primary">AUTHENTICATION</span>
                  </Dialog.Title>
                  <p className="text-muted-foreground font-bold text-sm uppercase tracking-widest">Secure Governance Entry</p>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    className="w-full flex items-center justify-center gap-4 py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] transition-all shadow-xl shadow-white/5"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>

                  <div className="flex items-center gap-4 py-4">
                    <div className="h-[1px] flex-1 bg-border" />
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">OR DEMO AS</span>
                    <div className="h-[1px] flex-1 bg-border" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleDemoLogin("ADMIN")}
                      className="py-4 rounded-2xl bg-secondary hover:bg-red-500/10 hover:text-red-500 border border-border font-black text-[10px] uppercase tracking-widest transition-all"
                    >
                      SYSTEM_ADMIN
                    </button>
                    <button 
                      onClick={() => handleDemoLogin("ANALYST")}
                      className="py-4 rounded-2xl bg-secondary hover:bg-emerald-500/10 hover:text-emerald-500 border border-border font-black text-[10px] uppercase tracking-widest transition-all"
                    >
                      DATA_ANALYST
                    </button>
                  </div>
                </div>

                <div className="mt-10 pt-10 border-t border-border flex items-center justify-center gap-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                  <Lock className="w-3 h-3" />
                  Cryptographically Secured Entry Matrix
                </div>

                <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-secondary rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

