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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e5a110]/20">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-pill-gold text-[10px] font-serif uppercase tracking-[0.25em] text-[#f5b92e] font-semibold mb-2">
            <Sparkles className="w-3 h-3 text-[#f5b92e]" />
            <span>Operational Intelligence</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-wider text-white mt-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            ATELIER OVERVIEW
          </h1>
          <p className="text-xs text-stone-300 font-sans mt-1">
            Real-time telemetry across weaver production, patron transactions, and stock reserves.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-pill border border-emerald-500/30 text-emerald-300 text-xs font-serif backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span>Looms Active &amp; Online</span>
          </div>
          <Link
            href="/admin/products"
            className="btn-loom px-5 py-2.5 bg-gradient-to-r from-[#e5a110] to-[#f5b92e] text-[#04160d] text-xs font-serif font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(229,161,16,0.3)] flex items-center space-x-1.5"
          >
            <span>+ Add New Weave</span>
          </Link>
        </div>
      </div>

      {/* 6 Key Glassmorphic Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Total Sales */}
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden space-y-3 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-serif uppercase tracking-widest text-stone-400">Total Revenue</span>
            <div className="p-2.5 rounded-2xl glass-pill border border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-white relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {formatPrice(totalSales)}
          </div>
          <div className="flex items-center space-x-1.5 text-[11px] text-emerald-300 font-serif relative z-10">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>+24.6% vs previous lunar cycle</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden space-y-3 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#e5a110]/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-serif uppercase tracking-widest text-stone-400">Total Orders</span>
            <div className="p-2.5 rounded-2xl glass-pill-gold text-[#f5b92e]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-white relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {totalOrdersCount}
          </div>
          <p className="text-[11px] text-stone-300 font-sans relative z-10">
            <span className="text-[#f5b92e] font-semibold">{orders.filter((o) => o.status === "Processing").length}</span> parcels awaiting dispatch
          </p>
        </div>

        {/* Active Products */}
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden space-y-3 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-serif uppercase tracking-widest text-stone-400">Catalogued Weaves</span>
            <div className="p-2.5 rounded-2xl glass-pill border border-teal-500/30 text-teal-300">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-white relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {totalProductsCount}
          </div>
          <p className="text-[11px] text-stone-300 font-sans relative z-10">Across 4 distinct weaving guilds</p>
        </div>

        {/* Low Stock Reserves */}
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden space-y-3 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-serif uppercase tracking-widest text-stone-400">Low Stock Reserves</span>
            <div className="p-2.5 rounded-2xl glass-pill border border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-amber-300 relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {lowStockCount} Items
          </div>
          <p className="text-[11px] text-stone-300 font-sans relative z-10">Less than 10 pieces remaining on loom</p>
        </div>

        {/* Patron Wishlist Intent */}
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden space-y-3 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-serif uppercase tracking-widest text-stone-400">Wishlist Engagement</span>
            <div className="p-2.5 rounded-2xl glass-pill border border-rose-500/40 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.2)]">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-white relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {wishlist.length + 84} Saves
          </div>
          <p className="text-[11px] text-stone-300 font-sans relative z-10">High conversion anticipation for festive drops</p>
        </div>

        {/* Verified Patron Reviews */}
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden space-y-3 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-serif uppercase tracking-widest text-stone-400">Patron Satisfaction</span>
            <div className="p-2.5 rounded-2xl glass-pill border border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-[#f5b92e] relative z-10 drop-shadow-[0_0_10px_rgba(245,185,46,0.3)]">
            4.9 / 5.0
          </div>
          <p className="text-[11px] text-stone-300 font-sans relative z-10">{reviews.length} authentic submitted reviews</p>
        </div>
      </div>

      {/* Visual Analytics Grid: Sales Trend + Category Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Glass Sales Progression Chart */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#e5a110]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h3 className="font-serif text-lg font-bold text-white tracking-wide">Sales &amp; Revenue Velocity</h3>
              <p className="text-xs text-stone-300 font-sans">Monthly performance across Indian Handloom categories</p>
            </div>
            <span className="text-xs font-serif text-[#f5b92e] font-semibold px-3 py-1 rounded-full glass-pill-gold">
              2026 Fiscal Season
            </span>
          </div>

          {/* Frosted Glass SVG Bar Chart */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 border-b border-white/10 pb-2 relative z-10">
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
                    className="w-full max-w-[42px] bg-gradient-to-t from-emerald-900/60 via-[#e5a110]/70 to-[#f5b92e] rounded-t-xl transition-all duration-500 group-hover:brightness-125 group-hover:scale-y-105 shadow-[0_0_15px_rgba(229,161,16,0.25)] border-t border-x border-[#f5b92e]/40"
                    style={{ height: `${bar.val}%` }}
                  />
                  <span className="absolute -top-7 text-[10px] font-mono text-[#f5b92e] opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-0.5 rounded border border-[#f5b92e]/40 backdrop-blur-md">
                    ₹{bar.val * 2}k
                  </span>
                </div>
                <span className="text-xs font-serif text-stone-300">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance Breakdown */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <h3 className="font-serif text-lg font-bold text-white tracking-wide">Category Demand</h3>
            <p className="text-xs text-stone-300 font-sans">Share of total woven textile orders</p>
          </div>

          <div className="space-y-4 relative z-10">
            {[
              { label: "Festive & Royal Suits", pct: 42, color: "bg-gradient-to-r from-[#e5a110] to-[#f5b92e]" },
              { label: "Kanjivaram & Silk Sarees", pct: 28, color: "bg-gradient-to-r from-emerald-500 to-teal-400" },
              { label: "Men's Tussar Bandhgalas", pct: 18, color: "bg-gradient-to-r from-amber-500 to-orange-400" },
              { label: "Linen & Jamdani Overlays", pct: 12, color: "bg-gradient-to-r from-stone-400 to-stone-200" }
            ].map((cat) => (
              <div key={cat.label} className="space-y-1.5 text-xs">
                <div className="flex justify-between font-serif">
                  <span className="text-stone-200">{cat.label}</span>
                  <span className="text-[#f5b92e] font-semibold">{cat.pct}%</span>
                </div>
                <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
                  <div className={`h-full ${cat.color} rounded-full shadow-[0_0_8px_rgba(229,161,16,0.3)]`} style={{ width: `${cat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/admin/products"
            className="w-full py-2.5 glass-panel-subtle hover:border-[#e5a110]/50 text-xs font-serif uppercase tracking-wider text-center text-stone-200 hover:text-white rounded-xl transition-all block relative z-10 shadow-sm"
          >
            Manage Category Inventory
          </Link>
        </div>
      </div>

      {/* Recent Orders Table with Glassmorphism */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h3 className="font-serif text-xl font-bold text-white tracking-wide">Active Dispatch Parcels</h3>
            <p className="text-xs text-stone-300 font-sans">Recent orders awaiting artisan packing and tracking updates</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-serif uppercase tracking-wider text-[#f5b92e] hover:text-white font-semibold flex items-center space-x-1.5 px-3 py-1.5 rounded-xl glass-pill-gold transition-all"
          >
            <span>All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto relative z-10 rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-stone-400 font-serif uppercase tracking-wider bg-black/30 backdrop-blur-md">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Patron</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Value</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-stone-300 bg-white/[0.01]">
              {orders.map((ord) => (
                <tr key={ord.id} className="glass-row transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#f5b92e]">{ord.orderNumber}</td>
                  <td className="py-3.5 px-4 font-serif font-semibold text-white">{ord.customerName}</td>
                  <td className="py-3.5 px-4 font-mono text-stone-400">{ord.date}</td>
                  <td className="py-3.5 px-4 text-stone-300">{ord.items.length} garments</td>
                  <td className="py-3.5 px-4 font-serif font-bold text-white">{formatPrice(ord.total)}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 glass-pill-gold text-[#f5b92e] text-[10px] font-serif uppercase tracking-wider rounded-md font-semibold inline-block">
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
