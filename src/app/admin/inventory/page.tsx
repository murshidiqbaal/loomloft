"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import {
  Warehouse,
  Search,
  AlertTriangle,
  CheckCircle2,
  Plus,
  RefreshCw,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Layers,
} from "lucide-react";

export default function AdminInventoryPage() {
  const { products, showToast } = useStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "LOW_STOCK" | "HEALTHY">("ALL");

  const inventoryItems = products.map((p, idx) => ({
    id: p.id,
    name: p.name,
    sku: `LL-${p.category.slice(0, 3).toUpperCase()}-${String(idx + 1).padStart(2, "0")}`,
    category: p.category,
    image: p.images[0] || "/logo.png",
    price: p.price,
    available_stock: p.stock || (idx === 0 ? 2 : idx === 2 ? 3 : 18),
    reserved_stock: idx % 3 === 0 ? 2 : 1,
    sold_count: (idx + 1) * 14,
    threshold: 5,
  }));

  const filtered = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    const isLow = item.available_stock <= item.threshold;
    if (filter === "LOW_STOCK") return matchesSearch && isLow;
    if (filter === "HEALTHY") return matchesSearch && !isLow;
    return matchesSearch;
  });

  const handleQuickRestock = (id: string, name: string) => {
    showToast(`Restock order submitted for ${name} (+10 units reserve)`, "success");
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e5a110]/20">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#12372a] text-[#f5b92e] border border-[#e5a110]/30 text-[10px] font-serif uppercase tracking-widest font-semibold mb-2">
            <Warehouse className="w-3 h-3 text-[#f5b92e]" />
            <span>Artisan Stock &amp; Loom Reserves</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold uppercase tracking-wider text-white">
            INVENTORY &amp; WEFT RESERVES ({inventoryItems.length})
          </h1>
          <p className="text-xs text-stone-400 font-sans mt-1">
            Monitor real-time loom stock levels, reserved customer units, and artisan restock milestones.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#091811] border border-white/10 shadow-lg">
          <span className="text-[11px] font-serif uppercase tracking-wider text-stone-400">
            Total Stock On Hand
          </span>
          <h2 className="text-2xl font-serif font-bold text-white mt-1">
            {inventoryItems.reduce((s, i) => s + i.available_stock, 0)} units
          </h2>
          <span className="text-[10px] text-stone-400">Across 48 authenticated designs</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#091811] border border-amber-500/30 shadow-lg">
          <span className="text-[11px] font-serif uppercase tracking-wider text-amber-400">
            Critical Low Stock
          </span>
          <h2 className="text-2xl font-serif font-bold text-amber-300 mt-1">
            {inventoryItems.filter((i) => i.available_stock <= i.threshold).length} designs
          </h2>
          <span className="text-[10px] text-amber-400/80">Threshold &le; 5 units remaining</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#091811] border border-emerald-500/30 shadow-lg">
          <span className="text-[11px] font-serif uppercase tracking-wider text-emerald-400">
            Units Reserved In Transit
          </span>
          <h2 className="text-2xl font-serif font-bold text-emerald-300 mt-1">
            {inventoryItems.reduce((s, i) => s + i.reserved_stock, 0)} units
          </h2>
          <span className="text-[10px] text-emerald-400/80">Active cart &amp; transit holds</span>
        </div>
      </div>

      {/* Search and Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#091811] border border-white/10">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#f5b92e] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search garment name, SKU, weave..."
            className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#e5a110]/50"
          />
        </div>

        <div className="flex items-center space-x-2">
          {(["ALL", "LOW_STOCK", "HEALTHY"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-serif uppercase tracking-wider transition-all cursor-pointer ${
                filter === tab
                  ? "bg-gradient-to-r from-[#e5a110] to-[#f5b92e] text-[#04160d] font-bold"
                  : "bg-black/30 hover:bg-white/5 text-stone-300 border border-white/5"
              }`}
            >
              {tab === "ALL" ? "All Designs" : tab === "LOW_STOCK" ? "Low Stock" : "Adequate"}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-2xl bg-[#091811] border border-[#e5a110]/20 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#051009] border-b border-white/10 text-[11px] font-serif uppercase tracking-wider text-stone-400">
              <tr>
                <th className="py-4 px-5">Garment &amp; SKU</th>
                <th className="py-4 px-5">Category</th>
                <th className="py-4 px-5">Retail Price</th>
                <th className="py-4 px-5">Available Stock</th>
                <th className="py-4 px-5">Reserved</th>
                <th className="py-4 px-5">Historical Sold</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((item) => {
                const isLow = item.available_stock <= item.threshold;
                return (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-black/40 border border-white/10 shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                          <span className="font-semibold text-white block">{item.name}</span>
                          <span className="font-mono text-[10px] text-[#f5b92e]">{item.sku}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5 text-stone-300 font-serif">{item.category}</td>
                    <td className="py-4 px-5 font-bold text-white">{formatPrice(item.price)}</td>

                    <td className="py-4 px-5 font-mono font-bold">
                      <span className={isLow ? "text-amber-400" : "text-white"}>
                        {item.available_stock} units
                      </span>
                    </td>

                    <td className="py-4 px-5 text-stone-400 font-mono">{item.reserved_stock} units</td>
                    <td className="py-4 px-5 text-stone-300 font-mono">{item.sold_count} sold</td>

                    <td className="py-4 px-5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-serif uppercase tracking-wider font-semibold border ${
                          isLow
                            ? "bg-amber-950/70 text-amber-300 border-amber-500/40"
                            : "bg-emerald-950/70 text-emerald-300 border-emerald-500/40"
                        }`}
                      >
                        {isLow ? "Low Threshold" : "Stock In Order"}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => handleQuickRestock(item.id, item.name)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#e5a110] text-stone-300 hover:text-[#04160d] text-[11px] font-semibold transition-all border border-white/10"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Restock +10</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
