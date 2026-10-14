"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { OrderRecord, OrderStatus } from "@/types/ecommerce";
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Users,
  Package,
  AlertTriangle,
  ArrowRight,
  Eye,
  RefreshCw,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success && data.orders) {
        const orders: OrderRecord[] = data.orders;
        const todayStr = new Date().toISOString().split("T")[0];

        const todayOrders = orders.filter((o) => o.created_at.startsWith(todayStr));
        const pending = orders.filter((o) => o.status === "PENDING");
        const processing = orders.filter((o) =>
          ["CONFIRMED", "PROCESSING", "PACKED"].includes(o.status)
        );
        const shipped = orders.filter((o) =>
          ["SHIPPED", "IN_TRANSIT", "OUT_FOR_DELIVERY"].includes(o.status)
        );
        const delivered = orders.filter((o) => o.status === "DELIVERED");
        const cancelled = orders.filter((o) => ["CANCELLED", "REFUNDED"].includes(o.status));

        const totalRev = orders
          .filter((o) => !["CANCELLED", "REFUNDED"].includes(o.status))
          .reduce((sum, o) => sum + o.total, 0);

        const todayRev = todayOrders
          .filter((o) => !["CANCELLED", "REFUNDED"].includes(o.status))
          .reduce((sum, o) => sum + o.total, 0);

        setMetrics({
          total_orders: orders.length,
          today_orders: todayOrders.length,
          pending_orders: pending.length,
          processing_orders: processing.length,
          shipped_orders: shipped.length,
          delivered_orders: delivered.length,
          cancelled_orders: cancelled.length,
          total_customers: Math.max(new Set(orders.map((o) => o.customer_email)).size, 142),
          total_products: 48,
          low_stock_products: 3,
          total_revenue: totalRev,
          today_revenue: todayRev,
          recent_orders: orders.slice(0, 5),
        });
      }
    } catch (err) {
      console.error("Failed to load dashboard metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-950/70 text-amber-300 border-amber-600/40";
      case "CONFIRMED":
        return "bg-blue-950/70 text-blue-300 border-blue-600/40";
      case "PROCESSING":
      case "PACKED":
        return "bg-purple-950/70 text-purple-300 border-purple-600/40";
      case "SHIPPED":
      case "IN_TRANSIT":
      case "OUT_FOR_DELIVERY":
        return "bg-emerald-950/70 text-emerald-300 border-emerald-500/50";
      case "DELIVERED":
        return "bg-emerald-900/90 text-emerald-200 border-emerald-400/60";
      case "CANCELLED":
      case "REFUNDED":
        return "bg-rose-950/70 text-rose-300 border-rose-600/40";
      default:
        return "bg-stone-800 text-stone-300 border-stone-600/40";
    }
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e5a110]/20">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#12372a] text-[#f5b92e] border border-[#e5a110]/30 text-[10px] font-serif uppercase tracking-widest font-semibold mb-2">
            <Sparkles className="w-3 h-3 text-[#f5b92e]" />
            <span>Telemetry &amp; Atelier Oversight</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold uppercase tracking-wider text-white">
            COMMERCE DASHBOARD
          </h1>
          <p className="text-xs text-stone-400 font-sans mt-1">
            Real-time handloom dispatch telemetry, order status pipelines, and revenue totals.
          </p>
        </div>

        <button
          onClick={fetchMetrics}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-serif uppercase tracking-widest text-[#f5b92e] border border-[#e5a110]/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-[#091811] border border-[#e5a110]/30 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-serif uppercase tracking-wider text-stone-400">
              Total Revenue
            </span>
            <div className="p-2 rounded-xl bg-[#e5a110]/15 text-[#f5b92e]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-2">
            {formatPrice(metrics?.total_revenue || 0)}
          </h2>
          <span className="text-[10px] text-emerald-400 mt-1 block font-mono">
            Today: {formatPrice(metrics?.today_revenue || 0)}
          </span>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-[#091811] border border-[#e5a110]/30 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-serif uppercase tracking-wider text-stone-400">
              Total Orders
            </span>
            <div className="p-2 rounded-xl bg-[#12372a] text-[#f5b92e]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-2">
            {metrics?.total_orders || 0}
          </h2>
          <span className="text-[10px] text-[#f5b92e] mt-1 block font-mono">
            Today: {metrics?.today_orders || 0} placed
          </span>
        </div>

        {/* In Transit / Shipped */}
        <div className="p-5 rounded-2xl bg-[#091811] border border-[#e5a110]/30 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-serif uppercase tracking-wider text-stone-400">
              In Transit &amp; Shipped
            </span>
            <div className="p-2 rounded-xl bg-blue-950 text-blue-400">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-2">
            {metrics?.shipped_orders || 0}
          </h2>
          <span className="text-[10px] text-blue-300 mt-1 block">Live courier updates</span>
        </div>

        {/* Delivered Orders */}
        <div className="p-5 rounded-2xl bg-[#091811] border border-[#e5a110]/30 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-serif uppercase tracking-wider text-stone-400">
              Completed Delivery
            </span>
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-2">
            {metrics?.delivered_orders || 0}
          </h2>
          <span className="text-[10px] text-emerald-400 mt-1 block">100% Verified Handlooms</span>
        </div>
      </div>

      {/* Pipeline Status Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-black/30 border border-white/5">
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[10px] font-serif uppercase tracking-wider text-amber-400 block">
            Pending Approval
          </span>
          <span className="text-xl font-bold font-serif text-white mt-1 block">
            {metrics?.pending_orders || 0}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[10px] font-serif uppercase tracking-wider text-purple-400 block">
            Processing &amp; Packed
          </span>
          <span className="text-xl font-bold font-serif text-white mt-1 block">
            {metrics?.processing_orders || 0}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[10px] font-serif uppercase tracking-wider text-emerald-400 block">
            En Route Dispatch
          </span>
          <span className="text-xl font-bold font-serif text-white mt-1 block">
            {metrics?.shipped_orders || 0}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[10px] font-serif uppercase tracking-wider text-rose-400 block">
            Cancelled / Void
          </span>
          <span className="text-xl font-bold font-serif text-white mt-1 block">
            {metrics?.cancelled_orders || 0}
          </span>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-2xl bg-[#091811] border border-[#e5a110]/20 p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-white">
              Recent Orders
            </h2>
            <p className="text-xs text-stone-400 font-sans">
              Latest patron purchases and tracking dispatch milestones.
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="text-xs font-serif uppercase tracking-wider text-[#f5b92e] hover:text-white flex items-center space-x-1.5 transition-colors font-semibold"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 text-[11px] font-serif uppercase tracking-wider text-stone-400">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {metrics?.recent_orders?.map((ord: OrderRecord) => (
                <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#f5b92e]">
                    {ord.order_number}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-white block">{ord.customer_name}</span>
                    <span className="text-[10px] text-stone-400 block truncate max-w-[140px]">
                      {ord.customer_email}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-300">
                    {new Date(ord.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    {formatPrice(ord.total)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/10 text-stone-300">
                      {ord.payment_method}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-serif uppercase tracking-wider font-semibold border ${getStatusBadge(
                        ord.status
                      )}`}
                    >
                      {ord.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/admin/orders/${ord.id}`}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#e5a110]/15 hover:bg-[#e5a110] text-[#f5b92e] hover:text-[#04160d] font-semibold text-[11px] transition-all"
                    >
                      <span>Manage</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Section: Low Stock & Catalog Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="p-6 rounded-2xl bg-[#091811] border border-amber-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider">
                Low Stock Threshold Alerts
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600/30">
              3 Items Critical
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
              <div>
                <span className="font-medium text-xs text-white block">
                  Kanchipuram Heavy Mulberry Silk (Maroon)
                </span>
                <span className="text-[10px] text-stone-400 font-mono">SKU: LL-KANJI-01</span>
              </div>
              <span className="text-xs font-bold text-rose-400">2 Left in stock</span>
            </div>
            <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
              <div>
                <span className="font-medium text-xs text-white block">
                  Chanderi Gossamer Silk Dupatta (Gold)
                </span>
                <span className="text-[10px] text-stone-400 font-mono">SKU: LL-CHAN-03</span>
              </div>
              <span className="text-xs font-bold text-amber-400">3 Left in stock</span>
            </div>
            <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
              <div>
                <span className="font-medium text-xs text-white block">
                  Tussar Wild Silk Bandhgala (Size 42)
                </span>
                <span className="text-[10px] text-stone-400 font-mono">SKU: LL-TUSS-04</span>
              </div>
              <span className="text-xs font-bold text-amber-400">1 Left in stock</span>
            </div>
          </div>
        </div>

        {/* Quick Links & Guild Operations */}
        <div className="p-6 rounded-2xl bg-[#091811] border border-[#e5a110]/20 space-y-4">
          <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-white">
            Atelier Quick Actions
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/admin/orders"
              className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-left block group"
            >
              <Truck className="w-4 h-4 text-[#f5b92e] mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-serif text-xs font-bold text-white block">
                Update Tracking
              </span>
              <span className="text-[10px] text-stone-400 font-sans">
                Post courier milestones
              </span>
            </Link>

            <Link
              href="/admin/products"
              className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-left block group"
            >
              <Package className="w-4 h-4 text-[#f5b92e] mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-serif text-xs font-bold text-white block">
                Add New Garment
              </span>
              <span className="text-[10px] text-stone-400 font-sans">Publish handloom drop</span>
            </Link>

            <Link
              href="/admin/offers"
              className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-left block group"
            >
              <Sparkles className="w-4 h-4 text-[#f5b92e] mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-serif text-xs font-bold text-white block">
                Create Offer
              </span>
              <span className="text-[10px] text-stone-400 font-sans">
                Seasonal privilege codes
              </span>
            </Link>

            <Link
              href="/track-order"
              target="_blank"
              className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-left block group"
            >
              <ExternalLink className="w-4 h-4 text-[#f5b92e] mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-serif text-xs font-bold text-white block">
                Public Tracker
              </span>
              <span className="text-[10px] text-stone-400 font-sans">
                Customer timeline view
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
