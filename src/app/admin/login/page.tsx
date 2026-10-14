"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  KeyRound,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin, showToast } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      // 1. If Supabase Auth is configured, attempt Supabase Auth sign-in
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (error) {
          console.warn("Supabase sign-in notice:", error.message);
        } else if (data.user) {
          const role =
            data.user.app_metadata?.role || data.user.user_metadata?.role || "";
          if (role.toLowerCase() !== "admin" && cleanEmail !== "loomloft2026@gmail.com") {
            setErrorMsg("Forbidden: You do not possess ADMIN role permissions.");
            setIsLoading(false);
            return;
          }
        }
      }

      // 2. Call server-side admin verification endpoint
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        adminLogin(cleanEmail, cleanPassword);
        showToast("Authenticated as Master Curator", "success");
        router.push("/admin/dashboard");
      } else {
        setErrorMsg(data.message || "Invalid credentials. Please verify your login.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed. Please check network connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const autoFillDemo = () => {
    setEmail("loomloft2026@gmail.com");
    setPassword("Admin@2026");
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen bg-[#020b06] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background light orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] bg-[#e5a110]/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md glass-panel rounded-3xl p-8 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-center space-y-6 z-10 border border-[#e5a110]/35 backdrop-blur-2xl">
        {/* Brand Emblem */}
        <div className="relative w-16 h-20 mx-auto flex items-center justify-center p-2 rounded-2xl glass-pill-gold shadow-lg">
          <div className="relative w-12 h-16">
            <Image
              src="/logo.png"
              alt="LoomLoft"
              fill
              className="object-contain drop-shadow-[0_0_12px_rgba(245,185,46,0.7)]"
            />
          </div>
        </div>

        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full glass-pill-gold text-[#f5b92e] text-[10px] font-serif uppercase tracking-[0.25em] mb-2 font-semibold">
            <KeyRound className="w-3 h-3 text-[#f5b92e]" />
            <span>Master Guild Administration</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white mt-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            LOOM LOFT ADMIN
          </h1>
          <p className="text-xs text-stone-300 font-sans mt-2 leading-relaxed">
            Curator credentials required to access order management, stock inventory, and live tracking.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-950/60 border border-rose-500/50 rounded-xl text-rose-200 text-xs text-left animate-shake">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          {/* Email */}
          <div>
            <label className="block text-[11px] font-serif uppercase tracking-wider text-stone-300 mb-1.5 font-semibold">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#f5b92e] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                placeholder="loomloft2026@gmail.com"
                className="w-full pl-10 pr-4 py-3 glass-input rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-serif uppercase tracking-wider text-stone-300 mb-1.5 font-semibold">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#f5b92e] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
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
            <span>{isLoading ? "Verifying Credentials..." : "Access Admin Console"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Auto fill helper */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={autoFillDemo}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg glass-card hover:bg-white/10 text-[11px] text-[#f5b92e] hover:text-white border border-[#e5a110]/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#f5b92e]" />
              <span>Fill Admin Credentials</span>
            </button>
          </div>
        </form>

        {/* Credentials reminder */}
        <div className="pt-4 border-t border-white/10 space-y-1 text-left text-[11px] text-stone-300 bg-black/40 p-3 rounded-2xl border border-white/5">
          <div className="flex items-center space-x-1.5 text-[#f5b92e] font-serif uppercase tracking-wider text-[10px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Master Guild Credentials</span>
          </div>
          <div className="flex justify-between font-mono text-[10px] pt-1">
            <span className="text-stone-400">Email:</span>
            <span className="text-white">loomloft2026@gmail.com</span>
          </div>
          <div className="flex justify-between font-mono text-[10px]">
            <span className="text-stone-400">Password:</span>
            <span className="text-white">Admin@2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
