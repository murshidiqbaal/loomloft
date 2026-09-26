"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Point {
  x: number;
  y: number;
  age: number;
}

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState("");
  const [cursorVariant, setCursorVariant] = useState<"default" | "hover" | "view" | "drag">("default");
  const [isVisible, setIsVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);

  useEffect(() => {
    // Only enable on desktop with fine pointer
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Add point for golden thread trail
      pointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        age: 0
      });

      // Keep maximum points
      if (pointsRef.current.length > 25) {
        pointsRef.current.shift();
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest("button, a, input, select, textarea, [data-cursor]");
      const productCard = target.closest("[data-cursor='product'], [data-cursor='view']");
      const ctaBtn = target.closest("button, .btn-loom, a[role='button']");

      if (productCard) {
        setCursorVariant("view");
        setCursorText("VIEW");
      } else if (ctaBtn) {
        setCursorVariant("hover");
        setCursorText("");
      } else if (interactive) {
        setCursorVariant("hover");
        setCursorText("");
      } else {
        setCursorVariant("default");
        setCursorText("");
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      pointsRef.current = [];
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Canvas render loop for golden thread trailing spline
    const renderThreadTrail = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const points = pointsRef.current;
          // Age and trim points
          for (let i = 0; i < points.length; i++) {
            points[i].age += 1;
          }
          pointsRef.current = points.filter((p) => p.age < 20);

          if (pointsRef.current.length > 2) {
            ctx.beginPath();
            ctx.moveTo(pointsRef.current[0].x, pointsRef.current[0].y);

            for (let i = 1; i < pointsRef.current.length - 1; i++) {
              const xc = (pointsRef.current[i].x + pointsRef.current[i + 1].x) / 2;
              const yc = (pointsRef.current[i].y + pointsRef.current[i + 1].y) / 2;
              ctx.quadraticCurveTo(pointsRef.current[i].x, pointsRef.current[i].y, xc, yc);
            }

            ctx.strokeStyle = "rgba(229, 161, 16, 0.45)";
            ctx.lineWidth = 1.8;
            ctx.shadowColor = "#f5b92e";
            ctx.shadowBlur = 4;
            ctx.stroke();

            // Inner bright core of the thread
            ctx.strokeStyle = "rgba(255, 235, 160, 0.6)";
            ctx.lineWidth = 0.8;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(renderThreadTrail);
    };

    // Resize canvas
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    animationFrameId = requestAnimationFrame(renderThreadTrail);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Canvas for Golden Thread Trail */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9990]"
        style={{ width: "100vw", height: "100vh" }}
      />

      {/* Central thread needle point */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-[#f5b92e] shadow-[0_0_8px_#e5a110]"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: cursorVariant === "hover" ? 0 : 1,
          opacity: 1
        }}
        transition={{ type: "spring", damping: 30, stiffness: 350, mass: 0.1 }}
        style={{ width: 8, height: 8 }}
      />

      {/* Orbiting Golden Ring with subtle trailing glow */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full flex items-center justify-center font-serif text-[10px] tracking-widest font-semibold uppercase text-[#04160d]"
        animate={{
          x: cursorVariant === "view" ? mousePosition.x - 36 : mousePosition.x - 18,
          y: cursorVariant === "view" ? mousePosition.y - 36 : mousePosition.y - 18,
          width: cursorVariant === "view" ? 72 : cursorVariant === "hover" ? 44 : 36,
          height: cursorVariant === "view" ? 72 : cursorVariant === "hover" ? 44 : 36,
          backgroundColor: cursorVariant === "view" ? "rgba(245, 185, 46, 0.95)" : "transparent",
          borderColor: cursorVariant === "view" ? "#e5a110" : "rgba(229, 161, 16, 0.6)",
          borderWidth: cursorVariant === "view" ? 0 : 1.5,
          scale: 1
        }}
        transition={{ type: "spring", damping: 24, stiffness: 220, mass: 0.2 }}
      >
        {cursorText && (
          <span className="font-semibold tracking-widest text-[11px] drop-shadow-sm text-[#04160d]">
            {cursorText}
          </span>
        )}
      </motion.div>
    </>
  );
}
