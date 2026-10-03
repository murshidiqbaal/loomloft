"use client";

import Image from "next/image";
import { ArrowUpRight, Heart, MessageSquare } from "lucide-react";
import { InstagramIcon } from "@/components/icons/BrandIcons";

export default function InstagramGrid() {
  const posts = [
    {
      id: "ig-1",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
      caption: "Golden hour over the Chanderi pit looms. Each motif interlocked thread by thread.",
      likes: "1.2k",
      comments: "48"
    },
    {
      id: "ig-2",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
      caption: "Bespoke Nehru bandhgala cut from wild unbleached Tussar slub.",
      likes: "890",
      comments: "31"
    },
    {
      id: "ig-3",
      image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80",
      caption: "The Korvai temple border locked in pure mulberry silk. An heirloom in motion.",
      likes: "2.4k",
      comments: "94"
    },
    {
      id: "ig-4",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
      caption: "Ethereal Jamdani muslin overlay. Translucent poetry for modern silhouettes.",
      likes: "1.5k",
      comments: "62"
    },
    {
      id: "ig-5",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
      caption: "Indigo fermentation in Ajrakhpur: living bacteria creating indelible blues.",
      likes: "1.8k",
      comments: "53"
    },
    {
      id: "ig-6",
      image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=600&q=80",
      caption: "Single-strand Sozni needlework on Changthangi Pashmina. 180 hours of devotion.",
      likes: "3.1k",
      comments: "112"
    }
  ];

  return (
    <section className="py-24 bg-transparent text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 text-[#f5b92e] text-xs font-serif uppercase tracking-[0.25em] mb-2 px-3 py-1 rounded-full glass-pill-gold">
              <InstagramIcon className="w-3.5 h-3.5 text-[#e5a110]" />
              <span>Visual Diary</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              FOLLOW THE LOOM
            </h2>
            <p className="mt-2 text-stone-300 font-sans text-xs sm:text-sm">
              Live dispatches from our pit-loom studios, fabric drapes, and artisan journeys.
            </p>
          </div>

          <a
            href="https://www.instagram.com/loom_loft_/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-loom mt-6 md:mt-0 inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#e5a110] to-[#f5b92e] text-[#04160d] text-xs font-serif uppercase tracking-widest font-bold transition-all group shadow-[0_0_20px_rgba(229,161,16,0.3)] cursor-pointer"
          >
            <span>Follow @loom_loft_</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* 6-Card Instagram Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {posts.map((post) => (
            <a
              key={post.id}
              href="https://www.instagram.com/loom_loft_/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden glass-card block shadow-lg border border-[#e5a110]/25 hover:border-[#f5b92e]/60 transition-all duration-500"
            >
              <Image
                src={post.image}
                alt="LoomLoft Instagram archive"
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#072618]/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 text-white">
                <div className="flex justify-end">
                  <InstagramIcon className="w-4 h-4 text-[#f5b92e]" />
                </div>
                <p className="text-[10px] text-stone-200 line-clamp-3 font-sans leading-tight">
                  {post.caption}
                </p>
                <div className="flex items-center space-x-3 text-[10px] text-[#f5b92e] font-serif">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-current" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {post.comments}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
