"use client";

import React, { useEffect, useRef } from "react";

export function OracleGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let mouse = { x: 0, y: 0 };

    const dots: { x: number; y: number; vx: number; vy: number; radius: number; brightness: number }[] = [];
    const dotCount = 180;

    for (let i = 0; i < dotCount; i++) {
      dots.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5, // Faster
        vy: (Math.random() - 0.5) * 1.5, // Faster
        radius: Math.random() * 2 + 0.5,
        brightness: Math.random(), // Star variation
      });
    }

    // Matrix rain bits following mouse
    const rainParticles: { x: number; y: number; char: string; life: number; color: string }[] = [];
    const chars = "$$$$$$$$01";
    const pastelPurples = ["#d8b4fe", "#c084fc", "#a855f7", "#e9d5ff"];

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      // Add rain particles near mouse - specifically dollar signs
      if (Math.random() > 0.3) {
        rainParticles.push({
          x: mouse.x + (Math.random() - 0.5) * 60,
          y: mouse.y + (Math.random() - 0.5) * 60,
          char: chars.charAt(Math.floor(Math.random() * chars.length)),
          life: 1.0,
          color: pastelPurples[Math.floor(Math.random() * pastelPurples.length)]
        });
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 15, 0.3)"; // Brighter trail
      ctx.fillRect(0, 0, width, height);

      // Draw Rain Particles (Dollar Signs)
      ctx.font = "bold 14px monospace";
      for (let i = rainParticles.length - 1; i >= 0; i--) {
        const p = rainParticles[i];
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life * 0.7;
        ctx.fillText(p.char, p.x, p.y);
        ctx.globalAlpha = 1.0;
        p.y += 2.5; // Fall faster
        p.life -= 0.015;
        if (p.life <= 0) rainParticles.splice(i, 1);
      }

      dots.forEach((dot) => {
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < 0 || dot.x > width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > height) dot.vy *= -1;

        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 250) {
          const force = (250 - dist) / 1500;
          dot.vx += (dx / dist) * force;
          dot.vy += (dy / dist) * force;
        }

        // Limit speed
        const speed = Math.sqrt(dot.vx * dot.vx + dot.vy * dot.vy);
        if (speed > 3) {
          dot.vx = (dot.vx / speed) * 3;
          dot.vy = (dot.vy / speed) * 3;
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        const alpha = (dist < 200 ? 0.8 : 0.2 + dot.brightness * 0.4);
        ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`;
        ctx.fill();

        // Connect dots
        dots.forEach((otherDot) => {
          const ddx = dot.x - otherDot.x;
          const ddy = dot.y - otherDot.y;
          const ddist = Math.sqrt(ddx * ddx + ddy * ddy);

          if (ddist < 120) {
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(otherDot.x, otherDot.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.15 * (1 - ddist / 120)})`;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40"
    />
  );
}

