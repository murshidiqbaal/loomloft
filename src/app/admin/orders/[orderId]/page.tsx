"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { OrderRecord, OrderStatus, TrackingUpdateRecord, isValidTransition } from "@/types/ecommerce";
import {
  ArrowLeft,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  Upload,
  ExternalLink,
  Plus,
  AlertCircle,
  Calendar,
  X,
  CreditCard,
  ShieldCheck,
  Package,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Update Tracking Modal State
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  // Form Fields
  const [newStatus, setNewStatus] = useState<OrderStatus>("CONFIRMED");
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneDesc, setMilestoneDesc] = useState("");
  const [location, setLocation] = useState("");
  const [courier, setCourier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [expectedDelivery, setExpectedDelivery] = useState("");
  const [overrideReason, setOverrideReason] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
        // Pre-fill next likely status
        if (data.order.status === "PENDING") setNewStatus("CONFIRMED");
        else if (data.order.status === "CONFIRMED") setNewStatus("PROCESSING");
        else if (data.order.status === "PROCESSING") setNewStatus("PACKED");
        else if (data.order.status === "PACKED") setNewStatus("SHIPPED");
        else if (data.order.status === "SHIPPED") setNewStatus("IN_TRANSIT");
        else if (data.order.status === "IN_TRANSIT") setNewStatus("OUT_FOR_DELIVERY");
        else if (data.order.status === "OUT_FOR_DELIVERY") setNewStatus("DELIVERED");
        else setNewStatus(data.order.status);

        if (data.order.shipment) {
          setCourier(data.order.shipment.courier_name || "");
          setTrackingNumber(data.order.shipment.tracking_number || "");
          setTrackingUrl(data.order.shipment.tracking_url || "");
          setExpectedDelivery(data.order.shipment.expected_delivery || "");
        }
      } else {
        setErrorMsg(data.message || "Order not found");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  // Open modal with smart milestone defaults
  const handleOpenUpdateModal = (presetStatus?: OrderStatus) => {
    const targetStatus = presetStatus || newStatus;
    setNewStatus(targetStatus);
    setModalError("");
    setSelectedFile(null);
    setOverrideReason("");

    // Set suggested title based on status
    if (targetStatus === "CONFIRMED") {
      setMilestoneTitle("Order Confirmed & Guild Allocated");
      setMilestoneDesc("Order verified. Loom artisan allocated for inspection.");
      setLocation("LoomLoft Atelier, Kochi");
    } else if (targetStatus === "PROCESSING") {
      setMilestoneTitle("Garment Preparation in Progress");
      setMilestoneDesc("Our master weavers are finishing and inspecting your handcrafted piece.");
      setLocation("LoomLoft Weaving Guild");
    } else if (targetStatus === "PACKED") {
      setMilestoneTitle("Heirloom Parcel Packaged");
      setMilestoneDesc("Wrapped in organic mulmul cotton with artisan guarantee certificate.");
      setLocation("LoomLoft Warehouse, Kochi");
    } else if (targetStatus === "SHIPPED") {
      setMilestoneTitle("Package Handed Over to Courier");
      setMilestoneDesc("Your package has been handed over to the courier partner.");
      setLocation("Kochi Logistics Center");
      if (!courier) setCourier("Delhivery");
    } else if (targetStatus === "IN_TRANSIT") {
      setMilestoneTitle("Package Reached Regional Hub");
      setMilestoneDesc("Shipment reached transit sorting hub and is progressing smoothly.");
      setLocation("Bengaluru Sorting Facility");
    } else if (targetStatus === "OUT_FOR_DELIVERY") {
      setMilestoneTitle("Out for Delivery Today");
      setMilestoneDesc("Courier executive is on the way to deliver your parcel.");
      setLocation(order?.shipping_address.city || "Local Delivery Center");
    } else if (targetStatus === "DELIVERED") {
      setMilestoneTitle("Order Delivered Successfully");
      setMilestoneDesc("Parcel handed over to customer. Thank you for preserving Indian craft.");
      setLocation(order?.shipping_address.city || "Recipient Address");
    }

    setIsUpdateModalOpen(true);
  };

  const handleStatusChange = (status: OrderStatus) => {
    setNewStatus(status);
    handleOpenUpdateModal(status);
  };

  const handleSubmitTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setSubmitting(true);
    setModalError("");

    try {
      const formData = new FormData();
      formData.append("status", newStatus);
      formData.append("title", milestoneTitle);
      formData.append("description", milestoneDesc);
      formData.append("location", location);
      formData.append("courier", courier);
      formData.append("tracking_number", trackingNumber);
      formData.append("tracking_url", trackingUrl);
      formData.append("expected_delivery", expectedDelivery);
      formData.append("override_reason", overrideReason);

      if (selectedFile) {
        formData.append("document", selectedFile);
      }

      const res = await fetch(`/api/admin/orders/${order.id}/tracking`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setOrder(data.order);
        setIsUpdateModalOpen(false);
      } else {
        setModalError(data.message || "Failed to update tracking");
      }
    } catch (err: any) {
      setModalError(err.message || "Failed to submit tracking update");
    } finally {
      setSubmitting(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-stone-400">
        <RefreshCw className="w-6 h-6 animate-spin text-[#f5b92e] mr-3" />
        <span>Loading order telemetry...</span>
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-serif font-bold text-white uppercase">Order Not Found</h2>
        <p className="text-xs text-stone-400">{errorMsg || "The requested order ID does not exist."}</p>
        <Link
          href="/admin/orders"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-serif uppercase tracking-wider text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders</span>
        </Link>
      </div>
    );
  }

  const isTransitionValid = isValidTransition(order.status, newStatus);

  return (
    <div className="space-y-8 max-w-6xl pb-20">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e5a110]/20">
        <div className="space-y-1">
          <Link
            href="/admin/orders"
            className="inline-flex items-center space-x-1.5 text-xs text-stone-400 hover:text-[#f5b92e] transition-colors mb-2 font-serif uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Orders List</span>
          </Link>
          <div className="flex items-center space-x-3">
            <h1 className="font-mono text-2xl sm:text-3xl font-bold text-[#f5b92e]">
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
          <span className="text-xs text-stone-400">
            Placed on{" "}
            {new Date(order.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Big Action: UPDATE TRACKING */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleOpenUpdateModal()}
            className="px-6 py-3 bg-gradient-to-r from-[#e5a110] to-[#f5b92e] hover:from-[#f5b92e] hover:to-[#e5a110] text-[#04160d] text-xs font-serif font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(229,161,16,0.3)] flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ UPDATE TRACKING</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Order Items & Summary, Right Vertical Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Items, Address, Payment) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Purchased Items Card */}
          <div className="p-6 rounded-2xl bg-[#091811] border border-[#e5a110]/20 space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-white">
                Garments Purchased ({order.items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
              <span className="text-xs font-mono text-stone-400">Snapshot Integrity Verified</span>
            </div>

            <div className="divide-y divide-white/5">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex items-center space-x-4">
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-black/50 border border-white/10 shrink-0">
                    <Image
                      src={item.image_snapshot || "/logo.png"}
                      alt={item.product_name_snapshot}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-xs font-semibold text-white truncate">
                      {item.product_name_snapshot}
                    </h3>
                    <div className="flex items-center space-x-3 text-[11px] text-stone-400 mt-1">
                      <span className="font-mono">SKU: {item.sku_snapshot}</span>
                      {item.selected_size && (
                        <span>&bull; Size: {item.selected_size}</span>
                      )}
                      {item.selected_color && (
                        <span>&bull; Color: {item.selected_color}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-bold text-[#f5b92e] mt-1.5">
                      <span>{formatPrice(item.price_snapshot)}</span>
                      <span className="text-stone-400 font-normal">&times; {item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-serif font-bold text-white text-sm">
                      {formatPrice(item.subtotal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-stone-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Privilege Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>{order.shipping_fee === 0 ? "Complimentary" : formatPrice(order.shipping_fee)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-serif font-bold text-white">
                <span>Grand Total</span>
                <span className="text-[#f5b92e]">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer Details */}
            <div className="p-5 rounded-2xl bg-[#091811] border border-white/10 space-y-3">
              <span className="text-[10px] font-serif uppercase tracking-wider text-stone-400 block font-semibold">
                Customer Profile
              </span>
              <div>
                <h3 className="font-semibold text-white text-xs">{order.customer_name}</h3>
                <span className="text-[11px] text-stone-300 block mt-0.5">{order.customer_email}</span>
                <span className="text-[11px] font-mono text-stone-400 block mt-0.5">{order.customer_phone}</span>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="p-5 rounded-2xl bg-[#091811] border border-white/10 space-y-3">
              <span className="text-[10px] font-serif uppercase tracking-wider text-stone-400 block font-semibold">
                Shipping Destination
              </span>
              <div className="text-xs text-stone-300 space-y-0.5 leading-relaxed">
                <span className="font-semibold text-white block">{order.shipping_address.full_name}</span>
                <p>{order.shipping_address.address_line_1}</p>
                {order.shipping_address.address_line_2 && <p>{order.shipping_address.address_line_2}</p>}
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                </p>
                <p className="text-stone-400">{order.shipping_address.country}</p>
              </div>
            </div>
          </div>

          {/* Payment & Courier Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#091811] border border-white/10 space-y-2">
              <span className="text-[10px] font-serif uppercase tracking-wider text-stone-400 block font-semibold">
                Payment Method
              </span>
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-[#f5b92e]" />
                <span className="text-xs font-mono font-bold text-white">{order.payment_method}</span>
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider inline-block ${
                  order.payment_status === "PAID" ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                Status: {order.payment_status}
              </span>
              {order.payment_reference && (
                <span className="text-[10px] text-stone-400 block font-mono">
                  Ref: {order.payment_reference}
                </span>
              )}
            </div>

            <div className="p-5 rounded-2xl bg-[#091811] border border-white/10 space-y-2">
              <span className="text-[10px] font-serif uppercase tracking-wider text-stone-400 block font-semibold">
                Active Courier
              </span>
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-[#f5b92e]" />
                <span className="text-xs font-semibold text-white">
                  {order.shipment?.courier_name || "Not Assigned"}
                </span>
              </div>
              {order.shipment?.tracking_number && (
                <span className="text-[10px] font-mono text-[#f5b92e] block">
                  Awb: {order.shipment.tracking_number}
                </span>
              )}
              {order.shipment?.expected_delivery && (
                <span className="text-[10px] text-stone-400 block">
                  ETA: {order.shipment.expected_delivery}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: ORDER TRACKING TIMELINE */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#091811] border border-[#e5a110]/20 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-white">
                Live Tracking Timeline
              </h2>
              <span className="text-[10px] text-stone-400">
                {order.tracking_updates?.length || 0} Chronological Milestones
              </span>
            </div>

            <button
              onClick={() => handleOpenUpdateModal()}
              className="text-xs font-serif uppercase tracking-wider text-[#f5b92e] hover:text-white font-semibold flex items-center space-x-1"
            >
              <span>+ Add Update</span>
            </button>
          </div>

          {/* Vertical Timeline */}
          <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#e5a110] before:via-emerald-500/50 before:to-stone-700">
            {order.tracking_updates?.map((milestone, idx) => {
              const isLatest = idx === order.tracking_updates.length - 1;
              return (
                <div key={milestone.id} className="relative group">
                  {/* Timeline Node Icon */}
                  <div
                    className={`absolute -left-[30px] top-0 w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                      isLatest
                        ? "bg-[#e5a110] text-[#04160d] border-[#f5b92e] shadow-[0_0_12px_rgba(229,161,16,0.8)] scale-110"
                        : "bg-[#091811] text-emerald-400 border-emerald-500/60"
                    }`}
                  >
                    {isLatest ? (
                      <span className="w-2 h-2 rounded-full bg-[#04160d] animate-ping" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                  </div>

                  {/* Milestone Content */}
                  <div className="space-y-1.5 p-3.5 rounded-xl bg-white/5 border border-white/5 group-hover:border-[#e5a110]/30 transition-all">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-serif uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                          milestone.status
                        )}`}
                      >
                        {milestone.status.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {new Date(milestone.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <h3 className="font-serif text-xs font-bold text-white mt-1">
                      {milestone.title}
                    </h3>

                    <p className="text-xs text-stone-300 font-sans leading-relaxed">
                      {milestone.description}
                    </p>

                    {milestone.location && (
                      <div className="flex items-center space-x-1.5 text-[11px] text-stone-400 pt-1">
                        <MapPin className="w-3 h-3 text-[#f5b92e]" />
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
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#e5a110]/20 hover:bg-[#e5a110] text-[#f5b92e] hover:text-[#04160d] text-[11px] font-serif font-bold uppercase tracking-wider transition-all shadow-sm"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Courier Document</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    <div className="text-[9px] text-stone-500 pt-1">
                      Logged by: {milestone.updated_by_name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* UPDATE TRACKING MODAL / DRAWER */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl my-8 p-6 sm:p-8 rounded-3xl bg-[#091811] border border-[#e5a110]/40 shadow-[0_25px_60px_rgba(0,0,0,0.9)] space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-[#e5a110]/15 text-[#f5b92e]">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-white">
                    Update Order Tracking
                  </h2>
                  <span className="text-xs text-stone-400 font-mono">
                    Order {order.order_number}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-rose-950/70 border border-rose-500/50 rounded-xl text-rose-200 text-xs">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSubmitTracking} className="space-y-4">
              {/* Status Selector */}
              <div>
                <label className="block text-[11px] font-serif uppercase tracking-wider text-stone-300 mb-1.5 font-semibold">
                  New Order Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#e5a110]/60"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="PACKED">PACKED</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="IN_TRANSIT">IN_TRANSIT</option>
                  <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="RETURN_REQUESTED">RETURN_REQUESTED</option>
                  <option value="RETURNED">RETURNED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>

              {/* Status transition override notice if needed */}
              {!isTransitionValid && (
                <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-600/40 text-amber-200 text-xs space-y-2">
                  <div className="flex items-center space-x-1.5 font-semibold">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Non-standard status transition ({order.status} &rarr; {newStatus})</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="Provide required admin override reason..."
                    className="w-full px-3 py-1.5 bg-black/50 border border-amber-500/40 rounded-lg text-xs text-white placeholder-amber-400/50 focus:outline-none"
                  />
                </div>
              )}

              {/* Milestone Title */}
              <div>
                <label className="block text-[11px] font-serif uppercase tracking-wider text-stone-300 mb-1.5 font-semibold">
                  Milestone Title
                </label>
                <input
                  type="text"
                  required
                  value={milestoneTitle}
                  onChange={(e) => setMilestoneTitle(e.target.value)}
                  placeholder="e.g. Package reached Bengaluru hub"
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#e5a110]/60"
                />
              </div>

              {/* Milestone Description */}
              <div>
                <label className="block text-[11px] font-serif uppercase tracking-wider text-stone-300 mb-1.5 font-semibold">
                  Detailed Description for Customer
                </label>
                <textarea
                  rows={2}
                  required
                  value={milestoneDesc}
                  onChange={(e) => setMilestoneDesc(e.target.value)}
                  placeholder="e.g. Your package has arrived at the sorting facility and will be dispatched to your local center."
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#e5a110]/60"
                />
              </div>

              {/* Location & Courier Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-serif uppercase tracking-wider text-stone-300 mb-1 font-semibold">
                    Current Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, Kochi"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#e5a110]/60"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-serif uppercase tracking-wider text-stone-300 mb-1 font-semibold">
                    Courier Partner
                  </label>
                  <input
                    type="text"
                    value={courier}
                    onChange={(e) => setCourier(e.target.value)}
                    placeholder="e.g. Delhivery, Blue Dart"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#e5a110]/60"
                  />
                </div>
              </div>

              {/* Tracking Number & Expected Delivery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-serif uppercase tracking-wider text-stone-300 mb-1 font-semibold">
                    Tracking / AWB Number
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. DL123456789"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#e5a110]/60"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-serif uppercase tracking-wider text-stone-300 mb-1 font-semibold">
                    Expected Delivery Date
                  </label>
                  <input
                    type="text"
                    value={expectedDelivery}
                    onChange={(e) => setExpectedDelivery(e.target.value)}
                    placeholder="e.g. October 10, 2026"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#e5a110]/60"
                  />
                </div>
              </div>

              {/* Optional Courier Document Upload */}
              <div className="p-4 rounded-2xl bg-black/40 border border-dashed border-[#e5a110]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-stone-300">
                    <Upload className="w-4 h-4 text-[#f5b92e]" />
                    <span className="text-xs font-serif uppercase tracking-wider font-semibold">
                      Optional Courier Document
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400">PDF, JPG, PNG &bull; Max 10MB</span>
                </div>

                <p className="text-[11px] text-stone-400 font-sans">
                  Upload courier consignment receipt, dispatch receipt, or hub scan slip. Will be saved to Appwrite Storage bucket &quot;tracking-documents&quot;.
                </p>

                <div className="flex items-center space-x-3 pt-1">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                    className="text-xs text-stone-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-serif file:uppercase file:bg-[#e5a110]/20 file:text-[#f5b92e] hover:file:bg-[#e5a110]/40 cursor-pointer"
                  />
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-[11px] text-rose-400 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {selectedFile && (
                  <span className="text-[11px] text-emerald-400 font-mono block">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-serif uppercase tracking-wider text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#e5a110] to-[#f5b92e] hover:from-[#f5b92e] hover:to-[#e5a110] text-[#04160d] text-xs font-serif font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(229,161,16,0.3)] cursor-pointer disabled:opacity-60 flex items-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Publishing Milestone...</span>
                    </>
                  ) : (
                    <span>Publish Tracking Update</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
