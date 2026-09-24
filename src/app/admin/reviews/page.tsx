"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { Star, CheckCircle, Trash2, ShieldCheck } from "lucide-react";

export default function AdminReviewsPage() {
  const { reviews, showToast } = useStore();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-800 gap-4">
        <div>
          <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#f5b92e] font-semibold">
            Patron Feedback Portal
          </span>
          <h1 className="font-serif text-3xl font-bold uppercase tracking-wider text-white mt-1">
            PATRON TESTIMONIALS ({reviews.length})
          </h1>
          <p className="text-xs text-stone-400 font-sans mt-0.5">
            Approve verified buyer reviews, monitor sentiment, and manage published testaments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-[#072618] border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex text-[#e5a110]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < r.rating ? "fill-current" : "text-stone-700"}`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-stone-400">{r.date}</span>
              </div>

              <p className="text-xs sm:text-sm text-stone-200 font-sans italic mt-3 leading-relaxed">
                &ldquo;{r.comment}&rdquo;
              </p>

              {r.productName && (
                <div className="mt-3 pt-2 border-t border-stone-800">
                  <span className="text-[10px] font-serif uppercase tracking-wider text-[#f5b92e]">
                    {r.productName}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-serif font-bold text-white block">{r.author}</span>
                <span className="text-[11px] text-stone-400 font-sans">{r.location}</span>
              </div>
              <div className="flex items-center space-x-1 text-emerald-400 text-[10px] font-serif font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Verified Buyer</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
