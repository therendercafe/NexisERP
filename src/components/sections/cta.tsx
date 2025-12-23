"use client";

import { motion } from "framer-motion";
import { ArrowRight, Send } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="relative rounded-[3rem] bg-primary p-12 md:p-24 overflow-hidden text-center">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-primary-foreground uppercase mb-8 leading-[0.9]">
              READY TO <br />
              <span className="opacity-70">REVOLUTIONIZE YOUR OPS?</span>
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/80 font-medium mb-12 max-w-2xl mx-auto">
              Our team specializes in turning complex business logic into stunning, 
              high-performance SaaS products. Let's build your next breakthrough.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/dashboard" className="group px-10 py-5 bg-background text-foreground rounded-full text-lg font-black uppercase tracking-widest flex items-center gap-3 transition-all hover:scale-105 hover:shadow-2xl">
                Explore Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="group px-10 py-5 rounded-full text-lg font-black uppercase tracking-widest border border-primary-foreground/20 text-primary-foreground hover:bg-white/10 transition-all flex items-center gap-3">
                Contact Developer
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

