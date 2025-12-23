import { Hero } from "@/components/sections/hero";
import { Stack } from "@/components/sections/stack";
import { Value } from "@/components/sections/value";
import { Showcase } from "@/components/sections/showcase";
import { CTA } from "@/components/sections/cta";
import { CyberGrid } from "@/components/ui/cyber-grid";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      <CyberGrid />
      <div className="relative z-10">
        <Hero />
        <div id="stack">
          <Stack />
        </div>
        <Showcase />
        <div id="strategy">
          <Value />
        </div>
        <CTA />
        
        <footer className="py-12 border-t border-border/50 text-center">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            © 2025 NEXIS COMMAND ERP // BUILT BY THE RENDER CAFE // ALL RIGHTS RESERVED
          </p>
        </footer>
      </div>
    </main>
  );
}
