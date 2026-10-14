"use client";

import React, { useState } from "react";
import { Percent, Plus, Tag, Calendar, Sparkles, CheckCircle2, Clock } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function AdminOffersPage() {
  const { showToast } = useStore();

  const [offers, setOffers] = useState([
    {
      id: "off-01",
      name: "Heritage Inaugural Discount",
      badge_text: "15% INAUGURAL",
      type: "PERCENTAGE",
      discount_value: 15,
      start_at: "2026-10-01",
      end_at: "2026-10-31",
      status: "ACTIVE",
      scope: "All Handloom Weaves",
    },
    {
      id: "off-02",
      name: "Festive Silk Privilege Code",
      badge_text: "FLAT ₹1,000 OFF",
      type: "FIXED",
      discount_value: 1000,
      start_at: "2026-10-05",
      end_at: "2026-10-25",
      status: "ACTIVE",
      scope: "Kanjivaram Guild Sarees",
    },
    {
      id: "off-03",
      name: "Mulberry Nightwear Drop Offer",
      badge_text: "BUY 2 GET 10% OFF",
      type: "PERCENTAGE",
      discount_value: 10,
      start_at: "2026-10-10",
      end_at: "2026-11-15",
      status: "SCHEDULED",
      scope: "Pure Mulberry Nighties",
    },
  ]);

  const toggleOfferStatus = (id: string) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: o.status === "ACTIVE" ? "PAUSED" : "ACTIVE" } : o
      )
    );
    showToast("Offer status updated successfully", "info");
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e5a110]/20">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#12372a] text-[#f5b92e] border border-[#e5a110]/30 text-[10px] font-serif uppercase tracking-widest font-semibold mb-2">
            <Percent className="w-3 h-3 text-[#f5b92e]" />
            <span>Seasonal Incentives &amp; Privileges</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold uppercase tracking-wider text-white">
            OFFERS &amp; PRIVILEGE DISCOUNTS ({offers.length})
          </h1>
          <p className="text-xs text-stone-400 font-sans mt-1">
            Configure percentage cuts, fixed discounts, and collection-wide pricing reductions.
          </p>
        </div>

        <button
          onClick={() => showToast("Offer creator ready", "info")}
          className="px-5 py-2.5 bg-gradient-to-r from-[#e5a110] to-[#f5b92e] text-[#04160d] text-xs font-serif font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Offer</span>
        </button>
      </div>

      {/* Offers Table */}
      <div className="rounded-2xl bg-[#091811] border border-[#e5a110]/20 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#051009] border-b border-white/10 text-[11px] font-serif uppercase tracking-wider text-stone-400">
              <tr>
                <th className="py-4 px-5">Offer Name &amp; Badge</th>
                <th className="py-4 px-5">Discount Formula</th>
                <th className="py-4 px-5">Scope</th>
                <th className="py-4 px-5">Duration</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {offers.map((off) => (
                <tr key={off.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-5">
                    <span className="font-semibold text-white block">{off.name}</span>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono bg-[#e5a110]/15 text-[#f5b92e] border border-[#e5a110]/30 font-bold">
                      {off.badge_text}
                    </span>
                  </td>

                  <td className="py-4 px-5 font-bold text-white font-mono">
                    {off.type === "PERCENTAGE" ? `${off.discount_value}% OFF` : `₹${off.discount_value} FLAT`}
                  </td>

                  <td className="py-4 px-5 text-stone-300 font-serif">{off.scope}</td>

                  <td className="py-4 px-5 text-stone-400">
                    <div className="flex items-center space-x-1 font-mono text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-[#e5a110]" />
                      <span>{off.start_at} &rarr; {off.end_at}</span>
                    </div>
                  </td>

                  <td className="py-4 px-5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-serif uppercase tracking-wider font-semibold border ${
                        off.status === "ACTIVE"
                          ? "bg-emerald-950/70 text-emerald-300 border-emerald-500/40"
                          : "bg-amber-950/70 text-amber-300 border-amber-500/40"
                      }`}
                    >
                      {off.status}
                    </span>
                  </td>

                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => toggleOfferStatus(off.id)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-[11px] font-serif uppercase tracking-wider border border-white/10 transition-all cursor-pointer"
                    >
                      {off.status === "ACTIVE" ? "Pause" : "Resume"}
                    </button>
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
