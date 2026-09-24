"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Settings, Save, Shield, Check } from "lucide-react";

export default function AdminSettingsPage() {
  const { showToast } = useStore();
  const [currency, setCurrency] = useState("INR (₹)");
  const [shippingThreshold, setShippingThreshold] = useState(2999);
  const [standardShippingFee, setStandardShippingFee] = useState(250);
  const [taxRate, setTaxRate] = useState("5% GST (Textile Handlooms)");
  const [transitInsurance, setTransitInsurance] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Store configuration settings successfully updated", "success");
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-800 gap-4">
        <div>
          <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#f5b92e] font-semibold">
            Store Architecture
          </span>
          <h1 className="font-serif text-3xl font-bold uppercase tracking-wider text-white mt-1">
            ATELIER CONFIGURATION
          </h1>
          <p className="text-xs text-stone-400 font-sans mt-0.5">
            Configure currency, complimentary shipping thresholds, and tax compliance.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 bg-[#e5a110] hover:bg-[#f5b92e] text-[#04160d] text-xs font-serif font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center space-x-2 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-[#072618] border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <h3 className="font-serif text-lg font-bold text-white">Fiscal &amp; Shipping Metrics</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">
                Store Currency
              </label>
              <input
                type="text"
                readOnly
                value={currency}
                className="w-full px-4 py-2 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">
                Applicable GST Rate
              </label>
              <input
                type="text"
                readOnly
                value={taxRate}
                className="w-full px-4 py-2 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">
                Complimentary Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={shippingThreshold}
                onChange={(e) => setShippingThreshold(Number(e.target.value))}
                className="w-full px-4 py-2 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">
                Standard Shipping Fee (₹)
              </label>
              <input
                type="number"
                value={standardShippingFee}
                onChange={(e) => setStandardShippingFee(Number(e.target.value))}
                className="w-full px-4 py-2 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={transitInsurance}
                onChange={(e) => setTransitInsurance(e.target.checked)}
                className="accent-[#e5a110]"
              />
              <span className="text-xs text-stone-300 font-serif">
                Include automatic full transit insurance on all pit-loom dispatches
              </span>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
