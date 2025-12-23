"use client";

import { motion } from "framer-motion";
import { Code2, Cpu, Database, Globe, Layers, Layout, Lock, Zap } from "lucide-react";

const SERVICES = [
  { title: "Full-Stack SaaS Development", desc: "End-to-end engineering from database schema design to high-fidelity frontend execution." },
  { title: "Enterprise ERP Solutions", desc: "Complex business logic, inventory management, and financial orchestration systems." },
  { title: "Visual BI & Reporting", desc: "Data visualization, automated PDF synthesis, and real-time dashboard analytics." },
  { title: "Security & Governance", desc: "RBAC, cryptographic audit trails, and secure identity management with Google OAuth." }
];

export function Showcase() {
  return (
    <section className="py-32 bg-secondary/10 border-y border-border/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="lg:w-1/3">
            <h2 className="text-xs font-black text-primary uppercase tracking-[0.4em] mb-4">The Nexis Capability</h2>
            <h3 className="text-4xl font-black tracking-tighter uppercase mb-8 leading-tight">
              A COMPLETE STACK <br />
              <span className="text-muted-foreground opacity-50">FOR MODERN SCALE.</span>
            </h3>
            <p className="text-muted-foreground font-medium mb-10">
              We don't just write code; we architect experiences. Our stack is chosen for maximum developer velocity and zero-compromise performance.
            </p>
            <div className="space-y-4">
               {SERVICES.map(s => (
                 <div key={s.title} className="flex gap-4">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <div>
                       <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">{s.title}</p>
                       <p className="text-[10px] font-bold text-muted-foreground leading-relaxed">{s.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { icon: Layout, label: "Next.js 14", sub: "App Router" },
               { icon: Database, label: "Prisma", sub: "ORM Matrix" },
               { icon: Cpu, label: "PostgreSQL", sub: "Core Persistence" },
               { icon: Globe, label: "TypeScript", sub: "Strict Safety" },
               { icon: Lock, label: "NextAuth", sub: "Security" },
               { icon: Zap, label: "Tailwind", sub: "JIT Styling" },
               { icon: Layers, label: "Framer", sub: "Kinetic UI" },
               { icon: Code2, label: "jsPDF", sub: "BI Reporting" }
             ].map((item, idx) => (
               <motion.div
                 key={item.label}
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 transition={{ delay: idx * 0.05 }}
                 className="aspect-square bg-card border border-border rounded-3xl flex flex-col items-center justify-center text-center p-6 group hover:border-primary/50 transition-all shadow-sm hover:shadow-xl"
               >
                 <item.icon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors mb-4" />
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">{item.label}</p>
                 <p className="text-[9px] font-bold text-muted-foreground opacity-50">{item.sub}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
}

