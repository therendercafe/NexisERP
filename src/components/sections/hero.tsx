"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Zap, Shield, BarChart3, Globe, Database, Cpu, Lock } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

import { signIn } from "next-auth/react";
import { useState, useRef } from "react";
import { AuthModal } from "@/components/auth-modal";

import Image from "next/image";
import { AIInput } from "@/components/ui/ai-input";

export function Hero() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-[140vh] flex flex-col items-center justify-start pt-32 pb-32 overflow-hidden bg-transparent perspective-2000">
      <nav className="absolute top-0 w-full p-8 flex justify-between items-center max-w-7xl mx-auto z-50">
        <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
          <Zap className="text-primary w-6 h-6 fill-current" />
          NEXIS
        </div>
        <div className="hidden md:flex items-center gap-12">
          <Link href="#stack" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Stack</Link>
          <Link href="#strategy" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Strategy</Link>
          <Link href="/dashboard" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-2 text-[9px] font-black bg-secondary/50 border border-border px-4 py-1.5 rounded-full text-muted-foreground">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
             MATRIX_LIVE_OK
          </div>
          <ThemeToggle />
          <button 
            onClick={() => setIsAuthOpen(true)}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-transform shadow-lg shadow-primary/20"
          >
            Launch Demo
          </button>
        </div>
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center max-w-5xl">
        <motion.div
          style={{ opacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-secondary/80 backdrop-blur-md border border-border text-[10px] font-black tracking-[0.2em] uppercase mb-8 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            V2.0 Matrix-Grade Architecture
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-8 uppercase text-foreground">
            <span className="relative inline-block overflow-hidden pb-4 px-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-[length:200%_auto] animate-gradient-flow drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">AI-Powered</span>
              {/* Glint effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-100%] animate-shine pointer-events-none" />
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 italic drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              REVENUE
            </span>
            <br />
            ORCHESTRATION.
          </h1>
          
          <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 font-medium leading-relaxed tracking-tight">
            The next-generation ERP for high-velocity enterprises. 
            Automated inventory, visual intelligence, and cryptographic audit trails 
            built for absolute precision.
          </p>
          
          <AIInput />
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="group relative px-10 py-5 bg-primary text-primary-foreground rounded-full text-lg font-black uppercase tracking-widest overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                Launch System
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <Link href="/dashboard" className="px-10 py-5 rounded-full text-lg font-black uppercase tracking-widest border border-border bg-card/50 backdrop-blur-xl hover:bg-secondary transition-all">
              Live Overview
            </Link>
          </div>
        </motion.div>

        {/* Dashboard Preview Layer with Simulated 3D Rotation */}
        <motion.div 
          style={{ rotateX, scale }}
          className="relative group preserve-3d"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative rounded-[2.5rem] border border-white/10 bg-card shadow-2xl overflow-hidden p-3 backdrop-blur-3xl transform-gpu">
            <div className="relative rounded-[1.8rem] overflow-hidden aspect-[16/10] shadow-inner border border-white/5">
              <Image 
                src="/images/dashboard1.jpg" 
                alt="Nexis Command Dashboard" 
                fill 
                className="object-cover object-top hover:scale-[1.02] transition-transform duration-1000"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-40 pointer-events-none" />
              
              {/* Shine sweep across the dashboard too */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] animate-shine delay-1000 pointer-events-none" />
            </div>
          </div>

          {/* Floating Badges */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute -top-12 -right-12 bg-card border border-border p-5 rounded-[2rem] shadow-2xl hidden lg:block rotate-6 hover:rotate-0 transition-transform duration-500"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500"><BarChart3 className="w-5 h-5" /></div>
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground leading-none mb-1">Profitability</p>
                <p className="text-lg font-black leading-none">+60.2%</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute -bottom-10 -left-12 bg-card border border-border p-5 rounded-[2rem] shadow-2xl hidden lg:block -rotate-6 hover:rotate-0 transition-transform duration-500"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500"><Shield className="w-5 h-5" /></div>
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground leading-none mb-1">Audit Ledger</p>
                <p className="text-lg font-black leading-none text-purple-500 italic font-serif tracking-tight">VERIFIED</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Tech Stack Affirmation Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-40 mb-20 space-y-8"
        >
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
            {["NEXT.JS", "REACT", "PRISMA", "POSTGRESQL", "TAILWIND", "AUTH.JS"].map((tech) => (
              <span key={tech} className="text-4xl md:text-5xl font-black tracking-tighter text-foreground/80 hover:text-primary transition-colors cursor-default">
                {tech}
              </span>
            ))}
          </div>
          
          <div className="max-w-4xl mx-auto pt-8 border-t border-border/30">
            <h2 className="text-2xl md:text-3xl font-black tracking-[0.2em] uppercase leading-tight text-transparent bg-clip-text bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground">
              Future-proof. Scalable. Secure. <br />
              <span className="text-primary italic">Engineered for absolute precision.</span>
            </h2>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
