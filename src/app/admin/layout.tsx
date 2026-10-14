"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
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
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  KeyRound,
  Grid,
  Percent,
  Warehouse,
  BarChart3,
  Search,
  Bell,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, adminEmail, adminLogin, adminLogout, showToast } = useStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  // Lockscreen credentials state
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If on /admin/login page specifically, let it render login page without wrapping admin sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const email = emailInput.trim().toLowerCase();
    const password = passwordInput.trim();

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        adminLogin(email, password);
        showToast("Authenticated as Master Curator", "success");
      } else {
        setErrorMsg(data.message || "Invalid credentials.");
      }
    } catch {
      setErrorMsg("Authentication failed. Please check connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const autoFillCredentials = () => {
    setEmailInput("loomloft2026@gmail.com");
    setPasswordInput("Admin@2026");
    setErrorMsg("");
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {}
    adminLogout();
    router.push("/admin/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Orders & Dispatch", href: "/admin/orders", icon: ShoppingBag },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: Grid },
    { label: "Collections", href: "/admin/collections", icon: Layers },
    { label: "Offers & Coupons", href: "/admin/offers", icon: Percent },
    { label: "Inventory", href: "/admin/inventory", icon: Warehouse },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Patron Reviews", href: "/admin/reviews", icon: Star },
    { label: "Homepage CMS", href: "/admin/homepage", icon: Sliders },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Store Settings", href: "/admin/settings", icon: Settings },
  ];

  // If not authenticated, render luxury security lock screen
  if (!isAdmin) {
    return (
      <div className="relative min-h-screen bg-[#020b06] text-white flex items-center justify-center p-4 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] bg-[#e5a110]/15 rounded-full blur-[160px] pointer-events-none" />

        <div className="relative w-full max-w-md glass-panel rounded-3xl p-8 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-center space-y-6 z-10 border border-[#e5a110]/35 backdrop-blur-2xl">
          <div className="relative w-14 h-18 mx-auto flex items-center justify-center p-2 rounded-2xl glass-pill-gold shadow-lg">
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
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full glass-pill-gold text-[#f5b92e] text-[10px] font-serif uppercase tracking-[0.25em] mb-2 font-semibold">
              <KeyRound className="w-3 h-3 text-[#f5b92e]" />
              <span>Admin Authentication Required</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white mt-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              LOOM LOFT ADMIN
            </h1>
            <p className="text-xs text-stone-300 font-sans mt-2 leading-relaxed">
              Curator credentials required to access orders, live tracking, and stock inventory.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/50 rounded-xl text-rose-200 text-xs text-left">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] font-serif uppercase tracking-wider text-stone-300 mb-1.5 font-semibold">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#f5b92e] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  placeholder="loomloft2026@gmail.com"
                  className="w-full pl-10 pr-4 py-3 glass-input rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-serif uppercase tracking-wider text-stone-300 mb-1.5 font-semibold">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#f5b92e] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 glass-input rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-[#e5a110] to-[#f5b92e] hover:from-[#f5b92e] hover:to-[#e5a110] text-[#04160d] rounded-xl text-xs font-serif uppercase tracking-widest font-bold transition-all shadow-[0_0_20px_rgba(229,161,16,0.3)] flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
            >
              <span>{isLoading ? "Verifying..." : "Unlock Atelier Console"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={autoFillCredentials}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg glass-card hover:bg-white/10 text-[11px] text-[#f5b92e] hover:text-white border border-[#e5a110]/30 transition-all cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-[#f5b92e]" />
                <span>Quick Fill Credentials</span>
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-white/10 space-y-1 text-left text-[11px] text-stone-300 bg-black/30 p-3.5 rounded-2xl border border-white/5">
            <div className="flex items-center space-x-1.5 text-[#f5b92e] font-serif uppercase tracking-wider text-[10px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Credentials Reference</span>
            </div>
            <div className="flex justify-between font-mono text-[11px] text-stone-300">
              <span className="text-stone-400">Email:</span>
              <span className="text-white font-semibold">loomloft2026@gmail.com</span>
            </div>
            <div className="flex justify-between font-mono text-[11px] text-stone-300">
              <span className="text-stone-400">Password:</span>
              <span className="text-white font-semibold">Admin@2026</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#07130c] text-stone-100 flex flex-col md:flex-row overflow-x-hidden font-sans">
      {/* Background Ambient Glow */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-10 w-[550px] h-[550px] bg-[#e5a110]/10 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0a1a12] border-b border-[#e5a110]/20 z-30 sticky top-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-lg bg-black/40 text-stone-300 hover:text-white border border-white/10"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="relative w-6 h-8">
            <Image src="/logo.png" alt="LoomLoft" fill className="object-contain" />
          </div>
          <span className="font-serif tracking-widest text-xs font-bold text-[#f5b92e]">
            LOOM LOFT ADMIN
          </span>
        </div>

        <Link
          href="/"
          className="p-2 rounded-lg bg-black/40 text-stone-300 hover:text-white border border-white/10 text-xs flex items-center space-x-1"
        >
          <span>Store</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#f5b92e]" />
        </Link>
      </div>

      {/* Shopify-style Admin Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-40 w-72 bg-[#091811] border-r border-[#e5a110]/20 p-5 flex flex-col justify-between shrink-0 transition-transform duration-300 md:translate-x-0 overflow-y-auto h-screen ${
          mobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* Logo Brand Header */}
          <div className="flex items-center justify-between pb-5 border-b border-[#e5a110]/20">
            <div className="flex items-center space-x-3">
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
                <span className="font-serif tracking-[0.2em] text-xs font-bold text-[#f5b92e] block">
                  LOOM LOFT
                </span>
                <span className="text-[10px] tracking-wider text-stone-400 uppercase font-sans">
                  Atelier Control
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href === "/admin/dashboard" && pathname === "/admin") ||
                (item.href !== "/admin" &&
                  item.href !== "/admin/dashboard" &&
                  pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-serif uppercase tracking-wider transition-all group ${
                    isActive
                      ? "bg-gradient-to-r from-[#e5a110] to-[#f5b92e] text-[#04160d] font-bold shadow-[0_0_15px_rgba(229,161,16,0.25)]"
                      : "text-stone-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? "text-[#04160d]" : "text-[#e5a110]"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#04160d]" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Actions */}
        <div className="pt-5 border-t border-[#e5a110]/20 space-y-2 mt-6">
          <div className="px-3.5 py-2.5 rounded-xl bg-black/40 text-[11px] border border-white/5 flex items-center space-x-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0 shadow-[0_0_8px_#34d399]" />
            <div className="truncate">
              <span className="block text-[9px] uppercase tracking-wider text-[#f5b92e] font-serif font-semibold">
                Master Curator
              </span>
              <span className="text-white font-mono text-[10px] truncate block opacity-90">
                {adminEmail || "loomloft2026@gmail.com"}
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 text-xs text-stone-300 hover:text-[#f5b92e] hover:border-[#e5a110]/40 transition-all group border border-transparent"
          >
            <span className="font-serif uppercase tracking-wider">Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 w-full px-3.5 py-2.5 rounded-xl text-xs text-rose-300 hover:bg-rose-950/40 border border-transparent hover:border-rose-800/40 transition-all font-serif uppercase tracking-wider cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Lock Console</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Viewport with Top Header */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-[#0a1a12]/90 backdrop-blur-md border-b border-[#e5a110]/20 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-20">
          {/* Global Search Bar */}
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-[#f5b92e] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search orders, customers, SKUs, tracking..."
              className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-[#e5a110]/60 transition-all"
            />
          </div>

          {/* Header Action Badges */}
          <div className="flex items-center space-x-4 pl-4">
            {/* Quick status pill */}
            <div className="hidden sm:inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#12372a] text-[#f5b92e] border border-[#e5a110]/30 text-[10px] font-serif uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Appwrite TablesDB &bull; Active</span>
            </div>

            {/* Notifications */}
            <button
              onClick={() => showToast("All system webhooks and tracking logs healthy", "info")}
              className="relative p-2 rounded-xl bg-black/40 text-stone-300 hover:text-white border border-white/10 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#f5b92e]" />
            </button>

            {/* Admin Avatar */}
            <div className="flex items-center space-x-2 pl-2 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-[#12372a] border border-[#e5a110]/40 flex items-center justify-center font-serif text-xs font-bold text-[#f5b92e]">
                LL
              </div>
            </div>
          </div>
        </header>

        {/* Content Page */}
        <main className="flex-1 p-6 sm:p-10 overflow-y-auto z-10">{children}</main>
      </div>
    </div>
  );
}
