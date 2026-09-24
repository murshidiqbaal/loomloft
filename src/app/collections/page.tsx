"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { Sparkles, ArrowRight, Compass } from "lucide-react";

export default function CollectionsPage() {
  const { collections } = useStore();

  return (
    <div className="bg-[#FAF7F2] text-stone-900 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-[#072618] text-xs font-serif uppercase tracking-[0.25em] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#e5a110]" />
            <span>Master Weaver Archives</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold uppercase tracking-[0.14em] text-[#072618]">
            THE COLLECTIONS
          </h1>
          <p className="mt-4 text-sm sm:text-base text-stone-600 font-sans leading-relaxed">
            Curated archives of sovereign handloom textiles grouped by origin guild, botanical dye philosophies, and royal court weaves.
          </p>
        </div>

        {/* Collections Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {collections.map((col, idx) => (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-stone-900 shadow-xl border border-stone-200 block"
            >
              <Image
                src={col.image}
                alt={col.title}
                fill
                priority={idx < 2}
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              <div className="absolute top-6 left-6">
                <span className="px-3.5 py-1.5 bg-[#072618]/90 text-[#f5b92e] text-[10px] font-serif uppercase tracking-widest rounded-full border border-[#e5a110]/40 shadow-lg">
                  {col.tag}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs font-serif uppercase tracking-widest text-[#f5b92e]">
                  {col.subtitle}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-1">
                  {col.title}
                </h2>
                <p className="text-xs text-stone-300 font-sans mt-2 line-clamp-2 max-w-md leading-relaxed">
                  {col.description}
                </p>

                <div className="mt-4 flex items-center space-x-2 text-xs font-serif uppercase tracking-widest text-[#e5a110] group-hover:text-white transition-colors">
                  <span>Explore Collection ({col.itemCount} Weaves)</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
