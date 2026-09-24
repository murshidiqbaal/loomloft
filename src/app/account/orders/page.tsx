"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  ChevronRight,
  Shield,
  ArrowLeft
} from "lucide-react";

export default function OrdersPage() {
  const { orders } = useStore();
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || "");

  const activeOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const statusSteps: Array<"Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered"> = [
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered"
  ];

  const getStepIndex = (status: string) => {
    return statusSteps.indexOf(status as any);
  };

  return (
    <div className="bg-[#FAF7F2] text-stone-900 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs font-serif uppercase tracking-widest text-stone-500 mb-8">
          <Link href="/account" className="hover:text-[#072618]">My Account</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#072618] font-bold">Orders &amp; Tracking</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] text-[#072618] mb-10">
          ORDER TRACKING &amp; DISPATCH
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Orders List */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-xs font-serif uppercase tracking-wider font-bold text-stone-500 block mb-2">
              All Orders ({orders.length})
            </span>
            {orders.map((ord) => {
              const isSelected = ord.id === activeOrder?.id;
              return (
                <button
                  key={ord.id}
                  onClick={() => setSelectedOrderId(ord.id)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all ${
                    isSelected
                      ? "bg-white border-[#072618] shadow-md ring-2 ring-[#072618]/10"
                      : "bg-white/80 border-stone-200 hover:border-stone-400"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-bold text-[#072618]">{ord.orderNumber}</span>
                    <span className="px-2.5 py-0.5 bg-[#072618] text-[#f5b92e] text-[10px] font-serif uppercase tracking-wider rounded font-semibold">
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-sans">
                    {ord.date} • {ord.items.length} items
                  </p>
                  <div className="mt-3 flex justify-between items-center pt-2 border-t border-stone-100">
                    <span className="text-xs text-stone-400 font-serif">Amount Paid</span>
                    <span className="font-serif font-bold text-sm text-stone-900">{formatPrice(ord.total)}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Selected Order Details & Status Timeline */}
          {activeOrder && (
            <div className="lg:col-span-8 bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
                <div>
                  <span className="text-[10px] font-serif uppercase tracking-widest text-[#072618] font-bold">
                    Order Timeline
                  </span>
                  <h2 className="font-mono text-xl sm:text-2xl font-bold text-stone-900 mt-0.5">
                    {activeOrder.orderNumber}
                  </h2>
                  <p className="text-xs text-stone-500 font-sans mt-1">
                    Booked on {activeOrder.date} • Payment: {activeOrder.paymentMethod} ({activeOrder.paymentStatus})
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-400 font-serif block">Total Value</span>
                  <span className="font-serif text-2xl font-bold text-[#072618]">
                    {formatPrice(activeOrder.total)}
                  </span>
                </div>
              </div>

              {/* Status Timeline Progression */}
              <div>
                <h3 className="font-serif text-xs uppercase tracking-widest text-stone-400 font-bold mb-6">
                  Guild Dispatch Milestone
                </h3>
                <div className="relative">
                  {/* Connecting Line */}
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-stone-200 hidden sm:block" />

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                    {statusSteps.map((stepName, idx) => {
                      const activeIndex = getStepIndex(activeOrder.status);
                      const isCompleted = idx <= activeIndex;
                      const isCurrent = idx === activeIndex;

                      return (
                        <div key={stepName} className="flex flex-col items-start sm:items-center text-left sm:text-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                              isCompleted
                                ? "bg-[#072618] text-[#f5b92e] shadow-md"
                                : "bg-stone-100 text-stone-400 border border-stone-300"
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span
                            className={`text-xs font-serif uppercase tracking-wider ${
                              isCurrent ? "font-bold text-[#072618]" : isCompleted ? "text-stone-800" : "text-stone-400"
                            }`}
                          >
                            {stepName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="pt-6 border-t border-stone-200">
                <h3 className="font-serif text-xs uppercase tracking-widest text-stone-400 font-bold mb-4">
                  Weaves in This Parcel
                </h3>
                <div className="space-y-4">
                  {activeOrder.items.map((item: any, i: number) => (
                    <div key={i} className="flex items-center space-x-4 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                      <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-stone-200 shrink-0">
                        <Image src={item.image} alt={item.productName} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-sm font-semibold text-stone-900 truncate">
                          {item.productName}
                        </h4>
                        <p className="text-xs text-stone-500 font-sans mt-0.5">
                          Size: {item.size} • Shade: {item.color} • Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="font-serif font-bold text-sm text-[#072618]">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address Details */}
              <div className="pt-6 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-stone-600">
                <div className="space-y-1">
                  <span className="font-serif uppercase tracking-widest font-bold text-stone-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#072618]" />
                    <span>Shipping Destination</span>
                  </span>
                  <p className="font-semibold text-stone-900">{activeOrder.customerName}</p>
                  <p>{activeOrder.shippingAddress.street}</p>
                  <p>{activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} - {activeOrder.shippingAddress.pincode}</p>
                  <p className="text-stone-500">{activeOrder.customerPhone}</p>
                </div>

                <div className="space-y-1">
                  <span className="font-serif uppercase tracking-widest font-bold text-stone-800 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Transit Protection</span>
                  </span>
                  <p>Insured Handloom Freight Carrier</p>
                  <p>Tamper-evident sealed cedar wooden box</p>
                  <p className="text-emerald-700 font-medium">Tracking dispatched via SMS &amp; WhatsApp</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
