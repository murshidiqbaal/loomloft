"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = "919876543210";
  const defaultMessage = encodeURIComponent(
    "Namaste LoomLoft! I am interested in exploring your handcrafted handloom collections and need styling assistance."
  );

  return (
    <div className="fixed bottom-[64px] sm:bottom-[72px] right-[96px] sm:right-[116px] z-40 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-3 w-72 bg-[#072618] border border-[#e5a110]/40 rounded-2xl p-4 shadow-2xl text-cream backdrop-blur-md"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#e5a110]/20">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-serif text-sm font-semibold tracking-wide text-[#f5b92e]">
                  LoomLoft Concierge
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-white transition-colors"
                aria-label="Close concierge"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-stone-300 mt-2.5 leading-relaxed">
              Seeking advice on sizing, custom weaving, or heritage bridal wear? Chat directly with our handloom stylists.
            </p>
            <a
              href={`https://wa.me/${phoneNumber}?text=${defaultMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3.5 flex items-center justify-center space-x-2 w-full py-2.5 bg-[#e5a110] hover:bg-[#f5b92e] text-[#04160d] text-xs font-semibold tracking-wider uppercase rounded-xl transition-all shadow-md font-sans"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Start WhatsApp Chat</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative group">
        {/* Soft shadow diffuser ensuring complete opacity over watermark */}
        <div className="absolute inset-0 -m-3 rounded-full bg-black/85 blur-md pointer-events-none" />

        {/* Hover Tooltip to the left */}
        <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 rounded-full bg-[#04160d]/95 border border-[#e5a110]/40 text-cream text-[10px] sm:text-xs font-serif tracking-widest uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-xl">
          Stylist Help
        </span>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-[#04160d] border border-[#e5a110] text-[#e5a110] hover:bg-[#09291a] rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.9),0_0_20px_rgba(229,161,16,0.25)] transition-all"
          aria-label="Contact LoomLoft Stylist on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-[#f5b92e] group-hover:scale-110 transition-transform" />
          <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-emerald-400 border-2 border-[#04160d] rounded-full animate-pulse" />
        </motion.button>
      </div>
    </div>
  );
}
