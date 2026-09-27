"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Minus,
  Trash2,
  Heart,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  Check
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const router = useRouter();
  const {
    cart,
    cartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    moveToWishlist,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    freeShippingThreshold,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useStore();

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    if (!promoInput.trim()) return;
    const res = applyCoupon(promoInput);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoInput("");
    }
  };

  const handleCheckout = () => {
    setCartOpen(false);
    router.push("/checkout");
  };

  const handleViewCart = () => {
    setCartOpen(false);
    router.push("/cart");
  };

  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
              className="w-screen max-w-md bg-[#072618] border-l border-[#e5a110]/30 text-cream shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-stone-800 flex items-center justify-between bg-[#04160d]">
                <div className="flex items-center space-x-2.5">
                  <ShoppingBag className="w-5 h-5 text-[#e5a110]" />
                  <h2 className="font-serif text-lg font-semibold tracking-wider uppercase text-white">
                    Your Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
                  </h2>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                  aria-label="Close bag"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Meter */}
              <div className="px-6 py-3 bg-[#0a2f1e] border-b border-[#e5a110]/15">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-serif text-stone-300">
                    {amountToFreeShipping > 0 ? (
                      <>
                        Add <strong className="text-[#f5b92e]">{formatPrice(amountToFreeShipping)}</strong> for complimentary insured shipping
                      </>
                    ) : (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Complimentary Insured Shipping Unlocked!
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    {Math.round(freeShippingProgress)}%
                  </span>
                </div>
                <div className="w-full bg-[#04160d] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#e5a110] to-[#f5b92e] transition-all duration-500 rounded-full"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-[#04160d] border border-[#e5a110]/20 flex items-center justify-center text-[#e5a110] mb-4">
                      <ShoppingBag className="w-8 h-8 opacity-70" />
                    </div>
                    <h3 className="font-serif text-lg text-white font-medium">Your Bag is Empty</h3>
                    <p className="text-xs text-stone-400 mt-2 max-w-xs leading-relaxed">
                      Discover our sovereign handloom weaves, master-tailored bandhgalas, and pure silk sarees.
                    </p>
                    <button
                      onClick={() => {
                        setCartOpen(false);
                        router.push("/collections");
                      }}
                      className="mt-6 px-6 py-2.5 bg-[#e5a110] hover:bg-[#f5b92e] text-[#04160d] font-serif uppercase tracking-widest text-xs font-semibold rounded-xl transition-all"
                    >
                      Explore Collections
                    </button>
                  </div>
                ) : (
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: 20 }}
                        className="flex space-x-4 p-3.5 bg-[#04160d]/70 border border-stone-800 rounded-2xl relative group"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-stone-900 shrink-0 border border-stone-700/60">
                          <Image
                            src={item.product.images[0] || "/logo.png"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <Link
                              href={`/products/${item.product.slug}`}
                              onClick={() => setCartOpen(false)}
                              className="font-serif text-sm font-medium text-stone-100 hover:text-[#e5a110] transition-colors line-clamp-1"
                            >
                              {item.product.name}
                            </Link>
                            <div className="flex items-center space-x-2 text-[11px] text-stone-400 mt-1">
                              <span>Size: <strong className="text-stone-200">{item.size}</strong></span>
                              <span>•</span>
                              <span>Color: <strong className="text-stone-200">{item.color}</strong></span>
                            </div>
                            <div className="mt-1">
                              <span className="font-serif text-sm font-semibold text-[#f5b92e]">
                                {formatPrice(item.product.price)}
                              </span>
                            </div>
                          </div>

                          {/* Controls */}
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-800/80">
                            {/* Quantity */}
                            <div className="flex items-center border border-stone-700 rounded-lg bg-[#072618]">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:text-[#e5a110] transition-colors text-stone-300"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-2 text-xs font-semibold text-white">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:text-[#e5a110] transition-colors text-stone-300"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => moveToWishlist(item.id)}
                                className="p-1.5 text-stone-400 hover:text-[#e5a110] transition-colors"
                                title="Move to Wishlist"
                                aria-label="Move item to wishlist"
                              >
                                <Heart className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-1.5 text-stone-400 hover:text-rose-400 transition-colors"
                                title="Remove from Bag"
                                aria-label="Remove item from cart"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="p-6 bg-[#04160d] border-t border-[#e5a110]/20 space-y-4">
                  {/* Coupon Area */}
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 bg-[#072618] border border-[#e5a110]/50 rounded-xl text-xs">
                      <div className="flex items-center space-x-2 text-[#f5b92e]">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Code <strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.discountPercent}% off)</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-stone-400 hover:text-rose-400 font-semibold text-[11px] underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Coupon code (try FIRSTLOOM)"
                        className="flex-1 px-3 py-2 bg-[#072618] border border-stone-700 rounded-lg text-xs text-white placeholder-stone-400 uppercase tracking-wider focus:outline-none focus:border-[#e5a110]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-stone-800 hover:bg-[#e5a110] hover:text-[#04160d] text-stone-200 text-xs font-serif uppercase tracking-wider rounded-lg transition-colors font-medium"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {promoError && (
                    <p className="text-[11px] text-rose-400">{promoError}</p>
                  )}

                  {/* Calculations */}
                  <div className="space-y-1.5 text-xs text-stone-300">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-serif text-white">{formatPrice(cartSubtotal)}</span>
                    </div>
                    {cartDiscount > 0 && (
                      <div className="flex justify-between text-[#f5b92e]">
                        <span>Privilege Discount</span>
                        <span className="font-serif">-{formatPrice(cartDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Insured Shipping</span>
                      <span>{cartShipping === 0 ? "Complimentary" : formatPrice(cartShipping)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-white pt-2 border-t border-stone-800">
                      <span className="font-serif tracking-wide">Estimated Total</span>
                      <span className="font-serif text-base text-[#f5b92e]">
                        {formatPrice(cartTotal)}
                      </span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-2.5 pt-1">
                    <button
                      onClick={handleCheckout}
                      className="w-full py-3.5 bg-[#e5a110] hover:bg-[#f5b92e] text-[#04160d] text-xs font-serif font-bold uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleViewCart}
                      className="w-full py-2.5 bg-transparent hover:bg-stone-800/60 text-stone-300 hover:text-white text-xs font-serif uppercase tracking-[0.15em] rounded-xl transition-colors border border-stone-700/60"
                    >
                      View Detailed Bag
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
