import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/supabase/admin";
import { addTrackingUpdate, getOrderById } from "@/lib/db/orders";
import { OrderStatus } from "@/types/ecommerce";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    // 1. Verify Admin Session server-side
    const adminSession = await verifyAdminSession();
    if (!adminSession.isAdmin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    // 2. Parse FormData
    const formData = await req.formData();
    const status = formData.get("status") as OrderStatus;
    const title = (formData.get("title") as string) || "";
    const description = (formData.get("description") as string) || "";
    const location = (formData.get("location") as string) || "";
    const courier = (formData.get("courier") as string) || "";
    const tracking_number = (formData.get("tracking_number") as string) || "";
    const tracking_url = (formData.get("tracking_url") as string) || "";
    const expected_delivery = (formData.get("expected_delivery") as string) || "";
    const override_reason = (formData.get("override_reason") as string) || "";
    const file = formData.get("document") as File | null;

    if (!status) {
      return NextResponse.json(
        { success: false, message: "Order status is required" },
        { status: 400 }
      );
    }

    // 3. Process update and optional Appwrite Storage upload
    const result = await addTrackingUpdate(
      orderId,
      {
        status,
        title,
        description,
        location,
        courier,
        tracking_number,
        tracking_url,
        expected_delivery,
        override_reason,
        admin_id: adminSession.userId,
        admin_name: adminSession.name,
      },
      file && file.size > 0 ? file : null
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error || "Failed to update tracking" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Order tracking updated to ${status}`,
      order: result.order,
    });
  } catch (error: any) {
    console.error("Error updating tracking milestone:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
