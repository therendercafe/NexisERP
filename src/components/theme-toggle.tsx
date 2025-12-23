"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const themes = [
    { name: "light", icon: Sun, label: "Light" },
    { name: "dark", icon: Zap, label: "Neon" },
    { name: "matrix", icon: Monitor, label: "Matrix" },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-secondary rounded-full border border-border">
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = theme === t.name;

        return (
          <button
            key={t.name}
            onClick={() => setTheme(t.name)}
            className={cn(
              "relative flex items-center justify-center w-8 h-8 rounded-full transition-colors",
              isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
            title={t.label}
          >
            {isActive && (
              <motion.div
                layoutId="theme-active"
                className="absolute inset-0 bg-primary rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon className="relative z-10 w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}

