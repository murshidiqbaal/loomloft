"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { OrderItem } from "@/data/mockData";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Eye,
  X,
  CreditCard
} from "lucide-react";

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, showToast } = useStore();
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("All");

  const statuses: OrderItem["status"][] = [
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled"
  ];

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      o.status.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#e5a110]/20 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-pill-gold text-[10px] font-serif uppercase tracking-[0.25em] text-[#f5b92e] font-semibold mb-2">
            <Truck className="w-3 h-3 text-[#f5b92e]" />
            <span>Fulfillment Console</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-wider text-white mt-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            PARCEL &amp; DISPATCH ORDERS ({orders.length})
          </h1>
          <p className="text-xs text-stone-300 font-sans mt-1">
            Monitor orders, update weaving fulfillment milestones, and examine transit addresses.
          </p>
        </div>
      </div>

      {/* Search and Status Pills Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Glass Search Input */}
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order ID, patron, or city..."
            className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl text-xs text-white placeholder-stone-400 focus:outline-none"
          />
        </div>

        {/* Quick Glass Status Filters */}
        <div className="flex flex-wrap gap-1.5">
          {["All", ...statuses].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-serif uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-gradient-to-r from-[#e5a110] to-[#f5b92e] text-[#04160d] font-bold shadow-[0_0_12px_rgba(229,161,16,0.3)]"
                  : "glass-pill text-stone-300 hover:text-white hover:border-white/20"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Glassmorphic Orders Table */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-stone-400 font-serif uppercase tracking-wider bg-black/30 backdrop-blur-md">
                <th className="py-4 px-4">Order ID</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Items</th>
                <th className="py-4 px-4">Amount</th>
                <th className="py-4 px-4">Payment</th>
                <th className="py-4 px-4">Transit Status</th>
                <th className="py-4 px-4 text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-stone-300">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400 font-sans">
                    No orders match your current search or filter query.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="glass-row transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#f5b92e]">{ord.orderNumber}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-serif font-bold text-white block">{ord.customerName}</span>
                      <span className="text-[10px] text-stone-400 font-sans">{ord.customerEmail}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-400">{ord.date}</td>
                    <td className="py-3.5 px-4">{ord.items.length} garments</td>
                    <td className="py-3.5 px-4 font-serif font-bold text-white">{formatPrice(ord.total)}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-mono text-stone-300 block">{ord.paymentMethod}</span>
                      <span className={`text-[9px] uppercase font-serif font-semibold ${
                        ord.paymentStatus === "Paid" ? "text-emerald-400" : "text-amber-400"
                      }`}>
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                        className="px-2.5 py-1 rounded-xl glass-input text-[11px] font-serif uppercase tracking-wider text-[#f5b92e] focus:outline-none cursor-pointer"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s} className="bg-[#04160d] text-white">{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-2 rounded-xl glass-pill hover:glass-pill-gold text-stone-300 hover:text-[#f5b92e] transition-all cursor-pointer shadow-sm"
                        title="Inspect order dossier"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Glassmorphic Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-2xl glass-panel rounded-3xl p-6 sm:p-8 text-cream shadow-[0_25px_70px_rgba(0,0,0,0.85)] space-y-6 max-h-[90vh] overflow-y-auto border border-[#e5a110]/35 backdrop-blur-2xl bg-[#04160d]/85">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white glass-pill rounded-full transition-all cursor-pointer"
            >
              <X className="w-4 h-4 text-[#f5b92e]" />
            </button>

            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#f5b92e] block">
                  Parcel Dossier
                </span>
                <h3 className="font-mono text-xl font-bold text-white mt-0.5">
                  {selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-stone-400 font-sans">
                  Placed on {selectedOrder.date}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-stone-400 font-serif block">Total Value</span>
                <span className="font-serif text-2xl font-bold text-[#f5b92e] drop-shadow-[0_0_10px_rgba(245,185,46,0.3)]">
                  {formatPrice(selectedOrder.total)}
                </span>
              </div>
            </div>

            {/* Status Selector */}
            <div className="p-4 rounded-2xl glass-panel-subtle flex items-center justify-between">
              <span className="text-xs font-serif uppercase tracking-wider text-stone-300">
                Update Fulfillment Status:
              </span>
              <select
                value={selectedOrder.status}
                onChange={(e) => {
                  const newStatus = e.target.value as any;
                  updateOrderStatus(selectedOrder.id, newStatus);
                  setSelectedOrder({ ...selectedOrder, status: newStatus });
                }}
                className="px-3 py-1.5 rounded-xl glass-input text-xs font-serif uppercase tracking-wider text-[#f5b92e] cursor-pointer"
              >
                {statuses.map((s) => (
                  <option key={s} value={s} className="bg-[#04160d] text-white">{s}</option>
                ))}
              </select>
            </div>

            {/* Patron & Shipping */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl glass-panel-subtle space-y-1">
                <span className="font-serif font-bold text-[#f5b92e] block mb-1">Customer Profile</span>
                <p className="font-semibold text-white">{selectedOrder.customerName}</p>
                <p className="text-stone-300">{selectedOrder.customerEmail}</p>
                <p className="text-stone-400">{selectedOrder.customerPhone}</p>
              </div>

              <div className="p-4 rounded-2xl glass-panel-subtle space-y-1">
                <span className="font-serif font-bold text-[#f5b92e] block mb-1">Delivery Address</span>
                <p className="text-stone-200">{selectedOrder.shippingAddress.street}</p>
                <p className="text-stone-300">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</p>
                <p className="text-[#f5b92e] font-serif pt-1">Method: {selectedOrder.paymentMethod}</p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3 pt-2">
              <span className="font-serif font-bold text-xs uppercase tracking-wider text-stone-400 block">
                Garments in Package ({selectedOrder.items.length})
              </span>
              {selectedOrder.items.map((it, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-3 rounded-xl glass-card">
                  <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-stone-900 shrink-0 border border-white/10">
                    <Image src={it.image} alt={it.productName} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-serif text-xs font-semibold text-white truncate">{it.productName}</h5>
                    <p className="text-[10px] text-stone-300 font-sans">Size: {it.size} • Shade: {it.color} • Qty {it.quantity}</p>
                  </div>
                  <div className="font-serif font-bold text-xs text-[#f5b92e]">
                    {formatPrice(it.price * it.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
