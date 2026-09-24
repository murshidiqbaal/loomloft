"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, MessageCircle, Clock, Sparkles, Send, CheckCircle2 } from "lucide-react";
import { InstagramIcon } from "@/components/icons/BrandIcons";
import { useStore } from "@/context/StoreContext";

export default function ContactPage() {
  const { showToast } = useStore();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "Bespoke Bridal & Trousseau",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
    showToast("Thank you. A LoomLoft concierge stylist will connect within 4 business hours.", "success");
  };

  return (
    <div className="bg-[#FAF7F2] text-stone-900 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-[#072618] text-xs font-serif uppercase tracking-[0.25em] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#e5a110]" />
            <span>Dedicated Guild Concierge</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-[0.14em] text-[#072618]">
            CONTACT LOOMLOFT
          </h1>
          <p className="mt-3 text-stone-600 font-sans text-xs sm:text-sm leading-relaxed">
            Whether inquiring about custom loom commissions, sizing advice, or wedding trousseau appointments, our handloom curators are here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Details & Quick Direct Access */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white border border-stone-200 rounded-3xl p-8 space-y-6 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-[#072618]">
                Direct Concierge Contacts
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-stone-700">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-[#072618] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-serif font-bold text-stone-900 block">General &amp; Bridal Inquiries</span>
                    <a href="mailto:concierge@loomloft.net" className="text-stone-600 hover:text-[#072618] underline">
                      concierge@loomloft.net
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-[#072618] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-serif font-bold text-stone-900 block">Phone Support</span>
                    <a href="tel:+919876543210" className="text-stone-600 hover:text-[#072618]">
                      +91 (080) 4920 1888
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MessageCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-serif font-bold text-stone-900 block">WhatsApp Styling Help</span>
                    <a
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 font-semibold hover:underline"
                    >
                      Chat Live with Master Stylist
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-[#072618] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-serif font-bold text-stone-900 block">Atelier Hours</span>
                    <p className="text-stone-500">Monday - Saturday: 10:00 AM - 7:30 PM IST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Atelier Studio Location */}
            <div className="bg-[#072618] text-white rounded-3xl p-8 space-y-4 shadow-xl border border-[#e5a110]/30">
              <span className="text-[10px] font-serif uppercase tracking-widest text-[#f5b92e] block">
                Flagship Experience Studio
              </span>
              <h3 className="font-serif text-2xl font-bold">LoomLoft Heritage Studio</h3>
              <p className="text-xs text-stone-300 font-sans leading-relaxed">
                42, Vithal Mallya Road, Opp. UB City, Bengaluru, Karnataka — 560001
              </p>
              <div className="pt-2">
                <a
                  href="https://www.instagram.com/loom_loft_/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-xs font-serif uppercase tracking-wider text-[#e5a110] hover:text-white transition-colors"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>Follow Atelier on Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Message Form */}
          <div className="lg:col-span-7 bg-white border border-stone-200 rounded-3xl p-8 sm:p-12 shadow-sm">
            {submitted ? (
              <div className="py-16 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-700 mx-auto" />
                <h3 className="font-serif text-2xl font-bold text-[#072618]">
                  Message Dispatched to Guild
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                  Thank you for writing to LoomLoft, {form.name}. Our senior curator has received your inquiry and will respond within 4 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 bg-[#072618] text-[#f5b92e] text-xs font-serif uppercase tracking-widest rounded-xl"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#072618]">
                    Send an Atelier Inquiry
                  </h2>
                  <p className="text-xs text-stone-500 font-sans mt-1">
                    Fill out the form below and we will prepare personalized fabric swatches or answers.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-serif uppercase tracking-wider text-stone-700 mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Gayatri Krishnan"
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#072618]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-serif uppercase tracking-wider text-stone-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. gayatri@example.com"
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#072618]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-serif uppercase tracking-wider text-stone-700 mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#072618]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-serif uppercase tracking-wider text-stone-700 mb-1">
                      Inquiry Focus
                    </label>
                    <select
                      value={form.inquiryType}
                      onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#072618]"
                    >
                      <option value="Bespoke Bridal & Trousseau">Bespoke Bridal &amp; Trousseau</option>
                      <option value="Custom Handloom Weave Commission">Custom Handloom Weave Commission</option>
                      <option value="Sizing & Drape Consultation">Sizing &amp; Drape Consultation</option>
                      <option value="Order Tracking & Support">Order Tracking &amp; Support</option>
                      <option value="Corporate / Luxury Gifting">Corporate / Luxury Gifting</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-serif uppercase tracking-wider text-stone-700 mb-1">
                    Your Message or Styling Requirements
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Provide details about dates, desired colors, preferred silks, or any questions..."
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#072618]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#072618] hover:bg-[#0d3824] text-[#f5b92e] font-serif font-bold uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>Dispatch Atelier Message</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
