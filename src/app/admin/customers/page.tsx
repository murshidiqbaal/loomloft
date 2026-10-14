"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import {
  Users,
  Search,
  ShoppingBag,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");

  const customers = [
    {
      id: "cust-01",
      name: "Test Customer",
      email: "test.customer@example.com",
      phone: "+91 98765 43210",
      registered_at: "2026-09-15",
      orders_count: 2,
      total_spent: 4998,
      last_order_at: "2026-10-06",
      status: "ACTIVE",
    },
    {
      id: "cust-02",
      name: "Aaditya Roy",
      email: "aaditya.roy@example.com",
      phone: "+91 98201 55621",
      registered_at: "2026-08-20",
      orders_count: 3,
      total_spent: 19850,
      last_order_at: "2026-10-04",
      status: "ACTIVE",
    },
    {
      id: "cust-03",
      name: "Meera Krishnan",
      email: "meera.krishnan@example.com",
      phone: "+91 94471 28910",
      registered_at: "2026-07-11",
      orders_count: 5,
      total_spent: 34500,
      last_order_at: "2026-09-28",
      status: "ACTIVE",
    },
    {
      id: "cust-04",
      name: "Rohan Singhal",
      email: "rohan.singhal@example.com",
      phone: "+91 98201 44512",
      registered_at: "2026-06-05",
      orders_count: 1,
      total_spent: 5490,
      last_order_at: "2026-10-02",
      status: "ACTIVE",
    },
  ];

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e5a110]/20">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#12372a] text-[#f5b92e] border border-[#e5a110]/30 text-[10px] font-serif uppercase tracking-widest font-semibold mb-2">
            <Users className="w-3 h-3 text-[#f5b92e]" />
            <span>Patron Directory &amp; Client Loyalty</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold uppercase tracking-wider text-white">
            PATRON ACCOUNTS ({customers.length})
          </h1>
          <p className="text-xs text-stone-400 font-sans mt-1">
            Registered collectors, spending telemetry, and order histories authenticated via Supabase Identity.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#091811] border border-white/10">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#f5b92e] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patron by name, email, phone..."
            className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#e5a110]/50"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-2xl bg-[#091811] border border-[#e5a110]/20 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#051009] border-b border-white/10 text-[11px] font-serif uppercase tracking-wider text-stone-400">
              <tr>
                <th className="py-4 px-5">Patron</th>
                <th className="py-4 px-5">Phone</th>
                <th className="py-4 px-5">Registered Since</th>
                <th className="py-4 px-5">Orders Count</th>
                <th className="py-4 px-5">Total Spent</th>
                <th className="py-4 px-5">Last Order</th>
                <th className="py-4 px-5 text-right">Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-5">
                    <span className="font-semibold text-white block">{c.name}</span>
                    <span className="text-[10px] text-stone-400 font-mono block">{c.email}</span>
                  </td>

                  <td className="py-4 px-5 font-mono text-stone-300">{c.phone}</td>

                  <td className="py-4 px-5 text-stone-300">
                    {new Date(c.registered_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td className="py-4 px-5 font-mono font-bold text-[#f5b92e]">
                    {c.orders_count} orders
                  </td>

                  <td className="py-4 px-5 font-serif font-bold text-white text-sm">
                    {formatPrice(c.total_spent)}
                  </td>

                  <td className="py-4 px-5 text-stone-300">
                    {new Date(c.last_order_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>

                  <td className="py-4 px-5 text-right">
                    <Link
                      href="/admin/orders"
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#e5a110] text-stone-300 hover:text-[#04160d] text-[11px] font-semibold transition-all border border-white/10"
                    >
                      <span>Orders</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
