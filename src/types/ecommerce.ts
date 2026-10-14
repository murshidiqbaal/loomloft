export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "PACKED"
  | "SHIPPED"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURN_REQUESTED"
  | "RETURNED"
  | "REFUNDED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "NOT_REQUIRED";

export type PaymentMethod = "COD" | "BANK_TRANSFER" | "UPI_MANUAL" | "OTHER";

export interface CustomerAddress {
  id?: string;
  customer_id?: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  district?: string;
  state: string;
  pincode: string;
  country: string;
  address_type?: "HOME" | "WORK" | "OTHER";
  is_default?: boolean;
}

export interface CustomerRecord {
  id: string;
  user_id: string; // Supabase auth UID
  name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  status: "ACTIVE" | "BLOCKED";
  orders_count: number;
  total_spent: number;
  last_order_at?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItemSnapshot {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  product_name_snapshot: string;
  sku_snapshot: string;
  image_snapshot: string;
  price_snapshot: number;
  offer_id?: string;
  discount_amount: number;
  quantity: number;
  subtotal: number;
  selected_size?: string;
  selected_color?: string;
}

export interface OrderStatusHistoryRecord {
  id: string;
  order_id: string;
  status: OrderStatus;
  title: string;
  description: string;
  location?: string;
  updated_by: string; // admin user ID
  updated_by_name: string;
  tracking_update_id?: string;
  created_at: string;
}

export interface TrackingUpdateRecord {
  id: string;
  order_id: string;
  shipment_id?: string;
  status: OrderStatus;
  title: string;
  description: string;
  location?: string;
  courier_name?: string;
  tracking_number?: string;
  tracking_url?: string;
  expected_delivery?: string;
  document_url?: string | null;
  document_name?: string | null;
  document_type?: string | null;
  document_file_id?: string | null;
  updated_by: string;
  updated_by_name: string;
  created_at: string;
}

export interface ShipmentRecord {
  id: string;
  order_id: string;
  courier_name: string;
  tracking_number: string;
  tracking_url?: string;
  status: OrderStatus;
  expected_delivery?: string;
  shipped_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderRecord {
  id: string;
  order_number: string; // e.g. LL-2026-000125
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  payment_reference?: string;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  tax: number;
  total: number;
  coupon_code?: string;
  shipping_address: CustomerAddress;
  customer_note?: string;
  admin_note?: string;
  items: OrderItemSnapshot[];
  shipment?: ShipmentRecord;
  tracking_updates: TrackingUpdateRecord[];
  status_history: OrderStatusHistoryRecord[];
  created_at: string;
  updated_at: string;
}

export interface InventoryRecord {
  id: string;
  product_id: string;
  variant_id?: string;
  product_name: string;
  sku: string;
  available_stock: number;
  reserved_stock: number;
  sold_count: number;
  low_stock_threshold: number;
  updated_at: string;
}

export interface InventoryHistoryRecord {
  id: string;
  product_id: string;
  variant_id?: string;
  change_type: "ORDER_RESERVED" | "ORDER_FULFILLED" | "ORDER_CANCELLED" | "MANUAL_ADJUSTMENT" | "RESTOCK";
  quantity_change: number;
  previous_stock: number;
  new_stock: number;
  reason: string;
  reference_id?: string;
  updated_by: string;
  created_at: string;
}

export interface AdminActivityLogRecord {
  id: string;
  admin_user_id: string;
  admin_name: string;
  action:
    | "ORDER_CREATED"
    | "ORDER_STATUS_UPDATED"
    | "TRACKING_ADDED"
    | "TRACKING_DOCUMENT_UPLOADED"
    | "ORDER_CANCELLED"
    | "PRODUCT_CREATED"
    | "PRODUCT_UPDATED"
    | "PRODUCT_DELETED"
    | "INVENTORY_UPDATED"
    | "OFFER_CREATED"
    | "OFFER_UPDATED"
    | "REVIEW_APPROVED"
    | "ADMIN_STATUS_OVERRIDE";
  entity_type: "ORDER" | "PRODUCT" | "INVENTORY" | "OFFER" | "REVIEW" | "TRACKING";
  entity_id: string;
  description: string;
  metadata?: Record<string, any>;
  created_at: string;
}

// Order Status Transitions validation
export const VALID_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["PACKED", "CANCELLED"],
  PACKED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["IN_TRANSIT", "CANCELLED"],
  IN_TRANSIT: ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: ["RETURN_REQUESTED"],
  RETURN_REQUESTED: ["RETURNED", "DELIVERED"],
  RETURNED: ["REFUNDED"],
  REFUNDED: [],
  CANCELLED: []
};

export function isValidTransition(from: OrderStatus, to: OrderStatus): boolean {
  if (from === to) return true;
  return VALID_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}
