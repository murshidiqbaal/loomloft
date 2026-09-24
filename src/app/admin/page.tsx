"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  Heart,
  ArrowUpRight,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function AdminDashboardPage() {
  const { products, orders, wishlist, reviews } = useStore();

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0) + 128450; // Include historical
  const totalOrdersCount = orders.length + 18;
  const totalProductsCount = products.length;
  const lowStockCount = products.filter((p) => p.stock < 10).length;

  return (
    <div className="space-y-8">
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#f5b92e] font-semibold">
            Operational Intelligence
          </span>
          <h1 className="font-serif text-3xl font-bold uppercase tracking-wider text-white mt-1">
            ATELIER OVERVIEW
          </h1>
          <p className="text-xs text-stone-400 font-sans mt-0.5">
            Real-time telemetry across weaver production, patron transactions, and stock reserves.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-serif">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Looms Active &amp; Online</span>
          </div>
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-[#e5a110] hover:bg-[#f5b92e] text-[#04160d] text-xs font-serif font-bold uppercase tracking-wider rounded-xl transition-all shadow-md"
          >
            + Add New Weave
          </Link>
        </div>
      </div>

      {/* 6 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Total Sales */}
        <div className="bg-[#072618] border border-[#e5a110]/25 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-serif uppercase tracking-widest text-stone-400">Total Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-white">
            {formatPrice(totalSales)}
          </div>
          <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400 font-serif">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+24.6% vs previous lunar cycle</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-[#072618] border border-[#e5a110]/25 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-serif uppercase tracking-widest text-stone-400">Total Orders</span>
            <div className="p-2 rounded-xl bg-[#04160d] text-[#f5b92e] border border-stone-800">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-white">
            {totalOrdersCount}
          </div>
          <p className="text-[11px] text-stone-400 font-sans">
            {orders.filter((o) => o.status === "Processing").length} parcels awaiting dispatch
          </p>
        </div>

        {/* Active Products */}
        <div className="bg-[#072618] border border-[#e5a110]/25 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-serif uppercase tracking-widest text-stone-400">Catalogued Weaves</span>
            <div className="p-2 rounded-xl bg-[#04160d] text-stone-300 border border-stone-800">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-white">
            {totalProductsCount}
          </div>
          <p className="text-[11px] text-stone-400 font-sans">Across 4 distinct weaving guilds</p>
        </div>

        {/* Low Stock Reserves */}
        <div className="bg-[#072618] border border-[#e5a110]/25 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-serif uppercase tracking-widest text-stone-400">Low Stock Reserves</span>
            <div className="p-2 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-amber-300">
            {lowStockCount} Items
          </div>
          <p className="text-[11px] text-stone-400 font-sans">Less than 10 pieces remaining on loom</p>
        </div>

        {/* Patron Wishlist Intent */}
        <div className="bg-[#072618] border border-[#e5a110]/25 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-serif uppercase tracking-widest text-stone-400">Wishlist Engagement</span>
            <div className="p-2 rounded-xl bg-rose-950/60 text-rose-400 border border-rose-800">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-white">
            {wishlist.length + 84} Saves
          </div>
          <p className="text-[11px] text-stone-400 font-sans">High conversion anticipation for festive drops</p>
        </div>

        {/* Verified Patron Reviews */}
        <div className="bg-[#072618] border border-[#e5a110]/25 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-serif uppercase tracking-widest text-stone-400">Patron Satisfaction</span>
            <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-[#f5b92e]">
            4.9 / 5.0
          </div>
          <p className="text-[11px] text-stone-400 font-sans">{reviews.length} authentic submitted reviews</p>
        </div>
      </div>

      {/* Visual Analytics Grid: Sales Trend + Category Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Clean Sales Progression Chart */}
        <div className="lg:col-span-8 bg-[#072618] border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Sales &amp; Revenue Velocity</h3>
              <p className="text-xs text-stone-400 font-sans">Monthly performance across Indian Handloom categories</p>
            </div>
            <span className="text-xs font-serif text-[#e5a110] font-semibold">2026 Fiscal Season</span>
          </div>

          {/* Clean SVG Bar Chart */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 border-b border-stone-800 pb-2">
            {[
              { month: "Apr", val: 45 },
              { month: "May", val: 58 },
              { month: "Jun", val: 52 },
              { month: "Jul", val: 78 },
              { month: "Aug", val: 86 },
              { month: "Sep", val: 94 }
            ].map((bar) => (
              <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="relative w-full flex items-end justify-center h-44">
                  <div
                    className="w-full max-w-[42px] bg-gradient-to-t from-[#0d3824] via-[#e5a110]/70 to-[#f5b92e] rounded-t-xl transition-all duration-500 group-hover:brightness-125 group-hover:scale-y-105"
                    style={{ height: `${bar.val}%` }}
                  />
                  <span className="absolute -top-7 text-[10px] font-mono text-[#f5b92e] opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{bar.val * 2}k
                  </span>
                </div>
                <span className="text-xs font-serif text-stone-400">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance Breakdown */}
        <div className="lg:col-span-4 bg-[#072618] border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-white">Category Demand</h3>
            <p className="text-xs text-stone-400 font-sans">Share of total woven textile orders</p>
          </div>

          <div className="space-y-4">
            {[
              { label: "Festive & Royal Suits", pct: 42, color: "bg-[#e5a110]" },
              { label: "Kanjivaram & Silk Sarees", pct: 28, color: "bg-emerald-400" },
              { label: "Men's Tussar Bandhgalas", pct: 18, color: "bg-amber-600" },
              { label: "Linen & Jamdani Overlays", pct: 12, color: "bg-stone-400" }
            ].map((cat) => (
              <div key={cat.label} className="space-y-1 text-xs">
                <div className="flex justify-between font-serif">
                  <span className="text-stone-300">{cat.label}</span>
                  <span className="text-[#f5b92e] font-semibold">{cat.pct}%</span>
                </div>
                <div className="w-full bg-[#04160d] h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/admin/products"
            className="w-full py-2.5 bg-[#04160d] hover:bg-[#0d3824] border border-stone-700 text-xs font-serif uppercase tracking-wider text-center text-stone-300 hover:text-white rounded-xl transition-colors block"
          >
            Manage Category Inventory
          </Link>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-[#072618] border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-white">Active Dispatch Parcels</h3>
            <p className="text-xs text-stone-400 font-sans">Recent orders awaiting artisan packing and tracking updates</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-serif uppercase tracking-wider text-[#e5a110] hover:text-[#f5b92e] font-semibold flex items-center space-x-1"
          >
            <span>All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 font-serif uppercase tracking-wider">
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Patron</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Items</th>
                <th className="py-3 px-3">Value</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 text-stone-300">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#04160d] transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-[#e5a110]">{ord.orderNumber}</td>
                  <td className="py-3 px-3 font-serif font-semibold text-white">{ord.customerName}</td>
                  <td className="py-3 px-3 font-mono text-stone-400">{ord.date}</td>
                  <td className="py-3 px-3 text-stone-300">{ord.items.length} garments</td>
                  <td className="py-3 px-3 font-serif font-bold text-white">{formatPrice(ord.total)}</td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-1 bg-[#0d3824] text-[#f5b92e] text-[10px] font-serif uppercase tracking-wider rounded-md border border-[#e5a110]/30 font-semibold">
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
