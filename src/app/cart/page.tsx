"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  Trash2,
  Heart,
  Plus,
  Minus,
  ArrowRight,
  Shield,
  Tag,
  Check,
  Sparkles
} from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    moveToWishlist,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    freeShippingThreshold
  } = useStore();

  const [promoCode, setPromoCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!promoCode.trim()) return;
    const res = applyCoupon(promoCode);
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setPromoCode("");
    }
  };

  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div className="bg-[#FAF7F2] text-stone-900 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 text-xs font-serif uppercase tracking-widest text-stone-500 mb-8">
          <Link href="/" className="hover:text-[#072618]">Home</Link>
          <span>/</span>
          <span className="text-[#072618] font-bold">Shopping Bag</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] text-[#072618] mb-8">
          YOUR SHOPPING BAG ({cart.reduce((s, i) => s + i.quantity, 0)})
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-16 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto text-stone-400 mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Your Bag is Currently Empty
            </h2>
            <p className="text-xs text-stone-500 mt-2 font-sans leading-relaxed">
              Explore our sovereign weaves and handspun garments to add pieces to your bag.
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Items Column */}
            <div className="lg:col-span-8 space-y-4">
              {/* Shipping Progress bar */}
              <div className="p-4 bg-white border border-stone-200 rounded-2xl">
                <div className="flex justify-between items-center text-xs mb-1.5 font-serif">
                  <span>
                    {amountToFreeShipping > 0 ? (
                      <>
                        Add <strong className="text-[#072618]">{formatPrice(amountToFreeShipping)}</strong> more to unlock complimentary insured shipping
                      </>
                    ) : (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Complimentary Insured Shipping Unlocked!
                      </span>
                    )}
                  </span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#072618] transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, (cartSubtotal / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="bg-white border border-stone-200 rounded-3xl p-6 divide-y divide-stone-100 space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="pt-6 first:pt-0 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <div className="relative w-20 h-26 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-serif uppercase tracking-widest text-stone-400">
                          {item.product.collection}
                        </span>
                        <Link href={`/products/${item.product.slug}`} className="block">
                          <h3 className="font-serif text-base font-semibold text-stone-900 hover:text-[#072618]">
                            {item.product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center space-x-3 text-xs text-stone-500 mt-1 font-sans">
                          <span>Size: <strong>{item.size}</strong></span>
                          <span>•</span>
                          <span>Shade: <strong>{item.color}</strong></span>
                        </div>
                        <div className="mt-2 font-serif text-base font-bold text-[#072618]">
                          {formatPrice(item.product.price)}
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex items-center space-x-6 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-stone-600 hover:text-[#072618]"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold font-mono">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 text-stone-600 hover:text-[#072618]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => moveToWishlist(item.id)}
                          className="p-2 text-stone-400 hover:text-[#072618] transition-colors"
                          title="Save to Wishlist"
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-stone-400 hover:text-rose-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-4 bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm sticky top-28">
              <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-[#072618] pb-4 border-b border-stone-200">
                Order Summary
              </h2>

              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="p-3 bg-stone-50 border border-stone-300 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-stone-800">
                    <Tag className="w-3.5 h-3.5 text-[#072618]" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.discountPercent}% OFF)</span>
                  </div>
                  <button onClick={removeCoupon} className="text-xs text-rose-600 underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Coupon Code (e.g. FIRSTLOOM)"
                      className="flex-1 px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 placeholder-stone-400 uppercase tracking-wider focus:outline-none focus:border-[#072618]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#072618] text-[#f5b92e] text-xs font-serif uppercase tracking-widest font-semibold rounded-xl"
                    >
                      Apply
                    </button>
                  </div>
                  {errorMsg && <p className="text-[11px] text-rose-600">{errorMsg}</p>}
                </form>
              )}

              {/* Calculation Rows */}
              <div className="space-y-3 text-xs text-stone-600 pt-2 border-t border-stone-100">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-serif font-semibold text-stone-900">{formatPrice(cartSubtotal)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Privilege Discount ({appliedCoupon?.code})</span>
                    <span className="font-serif">-{formatPrice(cartDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Shipping</span>
                  <span>{cartShipping === 0 ? "Complimentary" : formatPrice(cartShipping)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-4 border-t border-stone-200">
                  <span className="font-serif tracking-wider">Estimated Total</span>
                  <span className="font-serif text-xl text-[#072618]">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full py-4 bg-[#072618] hover:bg-[#0d3824] text-[#f5b92e] font-serif font-bold uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[11px] text-stone-500 font-serif flex items-center justify-center space-x-2">
                <Shield className="w-3.5 h-3.5 text-emerald-700" />
                <span>100% Secure Payment Encryption</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
