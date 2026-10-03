"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, Camera, Heart, Check, X } from "lucide-react";

export default function CommunityUGC() {
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

  const communityPosts = [
    {
      id: "ugc-1",
      customer: "Tara Mehra",
      location: "Bengaluru",
      handle: "@tara.weaves",
      piece: "Chanderi Silk Kurta Set in Forest Emerald",
      quote: "Wearing LoomLoft for our Diwali family gathering. The drape feels like a second skin, completely breathless and regal.",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      aspect: "aspect-[3/4]"
    },
    {
      id: "ugc-2",
      customer: "Kabir Malhotra",
      location: "Mumbai",
      handle: "@kabir.m",
      piece: "Handspun Khadi Raw Silk Nehru Bandhgala",
      quote: "Received so many inquiries about the slub texture of this jacket at the literary festival.",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      aspect: "aspect-square"
    },
    {
      id: "ugc-3",
      customer: "Dr. Radhika Nair",
      location: "Kochi",
      handle: "@radhika.nair",
      piece: "Kanjivaram Mulberry Silk Saree",
      quote: "Passed down the love for handlooms to my daughter on her graduation day. Pure Korvai mastery.",
      image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80",
      aspect: "aspect-[4/5]"
    },
    {
      id: "ugc-4",
      customer: "Siddharth & Rhea",
      location: "New Delhi",
      handle: "@sidd_rhea",
      piece: "Heritage Series Couple Trousseau",
      quote: "Choosing zero-carbon handloom for our intimate wedding was the best decision we made.",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
      aspect: "aspect-[3/4]"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <div className="inline-flex items-center space-x-2 text-[#f5b92e] text-xs font-serif uppercase tracking-[0.25em] mb-2 px-3.5 py-1 rounded-full glass-pill-gold">
              <Camera className="w-3.5 h-3.5" />
              <span>Sovereign Patron Archive</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              LOOMLOFT COMMUNITY
            </h2>
            <p className="mt-2 text-stone-300 font-sans text-xs sm:text-sm">
              Patrons around the globe draping our weaves for rites of passage, galas, and quiet rituals.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-6 md:mt-0 flex items-center space-x-3 glass-panel px-5 py-3 rounded-2xl border border-[#e5a110]/35 backdrop-blur-xl">
            <span className="text-xs font-serif tracking-wider uppercase text-[#f5b92e]">
              TAG <strong>@LOOM_LOFT_</strong> TO BE FEATURED
            </span>
          </div>
        </div>

        {/* Editorial Masonry-Style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {communityPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPhoto(post)}
              className="glass-card border border-white/10 hover:border-[#e5a110]/60 rounded-3xl overflow-hidden transition-all duration-300 group cursor-pointer shadow-2xl flex flex-col justify-between"
            >
              <div className={`relative ${post.aspect} w-full overflow-hidden bg-stone-900`}>
                <Image
                  src={post.image}
                  alt={post.customer}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-serif uppercase tracking-widest text-[#f5b92e] block drop-shadow-[0_0_8px_rgba(245,185,46,0.6)]">
                    {post.handle}
                  </span>
                  <span className="font-serif text-sm font-semibold block mt-0.5">
                    {post.customer} • {post.location}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <p className="text-xs text-stone-300 font-sans italic line-clamp-2 leading-relaxed">
                  &ldquo;{post.quote}&rdquo;
                </p>
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400">
                  <span className="truncate max-w-[180px] font-serif text-[#f5b92e]">
                    {post.piece}
                  </span>
                  <span className="text-stone-400 font-mono text-[10px] uppercase">View</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#04160d] border border-[#e5a110]/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row text-white">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-stone-300 hover:text-white"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5 text-[#e5a110]" />
            </button>
            <div className="relative aspect-[3/4] md:w-1/2 min-h-[300px]">
              <Image
                src={selectedPhoto.image}
                alt={selectedPhoto.customer}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 md:w-1/2 flex flex-col justify-between">
              <div>
                <span className="text-xs font-serif uppercase tracking-widest text-[#f5b92e]">
                  Community Spotlight
                </span>
                <h3 className="font-serif text-2xl font-bold text-white mt-1">
                  {selectedPhoto.customer}
                </h3>
                <p className="text-xs text-stone-400 font-serif">
                  {selectedPhoto.handle} • {selectedPhoto.location}
                </p>

                <div className="mt-4 p-3 rounded-xl bg-[#072618] border border-stone-800">
                  <span className="text-[10px] uppercase font-serif tracking-widest text-[#e5a110] block">
                    Featured Handloom Weave
                  </span>
                  <span className="text-xs font-serif text-white font-semibold mt-0.5 block">
                    {selectedPhoto.piece}
                  </span>
                </div>

                <p className="text-xs text-stone-300 font-sans italic mt-4 leading-relaxed">
                  &ldquo;{selectedPhoto.quote}&rdquo;
                </p>
              </div>

              <div className="pt-6 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                <span>Verified Handloom Patron</span>
                <span className="text-[#e5a110] font-serif uppercase tracking-wider">
                  #LoomLoftHeritage
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
