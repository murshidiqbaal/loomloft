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
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
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

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-3 bg-[#072618] border border-[#e5a110] text-[#e5a110] hover:bg-[#0d3824] rounded-full shadow-2xl transition-all group"
        aria-label="Contact LoomLoft Stylist on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 text-[#f5b92e] group-hover:scale-110 transition-transform" />
        <span className="text-xs font-serif tracking-widest uppercase font-medium hidden sm:inline text-cream">
          Stylist Help
        </span>
      </motion.button>
    </div>
  );
}
