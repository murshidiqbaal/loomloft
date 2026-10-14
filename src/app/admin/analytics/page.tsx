"use client";

import React from "react";
import { formatPrice } from "@/lib/utils";
import { BarChart3, TrendingUp, Users, ShoppingBag, Truck, Sparkles } from "lucide-react";

export default function AdminAnalyticsPage() {
  const channelData = [
    { channel: "Direct Atelier Visits", orders: 48, revenue: 142500, percent: "42%" },
    { channel: "Private Weaver Drops", orders: 36, revenue: 98000, percent: "31%" },
    { channel: "Instagram Atelier Feed", orders: 24, revenue: 64200, percent: "18%" },
    { channel: "Curator Referrals", orders: 12, revenue: 32000, percent: "9%" },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e5a110]/20">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#12372a] text-[#f5b92e] border border-[#e5a110]/30 text-[10px] font-serif uppercase tracking-widest font-semibold mb-2">
            <BarChart3 className="w-3 h-3 text-[#f5b92e]" />
            <span>Telemetry &amp; Growth Performance</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold uppercase tracking-wider text-white">
            COMMERCE ANALYTICS
          </h1>
          <p className="text-xs text-stone-400 font-sans mt-1">
            Dispatch conversion ratios, average patron basket value, and guild fulfillment throughput.
          </p>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#091811] border border-white/10 shadow-lg">
          <span className="text-[11px] font-serif uppercase tracking-wider text-stone-400">
            Average Order Value (AOV)
          </span>
          <h2 className="text-2xl font-serif font-bold text-white mt-1">
            {formatPrice(3485)}
          </h2>
          <span className="text-[10px] text-emerald-400">&uarr; +14.2% vs last month</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#091811] border border-white/10 shadow-lg">
          <span className="text-[11px] font-serif uppercase tracking-wider text-stone-400">
            Fulfillment Velocity
          </span>
          <h2 className="text-2xl font-serif font-bold text-white mt-1">
            2.4 Days
          </h2>
          <span className="text-[10px] text-emerald-400">Average order-to-dispatch transit</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#091811] border border-white/10 shadow-lg">
          <span className="text-[11px] font-serif uppercase tracking-wider text-stone-400">
            Delivery Success Rate
          </span>
          <h2 className="text-2xl font-serif font-bold text-white mt-1">
            99.2%
          </h2>
          <span className="text-[10px] text-emerald-400">Manual tracking precision verified</span>
        </div>
      </div>

      {/* Channel Breakdown Table */}
      <div className="p-6 rounded-2xl bg-[#091811] border border-[#e5a110]/20 space-y-4 shadow-xl">
        <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-white">
          Patron Acquisition Channels
        </h2>

        <div className="divide-y divide-white/5 text-xs">
          {channelData.map((ch) => (
            <div key={ch.channel} className="py-3 flex items-center justify-between">
              <div>
                <span className="font-medium text-white block">{ch.channel}</span>
                <span className="text-[10px] text-stone-400">{ch.orders} completed consignments</span>
              </div>
              <div className="text-right">
                <span className="font-serif font-bold text-[#f5b92e] block">{formatPrice(ch.revenue)}</span>
                <span className="text-[10px] text-stone-400">{ch.percent} volume share</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
