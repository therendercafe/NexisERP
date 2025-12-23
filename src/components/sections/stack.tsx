"use client";

import { motion } from "framer-motion";
import { 
  Database, 
  Cpu, 
  Globe, 
  Lock, 
  Code2, 
  Gauge, 
  Layout, 
  FileText, 
  Framer,
  Wind
} from "lucide-react";

const STACK = [
  { name: "Next.js 14", category: "Engine", description: "App Router, Server Actions, & Dynamic ISR for sub-second latency.", icon: Layout, color: "text-white" },
  { name: "TypeScript", category: "Language", description: "Strict type-safety ensuring zero runtime identity or data errors.", icon: Code2, color: "text-blue-500" },
  { name: "Prisma ORM", category: "Abstraction", description: "Type-safe database mapping with atomic transaction integrity.", icon: Database, color: "text-emerald-500" },
  { name: "PostgreSQL", category: "Persistence", description: "Enterprise-grade relational storage for complex financial schemas.", icon: Cpu, color: "text-indigo-400" },
  { name: "Tailwind CSS", category: "Design", description: "Utility-first precision styling with custom high-density palettes.", icon: Wind, color: "text-sky-400" },
  { name: "Framer Motion", category: "Experience", description: "Kinetic UI animations for fluid, next-gen user interactions.", icon: Framer, color: "text-pink-500" },
  { name: "NextAuth / Auth.js", category: "Security", description: "Google OAuth & RBAC layers for secure, tiered identity management.", icon: Lock, color: "text-amber-500" },
  { name: "jsPDF + AutoTable", category: "Reporting", description: "Dynamic cryptographic report synthesis and BI export engine.", icon: FileText, color: "text-rose-500" },
];

export function Stack() {
  return (
    <section className="py-32 bg-secondary/30 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-xs font-black text-primary uppercase tracking-[0.4em] mb-4">The NEXIS Infrastructure</h2>
          <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
            ENGINEERED FOR <br />
            <span className="text-muted-foreground opacity-50">ABSOLUTE PERFORMANCE.</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STACK.map((tech, idx) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-[2.5rem] bg-card border border-border group hover:border-primary/50 transition-all shadow-sm hover:shadow-2xl hover:shadow-primary/5"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-2xl bg-secondary transition-transform group-hover:scale-110 ${tech.color}`}>
                  <tech.icon className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">{tech.category}</p>
                   <p className="text-lg font-black tracking-tight leading-none">{tech.name}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                {tech.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

