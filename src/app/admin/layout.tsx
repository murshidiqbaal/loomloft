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
      <div className="min-h-screen bg-[#04160d] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#072618] border border-[#e5a110]/40 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="relative w-14 h-16 mx-auto overflow-hidden rounded bg-[#04160d] p-1 border border-[#e5a110]/40">
            <Image
              src="/images/loomloft-logo.jpeg"
              alt="LoomLoft Logo"
              fill
              className="object-contain"
            />
          </div>

          <div>
            <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#f5b92e] font-semibold block">
              Curator Management Console
            </span>
            <h1 className="font-serif text-2xl font-bold uppercase tracking-wider text-white mt-1">
              LOOM LOFT ADMIN
            </h1>
            <p className="text-xs text-stone-400 font-sans mt-2">
              Protected authentication required to manage handloom inventory, live orders, and homepage CMS.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <label className="block text-[11px] font-serif uppercase tracking-wider text-stone-300 mb-1">
                Admin Security Passkey
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#e5a110] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter passkey (e.g. loomloft2026)"
                  className="w-full pl-10 pr-4 py-3 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#e5a110]"
                  required
                />
              </div>
              {errorMsg && (
                <p className="text-[11px] text-rose-400 mt-1.5">{errorMsg}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#e5a110] hover:bg-[#f5b92e] text-[#04160d] font-serif font-bold uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2"
            >
              <span>Unlock Admin Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-stone-800 text-[11px] text-stone-500 flex items-center justify-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted Session • Passkey: <strong>loomloft2026</strong></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#04160d] text-stone-100 flex flex-col md:flex-row">
      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#072618] border-r border-[#e5a110]/20 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Logo & Curator Badge */}
          <div className="flex items-center space-x-3 pb-6 border-b border-[#e5a110]/20">
            <div className="relative w-8 h-10 overflow-hidden rounded bg-[#04160d] p-0.5 border border-[#e5a110]/40">
              <Image
                src="/images/loomloft-logo.jpeg"
                alt="LoomLoft"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-serif tracking-[0.2em] text-sm font-bold text-[#e5a110] block">
                LOOM LOFT
              </span>
              <span className="text-[9px] font-serif uppercase tracking-[0.25em] text-emerald-400">
                Curator Portal
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
                      ? "bg-[#0d3824] text-[#f5b92e] font-bold border border-[#e5a110]/30 shadow-md"
                      : "text-stone-300 hover:bg-[#0d3824]/60 hover:text-white"
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
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#04160d] border border-stone-800 text-xs text-stone-300 hover:text-[#e5a110] transition-colors"
          >
            <span className="font-serif uppercase tracking-wider">Storefront View</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={adminLogout}
            className="flex items-center space-x-2 w-full px-3.5 py-2.5 rounded-xl text-xs text-rose-400 hover:bg-rose-950/30 transition-colors font-serif uppercase tracking-wider"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock Console</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Viewport */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
