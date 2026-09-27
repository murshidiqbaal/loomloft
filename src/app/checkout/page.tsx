"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  Gift,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Sparkles
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, cartDiscount, cartShipping, cartTotal, appliedCoupon, createOrder, clearCart } = useStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  // Form Fields
  const [contact, setContact] = useState({
    name: "Rohan Singhal",
    email: "rohan.singhal@example.com",
    phone: "+91 98201 44512"
  });

  const [address, setAddress] = useState({
    street: "Flat 402, Sterling Greens, 100ft Road, Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560038"
  });

  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Credit/Debit Card" | "Net Banking" | "Cash on Delivery">("UPI");
  const [isGift, setIsGift] = useState(false);
  const [giftNote, setGiftNote] = useState("");

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    // Simulate abstracted payment gateway (Razorpay / Stripe)
    setTimeout(() => {
      const order = createOrder({
        customerName: contact.name,
        customerEmail: contact.email,
        customerPhone: contact.phone,
        total: cartTotal,
        paymentMethod,
        paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending" : "Paid",
        status: "Processing",
        items: cart.map((i) => ({
          productName: i.product.name,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
          price: i.product.price,
          image: i.product.images[0] || "/logo.png"
        })),
        shippingAddress: address
      });

      setIsProcessing(false);
      setCompletedOrder(order);
      setStep(3);

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }, 1500);
  };

  if (completedOrder && step === 3) {
    return (
      <div className="bg-[#FAF7F2] text-stone-900 min-h-screen py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-[#072618] text-[#f5b92e] flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-serif uppercase tracking-[0.25em] text-[#072618] font-bold">
            Heirloom Reserved
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-wider text-[#072618] mt-1">
            THANK YOU FOR SUPPORTING THE WEAVERS
          </h1>
          <p className="mt-3 text-stone-600 font-sans text-sm leading-relaxed">
            Your handcrafted order has been received by our master guild. A confirmation email with artisan details has been dispatched to <strong>{completedOrder.customerEmail}</strong>.
          </p>

          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 mt-8 text-left shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-serif uppercase tracking-widest text-stone-400">Order Reference</span>
                <h3 className="font-mono text-base font-bold text-[#072618]">{completedOrder.orderNumber}</h3>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-serif uppercase tracking-wider rounded-full border border-emerald-200">
                {completedOrder.status}
              </span>
            </div>

            <div className="space-y-3">
              {completedOrder.items.map((it: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="font-serif text-stone-800">
                    {it.productName} ({it.size} / {it.color}) × {it.quantity}
                  </span>
                  <span className="font-mono font-semibold">{formatPrice(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-between font-serif text-base font-bold text-[#072618]">
              <span>Total Paid</span>
              <span>{formatPrice(completedOrder.total)}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/account/orders"
              className="px-8 py-3.5 bg-[#072618] text-[#f5b92e] font-serif text-xs uppercase tracking-widest font-bold rounded-xl shadow-lg"
            >
              Track Order Dispatch
            </Link>
            <Link
              href="/"
              className="px-8 py-3.5 bg-white border border-stone-300 text-stone-800 font-serif text-xs uppercase tracking-widest rounded-xl hover:border-[#072618]"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] text-stone-900 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-stone-300 mb-8">
          <Link href="/" className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-[0.2em] text-[#072618]">
            LOOM LOFT
          </Link>
          <div className="flex items-center space-x-2 text-xs font-serif text-stone-600">
            <Lock className="w-4 h-4 text-[#e5a110]" />
            <span>256-Bit Encrypted Secure Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Checkout Form Left */}
          <div className="lg:col-span-7">
            {step === 1 ? (
              <form onSubmit={handleNextToPayment} className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm">
                <div>
                  <h2 className="font-serif text-xl font-bold uppercase tracking-wider text-[#072618] mb-1">
                    1. Contact Information
                  </h2>
                  <p className="text-xs text-stone-500 font-sans mb-4">
                    Guest checkout enabled. We will send tracking updates to this contact.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-serif uppercase tracking-wider text-stone-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={contact.name}
                        onChange={(e) => setContact({ ...contact, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#072618]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-serif uppercase tracking-wider text-stone-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={contact.email}
                        onChange={(e) => setContact({ ...contact, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#072618]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-serif uppercase tracking-wider text-stone-700 mb-1">Phone Number (with WhatsApp)</label>
                      <input
                        type="tel"
                        required
                        value={contact.phone}
                        onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#072618]"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="pt-6 border-t border-stone-200">
                  <h2 className="font-serif text-xl font-bold uppercase tracking-wider text-[#072618] mb-1">
                    2. Insured Shipping Address
                  </h2>
                  <p className="text-xs text-stone-500 font-sans mb-4">
                    Deliveries are covered by full heritage transit insurance.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-serif uppercase tracking-wider text-stone-700 mb-1">Street Address & Landmark</label>
                      <input
                        type="text"
                        required
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#072618]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-serif uppercase tracking-wider text-stone-700 mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#072618]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-serif uppercase tracking-wider text-stone-700 mb-1">State</label>
                        <input
                          type="text"
                          required
                          value={address.state}
                          onChange={(e) => setAddress({ ...address, state: e.target.value })}
                          className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#072618]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-serif uppercase tracking-wider text-stone-700 mb-1">PIN Code</label>
                        <input
                          type="text"
                          required
                          value={address.pincode}
                          onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                          className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#072618]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gift Option */}
                <div className="pt-6 border-t border-stone-200">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGift}
                      onChange={(e) => setIsGift(e.target.checked)}
                      className="w-4 h-4 accent-[#072618] rounded"
                    />
                    <div className="flex items-center space-x-2 text-xs font-serif uppercase tracking-wider text-stone-800">
                      <Gift className="w-4 h-4 text-[#e5a110]" />
                      <span>Complimentary Heritage Gift Wrapping with Calligraphy Card</span>
                    </div>
                  </label>
                  {isGift && (
                    <textarea
                      rows={2}
                      value={giftNote}
                      onChange={(e) => setGiftNote(e.target.value)}
                      placeholder="Write your custom blessing or message for the recipient..."
                      className="w-full mt-3 p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#072618]"
                    />
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#072618] hover:bg-[#0d3824] text-[#f5b92e] font-serif font-bold uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>Continue to Payment Method</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Step 2: Payment Selector */
              <div className="space-y-6 bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                  <h2 className="font-serif text-xl font-bold uppercase tracking-wider text-[#072618]">
                    Select Payment Gateway
                  </h2>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-serif uppercase tracking-wider text-stone-500 hover:text-[#072618] underline flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Edit Address</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { key: "UPI", label: "Instant UPI & QR Code (Google Pay, PhonePe, Paytm)", icon: QrCode },
                    { key: "Credit/Debit Card", label: "Credit / Debit Card (Visa, Mastercard, RuPay, Amex)", icon: CreditCard },
                    { key: "Net Banking", label: "Net Banking (All Major Indian Banks)", icon: ShieldCheck },
                    { key: "Cash on Delivery", label: "Cash on Delivery (Verified Pin Codes Only)", icon: Truck }
                  ].map((method) => {
                    const Icon = method.icon;
                    const isSelected = paymentMethod === method.key;
                    return (
                      <button
                        key={method.key}
                        onClick={() => setPaymentMethod(method.key as any)}
                        className={`w-full p-4 rounded-2xl border text-left flex items-center space-x-4 transition-all ${
                          isSelected
                            ? "border-[#072618] bg-emerald-50/50 shadow-sm"
                            : "border-stone-200 hover:border-stone-400 bg-white"
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl ${isSelected ? "bg-[#072618] text-[#f5b92e]" : "bg-stone-100 text-stone-600"}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-serif text-sm font-bold text-stone-900">{method.key}</h4>
                          <p className="text-[11px] text-stone-500 font-sans mt-0.5">{method.label}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-[#072618]" : "border-stone-300"}`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-[#072618]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
                  <p className="font-serif font-bold text-stone-800">Delivering to:</p>
                  <p>{contact.name} • {contact.phone}</p>
                  <p className="text-stone-500">{address.street}, {address.city}, {address.state} - {address.pincode}</p>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full py-4 bg-[#072618] hover:bg-[#0d3824] text-[#f5b92e] font-serif font-bold uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-xl flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <span>Securing Handloom Order...</span>
                  ) : (
                    <>
                      <span>Pay {formatPrice(cartTotal)} &amp; Confirm Order</span>
                      <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5 bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm sticky top-28">
            <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-[#072618] pb-4 border-b border-stone-200">
              Order Breakdown ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
            </h3>

            <div className="divide-y divide-stone-100 max-h-64 overflow-y-auto space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                  <div className="relative w-14 h-18 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-xs font-semibold text-stone-900 truncate">{item.product.name}</h4>
                    <p className="text-[10px] text-stone-500 font-sans">{item.size} • {item.color} • Qty {item.quantity}</p>
                    <span className="font-serif text-xs font-bold text-[#072618]">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-stone-600 pt-4 border-t border-stone-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-stone-900 font-semibold">{formatPrice(cartSubtotal)}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span>Privilege Coupon</span>
                  <span className="font-mono">-{formatPrice(cartDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Insured Shipping</span>
                <span>{cartShipping === 0 ? "Complimentary" : formatPrice(cartShipping)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-200">
                <span className="font-serif">Total Amount</span>
                <span className="font-serif text-xl text-[#072618]">{formatPrice(cartTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
