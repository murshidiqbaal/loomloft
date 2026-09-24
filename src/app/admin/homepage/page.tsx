"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Sliders, Save, Sparkles, Check } from "lucide-react";

export default function AdminHomepageCmsPage() {
  const { cms, updateCms, showToast } = useStore();

  const [heroHeading, setHeroHeading] = useState(cms.hero.headline);
  const [heroSubheadline, setHeroSubheadline] = useState(cms.hero.subheadline);
  const [primaryCta, setPrimaryCta] = useState(cms.hero.primaryCta);
  const [secondaryCta, setSecondaryCta] = useState(cms.hero.secondaryCta);
  const [announcement, setAnnouncement] = useState(cms.announcement);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCms("hero", {
      ...cms.hero,
      headline: heroHeading,
      subheadline: heroSubheadline,
      primaryCta,
      secondaryCta
    });
    updateCms("announcement", announcement);
    showToast("Homepage CMS changes saved to live storefront!", "success");
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-800 gap-4">
        <div>
          <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#f5b92e] font-semibold">
            Visual Storytelling CMS
          </span>
          <h1 className="font-serif text-3xl font-bold uppercase tracking-wider text-white mt-1">
            HOMEPAGE CMS MANAGER
          </h1>
          <p className="text-xs text-stone-400 font-sans mt-0.5">
            Modify live typography, hero statements, CTAs, and announcement ribbons dynamically.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 bg-[#e5a110] hover:bg-[#f5b92e] text-[#04160d] text-xs font-serif font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center space-x-2 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Publish to Storefront</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Announcement Bar */}
        <div className="bg-[#072618] border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h2 className="font-serif text-lg font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#e5a110]" />
            <span>Storefront Top Announcement Ribbon</span>
          </h2>
          <div>
            <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">
              Banner Text
            </label>
            <input
              type="text"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#e5a110]"
            />
          </div>
        </div>

        {/* 3D Hero Section */}
        <div className="bg-[#072618] border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <h2 className="font-serif text-lg font-bold text-white flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-[#e5a110]" />
            <span>3D Interactive Hero Settings</span>
          </h2>

          <div>
            <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">
              Main Headline
            </label>
            <input
              type="text"
              value={heroHeading}
              onChange={(e) => setHeroHeading(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white font-serif uppercase tracking-wider focus:outline-none focus:border-[#e5a110]"
            />
          </div>

          <div>
            <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">
              Supporting Subheadline
            </label>
            <textarea
              rows={2}
              value={heroSubheadline}
              onChange={(e) => setHeroSubheadline(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-[#e5a110]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">
                Primary CTA Button
              </label>
              <input
                type="text"
                value={primaryCta}
                onChange={(e) => setPrimaryCta(e.target.value)}
                className="w-full px-4 py-2 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white uppercase tracking-wider focus:outline-none focus:border-[#e5a110]"
              />
            </div>
            <div>
              <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">
                Secondary CTA Button
              </label>
              <input
                type="text"
                value={secondaryCta}
                onChange={(e) => setSecondaryCta(e.target.value)}
                className="w-full px-4 py-2 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white uppercase tracking-wider focus:outline-none focus:border-[#e5a110]"
              />
            </div>
          </div>
        </div>

        {/* Social URL Directives */}
        <div className="bg-[#072618] border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h2 className="font-serif text-lg font-bold text-white">
            Official Brand Social Handles
          </h2>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-serif uppercase tracking-wider text-stone-400 mb-1">Instagram</label>
              <input
                type="text"
                readOnly
                value={cms.social.instagram}
                className="w-full px-4 py-2 bg-[#04160d] border border-stone-800 rounded-xl text-stone-300 font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block font-serif uppercase tracking-wider text-stone-400 mb-1">YouTube</label>
              <input
                type="text"
                readOnly
                value={cms.social.youtube}
                className="w-full px-4 py-2 bg-[#04160d] border border-stone-800 rounded-xl text-stone-300 font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block font-serif uppercase tracking-wider text-stone-400 mb-1">Facebook</label>
              <input
                type="text"
                readOnly
                value={cms.social.facebook}
                className="w-full px-4 py-2 bg-[#04160d] border border-stone-800 rounded-xl text-stone-300 font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-[#e5a110] hover:bg-[#f5b92e] text-[#04160d] font-serif font-bold uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-xl"
        >
          Publish All CMS Updates
        </button>
      </form>
    </div>
  );
}
