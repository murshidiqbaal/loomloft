"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, X, Sparkles, ExternalLink } from "lucide-react";
import { YouTubeIcon } from "@/components/icons/BrandIcons";

export default function BehindTheLoom() {
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  const videos = [
    {
      id: "vid-1",
      title: "The Chanderi Gold Zari Rhythm — 48 Hours in Pranpur",
      duration: "04:32",
      thumbnail: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      description: "Step into the pit-loom quarters of Master Weaver Rameshwar. Watch the shuttle interlock gossamer silk with electroplated gold.",
      cluster: "Pranpur Guild, Chanderi"
    },
    {
      id: "vid-2",
      title: "Korvai Interlocking: Two Weavers, One Saree Soul",
      duration: "06:15",
      thumbnail: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80",
      description: "The mathematical synchronicity required by two master artisans to interlock contrasting borders on a pure Kanjivaram pit loom.",
      cluster: "Kanchipuram, Tamil Nadu"
    },
    {
      id: "vid-3",
      title: "Kutch Desert River: 16 Stages of Natural Fermented Indigo",
      duration: "05:40",
      thumbnail: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
      description: "How ancient Ajrakh blocks are hand-pressed onto organic modal silk using river water, wild madder root, and fermented indigo.",
      cluster: "Ajrakhpur, Kutch"
    }
  ];

  return (
    <section className="py-24 bg-[#072618] text-white relative overflow-hidden border-t border-[#e5a110]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <div className="inline-flex items-center space-x-2 text-[#e5a110] text-xs font-serif uppercase tracking-[0.25em] mb-3">
              <YouTubeIcon className="w-4 h-4 text-red-500" />
              <span>Official YouTube Guild Channel</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] text-white">
              BEHIND THE LOOM
            </h2>
            <p className="mt-3 text-stone-300 font-sans text-sm sm:text-base max-w-xl leading-relaxed">
              Witness the raw rhythm, timber pedals, and interlocked threads documented in our weaver villages across India.
            </p>
          </div>

          <a
            href="https://www.youtube.com/@LoomLoft-Handloom"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 md:mt-0 inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#04160d] hover:bg-[#0d3824] border border-[#e5a110]/40 text-[#f5b92e] text-xs font-serif uppercase tracking-widest font-semibold transition-all group"
          >
            <span>Visit @LoomLoft-Handloom</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {videos.map((vid) => (
            <div
              key={vid.id}
              className="bg-[#04160d] border border-stone-800 hover:border-[#e5a110]/60 rounded-3xl overflow-hidden transition-all duration-300 group flex flex-col justify-between shadow-xl"
            >
              {/* Thumbnail Container */}
              <div
                className="relative aspect-video w-full overflow-hidden bg-stone-900 cursor-pointer"
                onClick={() => setActiveVideoModal(vid.title)}
              >
                <Image
                  src={vid.thumbnail}
                  alt={vid.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Duration Badge */}
                <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/80 rounded text-[10px] font-mono text-stone-200 border border-stone-700">
                  {vid.duration}
                </span>

                {/* Cluster Badge */}
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#072618]/90 text-[#f5b92e] text-[9px] font-serif uppercase tracking-widest rounded-md border border-[#e5a110]/30">
                  {vid.cluster}
                </span>

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[#e5a110] text-[#04160d] flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-[#f5b92e] transition-all">
                    <Play className="w-6 h-6 fill-current translate-x-0.5" />
                  </div>
                </div>
              </div>

              {/* Information */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-white group-hover:text-[#f5b92e] transition-colors leading-snug">
                    {vid.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-2 font-sans leading-relaxed line-clamp-2">
                    {vid.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-serif">Official Documentary</span>
                  <a
                    href="https://www.youtube.com/@LoomLoft-Handloom"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#e5a110] hover:text-[#f5b92e] font-serif uppercase tracking-wider text-[11px] font-semibold flex items-center space-x-1"
                  >
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Preview Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-[#04160d] border border-[#e5a110]/40 rounded-3xl p-6 sm:p-8 text-center text-cream">
            <button
              onClick={() => setActiveVideoModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white"
              aria-label="Close video preview"
            >
              <X className="w-5 h-5 text-[#e5a110]" />
            </button>
            <div className="w-16 h-16 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <YouTubeIcon className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-2">
              {activeVideoModal}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto mb-6">
              Experience the full 4K documentary on our official YouTube channel @LoomLoft-Handloom.
            </p>
            <a
              href="https://www.youtube.com/@LoomLoft-Handloom"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-serif uppercase tracking-widest text-xs font-bold rounded-xl transition-all shadow-xl"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Open on YouTube Channel</span>
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
