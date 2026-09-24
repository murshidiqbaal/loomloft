"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/mockData";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { Heart, Eye, ShoppingBag, Check } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useStore();
  const [hovered, setHovered] = useState(false);
  const [activeColor, setActiveColor] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const isWish = isInWishlist(product.id);
  const hasSecondaryImage = product.images.length > 1;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes[0], product.colors[activeColor]?.name, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      data-cursor="product"
      className="group relative flex flex-col bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#efe8dc] hover:border-[#e5a110]/50 hover:shadow-2xl transition-all duration-500"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top Image Canvas */}
      <Link href={`/products/${product.slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-stone-200 block">
        {/* Main Image */}
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            hovered && hasSecondaryImage ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Secondary Hover Image */}
        {hasSecondaryImage && (
          <Image
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-all duration-700 ease-out group-hover:scale-105 absolute inset-0 ${
              hovered ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />
        )}

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-[#04160d]/90 text-[#f5b92e] text-[9px] font-serif uppercase tracking-[0.2em] rounded-md border border-[#e5a110]/30 shadow-md">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
            isWish
              ? "bg-[#072618] text-[#f5b92e] shadow-lg"
              : "bg-white/80 hover:bg-[#072618] text-stone-700 hover:text-[#f5b92e]"
          }`}
          aria-label={isWish ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWish ? "fill-current" : ""}`} />
        </button>

        {/* Quick View Floating Action (Desktop Hover) */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hidden sm:flex gap-2">
          <button
            onClick={handleQuickView}
            className="flex-1 py-2.5 bg-[#072618]/90 hover:bg-[#072618] text-[#f5b92e] text-[10px] font-serif uppercase tracking-[0.2em] rounded-xl flex items-center justify-center space-x-1.5 backdrop-blur-md border border-[#e5a110]/30 shadow-xl transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
          <button
            onClick={handleQuickAdd}
            disabled={justAdded}
            className="p-2.5 bg-[#e5a110] hover:bg-[#f5b92e] text-[#04160d] rounded-xl shadow-xl transition-all"
            title="Quick add to bag"
            aria-label="Quick add to bag"
          >
            {justAdded ? (
              <Check className="w-4 h-4 text-[#04160d]" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </Link>

      {/* Info Section */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
        <div>
          {/* Collection & Color Swatches */}
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase font-serif tracking-[0.2em] text-[#0d3824] font-medium">
              {product.collection}
            </span>
            {/* Color preview dots */}
            <div className="flex items-center space-x-1">
              {product.colors.map((c, i) => (
                <button
                  key={c.name}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveColor(i);
                  }}
                  className={`w-2.5 h-2.5 rounded-full border transition-all ${
                    activeColor === i
                      ? "border-[#072618] scale-125"
                      : "border-stone-400 opacity-70"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                  aria-label={`Select ${c.name} color`}
                />
              ))}
            </div>
          </div>

          <Link href={`/products/${product.slug}`} className="block group-hover:text-[#072618]">
            <h3 className="font-serif text-sm sm:text-base font-semibold text-stone-900 leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-[11px] text-stone-700 mt-1 font-sans line-clamp-1">
            {product.fabric} • {product.origin}
          </p>
        </div>

        {/* Price & Mobile Add Button */}
        <div className="mt-4 pt-3 border-t border-[#efe8dc] flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="font-serif text-base sm:text-lg font-bold text-[#072618]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] text-stone-600 line-through font-serif">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Mobile Tap-Friendly Add Button */}
          <button
            onClick={handleQuickAdd}
            className="sm:hidden p-2 bg-[#072618] text-[#f5b92e] rounded-lg text-xs"
            aria-label="Add to bag"
          >
            {justAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
