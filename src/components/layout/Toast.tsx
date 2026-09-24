"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Info, AlertCircle, X } from "lucide-react";

export default function Toast() {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: -30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            className="pointer-events-auto flex items-center justify-between p-3.5 bg-[#072618]/95 backdrop-blur-md border border-[#e5a110]/40 rounded-xl shadow-2xl text-cream"
          >
            <div className="flex items-center space-x-3">
              {toast.type === "success" && (
                <CheckCircle2 className="w-4 h-4 text-[#e5a110] shrink-0" />
              )}
              {toast.type === "info" && (
                <Info className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              {toast.type === "error" && (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span className="text-xs font-sans text-stone-200 tracking-wide">
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-[#f5b92e] transition-colors ml-3 p-1"
              aria-label="Dismiss alert"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
