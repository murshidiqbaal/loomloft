"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Star, CheckCircle, PenLine, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomerReviews() {
  const { reviews, addReview, products } = useStore();
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("");
  const [productName, setProductName] = useState(products[0]?.name || "Chanderi Silk Kurta Set");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    addReview({
      author: author.trim(),
      location: location.trim() || "India",
      productName,
      rating,
      comment: comment.trim(),
      verifiedBuyer: true
    });

    setModalOpen(false);
    setAuthor("");
    setLocation("");
    setComment("");
  };

  return (
    <section className="py-24 bg-[#FAF7F2] text-stone-900 relative overflow-hidden border-t border-[#efe8dc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <div className="inline-flex items-center space-x-2 text-[#072618] text-xs font-serif uppercase tracking-[0.25em] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#e5a110]" />
              <span>Verified Patron Testimonials</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] text-[#072618]">
              TESTAMENTS TO THE CRAFT
            </h2>
            <p className="mt-2 text-stone-600 font-sans text-xs sm:text-sm">
              Voices of patrons who cherish the tactile difference of authentic, zero-carbon handloom textiles.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="mt-6 md:mt-0 inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#072618] hover:bg-[#0d3824] text-[#f5b92e] text-xs font-serif uppercase tracking-widest font-semibold transition-all shadow-md group"
          >
            <PenLine className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-stone-200 hover:border-[#e5a110]/60 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div>
                {/* Star Rating */}
                <div className="flex items-center space-x-1 text-[#e5a110] mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? "fill-current" : "text-stone-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-stone-700 font-sans italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                {/* Garment Tag */}
                {rev.productName && (
                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <span className="text-[10px] font-serif uppercase tracking-wider text-[#072618] font-semibold block truncate">
                      {rev.productName}
                    </span>
                  </div>
                )}
              </div>

              {/* Author & Verification */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-sm font-bold text-stone-900">
                    {rev.author}
                  </h4>
                  <span className="text-[11px] text-stone-500 font-sans">
                    {rev.location}
                  </span>
                </div>
                {rev.verifiedBuyer && (
                  <div
                    className="flex items-center space-x-1 text-[10px] text-emerald-700 font-serif font-semibold"
                    title="Verified Handloom Buyer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write a Review Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#072618] border border-[#e5a110]/40 rounded-3xl p-6 sm:p-8 text-cream shadow-2xl"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-[#e5a110]" />
              </button>

              <div className="mb-6">
                <span className="font-serif text-xs uppercase tracking-widest text-[#f5b92e]">
                  Patron Feedback
                </span>
                <h3 className="font-serif text-2xl font-bold text-white mt-1">
                  SHARE YOUR THREAD STORY
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Help fellow handloom connoisseurs understand the tactile drape and craft of your LoomLoft garment.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Priyamvada Sharma"
                    className="w-full px-4 py-2.5 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#e5a110]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">
                      City / Region
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Jaipur"
                      className="w-full px-4 py-2.5 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#e5a110]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">
                      Rating
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#e5a110]"
                    >
                      <option value={5}>★★★★★ (5 - Masterpiece)</option>
                      <option value={4}>★★★★☆ (4 - Excellent)</option>
                      <option value={3}>★★★☆☆ (3 - Good)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">
                    Select Garment
                  </label>
                  <select
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#e5a110]"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">
                    Your Experience & Tactile Review
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe how the handloom silk felt, the weight of the weave, compliments received, or the fit..."
                    className="w-full px-4 py-2.5 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#e5a110]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#e5a110] hover:bg-[#f5b92e] text-[#04160d] font-serif font-bold uppercase tracking-widest text-xs rounded-xl transition-all shadow-xl"
                  >
                    Submit Verified Review
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
