"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  Star,
  Sliders,
  Settings,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Lock,
  ArrowRight
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAdmin, adminLogin, adminLogout } = useStore();
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const success = adminLogin(passwordInput);
    if (!success) {
      setErrorMsg("Incorrect security passkey. (Default: loomloft2026 or admin)");
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products & Stock", href: "/admin/products", icon: Package },
    { label: "Orders & Transit", href: "/admin/orders", icon: ShoppingBag },
    { label: "Collections", href: "/admin/collections", icon: Layers },
    { label: "Coupons & Discounts", href: "/admin/coupons", icon: Tag },
    { label: "Patron Reviews", href: "/admin/reviews", icon: Star },
    { label: "Homepage CMS", href: "/admin/homepage", icon: Sliders },
    { label: "Store Settings", href: "/admin/settings", icon: Settings },
  ];

  // If not authenticated, render luxury security lock screen
  if (!isAdmin) {
    return (
      <div className="relative min-h-screen bg-[#020b06] text-white flex items-center justify-center p-4 overflow-hidden">
        {/* Ambient Floating Luminous Glass Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none animate-orb-1" />
        <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] bg-[#e5a110]/15 rounded-full blur-[130px] pointer-events-none animate-orb-2" />
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-teal-500/15 rounded-full blur-[100px] pointer-events-none animate-orb-3" />

        {/* Glassmorphic Security Vault Card */}
        <div className="relative w-full max-w-md glass-panel rounded-3xl p-8 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-center space-y-6 z-10 border border-[#e5a110]/35">
          <div className="relative w-14 h-18 mx-auto flex items-center justify-center p-2 rounded-2xl glass-pill-gold">
            <div className="relative w-10 h-14">
              <Image
                src="/logo.png"
                alt="LoomLoft Logo"
                fill
                className="object-contain drop-shadow-[0_0_12px_rgba(245,185,46,0.7)]"
              />
            </div>
          </div>

          <div>
            <span className="text-[10px] font-serif uppercase tracking-[0.28em] text-[#f5b92e] font-semibold block">
              Curator Management Console
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white mt-1.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              LOOM LOFT ADMIN
            </h1>
            <p className="text-xs text-stone-300 font-sans mt-2 leading-relaxed">
              Protected atelier clearance required to oversee handloom telemetry, dispatch parcels, and stock reserves.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <label className="block text-[11px] font-serif uppercase tracking-wider text-stone-300 mb-1.5">
                Admin Security Passkey
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#f5b92e] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter passkey (e.g. loomloft2026)"
                  className="w-full pl-10 pr-4 py-3 glass-input rounded-xl text-xs text-white placeholder-stone-400 focus:outline-none"
                  required
                />
              </div>
              {errorMsg && (
                <p className="text-[11px] text-rose-300 mt-2 font-sans bg-rose-950/40 border border-rose-800/40 p-2 rounded-lg">
                  {errorMsg}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn-loom w-full py-3.5 bg-gradient-to-r from-[#e5a110] via-[#f5b92e] to-[#e5a110] hover:brightness-110 text-[#04160d] font-serif font-bold uppercase tracking-widest text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(229,161,16,0.3)] flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Unlock Admin Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 text-[11px] text-stone-400 flex items-center justify-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted Atelier Session • Passkey: <strong className="text-white font-mono">loomloft2026</strong></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#020b06] text-stone-100 flex flex-col md:flex-row overflow-x-hidden">
      {/* Background Ambient Glowing Refraction Orbs */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none animate-orb-1 z-0" />
      <div className="fixed bottom-0 right-10 w-[550px] h-[550px] bg-[#e5a110]/12 rounded-full blur-[160px] pointer-events-none animate-orb-2 z-0" />
      <div className="fixed top-1/2 left-1/3 w-[400px] h-[400px] bg-teal-600/10 rounded-full blur-[130px] pointer-events-none animate-orb-3 z-0" />

      {/* Admin Glassmorphic Sidebar Navigation */}
      <aside className="relative w-full md:w-64 glass-panel rounded-none border-r border-[#e5a110]/20 p-6 flex flex-col justify-between shrink-0 z-20 backdrop-blur-2xl bg-[#04160d]/70">
        <div className="space-y-6">
          {/* Logo & Curator Badge */}
          <div className="flex items-center space-x-3 pb-6 border-b border-[#e5a110]/20">
            <div className="relative w-8 h-10 flex items-center justify-center p-1 rounded-xl glass-pill-gold">
              <div className="relative w-6 h-8">
                <Image
                  src="/logo.png"
                  alt="LoomLoft"
                  fill
                  className="object-contain drop-shadow-[0_0_8px_rgba(245,185,46,0.6)]"
                />
              </div>
            </div>
            <div>
              <span className="font-serif tracking-[0.2em] text-sm font-bold text-[#f5b92e] block drop-shadow-[0_0_8px_rgba(245,185,46,0.3)]">
                LOOM LOFT
              </span>
              <span className="text-[9px] font-serif uppercase tracking-[0.25em] text-emerald-300 font-semibold flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Curator Portal</span>
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-serif uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-[#e5a110]/25 via-[#f5b92e]/15 to-transparent text-[#f5b92e] font-bold border border-[#e5a110]/40 shadow-[0_0_15px_rgba(229,161,16,0.15)] backdrop-blur-md"
                      : "text-stone-300 hover:bg-white/[0.05] hover:text-white hover:border hover:border-white/10"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#f5b92e]" : "text-stone-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: Visit Store & Logout */}
        <div className="pt-6 border-t border-[#e5a110]/20 space-y-2 mt-8 md:mt-0">
          <Link
            href="/"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl glass-panel-subtle text-xs text-stone-300 hover:text-[#f5b92e] hover:border-[#e5a110]/40 transition-all group"
          >
            <span className="font-serif uppercase tracking-wider">Storefront View</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <button
            onClick={adminLogout}
            className="flex items-center space-x-2 w-full px-3.5 py-2.5 rounded-xl text-xs text-rose-300 hover:bg-rose-950/40 hover:border hover:border-rose-800/40 transition-all font-serif uppercase tracking-wider cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Lock Console</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Viewport */}
      <main className="relative flex-1 p-6 sm:p-10 overflow-y-auto z-10">
        {children}
      </main>
    </div>
  );
}
