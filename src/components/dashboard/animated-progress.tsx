"use client";

import { motion } from "framer-motion";

export function AnimatedProgress({ width, color = "bg-emerald-500" }: { width: string, color?: string }) {
  return (
    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full ${color} shadow-[0_0_10px_rgba(16,185,129,0.5)]`}
      />
    </div>
  );
}

