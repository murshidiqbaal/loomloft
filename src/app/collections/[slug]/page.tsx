"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/products/ProductCard";
import { ChevronRight, Sparkles, ArrowLeft } from "lucide-react";

export default function CollectionDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { collections, products } = useStore();

  const collection = collections.find((c) => c.slug === slug) || collections[0];

  // Match products by collection or title
  const matchingProducts = products.filter(
    (p) =>
      p.collection.toLowerCase() === collection.title.toLowerCase() ||
      collection.slug.includes(p.collection.toLowerCase().replace(/\s+/g, "-")) ||
      p.collection.toLowerCase().includes(collection.title.toLowerCase())
  );

  const displayProducts = matchingProducts.length > 0 ? matchingProducts : products.slice(0, 4);

  return (
    <div className="bg-[#FAF7F2] text-stone-900 min-h-screen pb-20">
      {/* Hero Banner for Collection */}
      <div className="relative min-h-[50vh] flex items-end bg-[#072618] text-white overflow-hidden py-16">
        <Image
          src={collection.image}
          alt={collection.title}
          fill
          priority
          className="object-cover opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04160d] via-[#072618]/70 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center space-x-2 text-xs font-serif uppercase tracking-widest text-stone-300 mb-4">
            <Link href="/" className="hover:text-[#e5a110]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/collections" className="hover:text-[#e5a110]">Collections</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#f5b92e] font-bold">{collection.title}</span>
          </div>

          <span className="px-3.5 py-1.5 bg-[#0d3824] text-[#f5b92e] text-[10px] font-serif uppercase tracking-widest rounded-full border border-[#e5a110]/40">
            {collection.tag}
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-[0.12em] mt-3 max-w-3xl">
            {collection.title}
          </h1>

          <p className="mt-3 text-sm sm:text-base text-stone-300 font-sans max-w-2xl leading-relaxed">
            {collection.description}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex items-center justify-between pb-6 border-b border-stone-300 mb-8">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#072618]">
              Artisan Weaves in This Edition
            </h2>
            <p className="text-xs text-stone-500 font-sans mt-0.5">
              Showing {displayProducts.length} authenticated handloom creations
            </p>
          </div>

          <Link
            href="/collections"
            className="text-xs font-serif uppercase tracking-widest text-[#072618] hover:text-[#e5a110] font-semibold flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Collections</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
