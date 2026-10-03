"use client";

import React, { useState, useEffect } from "react";
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

  // Track completion of the 3D scroll hero animation
  const [heroAnimCompleted, setHeroAnimCompleted] = useState<boolean>(false);
  const [scrolledPastHero, setScrolledPastHero] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroTrack = document.getElementById("loom-story-track");
      if (!heroTrack) {
        setScrolledPastHero(true);
        return;
      }
      const rect = heroTrack.getBoundingClientRect();
      // True only once the bottom of the hero track reaches the viewport (animation completed)
      setScrolledPastHero(rect.bottom <= window.innerHeight + 80);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const isHeroCompleted = heroAnimCompleted || scrolledPastHero;

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
      <div className="relative z-20">
        <Hero3D onAnimationComplete={setHeroAnimCompleted} />
      </div>

      {/* ============================================================
          ATELIER STOREFRONT: GLASSMORPHISM WITH CLEAN BACKGROUND IMAGE
          ============================================================ */}
      <div className="relative w-full overflow-hidden bg-[#020b06] text-white">
        {/* Clean Luxury Indian Silk Background Image Layer - ONLY SHOWN AFTER LANDING PAGE ANIMATION COMPLETED */}
        <div
          className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000 ease-out ${
            isHeroCompleted ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={!isHeroCompleted}
        >
          <Image
            src="/images/clean-atelier-bg.jpg"
            alt="LoomLoft Luxury Silk Atelier Background"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center opacity-45 brightness-90 scale-105"
          />
          {/* Subtle Ambient Vignette & Glowing Glass Orbs */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020b06]/95 via-[#03130b]/75 to-[#020b06]/95" />
          <div className="absolute top-1/4 left-1/5 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-[140px] animate-orb-1" />
          <div className="absolute bottom-1/3 right-1/4 w-[550px] h-[550px] bg-[#e5a110]/12 rounded-full blur-[160px] animate-orb-2" />
        </div>

        <div className="relative z-10">
          {/* TRANSITION BRIDGE: FASHION FILM -> FASHION STORE */}
          <section
            id="loom-store-start"
            className="relative pt-24 pb-20 overflow-hidden text-center"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-pill-gold text-[#f5b92e] text-[11px] font-serif uppercase tracking-[0.25em] mb-4 shadow-lg backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-[#f5b92e]" />
                <span>Curated Female Atelier</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light uppercase tracking-[0.16em] text-white leading-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
                NEW COLLECTION
              </h2>

              <div className="h-[1px] w-28 bg-gradient-to-r from-transparent via-[#f5b92e] to-transparent mx-auto my-5 shadow-[0_0_8px_#f5b92e]" />

              <p className="max-w-2xl mx-auto text-stone-300 font-sans text-xs sm:text-sm tracking-wider leading-relaxed">
                The golden thread continues into our latest drops — Handwoven Banarasi &amp; Kanjivaram Sarees, Pure Mulberry Silk Nighties &amp; Heirloom Loungewear designed for grace and comfort.
              </p>
            </div>
          </section>

          {/* 3. Featured Collection Spotlight: The Heritage Series */}
          {featuredCollection && (
            <section className="py-20 sm:py-28 relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="glass-panel rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#e5a110]/35 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Left Editorial Image Banner */}
                    <div className="lg:col-span-7 relative aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl bg-stone-900 border border-[#e5a110]/30 group">
                      <Image
                        src={featuredCollection.image}
                        alt={featuredCollection.title}
                        fill
                        priority
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                      <div className="absolute top-6 left-6">
                        <span className="px-3.5 py-1.5 glass-pill-gold text-[#f5b92e] text-[10px] font-serif uppercase tracking-[0.25em] rounded-full font-semibold shadow-lg">
                          Featured Edition
                        </span>
                      </div>
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <p className="text-xs font-serif uppercase tracking-[0.2em] text-[#f5b92e] drop-shadow-[0_0_8px_rgba(245,185,46,0.6)]">
                          Master Weaver Guild Collection
                        </p>
                        <h3 className="font-serif text-2xl sm:text-4xl font-bold mt-1">
                          {featuredCollection.title}
                        </h3>
                      </div>
                    </div>

                    {/* Right Narrative & Direct CTA */}
                    <div className="lg:col-span-5 space-y-6">
                      <div className="inline-flex items-center space-x-2 text-[#f5b92e] text-xs font-serif uppercase tracking-[0.25em] px-3 py-1 rounded-full glass-pill-gold">
                        <Sparkles className="w-3.5 h-3.5 text-[#e5a110]" />
                        <span>Curated Masterpiece Drop</span>
                      </div>

                      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                        SACRED SILKS &amp; ROYAL COURT WEAVES
                      </h2>

                      <p className="text-sm text-stone-300 font-sans leading-relaxed">
                        Centuries of royal Indian weaving traditions preserved in Kanjivaram silks, Banarasi brocades, and Chanderi gossamers. Each piece takes between 40 to 180 uninterrupted hours of manual loom work.
                      </p>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="p-4 rounded-2xl glass-card border border-white/10">
                          <span className="text-xs text-stone-400 font-serif uppercase tracking-widest block">
                            GI Tag Verified
                          </span>
                          <span className="font-serif text-base font-bold text-[#f5b92e] mt-1 block">
                            100% Authentic
                          </span>
                        </div>
                        <div className="p-4 rounded-2xl glass-card border border-white/10">
                          <span className="text-xs text-stone-400 font-serif uppercase tracking-widest block">
                            Weaver Families
                          </span>
                          <span className="font-serif text-base font-bold text-[#f5b92e] mt-1 block">
                            450+ Guilds
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 flex items-center space-x-4">
                        <Link
                          href={`/collections/${featuredCollection.slug}`}
                          className="btn-loom px-8 py-3.5 bg-gradient-to-r from-[#e5a110] to-[#f5b92e] text-[#04160d] text-xs font-serif uppercase tracking-widest font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(229,161,16,0.3)] flex items-center space-x-2 group"
                        >
                          <span>Explore Heritage Series</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                          href="/about"
                          className="text-xs font-serif uppercase tracking-widest text-stone-300 hover:text-[#f5b92e] font-semibold underline underline-offset-4 transition-colors"
                        >
                          Our Guild Ethos
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 4. New Arrivals (Tabbed & Responsive Grid) */}
          <section className="py-20 sm:py-28 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                <div>
                  <div className="inline-flex items-center space-x-2 text-[#f5b92e] text-xs font-serif uppercase tracking-[0.25em] mb-2 px-3 py-1 rounded-full glass-pill-gold">
                    <Sparkles className="w-3.5 h-3.5 text-[#e5a110]" />
                    <span>Fresh Off The Loom</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                    NEW ARRIVALS
                  </h2>
                  <p className="mt-2 text-stone-300 font-sans text-xs sm:text-sm">
                    Seasonal handloom drops released in limited editions directly from artisan pits.
                  </p>
                </div>

                {/* Category Filter Tabs */}
                <div className="mt-6 md:mt-0 flex flex-wrap gap-2">
                  {newArrivalCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setNewArrivalCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-serif uppercase tracking-widest transition-all cursor-pointer ${
                        newArrivalCategory === cat
                          ? "bg-gradient-to-r from-[#e5a110] to-[#f5b92e] text-[#04160d] font-bold shadow-[0_0_15px_rgba(229,161,16,0.3)]"
                          : "glass-pill text-stone-300 hover:text-white hover:border-white/20"
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
                  <ProductCard key={product.id} product={product} variant="glass" />
                ))}
              </div>

              <div className="text-center mt-12">
                <Link
                  href="/products?filter=new"
                  className="btn-loom inline-flex items-center space-x-2 px-8 py-3.5 glass-panel hover:bg-[#072618] text-[#f5b92e] hover:text-white border border-[#e5a110]/35 rounded-xl text-xs font-serif uppercase tracking-widest font-semibold transition-all shadow-lg"
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
          <section className="py-20 sm:py-28 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                <div>
                  <div className="inline-flex items-center space-x-2 text-[#f5b92e] text-xs font-serif uppercase tracking-[0.25em] mb-2 px-3 py-1 rounded-full glass-pill-gold">
                    <Sparkles className="w-3.5 h-3.5 text-[#e5a110]" />
                    <span>The Sovereign Collection</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                    CURATED FOR YOU
                  </h2>
                  <p className="mt-2 text-stone-300 font-sans text-xs sm:text-sm">
                    Heirloom sarees, handspun tussar bandhgalas, and bespoke tailored separates.
                  </p>
                </div>

                <Link
                  href="/products"
                  className="mt-6 md:mt-0 text-xs font-serif uppercase tracking-widest text-[#f5b92e] hover:text-white font-semibold flex items-center space-x-1.5 transition-colors"
                >
                  <span>Explore All Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} variant="glass" />
                ))}
              </div>
            </div>
          </section>

          {/* 7. "The Story Behind The Thread" */}
          <StoryBehindThread />

          {/* 8. Collections Rail (Editorial Fashion Layout) */}
          <section className="py-20 sm:py-28 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                <div>
                  <div className="inline-flex items-center space-x-2 text-[#f5b92e] text-xs font-serif uppercase tracking-[0.25em] mb-2 px-3 py-1 rounded-full glass-pill-gold">
                    <Compass className="w-3.5 h-3.5 text-[#e5a110]" />
                    <span>Editorial Showcases</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                    COLLECTIONS
                  </h2>
                  <p className="mt-2 text-stone-300 font-sans text-xs sm:text-sm">
                    Explore handloom fashion curated by guild technique and geography.
                  </p>
                </div>

                <Link
                  href="/collections"
                  className="mt-6 md:mt-0 text-xs font-serif uppercase tracking-widest text-[#f5b92e] hover:text-white font-semibold flex items-center space-x-1.5 transition-colors"
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
                    className="lg:col-span-6 group relative rounded-3xl overflow-hidden aspect-[4/3] lg:aspect-auto min-h-[440px] bg-stone-900 block shadow-2xl border border-[#e5a110]/35 glass-panel"
                  >
                    <Image
                      src={collections[0].image}
                      alt={collections[0].title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                    <div className="absolute top-6 left-6">
                      <span className="px-3.5 py-1.5 glass-pill-gold text-[#f5b92e] text-[10px] font-serif uppercase tracking-widest rounded-full font-semibold shadow-md">
                        {collections[0].tag}
                      </span>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <span className="text-xs font-serif uppercase tracking-widest text-[#f5b92e] drop-shadow-[0_0_6px_rgba(245,185,46,0.6)]">
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
                      className="group relative rounded-2xl overflow-hidden glass-card flex flex-col lg:flex-row items-center p-4 border border-[#e5a110]/20 hover:border-[#f5b92e]/60 hover:shadow-2xl transition-all"
                    >
                      <div className="relative w-full lg:w-44 aspect-video lg:aspect-square rounded-xl overflow-hidden shrink-0 bg-stone-900 border border-white/10">
                        <Image
                          src={col.image}
                          alt={col.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4 lg:p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-stone-400 font-serif mb-1">
                            <span className="uppercase tracking-widest text-[#f5b92e] font-semibold">
                              {col.tag}
                            </span>
                            <span>{col.itemCount} Garments</span>
                          </div>
                          <h4 className="font-serif text-lg font-bold text-white group-hover:text-[#f5b92e] transition-colors">
                            {col.title}
                          </h4>
                          <p className="text-xs text-stone-300 mt-1 line-clamp-1 font-sans">
                            {col.subtitle}
                          </p>
                        </div>
                        <div className="mt-3 flex items-center space-x-1 text-xs font-serif uppercase tracking-wider text-[#f5b92e] font-bold">
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
      </div>
    </div>
  );
}
