"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Command } from "lucide-react";
import { useRouter } from "next/navigation";

const EXAMPLE_QUERIES = [
  "Run an audit of revenue performance for Q4.",
  "Identify high-churn risk segments in the client base.",
  "Analyze inventory velocity for low-stock SKUs.",
];

export function AIInput() {
  const [queryIndex, setQueryIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const router = useRouter();
  
  const currentQuery = EXAMPLE_QUERIES[queryIndex];

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isTyping) {
      if (currentText.length < currentQuery.length) {
        timeout = setTimeout(() => {
          setCurrentText(currentQuery.slice(0, currentText.length + 1));
        }, 50);
      } else {
        timeout = setTimeout(() => setIsTyping(false), 2000);
      }
    } else {
      if (currentText.length > 0) {
        timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, 20);
      } else {
        setQueryIndex((prev) => (prev + 1) % EXAMPLE_QUERIES.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, isTyping, currentQuery]);

  const handleGo = () => {
    router.push(`/dashboard/ai-auditor?q=${encodeURIComponent(currentText)}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-20 group">
      <div className="relative flex items-center bg-[#1a1a1f]/80 backdrop-blur-xl border border-border/50 rounded-2xl p-2 pl-5 pr-2 shadow-2xl transition-all group-hover:border-purple-500/50 group-hover:shadow-purple-500/5 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500/20">
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <Sparkles className="w-5 h-5 text-purple-500 animate-pulse flex-shrink-0" />
          <div className="flex-1 text-left text-base md:text-lg font-bold text-foreground/80 truncate py-4 relative tracking-tight">
            {currentText}
            <span className="w-[2px] h-5 bg-purple-500 inline-block ml-1 animate-caret shadow-[0_0_10px_rgba(168,85,247,1)]" />
          </div>
        </div>
        
        <button 
          onClick={handleGo}
          className="p-2.5 bg-purple-600 text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-500/20 group/btn"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        
        <div className="absolute -bottom-6 left-5 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
          <Command className="w-3 h-3" />
          <span>Press initialized command to audit</span>
        </div>
      </div>
      {/* 2 empty "lines" equivalent space */}
      <div className="h-12" />
    </div>
  );
}

