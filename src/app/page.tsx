"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import Hero3D from "@/components/hero/Hero3D";
import FabricExperience from "@/components/interactive/FabricExperience";
import StoryBehindThread from "@/components/interactive/StoryBehindThread";
import StyleFinderQuiz from "@/components/interactive/StyleFinderQuiz";
import ProductCard from "@/components/products/ProductCard";
import BehindTheLoom from "@/components/social/BehindTheLoom";
import InstagramGrid from "@/components/social/InstagramGrid";
import CommunityUGC from "@/components/social/CommunityUGC";
import CustomerReviews from "@/components/social/CustomerReviews";
import { Sparkles, ArrowRight, Compass, ShieldCheck, Award, Eye, Heart } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function HomePage() {
  const { products, collections } = useStore();
  const [newArrivalCategory, setNewArrivalCategory] = useState<string>("All");

  const newArrivalCategories = ["All", "Sarees", "Nightwear & Loungewear", "Women", "Festive", "Handloom"];

  const filteredNewArrivals = products.filter((p) => {
    if (newArrivalCategory === "All") return true;
    if (newArrivalCategory === "Sarees") {
      return (
        p.tags?.some((t) => t.toLowerCase().includes("saree")) ||
        p.name.toLowerCase().includes("saree")
      );
    }
    if (newArrivalCategory === "Nightwear & Loungewear") {
      return (
        p.tags?.some((t) => t.toLowerCase().includes("night") || t.toLowerCase().includes("lounge")) ||
        p.name.toLowerCase().includes("nighty") ||
        p.name.toLowerCase().includes("slip")
      );
    }
    return p.category.toLowerCase() === newArrivalCategory.toLowerCase();
  });

  const featuredProducts = products.filter((p) => p.isFeatured || p.isBestSeller);
  const featuredCollection = collections[0]; // The Heritage Series

  return (
    <div className="flex flex-col min-h-screen">
      {/* 2. Cinematic 3D Storytelling Experience */}
      <Hero3D />

      {/* TRANSITION BRIDGE: FASHION FILM -> FASHION STORE */}
      <section
        id="loom-store-start"
        className="relative bg-[#04160d] text-white pt-16 pb-20 overflow-hidden border-t border-[#f5b92e]/20"
      >
        {/* Continuous Golden Thread from 3D Scene */}
        <div className="flex flex-col items-center justify-center -mt-16 mb-8">
          <div className="w-[2px] h-24 bg-gradient-to-b from-[#f5b92e] to-[#e5a110] shadow-[0_0_12px_#f5b92e]" />
          <div className="w-3.5 h-3.5 rounded-full border border-[#f5b92e] bg-[#072618] mt-[-4px] shadow-[0_0_10px_#f5b92e] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#f5b92e]" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#072618] border border-[#f5b92e]/40 text-[#f5b92e] text-[11px] font-serif uppercase tracking-[0.25em] mb-4 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#f5b92e]" />
            <span>Curated Female Atelier</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light uppercase tracking-[0.16em] text-white leading-tight">
            NEW COLLECTION
          </h2>

          <div className="h-[1px] w-28 bg-gradient-to-r from-transparent via-[#f5b92e] to-transparent mx-auto my-5" />

          <p className="max-w-2xl mx-auto text-stone-300 font-sans text-xs sm:text-sm tracking-wider leading-relaxed">
            The golden thread continues into our latest drops — Handwoven Banarasi &amp; Kanjivaram Sarees, Pure Mulberry Silk Nighties &amp; Heirloom Loungewear designed for grace and comfort.
          </p>
        </div>
      </section>

      {/* 3. Featured Collection Spotlight: The Heritage Series */}
      {featuredCollection && (
        <section className="py-20 sm:py-28 bg-[#FAF7F2] text-stone-900 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Editorial Image Banner */}
              <div className="lg:col-span-7 relative aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl bg-stone-900 border border-stone-300">
                <Image
                  src={featuredCollection.image}
                  alt={featuredCollection.title}
                  fill
                  priority
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-6 left-6">
                  <span className="px-3.5 py-1.5 bg-[#072618]/90 text-[#f5b92e] text-[10px] font-serif uppercase tracking-[0.25em] rounded-full border border-[#e5a110]/40 shadow-lg">
                    Featured Edition
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-xs font-serif uppercase tracking-[0.2em] text-[#f5b92e]">
                    Master Weaver Guild Collection
                  </p>
                  <h3 className="font-serif text-2xl sm:text-4xl font-bold mt-1">
                    {featuredCollection.title}
                  </h3>
                </div>
              </div>

              {/* Right Narrative & Direct CTA */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center space-x-2 text-[#072618] text-xs font-serif uppercase tracking-[0.25em]">
                  <Sparkles className="w-3.5 h-3.5 text-[#e5a110]" />
                  <span>Curated Masterpiece Drop</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#072618] leading-tight">
                  SACRED SILKS &amp; ROYAL COURT WEAVES
                </h2>

                <p className="text-sm text-stone-600 font-sans leading-relaxed">
                  Centuries of royal Indian weaving traditions preserved in Kanjivaram silks, Banarasi brocades, and Chanderi gossamers. Each piece takes between 40 to 180 uninterrupted hours of manual loom work.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white border border-stone-200">
                    <span className="text-xs text-stone-400 font-serif uppercase tracking-widest block">
                      GI Tag Verified
                    </span>
                    <span className="font-serif text-base font-bold text-[#072618] mt-1 block">
                      100% Authentic
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-stone-200">
                    <span className="text-xs text-stone-400 font-serif uppercase tracking-widest block">
                      Weaver Families
                    </span>
                    <span className="font-serif text-base font-bold text-[#072618] mt-1 block">
                      450+ Guilds
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex items-center space-x-4">
                  <Link
                    href={`/collections/${featuredCollection.slug}`}
                    className="px-8 py-3.5 bg-[#072618] hover:bg-[#0d3824] text-[#f5b92e] text-xs font-serif uppercase tracking-widest font-bold rounded-xl transition-all shadow-xl flex items-center space-x-2 group"
                  >
                    <span>Explore Heritage Series</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/about"
                    className="text-xs font-serif uppercase tracking-widest text-[#072618] hover:text-[#e5a110] font-semibold underline underline-offset-4"
                  >
                    Our Guild Ethos
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. New Arrivals (Tabbed & Responsive Grid) */}
      <section className="py-20 sm:py-28 bg-white text-stone-900 border-t border-[#efe8dc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center space-x-2 text-[#072618] text-xs font-serif uppercase tracking-[0.25em] mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#e5a110]" />
                <span>Fresh Off The Loom</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] text-[#072618]">
                NEW ARRIVALS
              </h2>
              <p className="mt-2 text-stone-600 font-sans text-xs sm:text-sm">
                Seasonal handloom drops released in limited editions directly from artisan pits.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="mt-6 md:mt-0 flex flex-wrap gap-2">
              {newArrivalCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setNewArrivalCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-serif uppercase tracking-widest transition-all ${
                    newArrivalCategory === cat
                      ? "bg-[#072618] text-[#f5b92e] font-bold shadow-md"
                      : "bg-[#FAF7F2] border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredNewArrivals.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/products?filter=new"
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-[#FAF7F2] hover:bg-[#072618] text-[#072618] hover:text-[#f5b92e] border border-stone-300 hover:border-[#072618] rounded-xl text-xs font-serif uppercase tracking-widest font-semibold transition-all shadow-sm"
            >
              <span>View All New Arrivals ({filteredNewArrivals.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Interactive Fabric / Thread section */}
      <FabricExperience />

      {/* 6. Featured Products: "CURATED FOR YOU" */}
      <section className="py-20 sm:py-28 bg-[#FAF7F2] text-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center space-x-2 text-[#072618] text-xs font-serif uppercase tracking-[0.25em] mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#e5a110]" />
                <span>The Sovereign Collection</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] text-[#072618]">
                CURATED FOR YOU
              </h2>
              <p className="mt-2 text-stone-600 font-sans text-xs sm:text-sm">
                Heirloom sarees, handspun tussar bandhgalas, and bespoke tailored separates.
              </p>
            </div>

            <Link
              href="/products"
              className="mt-6 md:mt-0 text-xs font-serif uppercase tracking-widest text-[#072618] hover:text-[#e5a110] font-semibold flex items-center space-x-1"
            >
              <span>Explore All Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. "The Story Behind The Thread" */}
      <StoryBehindThread />

      {/* 8. Collections Rail (Editorial Fashion Layout) */}
      <section className="py-20 sm:py-28 bg-white text-stone-900 border-t border-[#efe8dc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center space-x-2 text-[#072618] text-xs font-serif uppercase tracking-[0.25em] mb-2">
                <Compass className="w-3.5 h-3.5 text-[#e5a110]" />
                <span>Editorial Showcases</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] text-[#072618]">
                COLLECTIONS
              </h2>
              <p className="mt-2 text-stone-600 font-sans text-xs sm:text-sm">
                Explore handloom fashion curated by guild technique and geography.
              </p>
            </div>

            <Link
              href="/collections"
              className="mt-6 md:mt-0 text-xs font-serif uppercase tracking-widest text-[#072618] hover:text-[#e5a110] font-semibold flex items-center space-x-1"
            >
              <span>All 8 Weave Categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Editorial Grid: 1 Large + 3 Medium Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Large Card */}
            {collections[0] && (
              <Link
                href={`/collections/${collections[0].slug}`}
                className="lg:col-span-6 group relative rounded-3xl overflow-hidden aspect-[4/3] lg:aspect-auto min-h-[420px] bg-stone-900 block shadow-xl border border-stone-200"
              >
                <Image
                  src={collections[0].image}
                  alt={collections[0].title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-6 left-6">
                  <span className="px-3.5 py-1.5 bg-[#072618]/90 text-[#f5b92e] text-[10px] font-serif uppercase tracking-widest rounded-full border border-[#e5a110]/40">
                    {collections[0].tag}
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs font-serif uppercase tracking-widest text-[#f5b92e]">
                    {collections[0].subtitle}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold mt-1">
                    {collections[0].title}
                  </h3>
                  <p className="text-xs text-stone-300 font-sans mt-2 line-clamp-2 max-w-md">
                    {collections[0].description}
                  </p>
                  <div className="mt-4 flex items-center space-x-2 text-xs font-serif uppercase tracking-widest text-[#e5a110] group-hover:text-white transition-colors">
                    <span>Explore Edition ({collections[0].itemCount} Weaves)</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )}

            {/* 3 Smaller Stacked Cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              {collections.slice(1, 4).map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.slug}`}
                  className="group relative rounded-2xl overflow-hidden bg-stone-900 flex flex-col lg:flex-row items-center p-4 border border-stone-200 hover:border-[#e5a110]/60 hover:shadow-xl transition-all"
                >
                  <div className="relative w-full lg:w-44 aspect-video lg:aspect-square rounded-xl overflow-hidden shrink-0 bg-stone-800">
                    <Image
                      src={col.image}
                      alt={col.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 lg:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-stone-500 font-serif mb-1">
                        <span className="uppercase tracking-widest text-[#072618] font-semibold">
                          {col.tag}
                        </span>
                        <span>{col.itemCount} Garments</span>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-stone-900 group-hover:text-[#072618]">
                        {col.title}
                      </h4>
                      <p className="text-xs text-stone-600 mt-1 line-clamp-1 font-sans">
                        {col.subtitle}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center space-x-1 text-xs font-serif uppercase tracking-wider text-[#072618] font-bold">
                      <span>View Collection</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. Style / Product Quiz */}
      <StyleFinderQuiz />

      {/* 10. LoomLoft Community / UGC */}
      <CommunityUGC />

      {/* 11. YouTube / Behind The Loom */}
      <BehindTheLoom />

      {/* 12. Instagram ("FOLLOW THE LOOM") */}
      <InstagramGrid />

      {/* 13. Customer Reviews */}
      <CustomerReviews />
    </div>
  );
}
