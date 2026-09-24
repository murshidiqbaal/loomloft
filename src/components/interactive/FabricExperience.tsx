"use client";

import React, { useRef, useEffect, useState } from "react";
import { Sparkles, Hand, Sliders, Info } from "lucide-react";

export default function FabricExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activePreset, setActivePreset] = useState<"chanderi" | "mulberry" | "tussar">("chanderi");
  const [threadTension, setThreadTension] = useState(14.8);
  const [interactionActive, setInteractionActive] = useState(false);

  const presets = {
    chanderi: {
      name: "Chanderi Gossamer Silk",
      threadCount: "320 Threads/inch",
      density: "Ultra Fine",
      zari: "24k Micro-Plated Zari",
      origin: "Pranpur Guild",
      color: "#e5a110",
      accent: "#f5b92e",
      warpColor: "rgba(229, 161, 16, 0.45)",
      weftColor: "rgba(7, 38, 24, 0.85)"
    },
    mulberry: {
      name: "Kanchipuram Heavy Mulberry Silk",
      threadCount: "480 Threads/inch",
      density: "Dense 3-Ply Warp",
      zari: "Pure Silver Korvai Zari",
      origin: "Tamil Nadu Guild",
      color: "#f5b92e",
      accent: "#ffffff",
      warpColor: "rgba(245, 185, 46, 0.55)",
      weftColor: "rgba(10, 46, 29, 0.95)"
    },
    tussar: {
      name: "Desi Wild Handspun Tussar",
      threadCount: "190 Threads/inch",
      density: "Organic Slub Weave",
      zari: "Raw Wild Amber Cocoons",
      origin: "Bhagalpur Cooperative",
      color: "#d6971a",
      accent: "#c28302",
      warpColor: "rgba(214, 151, 26, 0.5)",
      weftColor: "rgba(13, 56, 36, 0.9)"
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 460);

    // Mouse coordinates
    let mouse = { x: width / 2, y: height / 2, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
      setInteractionActive(true);
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      setInteractionActive(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        mouse.active = true;
        setInteractionActive(true);
      }
    };

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 800;
      height = canvas.height = 460;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("resize", handleResize);

    // Grid of threads
    const rows = 32;
    const cols = 48;
    let time = 0;

    const render = () => {
      time += 0.03;
      ctx.clearRect(0, 0, width, height);

      // Deep forest textured background
      ctx.fillStyle = "#04160d";
      ctx.fillRect(0, 0, width, height);

      const cellW = width / cols;
      const cellH = height / rows;

      // Draw Warp Threads (Vertical)
      for (let c = 0; c <= cols; c++) {
        const baseX = c * cellW;
        ctx.beginPath();
        for (let r = 0; r <= rows; r++) {
          const baseY = r * cellH;
          // Calculate deflection from mouse
          const dx = baseX - mouse.x;
          const dy = baseY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 120;
          let displaceX = 0;
          let displaceY = 0;

          if (dist < maxDist) {
            const force = (1 - dist / maxDist) * 18;
            displaceX = (dx / dist) * force;
            displaceY = (dy / dist) * force;
          }

          // Gentle ambient wave
          const ambientWave = Math.sin(baseY * 0.05 + time) * 2;
          const x = baseX + displaceX + ambientWave;
          const y = baseY + displaceY;

          if (r === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.strokeStyle =
          c % 4 === 0
            ? presets[activePreset].accent
            : presets[activePreset].warpColor;
        ctx.lineWidth = c % 4 === 0 ? 1.4 : 0.8;
        ctx.stroke();
      }

      // Draw Weft Threads (Horizontal)
      for (let r = 0; r <= rows; r++) {
        const baseY = r * cellH;
        ctx.beginPath();
        for (let c = 0; c <= cols; c++) {
          const baseX = c * cellW;
          const dx = baseX - mouse.x;
          const dy = baseY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 120;
          let displaceX = 0;
          let displaceY = 0;

          if (dist < maxDist) {
            const force = (1 - dist / maxDist) * 16;
            displaceX = (dx / dist) * force;
            displaceY = (dy / dist) * force;
          }

          const ambientWave = Math.cos(baseX * 0.05 + time) * 2;
          const x = baseX + displaceX;
          const y = baseY + displaceY + ambientWave;

          if (c === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.strokeStyle =
          r % 3 === 0
            ? "rgba(229, 161, 16, 0.4)"
            : "rgba(18, 67, 44, 0.7)";
        ctx.lineWidth = r % 3 === 0 ? 1.2 : 0.7;
        ctx.stroke();
      }

      // Draw interactive golden thread follow-cursor pulse
      if (mouse.active) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 45, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(245, 185, 46, 0.4)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#e5a110";
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [activePreset]);

  return (
    <section className="py-24 bg-[#072618] text-white relative overflow-hidden border-y border-[#e5a110]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 text-[#e5a110] text-xs font-serif uppercase tracking-[0.25em] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tactile Textile Simulation</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] text-white">
              FEEL THE THREAD
            </h2>
            <p className="mt-3 text-stone-300 font-sans text-sm sm:text-base max-w-xl leading-relaxed">
              Move your cursor or finger across the loom weave below. Observe the thread tension, warp interlocking, and gossamer silk elasticity in real time.
            </p>
          </div>

          {/* Preset Selector */}
          <div className="mt-6 md:mt-0 flex items-center space-x-2 bg-[#04160d] p-1.5 rounded-2xl border border-stone-800">
            {(["chanderi", "mulberry", "tussar"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setActivePreset(key)}
                className={`px-4 py-2 rounded-xl text-xs font-serif uppercase tracking-widest transition-all ${
                  activePreset === key
                    ? "bg-[#e5a110] text-[#04160d] font-bold shadow-md"
                    : "text-stone-300 hover:text-white"
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Weave Canvas Card */}
        <div className="relative rounded-3xl overflow-hidden border border-[#e5a110]/30 shadow-2xl bg-[#04160d]">
          <canvas
            ref={canvasRef}
            className="w-full h-[460px] cursor-crosshair block"
          />

          {/* Floating Live Telemetry Overlay */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-[#072618]/90 backdrop-blur-md border border-[#e5a110]/30 rounded-2xl p-4 sm:p-5 text-xs space-y-2 pointer-events-none shadow-xl max-w-xs">
            <div className="flex items-center space-x-2 text-[#f5b92e] font-serif uppercase tracking-wider text-[11px] font-semibold border-b border-stone-800 pb-2">
              <Sliders className="w-3.5 h-3.5" />
              <span>{presets[activePreset].name}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-stone-300 text-[11px]">
              <span className="text-stone-400">Thread Count:</span>
              <span className="text-white font-serif">{presets[activePreset].threadCount}</span>
              <span className="text-stone-400">Warp Tension:</span>
              <span className="text-[#e5a110] font-mono">{interactionActive ? "16.4 N (Active)" : "14.8 N (At Rest)"}</span>
              <span className="text-stone-400">Weave Density:</span>
              <span className="text-white font-serif">{presets[activePreset].density}</span>
              <span className="text-stone-400">Cluster:</span>
              <span className="text-[#f5b92e] font-serif">{presets[activePreset].origin}</span>
            </div>
          </div>

          {/* Bottom Hint */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center space-x-2 bg-[#072618]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-stone-800 text-[11px] text-stone-300 pointer-events-none">
            <Hand className="w-3.5 h-3.5 text-[#e5a110] animate-bounce" />
            <span>Hover or drag across the threads</span>
          </div>
        </div>
      </div>
    </section>
  );
}
