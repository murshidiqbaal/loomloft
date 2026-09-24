"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, RotateCcw, Check, ShoppingBag, Heart } from "lucide-react";

export default function StyleFinderQuiz() {
  const { products, addToCart, toggleWishlist, isInWishlist } = useStore();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{
    style?: string;
    occasion?: string;
    palette?: string;
    fabric?: string;
  }>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const questions = [
    {
      id: "style",
      title: "What aesthetic calls to your personal style?",
      subtitle: "Select the design philosophy that reflects your wardrobe silhouette.",
      options: [
        { label: "Sovereign Traditional", desc: "Heirloom Kanjivarams, temple borders & royal gold zari", key: "Traditional" },
        { label: "Quiet Luxury / Minimal", desc: "Clean lines, natural slub linen, subtle band collars", key: "Minimal" },
        { label: "Contemporary Fluid", desc: "Modern wrap dresses, airy Jamdani overlays & Ikat", key: "Contemporary" },
        { label: "Grand Festive", desc: "Chanderi silk suits, ceremonial brocades & resham work", key: "Festive" }
      ]
    },
    {
      id: "occasion",
      title: "Where will this handcrafted piece accompany you?",
      subtitle: "We tailor our recommendations based on how the fabric drapes and breathes.",
      options: [
        { label: "Heirloom Weddings & Galas", desc: "Intimate heritage festivities and ceremonial rites", key: "Occasion" },
        { label: "Cultural Evenings & Dinners", desc: "Refined gatherings that appreciate artisanal conversation", key: "Ethnic" },
        { label: "Executive & Boardroom Grace", desc: "Subtle authority with tailored raw silk and fine linen", key: "Office" },
        { label: "Weekend Leisure & Travel", desc: "Effortless breathable handspuns for tropical comfort", key: "Casual" }
      ]
    },
    {
      id: "palette",
      title: "Which color resonance speaks to your aura?",
      subtitle: "Naturally extracted or mineral pigments from master dyers.",
      options: [
        { label: "Imperial Forest & Gold", desc: "Deep rich emerald green, mustard ochre and warm zari", key: "Forest", swatch: "#072618" },
        { label: "Earth & Fermented Indigo", desc: "Mineral blue, desert madder rust and vegetable dyes", key: "Indigo", swatch: "#112432" },
        { label: "Sunlit Saffron & Marigold", desc: "Warm haldi tones, bright saffron and glowing amber", key: "Mustard", swatch: "#e5a110" },
        { label: "Pristine Ivory & Cloud", desc: "Unbleached raw silk, ivory muslin and natural ecru", key: "Ivory", swatch: "#FAF7F2" }
      ]
    },
    {
      id: "fabric",
      title: "What hand-feel do you seek to touch?",
      subtitle: "The tactile heartbeat of our handloom weaver guilds.",
      options: [
        { label: "Gossamer Chanderi Silk", desc: "Featherlight, translucent, shimmering gold butis", key: "Chanderi" },
        { label: "Heavy Korvai Mulberry Silk", desc: "Rich structured drape with regal temple borders", key: "Mulberry" },
        { label: "Handspun Desi Tussar Raw Silk", desc: "Textured slubs celebrating amber charkha threads", key: "Tussar" },
        { label: "Organic European Flax Linen", desc: "Aerated breathability that softens with every wash", key: "Linen" }
      ]
    }
  ];

  const handleSelectOption = (key: string) => {
    const qKey = questions[currentQuestion].id as keyof typeof answers;
    const newAnswers = { ...answers, [qKey]: key };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
  };

  // Score recommendations based on answers
  const recommendedProducts = products
    .filter((p) => {
      if (answers.fabric && p.fabric.toLowerCase().includes(answers.fabric.toLowerCase())) return true;
      if (answers.style && p.category.toLowerCase().includes(answers.style.toLowerCase())) return true;
      if (answers.palette && p.colors.some((c) => c.name.toLowerCase().includes(answers.palette?.toLowerCase() || ""))) return true;
      return true;
    })
    .slice(0, 3);

  return (
    <section className="py-24 bg-[#072618] text-white relative overflow-hidden border-t border-[#e5a110]/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 text-[#e5a110] text-xs font-serif uppercase tracking-[0.25em] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Artisanal Fashion Consultation</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-[0.14em] text-white">
            FIND YOUR LOOMLOFT STYLE
          </h2>
          <p className="mt-3 text-stone-300 font-sans text-xs sm:text-sm leading-relaxed">
            Answer 4 intuitive questions. Our master curators will match your silhouette and temperament to the right weaver guild.
          </p>
        </div>

        {/* Quiz Window */}
        <div className="bg-[#04160d] border border-[#e5a110]/35 rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden">
          {!isCompleted ? (
            <div>
              {/* Progress bar */}
              <div className="flex items-center justify-between text-xs font-serif uppercase tracking-widest text-[#f5b92e] mb-4">
                <span>
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span>
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Curated
                </span>
              </div>
              <div className="w-full bg-[#072618] h-1.5 rounded-full overflow-hidden mb-8 border border-stone-800">
                <div
                  className="h-full bg-gradient-to-r from-[#e5a110] to-[#f5b92e] transition-all duration-400"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Current Question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-2">
                    {questions[currentQuestion].title}
                  </h3>
                  <p className="text-xs text-stone-400 font-sans mb-8">
                    {questions[currentQuestion].subtitle}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {questions[currentQuestion].options.map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => handleSelectOption(opt.key)}
                        className="p-5 rounded-2xl bg-[#072618] hover:bg-[#0d3824] border border-stone-800 hover:border-[#e5a110] text-left transition-all group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="font-serif text-base font-semibold text-white group-hover:text-[#f5b92e] transition-colors">
                              {opt.label}
                            </h4>
                            {"swatch" in opt && (
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-stone-600"
                                style={{ backgroundColor: opt.swatch }}
                              />
                            )}
                          </div>
                          <p className="text-xs text-stone-400 mt-2 font-sans leading-relaxed">
                            {opt.desc}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center space-x-1 text-[11px] font-serif uppercase tracking-wider text-[#e5a110] opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Select this weave</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            /* Results Screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#072618] border border-[#e5a110] text-[#f5b92e] mb-2 shadow-xl">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#e5a110] block mb-1">
                  Your Bespoke Recommendation
                </span>
                <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white">
                  YOUR LOOMLOFT PICKS
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 font-sans max-w-lg mx-auto mt-2 leading-relaxed">
                  Based on your preference for <strong>{answers.style}</strong> aesthetics and <strong>{answers.fabric}</strong> handloom tactile drape, here are your matching curator selections:
                </p>
              </div>

              {/* Curated Product Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
                {recommendedProducts.map((p) => {
                  const isWish = isInWishlist(p.id);
                  return (
                    <div
                      key={p.id}
                      className="bg-[#072618] border border-stone-800 rounded-2xl p-3.5 flex flex-col justify-between hover:border-[#e5a110] transition-colors"
                    >
                      <div>
                        <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden mb-3 bg-stone-900">
                          <Image
                            src={p.images[0]}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h4 className="font-serif text-sm font-semibold text-white line-clamp-1">
                          {p.name}
                        </h4>
                        <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">
                          {p.fabric}
                        </p>
                        <div className="mt-2 font-serif text-base font-bold text-[#f5b92e]">
                          {formatPrice(p.price)}
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => addToCart(p)}
                          className="flex-1 py-2 bg-[#e5a110] hover:bg-[#f5b92e] text-[#04160d] text-[10px] font-serif uppercase tracking-widest font-bold rounded-lg transition-colors flex items-center justify-center space-x-1"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </button>
                        <button
                          onClick={() => toggleWishlist(p)}
                          className={`p-2 border rounded-lg transition-colors ${
                            isWish
                              ? "bg-rose-950/40 border-rose-500 text-rose-400"
                              : "border-stone-700 text-stone-300 hover:text-[#f5b92e]"
                          }`}
                          aria-label="Wishlist"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isWish ? "fill-current" : ""}`} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={resetQuiz}
                  className="px-6 py-3 rounded-xl border border-stone-700 hover:border-[#e5a110] text-stone-300 hover:text-white text-xs font-serif uppercase tracking-widest transition-colors flex items-center space-x-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Style Consultation</span>
                </button>
                <Link
                  href="/collections"
                  className="px-8 py-3 rounded-xl bg-[#e5a110] hover:bg-[#f5b92e] text-[#04160d] text-xs font-serif uppercase tracking-widest font-bold transition-all shadow-xl"
                >
                  Explore Complete Weaves
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
