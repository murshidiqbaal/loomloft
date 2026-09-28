"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 300;
const FRAME_WIDTH = 1920;
const FRAME_HEIGHT = 1080;

export default function LoomLoftStoryHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [currentFrame, setCurrentFrame] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInitialReady, setIsInitialReady] = useState(false);

  // Cached image elements
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const frameProxyRef = useRef({ frame: 1 });

  // Draw a specific frame to the canvas with watermark overlay
  const drawFrame = useCallback((frameNum: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const clampedFrame = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(frameNum)));
    const img = imagesRef.current[clampedFrame];

    if (!img || !img.complete || img.naturalWidth === 0) {
      // Find nearest loaded frame to prevent any blank frame flicker
      let nearestImg: HTMLImageElement | null = null;
      for (let offset = 1; offset < 40; offset++) {
        const prev = imagesRef.current[clampedFrame - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          nearestImg = prev;
          break;
        }
        const next = imagesRef.current[clampedFrame + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          nearestImg = next;
          break;
        }
      }
      if (nearestImg) {
        renderImageToCanvas(ctx, canvas, nearestImg);
      }
      return;
    }

    renderImageToCanvas(ctx, canvas, img);
  }, []);

  const renderImageToCanvas = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    img: HTMLImageElement
  ) => {
    const cw = canvas.width;
    const ch = canvas.height;

    // Cover mode scaling (maintains 16:9 ratio and fills screen seamlessly)
    const scale = Math.max(cw / FRAME_WIDTH, ch / FRAME_HEIGHT);
    const drawW = FRAME_WIDTH * scale;
    const drawH = FRAME_HEIGHT * scale;
    const offsetX = (cw - drawW) / 2;
    const offsetY = (ch - drawH) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  };

  const scrollToStore = () => {
    const storeEl = document.getElementById("loom-store-start");
    if (storeEl) {
      storeEl.scrollIntoView({ behavior: "smooth" });
    } else if (containerRef.current) {
      window.scrollTo({
        top: containerRef.current.offsetTop + containerRef.current.offsetHeight,
        behavior: "smooth",
      });
    }
  };

  // Preload frames progressively
  useEffect(() => {
    let isCancelled = false;
    imagesRef.current = new Array(TOTAL_FRAMES + 1).fill(null);

    // Initial critical batch (every 5th frame for fast responsiveness + first 25 frames)
    const priorityFrames: number[] = [];
    for (let i = 1; i <= 25; i++) priorityFrames.push(i);
    for (let i = 30; i <= TOTAL_FRAMES; i += 5) priorityFrames.push(i);

    const loadSingleFrame = (frameNum: number): Promise<void> => {
      return new Promise((resolve) => {
        if (imagesRef.current[frameNum]) {
          resolve();
          return;
        }
        const img = new window.Image();
        const paddedIndex = String(frameNum).padStart(3, "0");
        img.src = `/animate/ezgif-frame-${paddedIndex}.jpg`;

        img.onload = () => {
          if (!isCancelled) {
            imagesRef.current[frameNum] = img;

            if (frameNum === 1 || !isInitialReady) {
              setIsInitialReady(true);
              drawFrame(frameProxyRef.current.frame);
            }
          }
          resolve();
        };
        img.onerror = () => resolve();
      });
    };

    // Load priority frames first
    const loadAll = async () => {
      await Promise.all(priorityFrames.map(loadSingleFrame));

      const remaining: number[] = [];
      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        if (!imagesRef.current[i]) remaining.push(i);
      }

      const chunkSize = 12;
      for (let i = 0; i < remaining.length; i += chunkSize) {
        if (isCancelled) break;
        const chunk = remaining.slice(i, i + chunkSize);
        await Promise.all(chunk.map(loadSingleFrame));
      }
    };

    loadAll();

    return () => {
      isCancelled = true;
    };
  }, [drawFrame, isInitialReady]);

  // Handle Canvas Resize with pixel-perfect High-DPI support
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      drawFrame(frameProxyRef.current.frame);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrame]);

  // GSAP ScrollTrigger Master Scrubbing
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    frameProxyRef.current.frame = 1;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.9,
        onUpdate: (self) => {
          const p = self.progress;
          setScrollProgress(p);

          const frame = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(1 + p * (TOTAL_FRAMES - 1))));
          frameProxyRef.current.frame = frame;
          setCurrentFrame(frame);
          drawFrame(frame);
        },
      },
    });

    timeline.to(frameProxyRef.current, {
      frame: TOTAL_FRAMES,
      ease: "none",
      duration: 1,
    });

    return () => {
      if (timeline.scrollTrigger) {
        timeline.scrollTrigger.kill();
      }
      timeline.kill();
    };
  }, [drawFrame]);

  // Scene texts only show AFTER the user initiates scrolling (currentFrame >= 12 && scrollProgress >= 0.02)
  const hasStartedScrolling = currentFrame >= 12 && scrollProgress >= 0.02;

  const isSlideActive = (startFrame: number, endFrame: number) => {
    if (!hasStartedScrolling) return false;
    return currentFrame >= startFrame && currentFrame <= endFrame;
  };

  return (
    <div
      ref={containerRef}
      id="loom-story-track"
      className="relative w-full bg-[#020b06] text-white selection:bg-[#072618] selection:text-[#f5b92e]"
      style={{ height: "550vh" }}
    >
      {/* Sticky Viewport Container */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-black"
      >
        {/* Cinematic Canvas Frame Player */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block z-10 touch-none pointer-events-none"
        />


        {/* Ambient Subtle Glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0d3824]/20 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#f5b92e]/10 rounded-full blur-[140px] pointer-events-none z-0" />

        {/* TOP RIGHT MINIMAL SKIP BUTTON */}
        <div
          className={`absolute top-6 right-6 z-30 transition-opacity duration-500 ${
            scrollProgress >= 0.86 ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
          }`}
        >
          <button
            onClick={scrollToStore}
            className="btn-loom px-4 py-2 rounded-full bg-[#072618]/70 hover:bg-[#0d3824] border border-[#e5a110]/30 text-[#f5b92e] font-serif text-[11px] uppercase tracking-[0.2em] transition-all shadow-md flex items-center space-x-2 group cursor-pointer"
          >
            <span>Skip</span>
            <ArrowDown className="w-3 h-3 text-[#f5b92e] group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* INITIAL CLEAN LANDING VIEW: PURE CINEMATIC VISUAL */}
        {/* Only shows subtle scroll hint on initial load; fades away as soon as user starts scrolling */}
        <div
          className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 pointer-events-none z-20 transition-all duration-700 ${!hasStartedScrolling
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
            }`}
        >
          <span className="font-serif text-[11px] tracking-[0.28em] uppercase text-[#deb841]/85">
            Scroll to begin story
          </span>
          <div className="w-5 h-8 rounded-full border border-[#f5b92e]/40 flex items-start justify-center p-1">
            <span className="w-1 h-2 bg-[#f5b92e] rounded-full animate-bounce" />
          </div>
        </div>

        {/* -------------------------------------------------------------
            SYNCHRONIZED ESSENTIAL THOUGHTS (3 COMPACT EDITORIAL CARDS)
        ------------------------------------------------------------- */}

        {/* THOUGHT 01: THE THREAD (Frames 15 - 75) */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-10 z-20 pointer-events-none transition-all duration-700 ${isSlideActive(15, 75)
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4"
            }`}
        >
          <div className="text-center max-w-lg">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.14em] text-white leading-tight uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              Everything begins with a{" "}
              <span className="font-normal italic text-[#f5b92e] drop-shadow-[0_0_15px_rgba(245,185,46,0.6)]">
                thread.
              </span>
            </h1>
            <p className="mt-3 text-xs sm:text-sm font-sans text-stone-200 tracking-[0.22em] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Pure 24k gold-wrapped mulberry silk.
            </p>
          </div>
        </div>

        {/* THOUGHT 02: THE WEAVE (Frames 85 - 145) */}
        <div
          className={`absolute inset-0 flex flex-col items-start justify-center p-6 sm:p-14 z-20 pointer-events-none transition-all duration-700 ${isSlideActive(85, 145)
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4"
            }`}
        >
          <div className="max-w-md text-left">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.12em] text-white leading-tight uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              Threads become{" "}
              <span className="italic font-normal text-[#f5b92e] drop-shadow-[0_0_15px_rgba(245,185,46,0.6)]">patterns.</span>
            </h2>
            <p className="mt-3 text-xs sm:text-sm font-sans text-stone-200 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Warp and weft interlock in sacred rhythm across the traditional handloom.
            </p>
          </div>
        </div>

        {/* THOUGHT 03: THE FABRIC (Frames 155 - 215) */}
        <div
          className={`absolute inset-0 flex flex-col items-end justify-center p-6 sm:p-14 z-20 pointer-events-none transition-all duration-700 ${isSlideActive(155, 215)
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4"
            }`}
        >
          <div className="max-w-md text-right">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.12em] text-white leading-tight uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              Crafted by hand.
              <br />
              <span className="italic font-normal text-[#f5b92e] drop-shadow-[0_0_15px_rgba(245,185,46,0.6)]">
                Designed for today.
              </span>
            </h2>
            <p className="mt-3 text-xs sm:text-sm font-sans text-stone-200 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Royal Banarasi mulberry silk, undulating with imperial luster and beaten gold zari.
            </p>
          </div>
        </div>

        {/* Golden Guide Thread Continuing Downwards at Animation Finale */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
          <div className="w-[1.5px] h-14 bg-gradient-to-b from-[#f5b92e] to-[#f5b92e]/20 shadow-[0_0_8px_#f5b92e]" />
        </div>

        {/* CINEMATIC FULL BLACKOUT OVERLAY */}
        <div
          className="absolute inset-0 bg-[#000000] z-24 pointer-events-none transition-opacity duration-300"
          style={{ opacity: Math.min(1, Math.max(0, (scrollProgress - 0.86) / 0.08)) }}
        />

        {/* REGAL BRAND LOGO EASING IN FROM THE BLACKOUT INTO NEXT SECTION */}
        {scrollProgress >= 0.91 && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-6 z-25 pointer-events-none"
            style={{
              opacity: Math.min(1, Math.max(0, (scrollProgress - 0.91) / 0.07)),
              transform: `scale(${0.92 + Math.min(1, Math.max(0, (scrollProgress - 0.91) / 0.07)) * 0.08}) translateY(${(1 - Math.min(1, Math.max(0, (scrollProgress - 0.91) / 0.07))) * 24}px)`,
              transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
            }}
          >
            {/* Ambient Imperial Golden Glow */}
            <div className="absolute w-80 h-80 rounded-full bg-[#f5b92e]/12 blur-[100px] pointer-events-none" />

            {/* Golden Monogram Emblem */}
            <div className="relative w-16 h-24 sm:w-20 sm:h-28 mb-4 drop-shadow-[0_0_28px_rgba(245,185,46,0.65)]">
              <Image
                src="/logo.png"
                alt="LoomLoft Official Emblem"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Official Typography */}
            <span className="font-serif text-2xl sm:text-4xl tracking-[0.32em] uppercase font-light text-[#f5b92e] drop-shadow-[0_0_20px_rgba(245,185,46,0.5)]">
              LOOM LOFT
            </span>
            <span className="font-serif text-[10px] sm:text-xs tracking-[0.45em] uppercase text-stone-300 mt-2.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              QUALITY IN EVERY THREAD
            </span>

            {/* Continuous Golden Guide Thread leading into the Atelier / Store */}
            <div className="w-[1.5px] h-20 bg-gradient-to-b from-[#f5b92e] to-[#e5a110]/50 mt-7 shadow-[0_0_10px_#f5b92e]" />
          </div>
        )}

        {/* ULTRA-MINIMAL BOTTOM PROGRESS LINE */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-[2px] bg-stone-900/60 pointer-events-none z-30 transition-opacity duration-300 ${
            scrollProgress >= 0.92 ? "opacity-0" : "opacity-100"
          }`}
        >
          <div
            className="h-full bg-gradient-to-r from-[#e5a110] to-[#f5b92e] transition-all duration-150 ease-out shadow-[0_0_6px_#f5b92e]"
            style={{ width: `${Math.round(scrollProgress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
