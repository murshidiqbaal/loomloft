"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { Layers, Plus, Trash2, Edit, Check, X, Sparkles } from "lucide-react";

export default function AdminCollectionsPage() {
  const { collections, showToast } = useStore();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-800 gap-4">
        <div>
          <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#f5b92e] font-semibold">
            Weaver Archives
          </span>
          <h1 className="font-serif text-3xl font-bold uppercase tracking-wider text-white mt-1">
            COLLECTION EDITIONS ({collections.length})
          </h1>
          <p className="text-xs text-stone-400 font-sans mt-0.5">
            Organize textiles into editorial storylines and royal court archives.
          </p>
        </div>

        <button
          onClick={() => {
            showToast("New collection modal initialized", "info");
          }}
          className="px-5 py-3 bg-[#e5a110] hover:bg-[#f5b92e] text-[#04160d] text-xs font-serif font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Collection</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            className="bg-[#072618] border border-stone-800 hover:border-[#e5a110]/50 rounded-3xl p-5 flex flex-col justify-between shadow-xl transition-all"
          >
            <div>
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-4 bg-stone-900 border border-stone-800">
                <Image src={col.image} alt={col.title} fill className="object-cover" />
                <span className="absolute top-3 left-3 px-3 py-1 bg-[#04160d]/90 text-[#f5b92e] text-[9px] font-serif uppercase tracking-widest rounded-md border border-[#e5a110]/40">
                  {col.tag}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-400 font-serif mb-1">
                <span>Slug: /{col.slug}</span>
                <span className="text-[#f5b92e] font-semibold">{col.itemCount} Garments</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-white mt-1">{col.title}</h3>
              <p className="text-xs text-stone-300 font-sans mt-1.5 leading-relaxed line-clamp-2">
                {col.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between">
              <span className="text-[11px] font-serif uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Live on Storefront</span>
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => showToast(`Editing collection ${col.title}`, "info")}
                  className="p-1.5 rounded-lg bg-[#04160d] text-stone-300 hover:text-[#f5b92e] border border-stone-800"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
