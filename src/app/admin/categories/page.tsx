"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Grid, Plus, Sparkles, Layers, ArrowRight } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function AdminCategoriesPage() {
  const { showToast } = useStore();

  const categories = [
    {
      id: "cat-1",
      name: "Sarees",
      slug: "sarees",
      description: "Handloom Banarasi, Kanjivaram Korvai, Chanderi Gossamers & Tussar Silks.",
      product_count: 24,
      image: "/images/products/saree-heritage-1.jpg",
      status: "ACTIVE",
    },
    {
      id: "cat-2",
      name: "Nightwear & Loungewear",
      slug: "nightwear-loungewear",
      description: "Pure Mulberry Silk nighties, handspun cotton slips, and artisanal robes.",
      product_count: 12,
      image: "/images/products/nightwear-slip-1.jpg",
      status: "ACTIVE",
    },
    {
      id: "cat-3",
      name: "Men's Heritage",
      slug: "mens-heritage",
      description: "Tussar silk bandhgalas, raw silk kurtas, and handcrafted dhotis.",
      product_count: 8,
      image: "/images/products/saree-heritage-2.jpg",
      status: "ACTIVE",
    },
    {
      id: "cat-4",
      name: "Festive & Bridal",
      slug: "festive-bridal",
      description: "High-density 24k gold zari brocades curated for weddings & ceremonies.",
      product_count: 16,
      image: "/images/products/saree-heritage-3.jpg",
      status: "ACTIVE",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e5a110]/20">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#12372a] text-[#f5b92e] border border-[#e5a110]/30 text-[10px] font-serif uppercase tracking-widest font-semibold mb-2">
            <Grid className="w-3 h-3 text-[#f5b92e]" />
            <span>Taxonomy &amp; Weave Guilds</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold uppercase tracking-wider text-white">
            WEAVE CATEGORIES ({categories.length})
          </h1>
          <p className="text-xs text-stone-400 font-sans mt-1">
            Organize catalog classifications, navigation groupings, and artisan disciplines.
          </p>
        </div>

        <button
          onClick={() => showToast("Category creation modal ready", "info")}
          className="px-5 py-2.5 bg-gradient-to-r from-[#e5a110] to-[#f5b92e] text-[#04160d] text-xs font-serif font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Category</span>
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-5 rounded-2xl bg-[#091811] border border-[#e5a110]/20 hover:border-[#f5b92e]/50 transition-all shadow-xl space-y-4 group"
          >
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/10">
              <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform" />
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                <span className="font-mono text-[#f5b92e]">{cat.product_count} Weaves</span>
                <span className="text-emerald-400 uppercase font-semibold">Active</span>
              </div>
              <h3 className="font-serif text-base font-bold text-white group-hover:text-[#f5b92e] transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
