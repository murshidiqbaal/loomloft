"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { OrderRecord, OrderStatus } from "@/types/ecommerce";
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Search,
} from "lucide-react";

export default function CustomerMyOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to load customer orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Auto refetch when tab becomes active
    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchOrders();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-900 border-blue-300";
      case "PROCESSING":
      case "PACKED":
        return "bg-purple-100 text-purple-900 border-purple-300";
      case "SHIPPED":
      case "IN_TRANSIT":
      case "OUT_FOR_DELIVERY":
        return "bg-emerald-100 text-emerald-900 border-emerald-300";
      case "DELIVERED":
        return "bg-[#12372a] text-[#f5b92e] border-[#12372a]";
      case "CANCELLED":
      case "REFUNDED":
        return "bg-rose-100 text-rose-900 border-rose-300";
      default:
        return "bg-stone-100 text-stone-800 border-stone-300";
    }
  };

  return (
    <div className="bg-[#FAF7F2] text-stone-900 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs font-serif uppercase tracking-widest text-stone-500 mb-8">
          <Link href="/" className="hover:text-[#072618]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#072618] font-bold">My Orders</span>
        </div>

        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#12372a]/10 text-[#12372a] border border-[#12372a]/20 text-[10px] font-serif uppercase tracking-widest font-semibold mb-2">
              <Package className="w-3 h-3 text-[#12372a]" />
              <span>Patron Wardrobe Archive</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] text-[#072618]">
              MY ORDERS &amp; DISPATCH
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 font-sans mt-1">
              Review current artisan handloom commissions, parcel timelines, and tracking records.
            </p>
          </div>

          <Link
            href="/track-order"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#072618] hover:bg-[#12372a] text-white text-xs font-serif uppercase tracking-widest font-semibold transition-all shadow-md self-start sm:self-auto"
          >
            <Truck className="w-3.5 h-3.5 text-[#f5b92e]" />
            <span>Public Order Lookup</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-stone-500">
            <RefreshCw className="w-5 h-5 animate-spin mr-2 text-[#072618]" />
            <span>Fetching your order records...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-stone-200 p-8 shadow-sm space-y-4">
            <Package className="w-12 h-12 text-stone-400 mx-auto" />
            <h2 className="font-serif text-2xl font-bold text-stone-800">NO ORDERS PLACED YET</h2>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Explore our master artisan collections in Kanjivaram and Chanderi gossamers.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-[#072618] text-[#f5b92e] rounded-xl text-xs font-serif uppercase tracking-widest font-bold"
            >
              <span>Explore The Atelier</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((ord) => {
              const itemCount = ord.items.reduce((s, i) => s + i.quantity, 0);
              return (
                <div
                  key={ord.id}
                  className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all space-y-6"
                >
                  {/* Order Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-base font-bold text-[#072618]">
                          {ord.order_number}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-serif uppercase tracking-wider font-semibold border ${getStatusBadge(
                            ord.status
                          )}`}
                        >
                          {ord.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <span className="text-xs text-stone-500">
                        Ordered on{" "}
                        {new Date(ord.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[11px] uppercase tracking-wider text-stone-500 block">
                        Order Total
                      </span>
                      <span className="font-serif font-bold text-lg text-[#072618]">
                        {formatPrice(ord.total)}
                      </span>
                    </div>
                  </div>

                  {/* Product Thumbnails Gallery */}
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-3 overflow-x-auto pb-1">
                      {ord.items.map((item) => (
                        <div
                          key={item.id}
                          className="relative w-16 h-20 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 shadow-sm"
                        >
                          <Image
                            src={item.image_snapshot || "/logo.png"}
                            alt={item.product_name_snapshot}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                      <div className="pl-2">
                        <span className="text-xs font-semibold text-stone-800 block">
                          {itemCount} Handcrafted Garment{itemCount > 1 ? "s" : ""}
                        </span>
                        <span className="text-[11px] text-stone-500 block truncate max-w-[220px]">
                          {ord.items[0]?.product_name_snapshot}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                      <Link
                        href={`/account/orders/${ord.id}`}
                        className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-stone-300 hover:border-stone-500 text-stone-700 text-xs font-serif uppercase tracking-wider font-semibold text-center transition-colors"
                      >
                        VIEW ORDER
                      </Link>

                      <Link
                        href={`/account/orders/${ord.id}`}
                        className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#072618] hover:bg-[#12372a] text-[#f5b92e] text-xs font-serif uppercase tracking-widest font-bold text-center transition-all shadow-md flex items-center justify-center space-x-1.5"
                      >
                        <Truck className="w-3.5 h-3.5 text-[#f5b92e]" />
                        <span>TRACK ORDER</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
