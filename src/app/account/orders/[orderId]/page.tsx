"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { OrderRecord, OrderStatus } from "@/types/ecommerce";
import {
  ArrowLeft,
  ChevronRight,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  FileText,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export default function CustomerOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrder = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      }
    } catch (err) {
      console.error("Failed to fetch customer order:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    // 13. Immediate reflection: Periodic polling every 8s while tab is open
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchOrder(true);
      }
    }, 8000);

    // Refetch when tab becomes active
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchOrder(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [orderId]);

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

  // Pipeline steps for progress indicator
  const pipelineSteps: { key: OrderStatus; label: string }[] = [
    { key: "PENDING", label: "Order Placed" },
    { key: "CONFIRMED", label: "Confirmed" },
    { key: "PROCESSING", label: "Processing" },
    { key: "PACKED", label: "Packed" },
    { key: "SHIPPED", label: "Shipped" },
    { key: "IN_TRANSIT", label: "In Transit" },
    { key: "OUT_FOR_DELIVERY", label: "Out For Delivery" },
    { key: "DELIVERED", label: "Delivered" },
  ];

  const getStepState = (stepKey: OrderStatus) => {
    if (!order) return "upcoming";
    const statusOrder: OrderStatus[] = [
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "PACKED",
      "SHIPPED",
      "IN_TRANSIT",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ];
    const currentIndex = statusOrder.indexOf(order.status);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  if (loading) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen py-24 flex items-center justify-center text-stone-600">
        <RefreshCw className="w-5 h-5 animate-spin mr-3 text-[#072618]" />
        <span>Loading order dispatch details...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen py-24 text-center">
        <h2 className="text-xl font-serif font-bold text-stone-800">Order Not Found</h2>
        <Link
          href="/account/orders"
          className="mt-4 inline-block text-xs font-serif uppercase tracking-wider text-[#072618] underline"
        >
          Return to My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] text-stone-900 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs font-serif uppercase tracking-widest text-stone-500">
          <Link href="/account/orders" className="hover:text-[#072618]">My Orders</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#072618] font-bold">{order.order_number}</span>
        </div>

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <h1 className="font-mono text-2xl sm:text-3xl font-bold text-[#072618]">
                {order.order_number}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-serif uppercase tracking-wider font-semibold border ${getStatusBadge(
                  order.status
                )}`}
              >
                {order.status.replace(/_/g, " ")}
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Commissioned on{" "}
              {new Date(order.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => fetchOrder(false)}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl border border-stone-200 hover:border-stone-400 text-xs font-serif uppercase tracking-wider text-stone-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#072618]" : ""}`} />
              <span>Refresh Status</span>
            </button>
          </div>
        </div>

        {/* Horizontal Milestone Tracker (Desktop) */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm overflow-x-auto">
          <h2 className="text-xs font-serif uppercase tracking-widest font-bold text-stone-400 mb-6">
            Dispatch Progression Milestones
          </h2>

          <div className="flex items-center justify-between min-w-[680px]">
            {pipelineSteps.map((step, idx) => {
              const state = getStepState(step.key);
              return (
                <React.Fragment key={step.key}>
                  <div className="flex flex-col items-center text-center space-y-2 relative">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        state === "completed"
                          ? "bg-[#072618] text-[#f5b92e] shadow-md"
                          : state === "current"
                          ? "bg-[#e5a110] text-[#04160d] ring-4 ring-[#e5a110]/20 scale-110 shadow-lg font-black"
                          : "bg-stone-100 text-stone-400 border border-stone-200"
                      }`}
                    >
                      {state === "completed" ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-[11px] font-serif uppercase tracking-wider whitespace-nowrap ${
                        state === "current"
                          ? "font-bold text-[#072618]"
                          : state === "completed"
                          ? "font-medium text-stone-700"
                          : "text-stone-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {idx < pipelineSteps.length - 1 && (
                    <div
                      className={`flex-1 h-[2px] mx-2 transition-all ${
                        state === "completed" ? "bg-[#072618]" : "bg-stone-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* 2-Column Content Grid: Left Items & Summary, Right Live Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Items & Address */}
          <div className="lg:col-span-7 space-y-6">
            {/* Products Card */}
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm space-y-5">
              <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-stone-800 pb-3 border-b border-stone-100">
                Purchased Garments
              </h2>

              <div className="divide-y divide-stone-100">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 flex items-center space-x-4">
                    <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                      <Image
                        src={item.image_snapshot || "/logo.png"}
                        alt={item.product_name_snapshot}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-xs font-semibold text-stone-900 truncate">
                        {item.product_name_snapshot}
                      </h3>
                      <div className="text-[11px] text-stone-500 mt-1">
                        <span className="font-mono">SKU: {item.sku_snapshot}</span>
                        {item.selected_size && <span> &bull; Size: {item.selected_size}</span>}
                        {item.selected_color && <span> &bull; Color: {item.selected_color}</span>}
                      </div>
                      <div className="text-xs font-bold text-[#072618] mt-1">
                        <span>{formatPrice(item.price_snapshot)}</span>
                        <span className="text-stone-400 font-normal"> &times; {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-serif font-bold text-stone-900 text-sm">
                        {formatPrice(item.subtotal)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Privilege Discount</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Handloom Freight</span>
                  <span>{order.shipping_fee === 0 ? "Complimentary" : formatPrice(order.shipping_fee)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-100 text-sm font-serif font-bold text-stone-900">
                  <span>Grand Total</span>
                  <span className="text-[#072618]">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Address & Payment Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm space-y-2">
                <span className="text-[10px] font-serif uppercase tracking-widest text-stone-400 block font-semibold">
                  Delivery Address
                </span>
                <span className="font-semibold text-xs text-stone-800 block">
                  {order.shipping_address.full_name}
                </span>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {order.shipping_address.address_line_1}
                  {order.shipping_address.address_line_2 ? `, ${order.shipping_address.address_line_2}` : ""},<br />
                  {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                </p>
                <span className="text-xs text-stone-500 font-mono block pt-1">
                  {order.shipping_address.phone}
                </span>
              </div>

              <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm space-y-2">
                <span className="text-[10px] font-serif uppercase tracking-widest text-stone-400 block font-semibold">
                  Payment Details
                </span>
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-[#072618]" />
                  <span className="text-xs font-mono font-bold text-stone-800">
                    {order.payment_method}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider block ${
                    order.payment_status === "PAID" ? "text-emerald-700" : "text-amber-700"
                  }`}
                >
                  Payment: {order.payment_status}
                </span>
                {order.shipment?.courier_name && (
                  <div className="pt-2 border-t border-stone-100 text-xs text-stone-600">
                    <span className="text-[10px] uppercase text-stone-400 block">Courier</span>
                    <span className="font-medium text-stone-800">{order.shipment.courier_name}</span>
                    {order.shipment.tracking_number && (
                      <span className="block font-mono text-[11px] text-[#072618]">
                        AWB: {order.shipment.tracking_number}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Live Tracking Timeline */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="pb-3 border-b border-stone-100">
              <div className="inline-flex items-center space-x-1.5 text-xs text-[#072618] font-serif uppercase tracking-widest font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#e5a110]" />
                <span>Live Dispatch Feed</span>
              </div>
              <h2 className="font-serif text-base font-bold uppercase tracking-wider text-stone-800">
                Order Tracking Timeline
              </h2>
            </div>

            {/* Vertical Timeline List */}
            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#072618] before:via-[#12372a]/50 before:to-stone-300">
              {order.tracking_updates?.map((milestone, idx) => {
                const isLatest = idx === order.tracking_updates.length - 1;
                return (
                  <div key={milestone.id} className="relative group">
                    {/* Node Dot */}
                    <div
                      className={`absolute -left-[30px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                        isLatest
                          ? "bg-[#072618] text-[#f5b92e] border-[#12372a] shadow-md scale-110"
                          : "bg-white text-emerald-600 border-emerald-500"
                      }`}
                    >
                      {isLatest ? (
                        <span className="w-2 h-2 rounded-full bg-[#f5b92e] animate-ping" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                    </div>

                    {/* Timeline Event Card */}
                    <div className="space-y-1.5 p-4 rounded-2xl bg-stone-50 border border-stone-200/70 group-hover:border-[#12372a]/30 transition-all">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[9px] font-serif uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                            milestone.status
                          )}`}
                        >
                          {milestone.status.replace(/_/g, " ")}
                        </span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          {new Date(milestone.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <h3 className="font-serif text-xs font-bold text-stone-900 mt-1">
                        {milestone.title}
                      </h3>

                      <p className="text-xs text-stone-600 font-sans leading-relaxed">
                        {milestone.description}
                      </p>

                      {milestone.location && (
                        <div className="flex items-center space-x-1.5 text-[11px] text-stone-500 pt-1">
                          <MapPin className="w-3 h-3 text-[#072618]" />
                          <span>Location: {milestone.location}</span>
                        </div>
                      )}

                      {/* View Courier Document Button */}
                      {milestone.document_url && (
                        <div className="pt-2">
                          <a
                            href={milestone.document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#072618] hover:bg-[#12372a] text-[#f5b92e] text-[11px] font-serif font-bold uppercase tracking-wider transition-all shadow-sm"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Courier Document</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
