"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  return (
    <div className="bg-[#FAF7F2] text-stone-900 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-[#072618] text-xs font-serif uppercase tracking-[0.25em] mb-2">
            <Heart className="w-3.5 h-3.5 text-[#e5a110] fill-current" />
            <span>Saved Handloom Desires</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] text-[#072618]">
            YOUR WISHLIST ({wishlist.length})
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-stone-600 font-sans">
            Pieces you have saved to cherish. Woven in limited batches directly from master artisan looms.
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-16 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto text-stone-400 mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs text-stone-500 mt-2 font-sans leading-relaxed">
              Explore our Chanderi silks, handspun tussar bandhgalas, and Kanjivaram heirlooms and click the heart icon to save them here.
            </p>
            <Link
              href="/collections"
              className="mt-6 inline-flex items-center space-x-2 px-6 py-3 bg-[#072618] text-[#f5b92e] text-xs font-serif uppercase tracking-widest font-semibold rounded-xl shadow-md"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-[#e5a110]/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[3/4] w-full bg-stone-100">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-rose-600 hover:bg-white transition-colors shadow-md"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4">
                    <span className="text-[10px] font-serif uppercase tracking-widest text-[#072618] font-semibold">
                      {product.collection}
                    </span>
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-serif text-sm font-semibold text-stone-900 hover:text-[#072618] mt-1 line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-[11px] text-stone-500 mt-0.5 font-sans line-clamp-1">
                      {product.fabric}
                    </p>
                    <div className="mt-3 font-serif text-base font-bold text-[#072618]">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => {
                      addToCart(product);
                    }}
                    className="w-full py-2.5 bg-[#072618] hover:bg-[#0d3824] text-[#f5b92e] text-xs font-serif uppercase tracking-widest font-semibold rounded-xl transition-all flex items-center justify-center space-x-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
