"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { Search, X, ArrowRight, Sparkles, Clock, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/utils";

export default function SearchOverlay() {
  const router = useRouter();
  const {
    searchOpen,
    setSearchOpen,
    products,
    recentSearches,
    addRecentSearch,
    addToCart
  } = useStore();

  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
  }, [searchOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen, setSearchOpen]);

  const popularSearches = [
    "Kanjivaram Saree",
    "Chanderi Silk Kurta",
    "Handspun Nehru Jacket",
    "Pashmina Stole",
    "Natural Indigo",
    "Muslin Jamdani"
  ];

  const searchResults = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.fabric.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
          p.weaveTechnique.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelectSearch = (term: string) => {
    setQuery(term);
    addRecentSearch(term);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    addRecentSearch(query);
    setSearchOpen(false);
    router.push(`/products?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#04160d]/95 backdrop-blur-xl flex flex-col p-4 sm:p-8 text-cream overflow-y-auto"
        >
          {/* Top Bar with Close button */}
          <div className="max-w-5xl mx-auto w-full flex items-center justify-between pb-6 border-b border-[#e5a110]/20">
            <div className="flex items-center space-x-2 text-[#e5a110]">
              <Sparkles className="w-4 h-4" />
              <span className="font-serif text-xs uppercase tracking-[0.25em]">
                Discover LoomLoft Handlooms
              </span>
            </div>
            <button
              onClick={() => setSearchOpen(false)}
              className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              aria-label="Close search overlay"
            >
              <X className="w-6 h-6 text-[#e5a110]" />
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="max-w-5xl mx-auto w-full pt-8 pb-4">
            <form onSubmit={handleSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#e5a110]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search silks, handspuns, weaves, regions (e.g. Chanderi, Kanjivaram)..."
                className="w-full pl-14 pr-28 py-4 sm:py-5 bg-[#072618] border-2 border-[#e5a110]/40 focus:border-[#e5a110] rounded-2xl text-base sm:text-xl font-serif text-white placeholder-stone-400 tracking-wide focus:outline-none shadow-2xl transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-[#e5a110] hover:bg-[#f5b92e] text-[#04160d] text-xs font-serif font-bold uppercase tracking-wider rounded-xl transition-all"
              >
                Search
              </button>
            </form>
          </div>

          {/* Main Body */}
          <div className="max-w-5xl mx-auto w-full py-6 flex-1">
            {!query.trim() ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                {/* Popular Searches */}
                <div className="space-y-3">
                  <h3 className="font-serif text-xs uppercase tracking-[0.2em] text-[#e5a110] font-semibold">
                    Popular Inquiries
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSelectSearch(term)}
                        className="px-3.5 py-2 bg-[#072618] hover:bg-[#0d3824] border border-stone-700 hover:border-[#e5a110] rounded-full text-xs text-stone-200 transition-all"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches */}
                <div className="space-y-3">
                  <h3 className="font-serif text-xs uppercase tracking-[0.2em] text-[#e5a110] font-semibold flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Recent Searches</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSelectSearch(term)}
                        className="px-3.5 py-2 bg-[#04160d] hover:bg-[#072618] border border-stone-800 hover:border-stone-600 rounded-full text-xs text-stone-300 transition-all"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-2 border-b border-stone-800">
                  <h3 className="font-serif text-sm uppercase tracking-wider text-stone-300">
                    Results for &ldquo;<span className="text-[#f5b92e]">{query}</span>&rdquo; ({searchResults.length})
                  </h3>
                  {searchResults.length > 0 && (
                    <button
                      onClick={handleSubmit}
                      className="text-xs font-serif uppercase tracking-widest text-[#e5a110] hover:text-[#f5b92e] flex items-center space-x-1"
                    >
                      <span>View All in Catalog</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {searchResults.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="font-serif text-lg text-stone-300">No woven garments matched &ldquo;{query}&rdquo;</p>
                    <p className="text-xs text-stone-500 mt-2">
                      Try exploring our categories: Festive, Handloom, Men, Women, or Silk.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        className="bg-[#072618] border border-stone-800 hover:border-[#e5a110]/60 rounded-2xl p-3 transition-all group flex flex-col justify-between"
                      >
                        <Link
                          href={`/products/${product.slug}`}
                          onClick={() => setSearchOpen(false)}
                          className="block"
                        >
                          <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-stone-900 mb-3">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {product.badge && (
                              <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#04160d]/90 text-[#f5b92e] text-[9px] font-serif uppercase tracking-widest rounded-md border border-[#e5a110]/30">
                                {product.badge}
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif text-xs font-medium text-white group-hover:text-[#e5a110] transition-colors line-clamp-1">
                            {product.name}
                          </h4>
                          <p className="text-[10px] text-stone-400 mt-0.5 line-clamp-1">{product.fabric}</p>
                          <div className="mt-2 font-serif text-sm font-semibold text-[#f5b92e]">
                            {formatPrice(product.price)}
                          </div>
                        </Link>
                        <button
                          onClick={() => {
                            addToCart(product);
                            setSearchOpen(false);
                          }}
                          className="mt-3 w-full py-2 bg-[#0d3824] hover:bg-[#e5a110] hover:text-[#04160d] text-[#e5a110] rounded-lg text-[10px] font-serif uppercase tracking-widest transition-colors font-semibold"
                        >
                          Add to Bag
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
