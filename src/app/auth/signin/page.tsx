"use client";

import { motion } from "framer-motion";
import { Zap, Shield, ShieldAlert, ShieldCheck, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const router = useRouter();

  const handleDemoLogin = (role: string) => {
    localStorage.setItem("nexis-demo-role", role);
    router.push("/dashboard");
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const roles = [
    {
      id: "ADMIN",
      name: "System Admin",
      description: "Full read/write access to financial forecasting, inventory SKU management, and audit matrix.",
      icon: ShieldAlert,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      id: "MANAGER",
      name: "Ops Manager",
      description: "Manage inventory stock levels and process orders. Limited access to high-level financial settings.",
      icon: ShieldCheck,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      id: "ANALYST",
      name: "Data Analyst",
      description: "Read-only access to revenue charts and inventory velocity. Restricted from making any changes.",
      icon: Shield,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full z-50">
        <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <Zap className="text-primary w-6 h-6 fill-current" />
          NEXIS
        </div>
        <ThemeToggle />
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-black tracking-tighter uppercase mb-4">
              Access <span className="text-primary">Control</span>
            </h1>
            <p className="text-muted-foreground font-bold max-w-lg mx-auto">
              Select a role below to demo the Role-Based Access Control (RBAC) system. 
              In a production environment, roles are assigned via Google OAuth or internal HR sync.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role, idx) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleDemoLogin(role.id)}
                className="p-8 rounded-3xl bg-card border border-border flex flex-col items-center text-center group hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden active:scale-95"
              >
                <div className={`p-4 rounded-2xl ${role.bg} ${role.color} mb-6`}>
                  <role.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black tracking-tighter uppercase mb-3">{role.name}</h3>
                <p className="text-sm text-muted-foreground font-medium mb-8 flex-1 leading-relaxed">
                  {role.description}
                </p>
                <div className="w-full py-4 rounded-full bg-secondary font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-primary-foreground">
                  Launch as {role.id}
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-secondary/30 border border-border text-center">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Production Authentication</p>
             <button 
               onClick={handleGoogleSignIn}
               className="flex items-center gap-3 bg-background border border-border px-8 py-3 rounded-full mx-auto font-bold text-sm hover:bg-secondary transition-colors"
             >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google Enterprise
             </button>
          </div>
        </div>
      </main>
    </div>
  );
}
