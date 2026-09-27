"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { cart, wishlist, setCartOpen, setSearchOpen, cms, isAdmin } = useStore();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Collections", href: "/collections" },
    { label: "Handloom", href: "/collections/heritage-series" },
    { label: "Men", href: "/collections/crafted-elegance" },
    { label: "Women", href: "/collections/ethereal-weaves" },
    { label: "Our Story", href: "/about" },
  ];

  const isHome = pathname === "/";

  return (
    <>
      {/* Announcement Bar - Only show on sub-pages when at the very top */}
      {!isHome && !scrolled && (
        <div className="bg-[#04160d]/95 backdrop-blur-sm text-[#e5a110] text-[10px] sm:text-xs py-1.5 px-4 tracking-[0.2em] font-serif uppercase text-center border-b border-[#e5a110]/20 relative z-50 transition-all duration-300">
          <span className="inline-block animate-pulse mr-2 font-bold">•</span>
          {cms.announcement}
          <span className="inline-block animate-pulse ml-2 font-bold">•</span>
        </div>
      )}

      {/* Floating Transition Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-out flex justify-center ${
          scrolled
            ? "pt-3 sm:pt-4 px-3 sm:px-6 pointer-events-none"
            : isHome
            ? "pt-4 pb-4 px-4 sm:px-8 bg-transparent pointer-events-auto"
            : "pt-3 pb-3 px-4 sm:px-8 bg-[#072618]/95 border-b border-[#e5a110]/20 shadow-lg pointer-events-auto"
        }`}
      >
        <div
          className={`w-full transition-all duration-500 ease-out flex items-center justify-between ${
            scrolled
              ? "max-w-5xl rounded-full bg-[#030b06]/85 backdrop-blur-xl border border-white/15 shadow-[0_14px_40px_rgba(0,0,0,0.7),0_0_20px_rgba(229,161,16,0.08)] py-2 sm:py-2.5 px-5 sm:px-7 pointer-events-auto"
              : "max-w-7xl rounded-none bg-transparent border-transparent py-0 px-2 sm:px-4 pointer-events-auto"
          }`}
        >
          {/* LEFT: Official Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2.5 sm:space-x-3 group cursor-pointer focus:outline-none flex-shrink-0"
          >
            <div
              className={`relative flex items-center justify-center transition-all duration-500 ${
                scrolled ? "w-6 h-9" : "w-7 sm:w-8 h-10 sm:h-12"
              }`}
            >
              <Image
                src="/logo.png"
                alt="LoomLoft Official Logo"
                fill
                priority
                className="object-contain drop-shadow-[0_0_8px_rgba(245,185,46,0.5)] group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="flex flex-col">
              <span
                className={`font-serif tracking-[0.22em] font-bold uppercase text-[#e5a110] group-hover:text-[#f5b92e] transition-all leading-none ${
                  scrolled ? "text-base sm:text-lg" : "text-lg sm:text-xl"
                }`}
              >
                LOOM LOFT
              </span>
              <span
                className={`font-serif tracking-[0.28em] text-[7px] sm:text-[8px] uppercase text-stone-300 mt-1 transition-all ${
                  scrolled ? "hidden md:block" : "block"
                }`}
              >
                QUALITY IN EVERY THREAD
              </span>
            </div>
          </Link>

          {/* CENTER: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative group text-[11px] xl:text-xs uppercase tracking-[0.18em] font-medium font-sans text-stone-200 hover:text-[#e5a110] transition-colors py-1"
                >
                  <span>{link.label}</span>
                  <span
                    className={`absolute bottom-0 left-0 h-[1.5px] bg-[#e5a110] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Action Icons */}
          <div
            className={`flex items-center space-x-2 sm:space-x-3.5 ${
              scrolled ? "pl-2 sm:pl-3 border-l border-white/10" : ""
            }`}
          >
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-1.5 sm:p-2 text-stone-200 hover:text-[#e5a110] hover:scale-110 transition-all rounded-full"
              aria-label="Open Search"
            >
              <Search className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-1.5 sm:p-2 text-stone-200 hover:text-[#e5a110] hover:scale-110 transition-all rounded-full"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#e5a110] text-[#04160d] text-[9px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Account Link */}
            <Link
              href="/account"
              className="hidden sm:inline-flex p-1.5 sm:p-2 text-stone-200 hover:text-[#e5a110] hover:scale-110 transition-all rounded-full"
              aria-label="Account Profile"
            >
              <User className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </Link>

            {/* Admin Quick Indicator */}
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden md:inline-flex items-center space-x-1 px-2 py-0.5 text-[9px] tracking-wider uppercase font-serif bg-[#e5a110] text-[#04160d] rounded-md font-semibold"
                title="Admin Portal Active"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Admin</span>
              </Link>
            )}

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-1.5 sm:p-2 text-stone-200 hover:text-[#e5a110] hover:scale-110 transition-all rounded-full"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              {totalCartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#e5a110] text-[#04160d] text-[9px] font-bold flex items-center justify-center"
                >
                  {totalCartCount}
                </motion.span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-stone-200 hover:text-[#e5a110] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#e5a110]" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Slide-Out Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
            className="fixed inset-0 z-50 lg:hidden bg-[#072618] text-cream flex flex-col p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-6 border-b border-[#e5a110]/20">
              <div className="flex items-center space-x-3">
                <div className="relative w-7 h-11 flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="LoomLoft"
                    fill
                    className="object-contain drop-shadow-[0_0_8px_rgba(245,185,46,0.5)]"
                  />
                </div>
                <div>
                  <h3 className="font-serif tracking-[0.25em] text-lg font-bold text-[#e5a110]">
                    LOOM LOFT
                  </h3>
                  <p className="text-[8px] tracking-[0.3em] text-stone-300 uppercase font-serif">
                    QUALITY IN EVERY THREAD
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-stone-300 hover:text-[#e5a110]"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col space-y-4 my-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between text-base uppercase font-serif tracking-[0.2em] text-stone-200 hover:text-[#e5a110] py-2 border-b border-stone-800"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-[#e5a110]/60" />
                </Link>
              ))}

              <Link
                href="/style-finder"
                className="flex items-center justify-between text-base uppercase font-serif tracking-[0.2em] text-[#e5a110] py-2 border-b border-stone-800 font-semibold"
              >
                <span>Style Consultation Quiz</span>
                <ArrowRight className="w-4 h-4 text-[#e5a110]" />
              </Link>
            </nav>

            <div className="mt-auto space-y-4 pt-6 border-t border-[#e5a110]/20">
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/account"
                  className="flex items-center justify-center space-x-2 py-3 bg-[#0d3824] border border-[#e5a110]/30 rounded-xl text-xs uppercase tracking-wider font-medium text-stone-200"
                >
                  <User className="w-4 h-4 text-[#e5a110]" />
                  <span>My Account</span>
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center justify-center space-x-2 py-3 bg-[#0d3824] border border-[#e5a110]/30 rounded-xl text-xs uppercase tracking-wider font-medium text-stone-200"
                >
                  <Heart className="w-4 h-4 text-[#e5a110]" />
                  <span>Wishlist ({wishlist.length})</span>
                </Link>
              </div>

              <Link
                href="/admin"
                className="flex items-center justify-center space-x-2 w-full py-2.5 bg-[#04160d] border border-[#e5a110]/20 rounded-xl text-[11px] uppercase tracking-widest text-stone-400 hover:text-[#e5a110]"
              >
                <ShieldCheck className="w-4 h-4 text-[#e5a110]" />
                <span>Admin Management</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
