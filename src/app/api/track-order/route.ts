import { NextRequest, NextResponse } from "next/server";
import { getPublicTracking } from "@/lib/db/orders";

// Simple in-memory rate limiter per IP: max 20 requests per minute
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local-client";
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (entry && entry.expiresAt > now) {
      if (entry.count > 20) {
        return NextResponse.json(
          { success: false, message: "Too many tracking inquiries. Please wait a moment." },
          { status: 429 }
        );
      }
      entry.count += 1;
    } else {
      rateLimitMap.set(ip, { count: 1, expiresAt: now + 60000 });
    }

    const { orderNumber, emailOrPhone } = await req.json();

    if (!orderNumber || !emailOrPhone) {
      return NextResponse.json(
        {
          success: false,
          message: "Both Order Number and Customer Email or Phone number are strictly required.",
        },
        { status: 400 }
      );
    }

    const trackingData = await getPublicTracking(orderNumber, emailOrPhone);

    if (!trackingData) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No matching order found for this order number and contact detail combination.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, tracking: trackingData });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process tracking request" },
      { status: 500 }
    );
  }
}
