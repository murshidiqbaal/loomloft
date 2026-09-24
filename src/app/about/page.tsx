"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Feather, Compass, Scissors, ShieldCheck, HeartHandshake, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-[#FAF7F2] text-stone-900 min-h-screen">
      {/* Editorial Hero Header */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-[#072618] text-white text-center py-24 px-4 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80"
          alt="Weaver at loom"
          fill
          priority
          className="object-cover opacity-25 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04160d] via-[#072618]/70 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 text-[#e5a110] text-xs font-serif uppercase tracking-[0.25em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The LoomLoft Chronicle</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-[0.14em] text-white leading-tight">
            QUALITY IN EVERY THREAD
          </h1>

          <p className="text-sm sm:text-lg text-stone-300 font-sans max-w-2xl mx-auto leading-relaxed">
            We are guardians of India&apos;s ancient handloom guilds. No electric turbines, no factory shortcuts — only patient human rhythms and sovereign fibers.
          </p>
        </div>
      </section>

      {/* Narrative Section: "FROM THREAD TO TREND" */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-serif uppercase tracking-[0.25em] text-[#072618] font-bold">
              Our Founding Ethos
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#072618] leading-tight">
              FROM THREAD TO TREND
            </h2>
            <p className="text-sm sm:text-base text-stone-600 font-sans leading-relaxed">
              In an age overwhelmed by disposable fast fashion, LoomLoft exists as an intentional rebellion. We believe that true luxury is tactile memory: the slub of an amber charkha thread, the quiet creak of a teakwood shuttle, and the golden shimmer of 24k electroplated zari that will outlive generations.
            </p>
            <p className="text-sm sm:text-base text-stone-600 font-sans leading-relaxed">
              Every garment in our archive is traceable to its weaver cluster. From Pranpur in Chanderi to the riverside vats of Ajrakhpur, we preserve sacred weaving geometry while tailoring silhouettes for modern cosmopolitan life.
            </p>

            <div className="pt-4 flex items-center space-x-6 text-xs font-serif text-[#072618] font-bold uppercase tracking-wider">
              <span>Zero Machinery</span>
              <span>•</span>
              <span>Fair Living Wages</span>
              <span>•</span>
              <span>100% Biodegradable</span>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-stone-900 border border-stone-200">
            <Image
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80"
              alt="Artisan hands weaving"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Guild Pillars */}
      <section id="artisans" className="py-24 bg-[#072618] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-serif uppercase tracking-[0.25em] text-[#e5a110] block mb-2">
              Core Principles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-wider">
              THE WEAVING COVENANT
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#04160d] border border-[#e5a110]/30 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0d3824] text-[#f5b92e] flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">Direct Artisan Equity</h3>
              <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
                We bypass all middlemen and commercial middlemen. 450+ master weaver families receive living wages, health coverage, and generational craft protection.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#04160d] border border-[#e5a110]/30 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0d3824] text-[#f5b92e] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">Geographic Indication</h3>
              <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
                Authenticity is sacred. Every piece bears registered Silk Mark and Handloom Mark tags, certifying genuine origin from Kanchipuram, Chanderi, or Srinagar.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#04160d] border border-[#e5a110]/30 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0d3824] text-[#f5b92e] flex items-center justify-center">
                <Feather className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">Zero Synthetic Chemistry</h3>
              <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
                Dyed in fermented plant vats using pomegranate peel, madder root, indigo leaves, and marigold petals. Gentle on human skin and pure to the earth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center max-w-4xl mx-auto px-4">
        <h3 className="font-serif text-3xl font-bold text-[#072618]">
          READY TO DRAPE AN HEIRLOOM?
        </h3>
        <p className="text-sm text-stone-600 font-sans mt-2 max-w-lg mx-auto">
          Explore our seasonal drops or book a bespoke bridal consultation with our master stylist.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/collections"
            className="px-8 py-3.5 bg-[#072618] text-[#f5b92e] font-serif text-xs uppercase tracking-widest font-bold rounded-xl shadow-xl flex items-center space-x-2"
          >
            <span>Explore Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="px-8 py-3.5 bg-white border border-stone-300 text-stone-800 font-serif text-xs uppercase tracking-widest rounded-xl hover:border-[#072618]"
          >
            Contact Stylist
          </Link>
        </div>
      </section>
    </div>
  );
}
