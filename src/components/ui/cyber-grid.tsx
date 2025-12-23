"use client";

import React, { useEffect, useRef } from "react";

export function CyberGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let mouse = { x: 0, y: 0 };

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"\'#&_(),.;:?!\\|{}<>[]^~ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = new Array(columns).fill(1);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const draw = () => {
      // Semi-transparent black to create trailing effect
      ctx.fillStyle = "rgba(10, 10, 15, 0.1)";
      ctx.fillRect(0, 0, width, height);

      // --- LAYER 1: WARP GRID ---
      ctx.strokeStyle = "rgba(0, 242, 255, 0.05)";
      ctx.lineWidth = 0.5;
      const gridSize = 60;
      
      // Vertical grid lines with warp
      for (let x = 0; x < width + gridSize; x += gridSize) {
        ctx.beginPath();
        for (let y = 0; y < height; y += 20) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const warp = Math.max(0, 40 - dist / 8);
          
          const warpX = x + (dist > 0 ? (dx / dist) * warp : 0);
          if (y === 0) ctx.moveTo(warpX, y);
          else ctx.lineTo(warpX, y);
        }
        ctx.stroke();
      }

      // --- LAYER 2: DIGITAL RAIN ---
      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 120) {
          ctx.fillStyle = "#00f2ff"; // Active Primary
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#00f2ff";
        } else {
          ctx.fillStyle = "rgba(0, 242, 255, 0.15)"; // Dim Matrix
          ctx.shadowBlur = 0;
        }

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Speed control
        drops[i] += dist < 150 ? 1.5 : 0.75;
      }

      requestAnimationFrame(draw);
    };

    const animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ filter: "contrast(1.1) brightness(1.1)" }}
    />
  );
}

