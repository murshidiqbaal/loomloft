"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState("");
  const [cursorVariant, setCursorVariant] = useState<"default" | "hover" | "view" | "drag">("default");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop with fine pointer
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

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

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Central thread needle point */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-[#e5a110]"
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
          <span className="font-semibold tracking-widest text-[11px] drop-shadow-sm">
            {cursorText}
          </span>
        )}
      </motion.div>
    </>
  );
}
