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
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
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
    { label: "New Arrivals", href: "/products?filter=new" },
    { label: "Our Story", href: "/about" },
  ];

  const isHome = pathname === "/";
  // On home, start transparent if not scrolled. On other pages, provide dark forest background
  const navBgClass = scrolled || !isHome
    ? "bg-[#072618]/95 backdrop-blur-md border-b border-[#e5a110]/20 shadow-lg py-3 text-cream"
    : "bg-transparent py-5 text-white";

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#04160d] text-[#e5a110] text-[10px] sm:text-xs py-2 px-4 tracking-[0.2em] font-serif uppercase text-center border-b border-[#e5a110]/20 relative z-50">
        <span className="inline-block animate-pulse mr-2 font-bold">•</span>
        {cms.announcement}
        <span className="inline-block animate-pulse ml-2 font-bold">•</span>
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-300 w-full ${navBgClass}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* LEFT: Official Logo */}
            <Link
              href="/"
              className="flex items-center space-x-3 group cursor-pointer focus:outline-none"
            >
              <div className="relative w-9 h-11 sm:w-10 sm:h-12 overflow-hidden rounded bg-[#072618]/60 p-0.5 border border-[#e5a110]/40 group-hover:border-[#f5b92e] transition-colors">
                <Image
                  src="/images/loomloft-logo.jpeg"
                  alt="LoomLoft Official Logo"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif tracking-[0.25em] text-lg sm:text-xl font-bold uppercase text-[#e5a110] group-hover:text-[#f5b92e] transition-colors leading-none">
                  LOOM LOFT
                </span>
                <span className="font-serif tracking-[0.3em] text-[8px] uppercase text-stone-300 mt-1">
                  QUALITY IN EVERY THREAD
                </span>
              </div>
            </Link>

            {/* CENTER: Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative group text-xs uppercase tracking-[0.18em] font-medium font-sans text-stone-200 hover:text-[#e5a110] transition-colors py-1"
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
            <div className="flex items-center space-x-3 sm:space-x-5">
              {/* Search Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-stone-200 hover:text-[#e5a110] hover:scale-110 transition-all rounded-full"
                aria-label="Open Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="relative p-2 text-stone-200 hover:text-[#e5a110] hover:scale-110 transition-all rounded-full"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#e5a110] text-[#04160d] text-[10px] font-bold flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Account Link */}
              <Link
                href="/account"
                className="hidden sm:inline-flex p-2 text-stone-200 hover:text-[#e5a110] hover:scale-110 transition-all rounded-full"
                aria-label="Account Profile"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Admin Quick Indicator */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hidden md:inline-flex items-center space-x-1 px-2.5 py-1 text-[10px] tracking-wider uppercase font-serif bg-[#e5a110] text-[#04160d] rounded-md font-semibold"
                  title="Admin Portal Active"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-stone-200 hover:text-[#e5a110] hover:scale-110 transition-all rounded-full"
                aria-label="Open Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#e5a110] text-[#04160d] text-[10px] font-bold flex items-center justify-center"
                  >
                    {totalCartCount}
                  </motion.span>
                )}
              </button>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-stone-200 hover:text-[#e5a110] transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-[#e5a110]" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
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
                <div className="relative w-8 h-10">
                  <Image
                    src="/images/loomloft-logo.jpeg"
                    alt="LoomLoft"
                    fill
                    className="object-contain"
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
