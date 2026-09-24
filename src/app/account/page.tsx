"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { User, Package, Heart, Shield, MapPin, ArrowRight, Clock } from "lucide-react";

export default function AccountPage() {
  const { orders, wishlist } = useStore();

  return (
    <div className="bg-[#FAF7F2] text-stone-900 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-stone-200 mb-10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-[#072618] text-[#f5b92e] flex items-center justify-center font-serif text-2xl font-bold shadow-lg">
              R
            </div>
            <div>
              <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#072618] font-bold">
                Privilege Connoisseur
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Rohan Singhal
              </h1>
              <p className="text-xs text-stone-500 font-sans mt-0.5">
                rohan.singhal@example.com • Member since 2024
              </p>
            </div>
          </div>

          <div className="mt-4 sm:mt-0 flex gap-3">
            <Link
              href="/account/orders"
              className="px-5 py-2.5 bg-[#072618] text-[#f5b92e] text-xs font-serif uppercase tracking-widest font-semibold rounded-xl shadow-md"
            >
              Order History ({orders.length})
            </Link>
            <Link
              href="/wishlist"
              className="px-5 py-2.5 bg-white border border-stone-300 text-stone-800 text-xs font-serif uppercase tracking-widest rounded-xl hover:border-[#072618]"
            >
              Wishlist ({wishlist.length})
            </Link>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-800">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-stone-400 font-serif uppercase tracking-wider block">Total Orders</span>
              <span className="font-serif text-2xl font-bold text-[#072618]">{orders.length} Handlooms</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-rose-50 rounded-2xl text-rose-700">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-stone-400 font-serif uppercase tracking-wider block">Saved to Wishlist</span>
              <span className="font-serif text-2xl font-bold text-stone-900">{wishlist.length} Items</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-800">
              <Shield className="w-6 h-6 text-[#e5a110]" />
            </div>
            <div>
              <span className="text-xs text-stone-400 font-serif uppercase tracking-wider block">Weaver Guild Tier</span>
              <span className="font-serif text-2xl font-bold text-[#072618]">Gold Sovereign</span>
            </div>
          </div>
        </div>

        {/* Recent Orders Preview */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm">
          <div className="flex items-center justify-between pb-6 border-b border-stone-200 mb-6">
            <h2 className="font-serif text-xl font-bold text-[#072618]">
              Recent Orders &amp; Guild Dispatch
            </h2>
            <Link
              href="/account/orders"
              className="text-xs font-serif uppercase tracking-widest text-[#072618] hover:text-[#e5a110] font-semibold flex items-center space-x-1"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-6">
            {orders.slice(0, 2).map((order) => (
              <div key={order.id} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="font-mono text-sm font-bold text-[#072618]">{order.orderNumber}</span>
                    <span className="px-2.5 py-0.5 bg-[#072618] text-[#f5b92e] text-[10px] font-serif uppercase tracking-wider rounded-md font-semibold">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-sans">
                    Placed on {order.date} • {order.items.length} garments • Delivered to {order.shippingAddress.city}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-serif text-lg font-bold text-stone-900">{formatPrice(order.total)}</span>
                  <Link
                    href="/account/orders"
                    className="px-4 py-2 bg-white border border-stone-300 rounded-xl text-xs font-serif uppercase tracking-wider text-stone-800 hover:border-[#072618]"
                  >
                    Track Progress
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
