"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Track whether the user has scrolled past the landing page hero into the store
  const [isAfterLanding, setIsAfterLanding] = useState(false);

  // Watermark exact position state
  const [watermarkPos, setWatermarkPos] = useState<{
    right: number;
    bottom: number;
    size: number;
    isCoveringWatermark: boolean;
  }>({
    right: 24,
    bottom: 24,
    size: 56,
    isCoveringWatermark: false,
  });

  const updatePosition = useCallback(() => {
    if (typeof window === "undefined") return;

    const cw = window.innerWidth;
    const ch = window.innerHeight;

    // Check if on non-home page: always standard position and size
    if (!isHomePage) {
      setIsAfterLanding(true);
      setWatermarkPos({
        right: cw >= 640 ? 32 : 24,
        bottom: cw >= 640 ? 32 : 24,
        size: 56,
        isCoveringWatermark: false,
      });
      return;
    }

    // Check if scrolled past the 3D landing hero section into the store
    const storeEl = document.getElementById("loom-store-start");
    let afterLanding = false;

    if (storeEl) {
      const rect = storeEl.getBoundingClientRect();
      // Transition starts as the store section enters viewport
      afterLanding = rect.top <= ch * 0.85;
    } else {
      // Fallback: check track height or scroll position
      const trackEl = document.getElementById("loom-story-track");
      if (trackEl) {
        const rect = trackEl.getBoundingClientRect();
        afterLanding = rect.bottom <= ch + 100;
      } else {
        afterLanding = window.scrollY > ch * 2;
      }
    }

    setIsAfterLanding(afterLanding);

    // On mobile portrait (< 640px), 16:9 canvas is cropped horizontally and watermark is off-screen
    const isMobilePortrait = cw < 640 && ch > cw;

    if (afterLanding || isMobilePortrait) {
      // Normal standard FAB size and position
      setWatermarkPos({
        right: cw >= 640 ? 32 : 24,
        bottom: cw >= 640 ? 32 : 24,
        size: 56,
        isCoveringWatermark: false,
      });
      return;
    }

    // --- LANDING PAGE WATERMARK COVERAGE MODE ---
    // Exact cover mode scaling (matches LoomLoftStoryHero canvas drawImage)
    const FRAME_WIDTH = 1920;
    const FRAME_HEIGHT = 1080;
    const scale = Math.max(cw / FRAME_WIDTH, ch / FRAME_HEIGHT);
    const drawW = FRAME_WIDTH * scale;
    const drawH = FRAME_HEIGHT * scale;
    const offsetX = (cw - drawW) / 2;
    const offsetY = (ch - drawH) / 2;

    // Star watermark center in 1920x1080 is at x=1740, y=890 (height 90px, width 80px)
    const starX = offsetX + 1740 * scale;
    const starY = offsetY + 890 * scale;

    // Bigger button size to guarantee 100% complete coverage of the star watermark
    // Scaled generously so no tips or points can peek out
    const targetSize = Math.max(84, Math.min(100, Math.round(94 * scale)));

    // Center the button precisely over (starX, starY)
    const right = Math.round(cw - starX - targetSize / 2);
    const bottom = Math.round(ch - starY - targetSize / 2);

    // If for any extreme aspect ratio the watermark is near or beyond edges, clamp safely
    if (right < 16 || bottom < 16 || starX > cw) {
      setWatermarkPos({
        right: cw >= 640 ? 32 : 24,
        bottom: cw >= 640 ? 32 : 24,
        size: 56,
        isCoveringWatermark: false,
      });
      return;
    }

    setWatermarkPos({
      right,
      bottom,
      size: targetSize,
      isCoveringWatermark: true,
    });
  }, [isHomePage]);

  useEffect(() => {
    updatePosition();

    let ticking = false;
    const handleScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updatePosition();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [updatePosition]);

  const phoneNumber = "919876543210";
  const defaultMessage = encodeURIComponent(
    "Namaste LoomLoft! I am interested in exploring your handcrafted handloom collections and need styling assistance."
  );

  const isCovering = watermarkPos.isCoveringWatermark && !isAfterLanding;

  return (
    <div
      className="fixed z-40 flex flex-col items-end pointer-events-none"
      style={{
        right: `${watermarkPos.right}px`,
        bottom: `${watermarkPos.bottom}px`,
        transition:
          "right 0.5s cubic-bezier(0.16, 1, 0.3, 1), bottom 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Concierge Chat Popup Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-3 w-72 bg-[#072618] border border-[#e5a110]/40 rounded-2xl p-4 shadow-2xl text-cream backdrop-blur-md pointer-events-auto"
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
                className="text-stone-400 hover:text-white transition-colors cursor-pointer"
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
              className="mt-3.5 flex items-center justify-center space-x-2 w-full py-2.5 bg-[#e5a110] hover:bg-[#f5b92e] text-[#04160d] text-xs font-semibold tracking-wider uppercase rounded-xl transition-all shadow-md font-sans cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Start WhatsApp Chat</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative group pointer-events-auto">
        {/* Solid Opaque Backing Shield: Absolutely covers the watermark with zero light bleed */}
        {isCovering && (
          <div
            className="absolute -inset-1 rounded-full bg-[#020b06] shadow-[0_12px_36px_rgba(0,0,0,0.95),0_0_24px_rgba(229,161,16,0.3)] pointer-events-none transition-opacity duration-500"
            style={{ opacity: isCovering ? 1 : 0 }}
          />
        )}

        {/* Hover Tooltip to the left */}
        <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 rounded-full bg-[#04160d]/95 border border-[#e5a110]/40 text-cream text-[10px] sm:text-xs font-serif tracking-widest uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-xl">
          Stylist Concierge
        </span>

        {/* Interactive Floating Button with dynamic size & smooth morph */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: `${watermarkPos.size}px`,
            height: `${watermarkPos.size}px`,
            transition:
              "width 0.4s cubic-bezier(0.16, 1, 0.3, 1), height 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s, box-shadow 0.4s",
          }}
          className={`relative flex items-center justify-center bg-gradient-to-br from-[#072618] to-[#020b06] border border-[#e5a110] text-[#e5a110] hover:border-[#f5b92e] rounded-full cursor-pointer transition-all ${isCovering
              ? "shadow-[0_12px_36px_rgba(0,0,0,0.95),0_0_24px_rgba(229,161,16,0.35)] ring-1 ring-[#f5b92e]/40"
              : "shadow-[0_8px_24px_rgba(0,0,0,0.8),0_0_15px_rgba(229,161,16,0.2)]"
            }`}
          aria-label="Contact LoomLoft Stylist on WhatsApp"
        >
          <MessageCircle
            className={`text-[#f5b92e] group-hover:scale-110 transition-transform ${isCovering ? "w-9 h-9 sm:w-10 sm:h-10" : "w-6 h-6"
              }`}
          />
          <span
            className={`absolute bg-emerald-400 border-2 border-[#04160d] rounded-full animate-pulse ${isCovering
                ? "top-2.5 right-2.5 w-3.5 h-3.5"
                : "top-1.5 right-1.5 w-3 h-3"
              }`}
          />
        </motion.button>
      </div>
    </div>
  );
}

