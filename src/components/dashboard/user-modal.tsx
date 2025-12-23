"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Key, CheckCircle2, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { createUser, updateUser } from "@/lib/actions/users";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const PAGES = [
  { id: "overview", label: "Overview", icon: "LayoutDashboard" },
  { id: "inventory", label: "Inventory", icon: "Package" },
  { id: "orders", label: "Orders", icon: "ShoppingCart" },
  { id: "clients", label: "Clients", icon: "UserCircle2" },
  { id: "revenue", label: "Revenue", icon: "TrendingUp" },
  { id: "audit", label: "Audit Logs", icon: "History" },
  { id: "settings", label: "Settings", icon: "Settings" },
  { id: "users", label: "User Roles", icon: "Users2" },
];

interface UserModalProps {
  user?: any;
  isOpen: boolean;
  onClose: () => void;
}

export function UserModal({ user, isOpen, onClose }: UserModalProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "ANALYST",
    password: "",
    permissions: [] as string[],
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "ANALYST",
        password: user.password || "",
        permissions: (user.permissions as string[]) || [],
      });
    } else {
      setFormData({
        name: "",
        email: "",
        role: "ANALYST",
        password: "",
        permissions: [],
      });
    }
    setError(null);
  }, [user, isOpen]);

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password: pass });
  };

  const togglePermission = (id: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(id)
        ? prev.permissions.filter(p => p !== id)
        : [...prev.permissions, id]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    
    const res = user 
      ? await updateUser(user.id, formData)
      : await createUser(formData);

    if (res.success) {
      setShowSuccess(true);
      router.refresh(); // Ajax-style data refresh
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    } else {
      setError(res.error || "An unexpected error occurred");
    }
    setIsPending(false);
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
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-0 m-auto w-full max-w-2xl h-fit max-h-[90vh] overflow-y-auto bg-card border border-border rounded-[2.5rem] shadow-2xl z-[101] p-8 outline-none"
              >
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-[0.2em] mb-2">
                       <Shield className="w-3 h-3" />
                       Governance Layer
                    </div>
                    <Dialog.Title className="text-3xl font-black tracking-tighter uppercase">
                      {user ? "Modify Entity" : "Provision New Identity"}
                    </Dialog.Title>
                  </div>
                  <button onClick={onClose} className="p-3 hover:bg-secondary rounded-2xl transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </motion.div>
                    )}
                    {showSuccess && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-500 text-xs font-bold"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Identity Matrix Updated Successfully
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Identity Name</label>
                      <input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-secondary/50 border border-border rounded-2xl p-4 font-black text-sm outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="e.g. Rick Sanchez"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Communication Email</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-secondary/50 border border-border rounded-2xl p-4 font-black text-sm outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="rick@citadel.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Operational Role</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full bg-secondary/50 border border-border rounded-2xl p-4 font-black text-sm outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                      >
                        <option value="ADMIN">ADMIN (Full Access)</option>
                        <option value="MANAGER">MANAGER (Ops Focus)</option>
                        <option value="ANALYST">ANALYST (Data Focus)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Access Token (Password)</label>
                      <div className="flex gap-2">
                        <input
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="flex-1 bg-secondary/50 border border-border rounded-2xl p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-primary/20"
                          placeholder="••••••••••••"
                        />
                        <button
                          type="button"
                          onClick={generatePassword}
                          className="px-4 bg-secondary border border-border rounded-2xl hover:bg-border transition-colors group"
                          title="Generate Secure Token"
                        >
                          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Granular Matrix Permissions</label>
                       <button 
                         type="button" 
                         onClick={() => setFormData({...formData, permissions: PAGES.map(p => p.id)})}
                         className="text-[9px] font-black uppercase text-primary hover:underline"
                       >
                         Grant All
                       </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {PAGES.map((page) => (
                        <button
                          key={page.id}
                          type="button"
                          onClick={() => togglePermission(page.id)}
                          className={cn(
                            "flex items-center gap-2 p-3 rounded-xl border transition-all text-left",
                            formData.permissions.includes(page.id)
                              ? "bg-primary/10 border-primary text-primary"
                              : "bg-secondary/30 border-border text-muted-foreground hover:border-primary/50"
                          )}
                        >
                          <div className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                            formData.permissions.includes(page.id) ? "bg-primary border-primary" : "border-border"
                          )}>
                            {formData.permissions.includes(page.id) && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-[11px] font-bold tracking-tight truncate">{page.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-8 py-4 rounded-2xl border border-border font-black text-xs uppercase tracking-widest hover:bg-secondary transition-all"
                    >
                      Abort
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="flex-2 px-12 py-4 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                      {user ? "Commit Mutations" : "Finalize Identity"}
                    </button>
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

