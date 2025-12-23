"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Zap, Shield, TrendingUp, Users, Terminal } from "lucide-react";

const VALUES = [
  {
    title: "Enterprise Velocity",
    description: "We don't build features; we build systems. Our architecture is designed to handle thousands of concurrent mutations without breaking a sweat.",
    icon: Zap,
    color: "bg-primary/10 text-primary"
  },
  {
    title: "Cryptographic Audit Integrity",
    description: "Every action is logged in a immutable governance ledger. We provide full transparency into who did what, when, and with what data.",
    icon: Shield,
    color: "bg-emerald-500/10 text-emerald-500"
  },
  {
    title: "High-Density Data Intelligence",
    description: "Transform raw data into visual intelligence. Our dashboard provides real-time financial orchestration with visual reporting.",
    icon: TrendingUp,
    color: "bg-blue-500/10 text-blue-500"
  },
  {
    title: "Modular Scaling",
    description: "Built on a modern stack (Next.js, Prisma, Postgres), the platform is ready to scale from MVP to Series A and beyond.",
    icon: Terminal,
    color: "bg-indigo-500/10 text-indigo-500"
  },
  {
    title: "Granular Identity Governance",
    description: "Role-Based Access Control (RBAC) that actually works. Define precisely what your team can see and do within the matrix.",
    icon: Users,
    color: "bg-amber-500/10 text-amber-500"
  },
  {
    title: "Zero-Latency Experience",
    description: "Leveraging Server Components and Edge-ready database connections for an app that feels like a native desktop experience.",
    icon: CheckCircle2,
    color: "bg-rose-500/10 text-rose-500"
  }
];

export function Value() {
  return (
    <section className="py-32 bg-transparent relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <h2 className="text-xs font-black text-primary uppercase tracking-[0.4em] mb-4">Strategic Partnership</h2>
            <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-8 leading-[0.9]">
              WHY TOP ENTERPRISES <br />
              <span className="text-muted-foreground opacity-50">CHOOSE OUR STACK.</span>
            </h3>
            <p className="text-xl text-muted-foreground font-medium mb-12 max-w-xl">
              We specialize in high-end SaaS product engineering. From fintech dashboards to complex inventory systems, we deliver absolute reliability and modern design.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="px-6 py-3 rounded-2xl bg-secondary/50 border border-border flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500" />
                 <span className="text-xs font-black uppercase tracking-widest">Available for Demo</span>
              </div>
              <div className="px-6 py-3 rounded-2xl bg-secondary/50 border border-border flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-primary" />
                 <span className="text-xs font-black uppercase tracking-widest">Next.js Specialists</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((v, idx) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-[2.5rem] bg-card/50 backdrop-blur-xl border border-border hover:border-primary/30 transition-all shadow-sm"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${v.color}`}>
                  <v.icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-black tracking-tight mb-2 uppercase leading-none">{v.title}</h4>
                <p className="text-xs font-bold text-muted-foreground leading-relaxed uppercase opacity-70">
                  {v.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

