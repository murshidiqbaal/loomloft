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

  const statuses: OrderItem["status"][] = [
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled"
  ];

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      o.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-800 gap-4">
        <div>
          <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#f5b92e] font-semibold">
            Fulfillment Console
          </span>
          <h1 className="font-serif text-3xl font-bold uppercase tracking-wider text-white mt-1">
            PARCEL &amp; DISPATCH ORDERS ({orders.length})
          </h1>
          <p className="text-xs text-stone-400 font-sans mt-0.5">
            Monitor orders, update weaving fulfillment milestones, and examine transit addresses.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by Order ID, customer, or status..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#072618] border border-stone-800 rounded-xl text-xs text-white placeholder-stone-400 focus:outline-none focus:border-[#e5a110]"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-[#072618] border border-stone-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 font-serif uppercase tracking-wider bg-[#04160d]">
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
            <tbody className="divide-y divide-stone-800 text-stone-300">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#04160d]/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#e5a110]">{ord.orderNumber}</td>
                  <td className="py-3 px-4">
                    <span className="font-serif font-bold text-white block">{ord.customerName}</span>
                    <span className="text-[10px] text-stone-400 font-sans">{ord.customerEmail}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-stone-400">{ord.date}</td>
                  <td className="py-3 px-4">{ord.items.length} garments</td>
                  <td className="py-3 px-4 font-serif font-bold text-white">{formatPrice(ord.total)}</td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] font-mono text-stone-300 block">{ord.paymentMethod}</span>
                    <span className={`text-[9px] uppercase font-serif ${
                      ord.paymentStatus === "Paid" ? "text-emerald-400" : "text-amber-400"
                    }`}>
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                      className="px-2 py-1 rounded bg-[#04160d] border border-stone-700 text-[11px] font-serif uppercase tracking-wider text-[#f5b92e] focus:outline-none focus:border-[#e5a110]"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="p-1.5 rounded-lg bg-[#04160d] text-stone-300 hover:text-[#f5b92e] border border-stone-800 transition-colors"
                      title="Inspect order details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#072618] border border-[#e5a110]/40 rounded-3xl p-6 sm:p-8 text-cream shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5 text-[#e5a110]" />
            </button>

            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div>
                <span className="text-[10px] font-serif uppercase tracking-widest text-[#f5b92e]">
                  Parcel Dossier
                </span>
                <h3 className="font-mono text-xl font-bold text-white">
                  {selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-stone-400 font-sans">
                  Placed on {selectedOrder.date}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-stone-400 font-serif block">Total</span>
                <span className="font-serif text-xl font-bold text-[#f5b92e]">
                  {formatPrice(selectedOrder.total)}
                </span>
              </div>
            </div>

            {/* Status Selector */}
            <div className="p-4 rounded-2xl bg-[#04160d] border border-stone-800 flex items-center justify-between">
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
                className="px-3 py-1.5 rounded-xl bg-[#072618] border border-[#e5a110]/40 text-xs font-serif uppercase tracking-wider text-[#f5b92e]"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Patron & Shipping */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#04160d] border border-stone-800 space-y-1">
                <span className="font-serif font-bold text-stone-300 block mb-1">Customer Profile</span>
                <p className="font-semibold text-white">{selectedOrder.customerName}</p>
                <p className="text-stone-400">{selectedOrder.customerEmail}</p>
                <p className="text-stone-400">{selectedOrder.customerPhone}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#04160d] border border-stone-800 space-y-1">
                <span className="font-serif font-bold text-stone-300 block mb-1">Delivery Address</span>
                <p className="text-stone-300">{selectedOrder.shippingAddress.street}</p>
                <p className="text-stone-300">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</p>
                <p className="text-[#f5b92e] font-serif">Method: {selectedOrder.paymentMethod}</p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3 pt-2">
              <span className="font-serif font-bold text-xs uppercase tracking-wider text-stone-400 block">
                Garments in Package ({selectedOrder.items.length})
              </span>
              {selectedOrder.items.map((it, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-3 rounded-xl bg-[#04160d] border border-stone-800">
                  <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-stone-900 shrink-0">
                    <Image src={it.image} alt={it.productName} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-serif text-xs font-semibold text-white truncate">{it.productName}</h5>
                    <p className="text-[10px] text-stone-400 font-sans">Size: {it.size} • Shade: {it.color} • Qty {it.quantity}</p>
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
