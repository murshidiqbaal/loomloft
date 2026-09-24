"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { InstagramIcon, YouTubeIcon, FacebookIcon } from "@/components/icons/BrandIcons";
import { useStore } from "@/context/StoreContext";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useStore();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      showToast("Please enter a valid email address", "error");
      return;
    }
    setSubscribed(true);
    showToast("Welcome to The Loom circle! 15% code sent.", "success");
    setEmail("");
  };

  return (
    <footer className="bg-[#04160d] text-stone-300 border-t border-[#e5a110]/20 pt-16 pb-12 relative overflow-hidden">
      {/* Subtle background golden thread glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#e5a110] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter Section: "JOIN THE LOOM" */}
        <div className="bg-[#072618] border border-[#e5a110]/30 rounded-3xl p-8 sm:p-12 mb-16 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-2">
              <div className="inline-flex items-center space-x-2 text-[#e5a110] text-xs font-serif uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Loom Circle</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-white tracking-wide">
                JOIN THE LOOM
              </h3>
              <p className="text-sm text-stone-300 font-sans max-w-md leading-relaxed">
                Receive intimate invitations to private weaver drops, textile conservation journals, and 15% privilege code on your first handcrafted order.
              </p>
            </div>

            <div className="lg:col-span-6">
              {subscribed ? (
                <div className="flex items-center space-x-3 p-4 bg-[#0d3824] border border-[#e5a110] rounded-2xl text-[#f5b92e]">
                  <Check className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-serif tracking-wide">
                    You are now connected to the LoomLoft guild. Use code <strong>FIRSTLOOM</strong> at checkout.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-5 py-3.5 bg-[#04160d] border border-stone-700 focus:border-[#e5a110] rounded-xl text-sm text-white placeholder-stone-400 focus:outline-none transition-colors"
                    required
                  />
                  <button
                    type="submit"
                    className="px-7 py-3.5 bg-[#e5a110] hover:bg-[#f5b92e] text-[#04160d] text-xs font-serif font-bold uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center space-x-2 shrink-0 shadow-lg"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-10 h-12 overflow-hidden rounded bg-[#072618] p-0.5 border border-[#e5a110]/40">
                <Image
                  src="/images/loomloft-logo.jpeg"
                  alt="LoomLoft Official Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-serif tracking-[0.25em] text-xl font-bold uppercase text-[#e5a110]">
                  LOOM LOFT
                </span>
                <p className="font-serif tracking-[0.3em] text-[8px] uppercase text-stone-400 mt-1">
                  QUALITY IN EVERY THREAD
                </p>
              </div>
            </Link>
            <p className="text-xs text-stone-400 leading-relaxed font-sans max-w-sm">
              Honoring India&apos;s sacred handloom heritage. Every textile is created in artisan clusters across Chanderi, Kanchipuram, Varanasi, Kutch, and Srinagar without mechanical compromise.
            </p>

            {/* Official Social Links */}
            <div className="pt-2">
              <p className="text-[11px] font-serif uppercase tracking-[0.2em] text-[#e5a110] mb-3">
                Follow LoomLoft
              </p>
              <div className="flex items-center space-x-3">
                <a
                  href="https://www.instagram.com/loom_loft_/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#072618] border border-[#e5a110]/40 flex items-center justify-center text-stone-300 hover:text-[#f5b92e] hover:border-[#f5b92e] transition-all"
                  aria-label="LoomLoft Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://www.youtube.com/@LoomLoft-Handloom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#072618] border border-[#e5a110]/40 flex items-center justify-center text-stone-300 hover:text-[#f5b92e] hover:border-[#f5b92e] transition-all"
                  aria-label="LoomLoft YouTube"
                >
                  <YouTubeIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://www.facebook.com/Loomloft.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#072618] border border-[#e5a110]/40 flex items-center justify-center text-stone-300 hover:text-[#f5b92e] hover:border-[#f5b92e] transition-all"
                  aria-label="LoomLoft Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-[0.2em] font-semibold text-white mb-4">
              Shop Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/collections" className="hover:text-[#e5a110] transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link href="/collections/heritage-series" className="hover:text-[#e5a110] transition-colors">
                  The Heritage Series
                </Link>
              </li>
              <li>
                <Link href="/collections/crafted-elegance" className="hover:text-[#e5a110] transition-colors">
                  Men&apos;s Tailored Handloom
                </Link>
              </li>
              <li>
                <Link href="/collections/ethereal-weaves" className="hover:text-[#e5a110] transition-colors">
                  Women&apos;s Jamdani & Silk
                </Link>
              </li>
              <li>
                <Link href="/collections/artisan-earth" className="hover:text-[#e5a110] transition-colors">
                  Natural Plant Dyes
                </Link>
              </li>
              <li>
                <Link href="/products?filter=new" className="hover:text-[#e5a110] transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* The Guild / Company */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-[0.2em] font-semibold text-white mb-4">
              Our Craft & Ethos
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/about" className="hover:text-[#e5a110] transition-colors">
                  Our Story: From Thread to Trend
                </Link>
              </li>
              <li>
                <Link href="/style-finder" className="hover:text-[#e5a110] transition-colors">
                  Style Consultation Quiz
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-[#e5a110] transition-colors">
                  LoomLoft Community & UGC
                </Link>
              </li>
              <li>
                <Link href="/about#artisans" className="hover:text-[#e5a110] transition-colors">
                  Master Weavers Guild
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#e5a110] transition-colors">
                  Bespoke Bridal Appointments
                </Link>
              </li>
            </ul>
          </div>

          {/* Care & Concierge */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-[0.2em] font-semibold text-white mb-4">
              Care & Support
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/contact" className="hover:text-[#e5a110] transition-colors">
                  Contact Concierge
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-[#e5a110] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <span className="hover:text-[#e5a110] transition-colors cursor-pointer">
                  Handloom Care Protocol
                </span>
              </li>
              <li>
                <span className="hover:text-[#e5a110] transition-colors cursor-pointer">
                  Complimentary Insured Shipping
                </span>
              </li>
              <li>
                <span className="hover:text-[#e5a110] transition-colors cursor-pointer">
                  7-Day Heirloom Exchanges
                </span>
              </li>
              <li>
                <Link href="/admin" className="text-stone-500 hover:text-[#e5a110] transition-colors">
                  Curator Portal (Admin)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} LOOM LOFT. All Rights Reserved. Dedicated to India&apos;s Master Weavers.</p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0 font-serif">
            <span>GI Tag Certified</span>
            <span>•</span>
            <span>Silk Mark Certified</span>
            <span>•</span>
            <span>100% Zero-Carbon Handlooms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
