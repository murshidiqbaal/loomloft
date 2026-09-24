"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/products/ProductCard";
import {
  Heart,
  ShoppingBag,
  Star,
  Check,
  Share2,
  Ruler,
  Shield,
  Truck,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Maximize2,
  X,
  Compass,
  Scissors,
  Feather
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const {
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addRecentlyViewed,
    showToast
  } = useStore();

  const product = products.find((p) => p.slug === slug) || products[0];

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || "Standard");
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || "Standard");
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"story" | "craft" | "care" | "reviews">("story");

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
      setSelectedSize(product.sizes[0] || "Standard");
      setSelectedColor(product.colors[0]?.name || "Standard");
      setActiveImage(0);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="py-24 text-center">
        <h2 className="font-serif text-2xl font-bold">Product not found</h2>
        <Link href="/products" className="mt-4 text-xs font-serif underline text-[#e5a110]">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isWish = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1400);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    router.push("/checkout");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Direct product link copied to clipboard", "success");
    }
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.collection === product.collection))
    .slice(0, 4);

  return (
    <div className="bg-[#FAF7F2] text-stone-900 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs font-serif uppercase tracking-widest text-stone-500 mb-8">
          <Link href="/" className="hover:text-[#072618]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/collections" className="hover:text-[#072618]">{product.collection}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#072618] font-bold truncate max-w-xs">{product.name}</span>
        </div>

        {/* 2-Column Product Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT: Image Gallery with Zoom / Thumbnails */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails Rail */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shrink-0 pb-2 md:pb-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-18 h-24 md:w-20 md:h-28 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImage === idx
                      ? "border-[#072618] shadow-md scale-102"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="preview" fill className="object-cover" />
                </button>
              ))}
            </div>

            {/* Main Stage Display */}
            <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-stone-200 border border-stone-300 shadow-xl group">
              <Image
                src={product.images[activeImage] || product.images[0]}
                alt={product.name}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Badges */}
              {product.badge && (
                <span className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-[#072618]/90 text-[#f5b92e] text-[10px] font-serif uppercase tracking-[0.2em] rounded-md border border-[#e5a110]/40 shadow-lg">
                  {product.badge}
                </span>
              )}

              {/* Fullscreen Zoom Trigger */}
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute top-4 right-4 z-10 p-2.5 bg-white/80 hover:bg-white text-stone-800 rounded-full shadow-lg backdrop-blur-md transition-colors"
                title="Fullscreen Image"
                aria-label="View Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT: Product Information & Purchase Suite */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 font-serif mb-2">
                <span className="uppercase tracking-[0.2em] text-[#072618] font-semibold">
                  {product.collection}
                </span>
                <span className="font-mono text-stone-400">SKU: {product.sku}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#072618] leading-tight">
                {product.name}
              </h1>

              {/* Ratings & Origin */}
              <div className="flex items-center space-x-3 mt-3">
                <div className="flex items-center space-x-1 text-[#e5a110]">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-sm text-stone-900">{product.rating}</span>
                  <span className="text-xs text-stone-500">({product.reviewCount} Verified Reviews)</span>
                </div>
                <span className="text-stone-300">•</span>
                <span className="text-xs font-serif text-emerald-800 font-medium">
                  {product.origin}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-3 mt-4 pt-4 border-t border-stone-200">
                <span className="font-serif text-3xl font-bold text-[#072618]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="font-serif text-base text-stone-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.discount && (
                  <span className="px-2.5 py-1 bg-[#e5a110]/20 text-[#072618] text-xs font-semibold rounded-lg font-serif">
                    {product.discount}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 mt-1 font-sans">
                Inclusive of all taxes. Free insured heritage packaging.
              </p>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
              {product.description}
            </p>

            {/* Color Swatches */}
            <div className="pt-4 border-t border-stone-200">
              <label className="block text-xs font-serif uppercase tracking-wider text-stone-700 mb-2">
                Handloom Shade: <strong className="text-[#072618]">{selectedColor}</strong>
              </label>
              <div className="flex items-center space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all relative flex items-center justify-center ${
                      selectedColor === color.name
                        ? "border-[#072618] scale-110 shadow-md"
                        : "border-stone-300 opacity-80 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor === color.name && (
                      <Check className="w-3.5 h-3.5 text-white drop-shadow" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector & Size Guide */}
            <div className="pt-4 border-t border-stone-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-serif uppercase tracking-wider text-stone-700">
                  Select Size: <strong className="text-[#072618]">{selectedSize}</strong>
                </label>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs font-serif uppercase tracking-wider text-[#072618] hover:text-[#e5a110] underline flex items-center space-x-1"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Measurement Guide</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2 rounded-xl text-xs font-serif tracking-wider uppercase transition-all ${
                      selectedSize === sz
                        ? "bg-[#072618] text-[#f5b92e] font-bold shadow-md"
                        : "bg-white border border-stone-300 text-stone-700 hover:border-[#072618]"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="pt-4 border-t border-stone-200 flex items-center space-x-4">
              <span className="text-xs font-serif uppercase tracking-wider text-stone-700">
                Quantity:
              </span>
              <div className="flex items-center border border-stone-300 rounded-xl bg-white px-2 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 py-1 text-stone-600 hover:text-[#072618]"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-stone-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 py-1 text-stone-600 hover:text-[#072618]"
                >
                  +
                </button>
              </div>
              <span className="text-xs font-sans text-stone-500">
                Only {product.stock} weaves available
              </span>
            </div>

            {/* Action Suite (Add to Cart / Buy Now / Wishlist) */}
            <div className="pt-6 border-t border-stone-200 space-y-3">
              <div className="flex items-center space-x-3">
                {/* Animated Morphing Add to Bag Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={addedSuccess}
                  className={`flex-1 py-4 rounded-2xl font-serif text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-2 shadow-xl ${
                    addedSuccess
                      ? "bg-emerald-600 text-white"
                      : "bg-[#072618] hover:bg-[#0d3824] text-[#f5b92e]"
                  }`}
                >
                  {addedSuccess ? (
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="flex items-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </motion.div>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-4 rounded-2xl border transition-all ${
                    isWish
                      ? "bg-rose-50 border-rose-300 text-rose-600"
                      : "bg-white border-stone-300 text-stone-600 hover:text-[#072618] hover:border-[#072618]"
                  }`}
                  aria-label="Wishlist toggle"
                >
                  <Heart className={`w-5 h-5 ${isWish ? "fill-current" : ""}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-4 rounded-2xl bg-white border border-stone-300 text-stone-600 hover:text-[#072618] hover:border-[#072618] transition-colors"
                  aria-label="Share product"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 bg-[#e5a110] hover:bg-[#f5b92e] text-[#04160d] font-serif font-bold uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-md"
              >
                Instant Heritage Checkout
              </button>
            </div>

            {/* Authenticity Value Badges */}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-stone-200 text-stone-700">
              <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-white border border-stone-200">
                <Shield className="w-4 h-4 text-emerald-800 shrink-0" />
                <span className="text-[11px] font-serif">100% Certified Pure Handloom</span>
              </div>
              <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-white border border-stone-200">
                <Truck className="w-4 h-4 text-[#e5a110] shrink-0" />
                <span className="text-[11px] font-serif">Complimentary Insured Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Storytelling & Craft Deep Dive Tabs */}
        <div className="mt-20 pt-12 border-t border-stone-300">
          <div className="flex border-b border-stone-300 gap-8">
            {(["story", "craft", "care", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-xs font-serif uppercase tracking-[0.2em] font-semibold transition-all relative ${
                  activeTab === tab
                    ? "text-[#072618] border-b-2 border-[#072618]"
                    : "text-stone-400 hover:text-stone-700"
                }`}
              >
                {tab === "story" && "The Story Behind The Thread"}
                {tab === "craft" && "Weaving Technique & Guild"}
                {tab === "care" && "Artisanal Care Protocol"}
                {tab === "reviews" && `Verified Reviews (${product.reviewCount})`}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === "story" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-8 rounded-3xl border border-stone-200">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-[#072618] font-serif font-bold text-sm">
                    <Feather className="w-4 h-4 text-[#e5a110]" />
                    <span>The Thread Fiber</span>
                  </div>
                  <p className="text-xs text-stone-600 font-sans leading-relaxed">
                    {product.story.thread}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-[#072618] font-serif font-bold text-sm">
                    <Scissors className="w-4 h-4 text-[#e5a110]" />
                    <span>Pit Loom Weaving</span>
                  </div>
                  <p className="text-xs text-stone-600 font-sans leading-relaxed">
                    {product.story.craft}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-[#072618] font-serif font-bold text-sm">
                    <Compass className="w-4 h-4 text-[#e5a110]" />
                    <span>Artisan Guild Note</span>
                  </div>
                  <p className="text-xs text-stone-600 font-sans leading-relaxed italic">
                    &ldquo;{product.story.artisanNote}&rdquo;
                  </p>
                </div>
              </div>
            )}

            {activeTab === "craft" && (
              <div className="bg-white p-8 rounded-3xl border border-stone-200 space-y-4">
                <h4 className="font-serif text-lg font-bold text-[#072618]">
                  Weave Architecture: {product.weaveTechnique}
                </h4>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans max-w-2xl">
                  Constructed by generational artisans in {product.origin}. No computerized or synthetic electric looms were utilized in creating this textile. Every single thread tension was calibrated manually to produce natural breathe and fluidity.
                </p>
              </div>
            )}

            {activeTab === "care" && (
              <div className="bg-white p-8 rounded-3xl border border-stone-200">
                <h4 className="font-serif text-lg font-bold text-[#072618] mb-4">
                  Preservation &amp; Longevity Instructions
                </h4>
                <ul className="space-y-3">
                  {product.story.careInstructions.map((inst, i) => (
                    <li key={i} className="flex items-start space-x-3 text-xs sm:text-sm text-stone-700">
                      <Check className="w-4 h-4 text-[#e5a110] shrink-0 mt-0.5" />
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="bg-white p-8 rounded-3xl border border-stone-200 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                  <div>
                    <h4 className="font-serif text-xl font-bold text-[#072618]">
                      Overall Rating: {product.rating} / 5.0
                    </h4>
                    <p className="text-xs text-stone-500 font-sans">
                      Based on {product.reviewCount} verified purchases
                    </p>
                  </div>
                  <div className="flex text-[#e5a110]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-serif font-bold text-xs text-stone-900">
                        Ananya Deshmukh • Mumbai
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">12 Sep 2026</span>
                    </div>
                    <p className="text-xs text-stone-600 font-sans italic leading-relaxed">
                      &ldquo;The feel of the Chanderi silk is unlike anything from commercial retail. You can feel the heartbeat of the loom in the weave. The gold zari detailing catches the candlelight beautifully.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products / "YOU MAY ALSO LIKE" */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-stone-300">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs font-serif uppercase tracking-[0.2em] text-[#072618] font-bold">
                  Curator Recommendations
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#072618] mt-1">
                  YOU MAY ALSO LIKE
                </h3>
              </div>
              <Link
                href="/products"
                className="text-xs font-serif uppercase tracking-widest text-[#072618] hover:text-[#e5a110] font-semibold flex items-center space-x-1"
              >
                <span>Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-stone-300 shadow-2xl text-stone-900">
            <button
              onClick={() => setSizeGuideOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-900"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-2xl font-bold text-[#072618] mb-1">
              Handloom Sizing Matrix
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              All measurements in inches. Designed with 1.5 inch royal drape allowance.
            </p>

            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-300 font-serif uppercase tracking-wider text-stone-600">
                  <th className="py-2.5">Size</th>
                  <th className="py-2.5">Chest</th>
                  <th className="py-2.5">Waist</th>
                  <th className="py-2.5">Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-mono">
                <tr><td className="py-2 font-serif font-bold">XS (36)</td><td>36&quot;</td><td>32&quot;</td><td>44&quot;</td></tr>
                <tr><td className="py-2 font-serif font-bold">S (38)</td><td>38&quot;</td><td>34&quot;</td><td>45&quot;</td></tr>
                <tr><td className="py-2 font-serif font-bold">M (40)</td><td>40&quot;</td><td>36&quot;</td><td>45.5&quot;</td></tr>
                <tr><td className="py-2 font-serif font-bold">L (42)</td><td>42&quot;</td><td>38&quot;</td><td>46&quot;</td></tr>
                <tr><td className="py-2 font-serif font-bold">XL (44)</td><td>44&quot;</td><td>40&quot;</td><td>46.5&quot;</td></tr>
              </tbody>
            </table>

            <p className="text-[11px] text-stone-500 mt-6 italic">
              Need custom measurements? Chat directly with our master tailor via WhatsApp.
            </p>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 text-white rounded-full bg-white/10 hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-4xl aspect-[3/4] max-h-[90vh]">
            <Image
              src={product.images[activeImage] || product.images[0]}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
