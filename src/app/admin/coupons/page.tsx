"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { Tag, Plus, Check, Trash2, Calendar, ShieldCheck } from "lucide-react";

export default function AdminCouponsPage() {
  const { coupons, showToast } = useStore();
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState(15);
  const [newMinOrder, setNewMinOrder] = useState(4999);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    showToast(`Promotional voucher "${newCode.toUpperCase()}" generated`, "success");
    setModalOpen(false);
    setNewCode("");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-800 gap-4">
        <div>
          <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#f5b92e] font-semibold">
            Voucher Engineering
          </span>
          <h1 className="font-serif text-3xl font-bold uppercase tracking-wider text-white mt-1">
            PRIVILEGE CODES &amp; VOUCHERS ({coupons.length})
          </h1>
          <p className="text-xs text-stone-400 font-sans mt-0.5">
            Create promotional discount codes for wedding patrons, festive VIPs, and first-time buyers.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-3 bg-[#e5a110] hover:bg-[#f5b92e] text-[#04160d] text-xs font-serif font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Voucher</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div
            key={c.code}
            className="bg-[#072618] border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <span className="font-mono text-base font-bold text-[#f5b92e] tracking-wider">
                  {c.code}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-serif uppercase tracking-wider">
                  Active
                </span>
              </div>
              <div className="mt-3">
                <span className="font-serif text-3xl font-bold text-white">
                  {c.discountPercent}% OFF
                </span>
                <p className="text-xs text-stone-300 font-sans mt-1.5 leading-relaxed">
                  {c.description}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800 text-[11px] text-stone-400 space-y-1">
              <div className="flex justify-between">
                <span>Minimum Order:</span>
                <span className="text-white font-serif">{formatPrice(c.minOrder)}</span>
              </div>
              <div className="flex justify-between">
                <span>Valid Until:</span>
                <span className="font-mono text-[#e5a110]">{c.validUntil}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#072618] border border-[#e5a110]/40 rounded-3xl p-6 sm:p-8 text-cream shadow-2xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-white">Generate Privilege Code</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="e.g. DIWALI25"
                  className="w-full px-4 py-2.5 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white uppercase font-mono focus:outline-none focus:border-[#e5a110]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">Discount %</label>
                  <input
                    type="number"
                    min={5}
                    max={50}
                    value={newDiscount}
                    onChange={(e) => setNewDiscount(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    step={500}
                    value={newMinOrder}
                    onChange={(e) => setNewMinOrder(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 bg-[#04160d] text-stone-400 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#e5a110] text-[#04160d] font-bold font-serif uppercase tracking-wider rounded-xl text-xs"
                >
                  Generate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
