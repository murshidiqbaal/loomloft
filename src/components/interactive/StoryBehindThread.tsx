"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, Feather, Compass, Scissors } from "lucide-react";

export default function StoryBehindThread() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: "thread",
      number: "01",
      title: "The Thread",
      subtitle: "Indigenous Silks & 24k Zari Core",
      icon: Feather,
      description:
        "Every LoomLoft creation begins with raw, unadulterated fiber. We hand-reel wild Tussar cocoons from tribal forests in Bihar, pure mulberry silk from Kanchipuram, and genuine zari threads core-wound in fine silver and dipped in gold.",
      details: [
        { label: "Fiber Count", value: "300 - 480 Fine Count" },
        { label: "Purity", value: "100% Biodegradable Native Fibers" },
        { label: "Reeling", value: "Traditional Amber Charkha Hand-Spun" }
      ],
      image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "fabric",
      number: "02",
      title: "The Fabric",
      subtitle: "Zero-Electricity Pit Loom Weaves",
      icon: Compass,
      description:
        "Our looms reside inside earthen artisan homes. No noisy electric turbines or carbon-heavy automation. The shuttle moves purely through the human wrist and foot pedals, yielding microscopic slubs and textures impossible to replicate in industrial mills.",
      details: [
        { label: "Loom Type", value: "Traditional Wooden Pit & Frame Looms" },
        { label: "Energy Impact", value: "100% Zero-Carbon Neutral Craft" },
        { label: "Tactile Finish", value: "Liquid Drape with Organic Slub Depth" }
      ],
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "craft",
      number: "03",
      title: "The Craft",
      subtitle: "Centuries-Old Interlocking Motifs",
      icon: Scissors,
      description:
        "Whether it is the Korvai interlocking joint of Tamil Nadu, the freehand floral poetry of Bengal Jamdani, or the 16-stage fermented indigo baths of Kutch Ajrakh, our techniques are protected geographic treasures requiring weeks of patient calculation.",
      details: [
        { label: "Weaving Time", value: "40 to 180 Hours Per Garment" },
        { label: "Artisan Clusters", value: "Chanderi, Varanasi, Kutch, Srinagar" },
        { label: "Certification", value: "Handloom Mark & Silk Mark Authenticated" }
      ],
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "garment",
      number: "04",
      title: "The Garment",
      subtitle: "Modern Luxury with Sovereign Heritage",
      icon: ShieldCheck,
      description:
        "The finished textile is tailored with sculptural precision into modern bandhgalas, flowy silk kurta sets, and sovereign heirloom sarees. Finished with horn and mother-of-pearl buttons and delivered in cedar-scented unbleached packaging.",
      details: [
        { label: "Longevity", value: "Multi-Generational Heirloom" },
        { label: "Packaging", value: "Muslin Keepsake Box & Cedar Sachets" },
        { label: "Tailoring", value: "Bespoke Clean French Seams" }
      ],
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80"
    }
  ];

  return (
    <section className="py-24 bg-transparent text-white relative overflow-hidden">
      {/* Decorative Golden Thread Connector Line */}
      <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#e5a110]/40 to-transparent pointer-events-none hidden lg:block" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-[#f5b92e] text-xs font-serif uppercase tracking-[0.25em] mb-3 px-3 py-1 rounded-full glass-pill-gold">
            <Sparkles className="w-3.5 h-3.5 text-[#f5b92e]" />
            <span>Editorial Textile Journey</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            THE STORY BEHIND THE THREAD
          </h2>
          <p className="mt-4 text-stone-300 font-sans text-sm sm:text-base leading-relaxed">
            Follow the sacred metamorphosis from raw forest cocoon to contemporary runway silhouette. Step into the loom.
          </p>
        </div>

        {/* 4-Phase Step Selector Rail */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isCurrent = activeStep === idx;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStep(idx)}
                className={`text-left p-4 sm:p-5 rounded-2xl transition-all duration-300 relative border cursor-pointer ${
                  isCurrent
                    ? "glass-panel border-[#f5b92e] text-white shadow-[0_0_20px_rgba(229,161,16,0.25)]"
                    : "glass-pill text-stone-300 hover:text-white hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`font-serif text-xs font-bold tracking-widest ${
                      isCurrent ? "text-[#f5b92e]" : "text-stone-400"
                    }`}
                  >
                    PHASE {s.number}
                  </span>
                  <Icon
                    className={`w-4 h-4 ${
                      isCurrent ? "text-[#f5b92e]" : "text-stone-400"
                    }`}
                  />
                </div>
                <h4
                  className={`font-serif text-base sm:text-lg font-semibold tracking-wide ${
                    isCurrent ? "text-white" : "text-stone-200"
                  }`}
                >
                  {s.title}
                </h4>
                <p
                  className={`text-[11px] mt-1 font-sans line-clamp-1 ${
                    isCurrent ? "text-stone-300" : "text-stone-400"
                  }`}
                >
                  {s.subtitle}
                </p>

                {/* Animated active golden thread bar */}
                {isCurrent && (
                  <motion.div
                    layoutId="activeStoryIndicator"
                    className="absolute bottom-0 left-4 right-4 h-1 bg-gradient-to-r from-[#e5a110] to-[#f5b92e] rounded-t-full shadow-[0_0_8px_#f5b92e]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Step Exhibition Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45 }}
            className="grid grid-cols-1 lg:grid-cols-12 glass-panel rounded-3xl overflow-hidden border border-[#e5a110]/35 shadow-2xl backdrop-blur-2xl"
          >
            {/* Image Canvas Left */}
            <div className="lg:col-span-6 relative aspect-[4/3] lg:aspect-auto min-h-[380px] bg-stone-900 border-r border-white/10">
              <Image
                src={steps[activeStep].image}
                alt={steps[activeStep].title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#f5b92e] block drop-shadow-[0_0_8px_rgba(245,185,46,0.5)]">
                  Artisan Fieldwork Archive
                </span>
                <span className="font-serif text-xl sm:text-2xl font-bold mt-1 block">
                  {steps[activeStep].subtitle}
                </span>
              </div>
            </div>

            {/* Narrative Content Right */}
            <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between space-y-8 bg-[#04160d]/50 backdrop-blur-xl">
              <div>
                <div className="flex items-center space-x-2 text-[#f5b92e] font-serif text-xs font-bold uppercase tracking-[0.2em] mb-2">
                  <span>Phase {steps[activeStep].number}</span>
                  <span>•</span>
                  <span>{steps[activeStep].title}</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
                  {steps[activeStep].subtitle}
                </h3>
                <p className="mt-4 text-stone-300 font-sans text-sm sm:text-base leading-relaxed">
                  {steps[activeStep].description}
                </p>

                {/* Technical Specifications */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
                  {steps[activeStep].details.map((item, i) => (
                    <div key={i} className="glass-card p-3.5 rounded-xl border border-white/10">
                      <span className="text-[10px] uppercase font-serif tracking-widest text-stone-400 block">
                        {item.label}
                      </span>
                      <span className="font-serif text-xs sm:text-sm font-semibold text-[#f5b92e] mt-1 block">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Navigation CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-xs text-stone-400 font-serif">
                  Step {activeStep + 1} of {steps.length}
                </span>
                <button
                  onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                  className="btn-loom px-6 py-3 bg-gradient-to-r from-[#e5a110] to-[#f5b92e] text-[#04160d] text-xs font-serif uppercase tracking-widest font-bold rounded-xl transition-all flex items-center space-x-2 shadow-[0_0_20px_rgba(229,161,16,0.3)] cursor-pointer"
                >
                  <span>
                    {activeStep === steps.length - 1 ? "Replay Story" : "Next Phase"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
