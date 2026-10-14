"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Package,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function PublicTrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [trackingData, setTrackingData] = useState<any | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setTrackingData(null);
    setLoading(true);

    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: orderNumber.trim(),
          emailOrPhone: emailOrPhone.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.tracking) {
        setTrackingData(data.tracking);
      } else {
        setErrorMsg(
          data.message ||
            "Unable to locate order. Please ensure both Order Number and Email/Phone match your invoice."
        );
      }
    } catch {
      setErrorMsg("Network error. Please try tracking again.");
    } finally {
      setLoading(false);
    }
  };

  const autofillDemo = () => {
    setOrderNumber("LL-2026-000001");
    setEmailOrPhone("test.customer@example.com");
    setErrorMsg("");
  };

  return (
    <div className="bg-[#FAF7F2] text-stone-900 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#12372a]/10 text-[#072618] border border-[#12372a]/20 text-xs font-serif uppercase tracking-widest font-semibold">
            <Truck className="w-3.5 h-3.5 text-[#072618]" />
            <span>Consignment Live Tracking</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] text-[#072618]">
            TRACK YOUR HANDLOOM
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 font-sans max-w-xl mx-auto leading-relaxed">
            Enter your official LoomLoft Order Number along with your registered Email or Phone number to view verified dispatch milestones.
          </p>
        </div>

        {/* Tracking Search Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-10 shadow-lg space-y-6">
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleTrack} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-stone-600 mb-1.5 font-semibold">
                  Order Number
                </label>
                <div className="relative">
                  <Package className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g. LL-2026-000001"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#072618] font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-stone-600 mb-1.5 font-semibold">
                  Email Address OR Phone
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="test.customer@example.com or 9876543210"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#072618]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={autofillDemo}
                className="text-xs text-stone-500 hover:text-[#072618] underline font-sans"
              >
                Try sample order (LL-2026-000001)
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#072618] hover:bg-[#12372a] text-[#f5b92e] text-xs font-serif uppercase tracking-widest font-bold rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
              >
                <span>{loading ? "Verifying Records..." : "Locate Consignment"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Security Guarantee Note */}
          <div className="pt-4 border-t border-stone-100 flex items-center space-x-2 text-[11px] text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>End-to-end verified tracking powered by Appwrite TablesDB &amp; Storage</span>
          </div>
        </div>

        {/* Live Tracking Result */}
        {trackingData && (
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-10 shadow-xl space-y-8 animate-fadeIn">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-4">
              <div>
                <span className="text-[11px] font-serif uppercase tracking-widest text-stone-400 block">
                  Consignment Status
                </span>
                <div className="flex items-center space-x-3 mt-1">
                  <h2 className="font-mono text-xl sm:text-2xl font-bold text-[#072618]">
                    {trackingData.order_number}
                  </h2>
                  <span className="px-3 py-1 rounded-full text-xs font-serif uppercase tracking-wider font-semibold bg-[#12372a] text-[#f5b92e]">
                    {trackingData.status.replace(/_/g, " ")}
                  </span>
                </div>
                <span className="text-xs text-stone-500 mt-1 block">
                  Recipient: {trackingData.customer_name} &bull; {trackingData.shipping_address?.city}, {trackingData.shipping_address?.state}
                </span>
              </div>

              {trackingData.shipment?.courier_name && (
                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 block">
                    Courier Partner
                  </span>
                  <span className="font-serif font-bold text-sm text-[#072618]">
                    {trackingData.shipment.courier_name}
                  </span>
                  {trackingData.shipment.tracking_number && (
                    <span className="font-mono text-xs text-stone-500 block">
                      AWB: {trackingData.shipment.tracking_number}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Vertical Timeline */}
            <div className="space-y-4">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-stone-800">
                Verified Progress History
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#072618] before:to-stone-300">
                {trackingData.tracking_updates?.map((milestone: any, idx: number) => {
                  const isLatest = idx === trackingData.tracking_updates.length - 1;
                  return (
                    <div key={milestone.id} className="relative">
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

                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-serif uppercase tracking-widest font-bold text-[#072618]">
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

                        <h4 className="font-serif text-xs font-bold text-stone-900">
                          {milestone.title}
                        </h4>

                        <p className="text-xs text-stone-600 leading-relaxed font-sans">
                          {milestone.description}
                        </p>

                        {milestone.location && (
                          <div className="flex items-center space-x-1.5 text-[11px] text-stone-500 pt-1">
                            <MapPin className="w-3 h-3 text-[#072618]" />
                            <span>Transit Hub: {milestone.location}</span>
                          </div>
                        )}

                        {/* View Courier Document */}
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
        )}
      </div>
    </div>
  );
}
