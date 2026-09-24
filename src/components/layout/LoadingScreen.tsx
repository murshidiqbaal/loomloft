"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only display on initial session load, keep fast (~1.4s)
    const hasLoaded = sessionStorage.getItem("loomloft_visited");
    if (hasLoaded) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem("loomloft_visited", "true");
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#072618] text-[#FAF7F2] select-none pointer-events-auto"
        >
          {/* Animated golden thread path */}
          <div className="relative w-48 h-32 flex flex-col items-center justify-center">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 200 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M 10 60 Q 60 10 100 60 T 190 60"
                stroke="#e5a110"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
              />
              <motion.circle
                cx="190"
                cy="60"
                r="3"
                fill="#f5b92e"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.4, 1] }}
                transition={{ delay: 0.9, duration: 0.4 }}
              />
            </svg>

            {/* Official LoomLoft Logo Center */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative z-10 w-20 h-24 flex items-center justify-center overflow-hidden rounded"
            >
              <Image
                src="/images/loomloft-logo.jpeg"
                alt="LoomLoft Official Logo"
                fill
                priority
                className="object-contain"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-center mt-3"
          >
            <h1 className="font-serif text-xl tracking-[0.3em] uppercase text-[#e5a110] font-semibold">
              LOOM LOFT
            </h1>
            <p className="font-serif text-[10px] tracking-[0.35em] uppercase text-stone-300 mt-1">
              QUALITY IN EVERY THREAD
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
