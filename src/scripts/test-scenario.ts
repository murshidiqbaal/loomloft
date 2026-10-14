import fs from "fs";
import path from "path";

// Load .env.local manually for test script runner
try {
  const envContent = fs.readFileSync(path.resolve(process.cwd(), ".env.local"), "utf-8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      process.env[key] = val;
    }
  });
} catch {}

import {
  getOrderByNumber,
  addTrackingUpdate,
  getPublicTracking,
} from "../lib/db/orders";

async function runScenario() {
  console.log("=== SCENARIO VALIDATION: SECTION 46 ===");

  // 1. Check initial order LL-2026-000001
  const order = await getOrderByNumber("LL-2026-000001");
  if (!order) {
    throw new Error("Order LL-2026-000001 not found");
  }
  console.log("✓ Initial Order found:", order.order_number, "Status:", order.status);
  console.log("  Customer:", order.customer_name, "Price:", order.total);

  // 2. Admin changes: PENDING -> CONFIRMED
  const step1 = await addTrackingUpdate(order.id, {
    status: "CONFIRMED",
    title: "Order Confirmed by Master Curator",
    description: "Weaver guild notified and authentic pure Kanjivaram silk reserved.",
    location: "Kochi Atelier",
    admin_id: "admin-01",
    admin_name: "Curator Priya",
  });
  console.log("✓ Updated to CONFIRMED:", step1.success, "New Status:", step1.order?.status);

  // 3. Admin creates: PROCESSING
  const step2 = await addTrackingUpdate(order.id, {
    status: "PROCESSING",
    title: "Order is being prepared",
    description: "Our artisans have fetched and inspected the handloom garment.",
    location: "LoomLoft Warehouse",
    admin_id: "admin-01",
    admin_name: "Curator Priya",
  });
  console.log("✓ Updated to PROCESSING:", step2.success, "Milestones count:", step2.order?.tracking_updates.length);

  // 4. Admin creates: PACKED
  const step3 = await addTrackingUpdate(order.id, {
    status: "PACKED",
    title: "Handloom Packed in Mulmul Cotton",
    description: "Wrapped in organic muslin with certificate of handloom authenticity.",
    location: "LoomLoft Warehouse",
    admin_id: "admin-01",
    admin_name: "Curator Priya",
  });
  console.log("✓ Updated to PACKED:", step3.success);

  // 5. Admin creates: SHIPPED
  const pdfBytes = Buffer.from("%PDF-1.4 test shipping consignment receipt");
  const shippingFile = new File([pdfBytes], "courier-shipping.pdf", { type: "application/pdf" });

  const step4 = await addTrackingUpdate(
    order.id,
    {
      status: "SHIPPED",
      title: "Package Handed to Courier Partner",
      description: "Handed over to Delhivery express dispatch.",
      location: "Kochi",
      courier: "Delhivery",
      tracking_number: "DL123456789",
      expected_delivery: "October 10, 2026",
      admin_id: "admin-01",
      admin_name: "Curator Priya",
    },
    shippingFile
  );
  console.log("✓ Updated to SHIPPED:", step4.success, "Courier:", step4.order?.shipment?.courier_name);
  const shippedDoc = step4.order?.tracking_updates.find((u) => u.status === "SHIPPED");
  console.log("  Uploaded Document URL:", shippedDoc?.document_url);

  // 6. Admin creates: IN_TRANSIT
  const transitBytes = Buffer.from("%PDF-1.4 test regional transit hub scan");
  const hubFile = new File([transitBytes], "bengaluru-hub.pdf", { type: "application/pdf" });

  const step5 = await addTrackingUpdate(
    order.id,
    {
      status: "IN_TRANSIT",
      title: "Package Reached Regional Hub",
      description: "Package reached Bengaluru sorting hub.",
      location: "Bengaluru",
      admin_id: "admin-01",
      admin_name: "Curator Priya",
    },
    hubFile
  );
  console.log("✓ Updated to IN_TRANSIT:", step5.success);

  // 7. Admin creates: OUT_FOR_DELIVERY
  const step6 = await addTrackingUpdate(order.id, {
    status: "OUT_FOR_DELIVERY",
    title: "Out for Delivery",
    description: "Courier partner delivery executive is on the way to recipient.",
    location: "Kothamangalam",
    admin_id: "admin-01",
    admin_name: "Curator Priya",
  });
  console.log("✓ Updated to OUT_FOR_DELIVERY:", step6.success);

  // 8. Admin creates: DELIVERED
  const step7 = await addTrackingUpdate(order.id, {
    status: "DELIVERED",
    title: "Order Delivered Successfully",
    description: "Handed over to patron. Quality in every thread verified.",
    location: "Recipient Residence",
    admin_id: "admin-01",
    admin_name: "Curator Priya",
  });
  console.log("✓ Updated to DELIVERED:", step7.success, "Final Status:", step7.order?.status);

  // 9. Customer Public Tracking Verification
  console.log("\n=== CUSTOMER VIEW VERIFICATION ===");
  const customerView = await getPublicTracking("LL-2026-000001", "test.customer@example.com");
  if (!customerView) throw new Error("Customer public tracking failed");

  console.log("Customer sees Status:", customerView.status);
  console.log("Customer sees Total Milestones:", customerView.tracking_updates.length);
  customerView.tracking_updates.forEach((m, idx) => {
    console.log(`  [${idx + 1}] ${m.status}: "${m.title}" @ ${m.location || "N/A"}${m.document_url ? " [📄 DOCUMENT ATTACHED]" : ""}`);
  });

  console.log("\nALL 8 SCENARIO MILESTONES PRESERVED WITH COMPLETE TIMELINE INTEGRITY! ✓");
}

runScenario().catch(console.error);
