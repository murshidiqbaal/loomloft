"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lock background scroll during the 3-second loading phase
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 3-second loader duration
    const timer = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = originalOverflow;
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="loomloft-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#04160d] select-none pointer-events-auto"
        >
          {/* Subtle warm golden ambient aura behind the logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{
              opacity: [0.25, 0.65, 0.4, 0.7, 0.35],
              scale: [0.8, 1.15, 0.95, 1.12, 1],
            }}
            exit={{
              opacity: 0,
              scale: 1.25,
              transition: { duration: 0.6, ease: "easeInOut" },
            }}
            transition={{
              duration: 3,
              times: [0, 0.3, 0.55, 0.8, 1],
              ease: "easeInOut",
            }}
            style={{
              background:
                "radial-gradient(circle, rgba(245, 185, 46, 0.35) 0%, rgba(229, 161, 16, 0.15) 50%, transparent 72%)",
            }}
            className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full blur-3xl pointer-events-none"
          />

          {/* Logo Only Container with Entrance, Breathing, and Exit Transition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.78, filter: "blur(8px)" }}
            animate={{
              opacity: [0, 1, 1, 1, 1],
              scale: [0.78, 1.05, 0.98, 1.03, 1],
              filter: ["blur(8px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)"],
            }}
            exit={{
              opacity: 0,
              scale: 1.1,
              filter: "blur(6px)",
              transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
            }}
            transition={{
              duration: 3,
              times: [0, 0.28, 0.55, 0.82, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative z-10 w-28 h-48 sm:w-36 sm:h-60 flex items-center justify-center"
          >
            <Image
              src="/logo.png"
              alt="LoomLoft Logo"
              fill
              priority
              className="object-contain drop-shadow-[0_0_20px_rgba(245,185,46,0.6)] drop-shadow-[0_0_40px_rgba(229,161,16,0.3)]"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
