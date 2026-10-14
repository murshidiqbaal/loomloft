"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { OrderRecord, OrderStatus } from "@/types/ecommerce";
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Eye,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      params.append("sortBy", sortBy);

      const res = await fetch(`/api/orders?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, sortBy]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const statusTabs: { label: string; value: string }[] = [
    { label: "All Orders", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Processing", value: "PROCESSING" },
    { label: "Packed", value: "PACKED" },
    { label: "Shipped", value: "SHIPPED" },
    { label: "In Transit", value: "IN_TRANSIT" },
    { label: "Out For Delivery", value: "OUT_FOR_DELIVERY" },
    { label: "Delivered", value: "DELIVERED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-950/70 text-amber-300 border-amber-500/40";
      case "CONFIRMED":
        return "bg-blue-950/70 text-blue-300 border-blue-500/40";
      case "PROCESSING":
      case "PACKED":
        return "bg-purple-950/70 text-purple-300 border-purple-500/40";
      case "SHIPPED":
      case "IN_TRANSIT":
      case "OUT_FOR_DELIVERY":
        return "bg-emerald-950/70 text-emerald-300 border-emerald-500/50";
      case "DELIVERED":
        return "bg-emerald-900/90 text-emerald-200 border-emerald-400/60";
      case "CANCELLED":
      case "REFUNDED":
        return "bg-rose-950/70 text-rose-300 border-rose-500/40";
      default:
        return "bg-stone-800 text-stone-300 border-stone-600/40";
    }
  };

  // Pagination
  const totalPages = Math.ceil(orders.length / itemsPerPage) || 1;
  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e5a110]/20">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#12372a] text-[#f5b92e] border border-[#e5a110]/30 text-[10px] font-serif uppercase tracking-widest font-semibold mb-2">
            <Truck className="w-3 h-3 text-[#f5b92e]" />
            <span>Fulfillment Dispatch Center</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold uppercase tracking-wider text-white">
            ORDERS &amp; DISPATCH ({orders.length})
          </h1>
          <p className="text-xs text-stone-400 font-sans mt-1">
            Manage handloom orders, transition fulfillment milestones, and publish tracking updates.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-serif uppercase tracking-widest text-[#f5b92e] border border-[#e5a110]/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filter Tabs Bar (Shopify style) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setStatusFilter(tab.value);
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-serif uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === tab.value
                ? "bg-gradient-to-r from-[#e5a110] to-[#f5b92e] text-[#04160d] font-bold shadow-md"
                : "bg-black/30 hover:bg-white/5 text-stone-300 border border-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#091811] border border-white/10">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#f5b92e] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer, email..."
            className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#e5a110]/50"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <span className="text-xs text-stone-400 font-serif uppercase">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-[#091811] border border-[#e5a110]/20 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#051009] border-b border-white/10 text-[11px] font-serif uppercase tracking-wider text-stone-400">
              <tr>
                <th className="py-4 px-5">Order Number</th>
                <th className="py-4 px-5">Customer</th>
                <th className="py-4 px-5">Date Placed</th>
                <th className="py-4 px-5">Items</th>
                <th className="py-4 px-5">Total</th>
                <th className="py-4 px-5">Payment</th>
                <th className="py-4 px-5">Order Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    <Package className="w-8 h-8 mx-auto mb-2 text-stone-600" />
                    <span>No orders found matching the filter criteria.</span>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                    {/* Order Number */}
                    <td className="py-4 px-5 font-mono font-bold text-[#f5b92e]">
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="hover:underline flex items-center space-x-1"
                      >
                        <span>{ord.order_number}</span>
                      </Link>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-5">
                      <span className="font-semibold text-white block">{ord.customer_name}</span>
                      <span className="text-[10px] text-stone-400 block">{ord.customer_email}</span>
                      <span className="text-[10px] text-stone-500 font-mono block">
                        {ord.customer_phone}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-5 text-stone-300">
                      <div>
                        {new Date(ord.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <span className="text-[10px] text-stone-500">
                        {new Date(ord.created_at).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>

                    {/* Items */}
                    <td className="py-4 px-5">
                      <span className="font-semibold text-stone-200">
                        {ord.items.reduce((s, i) => s + i.quantity, 0)} pc(s)
                      </span>
                      <span className="text-[10px] text-stone-400 block truncate max-w-[140px]">
                        {ord.items[0]?.product_name_snapshot}
                      </span>
                    </td>

                    {/* Total */}
                    <td className="py-4 px-5 font-serif font-bold text-white text-sm">
                      {formatPrice(ord.total)}
                    </td>

                    {/* Payment Status & Method */}
                    <td className="py-4 px-5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/10 text-stone-300 block w-fit mb-1">
                        {ord.payment_method}
                      </span>
                      <span
                        className={`text-[9px] font-semibold uppercase tracking-wider ${
                          ord.payment_status === "PAID" ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        {ord.payment_status}
                      </span>
                    </td>

                    {/* Order Status */}
                    <td className="py-4 px-5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-serif uppercase tracking-wider font-semibold border ${getStatusBadge(
                          ord.status
                        )}`}
                      >
                        {ord.status.replace(/_/g, " ")}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#e5a110]/15 hover:bg-[#e5a110] text-[#f5b92e] hover:text-[#04160d] font-semibold text-xs transition-all shadow-sm"
                      >
                        <span>Manage &amp; Track</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#051009]">
            <span className="text-xs text-stone-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, orders.length)} of {orders.length} orders
            </span>

            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-stone-300 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-serif text-[#f5b92e] px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-stone-300 hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
