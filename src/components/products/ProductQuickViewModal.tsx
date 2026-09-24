"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { Product } from "@/data/mockData";
import { formatPrice } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Heart,
  ShoppingBag,
  Star,
  Check,
  Shield,
  Layers,
  ArrowRight
} from "lucide-react";

export default function ProductQuickViewModal() {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist
  } = useStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!quickViewProduct) return null;

  const currentSize = selectedSize || quickViewProduct.sizes[0] || "Standard";
  const currentColor = selectedColor || quickViewProduct.colors[0]?.name || "Standard";
  const isWish = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, currentSize, currentColor, 1);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      setQuickViewProduct(null);
    }, 900);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-[#072618] border border-[#e5a110]/40 rounded-3xl overflow-hidden shadow-2xl text-cream z-10 my-8"
        >
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-20 p-2 bg-[#04160d]/80 rounded-full text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-[#e5a110]" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery Left */}
            <div className="p-6 bg-[#04160d]/60 flex flex-col justify-between">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-stone-900 border border-stone-800">
                <Image
                  src={quickViewProduct.images[selectedImage] || quickViewProduct.images[0]}
                  alt={quickViewProduct.name}
                  fill
                  className="object-cover"
                />
                {quickViewProduct.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-[#04160d]/90 text-[#f5b92e] text-[10px] font-serif uppercase tracking-widest rounded-md border border-[#e5a110]/40">
                    {quickViewProduct.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {quickViewProduct.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                  {quickViewProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-16 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        selectedImage === idx ? "border-[#e5a110]" : "border-stone-800 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt="thumbnail" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Right */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="font-serif uppercase tracking-widest text-[#e5a110]">
                    {quickViewProduct.collection}
                  </span>
                  <div className="flex items-center space-x-1 text-[#f5b92e]">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-semibold text-white">{quickViewProduct.rating}</span>
                    <span className="text-stone-400">({quickViewProduct.reviewCount})</span>
                  </div>
                </div>

                <h2 className="font-serif text-2xl font-bold text-white mt-2 leading-tight">
                  {quickViewProduct.name}
                </h2>
                <p className="text-xs text-stone-300 mt-1 font-sans">{quickViewProduct.fabric}</p>

                {/* Price */}
                <div className="flex items-baseline space-x-3 mt-4">
                  <span className="font-serif text-2xl font-bold text-[#f5b92e]">
                    {formatPrice(quickViewProduct.price)}
                  </span>
                  {quickViewProduct.originalPrice && (
                    <span className="text-stone-400 line-through text-sm font-serif">
                      {formatPrice(quickViewProduct.originalPrice)}
                    </span>
                  )}
                  {quickViewProduct.discount && (
                    <span className="px-2 py-0.5 bg-[#e5a110]/20 text-[#f5b92e] text-xs font-semibold rounded">
                      {quickViewProduct.discount}
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-300 mt-4 leading-relaxed line-clamp-3">
                  {quickViewProduct.description}
                </p>

                {/* Color Variants */}
                <div className="mt-5">
                  <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-2">
                    Select Shade: <strong className="text-[#f5b92e]">{currentColor}</strong>
                  </label>
                  <div className="flex items-center space-x-3">
                    {quickViewProduct.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-7 h-7 rounded-full border-2 transition-all relative flex items-center justify-center ${
                          currentColor === color.name
                            ? "border-[#f5b92e] scale-110 shadow-md"
                            : "border-transparent opacity-80 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {currentColor === color.name && (
                          <Check className="w-3.5 h-3.5 text-white drop-shadow" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Options */}
                <div className="mt-5">
                  <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-2">
                    Select Size: <strong className="text-white">{currentSize}</strong>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-serif tracking-wider uppercase transition-all ${
                          currentSize === sz
                            ? "bg-[#e5a110] text-[#04160d] font-bold shadow-md"
                            : "bg-[#04160d] border border-stone-700 text-stone-200 hover:border-[#e5a110]"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-stone-800 space-y-3">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={addedAnimation}
                    className={`flex-1 py-3.5 rounded-xl font-serif text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-2 ${
                      addedAnimation
                        ? "bg-emerald-500 text-white"
                        : "bg-[#e5a110] hover:bg-[#f5b92e] text-[#04160d] shadow-lg"
                    }`}
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => toggleWishlist(quickViewProduct)}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isWish
                        ? "bg-rose-950/40 border-rose-500 text-rose-400"
                        : "bg-[#04160d] border-stone-700 text-stone-300 hover:text-[#e5a110] hover:border-[#e5a110]"
                    }`}
                    aria-label="Toggle wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isWish ? "fill-current" : ""}`} />
                  </button>
                </div>

                <Link
                  href={`/products/${quickViewProduct.slug}`}
                  onClick={() => setQuickViewProduct(null)}
                  className="w-full py-2 flex items-center justify-center space-x-1 text-xs font-serif uppercase tracking-widest text-stone-300 hover:text-[#e5a110] transition-colors"
                >
                  <span>View Complete Artisan Story & Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
