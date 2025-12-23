"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BrainCircuit, 
  Sparkles, 
  Search, 
  Bot, 
  Zap, 
  TrendingUp, 
  ShieldAlert, 
  Activity,
  ArrowRight,
  Database,
  Lock,
  MessageSquare,
  Download,
  Loader2,
  BarChart3,
  Target,
  Compass
} from "lucide-react";
import { OracleGrid } from "@/components/ui/oracle-grid";
import { cn } from "@/lib/utils";
import { runOracleAudit } from "@/lib/actions/oracle";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Sidebar } from "@/components/dashboard/sidebar";
import { useSearchParams } from "next/navigation";

const AUDIT_CATEGORIES = [
  { id: "revenue", label: "Revenue Health", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: "churn", label: "Churn Analysis", icon: ShieldAlert, color: "text-rose-500", bg: "bg-rose-500/10" },
  { id: "inventory", label: "Stock Velocity", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: "forecast", label: "Financial Forecast", icon: BarChart3, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "growth", label: "Strategic Growth", icon: Target, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { id: "integrity", label: "Data Integrity", icon: Lock, color: "text-purple-500", bg: "bg-purple-500/10" },
];

function TypewriterText({ text, speed = 1 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    // For 3x faster, we increment by more characters per tick if 1ms is still too slow
    const charsPerTick = 3; 
    
    const interval = setInterval(() => {
      if (index < text.length) {
        index += charsPerTick;
        setDisplayedText(text.slice(0, index));
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <div className="relative">
      {displayedText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-1.5 h-4 bg-purple-500 ml-1 align-middle"
        />
      )}
    </div>
  );
}

export default function AIAuditorPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const hasInitialized = useRef(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string; type?: string }[]>([
    { role: "assistant", content: "System initialized. I am NEXIS AI Oracle, your advanced Auditor. Please specify an operational vector to begin the analysis." }
  ]);

  const runAuditSequence = async (userQuery: string) => {
    setMessages(prev => [...prev, { role: "user", content: userQuery }]);
    setIsAnalyzing(true);

    const result = await runOracleAudit(userQuery);
    
    setMessages(prev => [...prev, { role: "assistant", content: result.content, type: result.type }]);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    const initialQuery = searchParams.get("q");
    if (initialQuery && !hasInitialized.current) {
      hasInitialized.current = true;
      runAuditSequence(initialQuery);
    }
  }, [searchParams]); // Added searchParams to deps for safety, but ref guards it

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("NEXIS AI ORACLE", 14, 25);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("AUTONOMOUS AI AUDIT LOG - V4.0 COGNITIVE CORE", 14, 32);
      doc.text(`GENERATED: ${new Date().toLocaleString()}`, pageWidth - 14, 32, { align: 'right' });

      let currentY = 50;

      messages.forEach((msg, idx) => {
        const isUser = msg.role === "user";
        
        // Message Header
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text(isUser ? "USER QUERY" : "ORACLE RESPONSE", 14, currentY);
        currentY += 5;

        // Message Content
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        
        const splitText = doc.splitTextToSize(msg.content, pageWidth - 28);
        
        // Check if we need a new page
        if (currentY + (splitText.length * 5) > 280) {
          doc.addPage();
          currentY = 20;
        }

        doc.text(splitText, 14, currentY);
        currentY += (splitText.length * 5) + 15;
      });

      doc.save(`NEXIS-AI-ORACLE-AUDIT-${new Date().getTime()}.pdf`);
    } catch (err) {
      console.error("PDF Export Failure:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    const userQuery = query;
    setQuery("");
    await runAuditSequence(userQuery);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground w-full">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 relative overflow-hidden flex flex-col">
        <OracleGrid />
        
        {/* Page Header */}
        <div className="relative z-10 mb-12 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500/10 rounded-2xl">
                <BrainCircuit className="w-8 h-8 text-purple-500" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tighter uppercase italic text-foreground">NEXIS AI Oracle</h1>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">High-Velocity AI Auditor • v4.0</p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-xl text-sm leading-relaxed font-bold tracking-tight">
              Autonomous audit engine specializing in recursive data orchestration. 
              Real-time anomaly detection, predictive churn modeling, and revenue performance 
              optimization across the entire enterprise stack.
            </p>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleExportPDF}
              disabled={isExporting || messages.length <= 1}
              className="bg-card border border-border px-6 py-3 rounded-2xl flex items-center gap-3 hover:bg-secondary transition-all disabled:opacity-50 group shadow-sm"
            >
              {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />}
              <div className="text-left text-foreground">
                <p className="text-[9px] font-black uppercase tracking-widest leading-none mb-1">Audit Record</p>
                <p className="text-sm font-black leading-none">Export PDF</p>
              </div>
            </button>

            <div className="bg-card border border-border px-6 py-3 rounded-2xl flex items-center gap-3 shadow-sm text-foreground">
              <Activity className="w-5 h-5 text-emerald-500 animate-pulse" />
              <div className="text-right">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Neural Load</p>
                <p className="text-sm font-black">2.4% OPS</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Interface Grid */}
        <div className="relative z-10 flex-1 grid grid-cols-12 gap-8 min-h-0">
          
          {/* Chat / Audit Terminal */}
          <div className="col-span-12 lg:col-span-8 flex flex-col bg-card border border-border rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Auditor Active</span>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-border" />
                <div className="w-3 h-3 rounded-full bg-border" />
                <div className="w-3 h-3 rounded-full bg-border" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-background/30">
              <AnimatePresence mode="popLayout">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-4 max-w-[85%]",
                      msg.role === "user" ? "ml-auto flex-row-reverse text-right" : "mr-auto"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0",
                      msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-purple-500/20 text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                    )}>
                      {msg.role === "user" ? <UserCircleIcon className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                    </div>
                    <div className={cn(
                      "p-5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap font-bold tracking-tight",
                      msg.role === "user" ? "bg-primary/10 border border-primary/20 text-foreground" : "bg-secondary border border-border text-foreground shadow-sm"
                    )}>
                      {msg.role === "assistant" ? (
                        <TypewriterText text={msg.content} speed={1} />
                      ) : (
                        msg.content
                      )}
                      {msg.type && (
                        <div className="mt-4 pt-4 border-t border-border flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-500 text-[10px] font-black uppercase tracking-widest">Vector: {msg.type}</span>
                          <span className="text-[10px] text-muted-foreground italic tracking-tight font-black">Confidence Score: 98.4%</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 mr-auto"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-500 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 animate-spin" />
                    </div>
                    <div className="p-5 bg-secondary border border-border rounded-2xl flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" />
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <form onSubmit={handleAudit} className="p-6 bg-secondary/30 border-t border-border">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Initialize operational vector (e.g., 'Run revenue audit')..."
                  className="w-full bg-background border border-border rounded-2xl py-4 pl-6 pr-16 text-sm font-black focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 text-foreground placeholder:text-muted-foreground/50"
                />
                <button 
                  type="submit"
                  disabled={isAnalyzing || !query.trim()}
                  className="absolute right-3 p-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition-all disabled:opacity-50 disabled:scale-100 active:scale-95 shadow-lg shadow-purple-500/20"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Categories / Vectors */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="p-6 bg-card border border-border rounded-[2rem] shadow-xl">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 text-foreground">
                <Zap className="w-4 h-4 text-purple-500" />
                Neural Vectors
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {AUDIT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setQuery(`Run ${cat.label.toLowerCase()} audit.`)}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 border border-border hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-left group"
                  >
                    <div className={cn("p-3 rounded-xl shadow-sm transition-transform group-hover:scale-110", cat.bg, cat.color)}>
                      <cat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black tracking-tight text-foreground">{cat.label}</p>
                      <p className="text-[10px] text-muted-foreground group-hover:text-purple-500 transition-colors tracking-tight italic font-bold">Initiate audit stream</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleExportPDF}
              disabled={isExporting || messages.length <= 1}
              className="w-full py-4 bg-card border border-border hover:bg-secondary rounded-[1.5rem] flex items-center justify-center gap-3 transition-all disabled:opacity-50 group mt-2 shadow-sm"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-primary group-hover:translate-y-0.5 transition-transform" />}
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Generate Permanent Audit Record</span>
            </button>

            <div className="p-6 bg-purple-600 rounded-[2rem] shadow-xl text-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                <BrainCircuit className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-black tracking-tight mb-2 uppercase text-white">Synthetic Intelligence</h3>
                <p className="text-xs text-white/80 leading-relaxed mb-6 font-bold">NEXIS Oracle uses recursive predictive modeling to detect anomalies before they impact the bottom line.</p>
                <button 
                  onClick={handleExportPDF}
                  disabled={isExporting || messages.length <= 1}
                  className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black uppercase tracking-widest transition-all backdrop-blur-md border border-white/20 disabled:opacity-50"
                >
                  {isExporting ? "Generating..." : "Download Status Report"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function UserCircleIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/>
    </svg>
  );
}
