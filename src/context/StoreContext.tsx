"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Product,
  CollectionItem,
  Review,
  OrderItem,
  INITIAL_PRODUCTS,
  INITIAL_COLLECTIONS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
  INITIAL_COUPONS,
  CMS_CONTENT
} from "@/data/mockData";

export interface CartItem {
  id: string; // unique cart line id: productId-size-color
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "info" | "error";
}

interface StoreContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size?: string, color?: string, quantity?: number) => void;
  removeFromCart: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  moveToWishlist: (lineId: string) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  appliedCoupon: typeof INITIAL_COUPONS[0] | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTotal: number;
  freeShippingThreshold: number;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Recently Viewed
  recentlyViewed: Product[];
  addRecentlyViewed: (product: Product) => void;

  // Quick View Modal
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Search Overlay
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (message: string, type?: "success" | "info" | "error") => void;
  removeToast: (id: string) => void;

  // Products & Collections (with Admin persistence)
  products: Product[];
  collections: CollectionItem[];
  reviews: Review[];
  orders: OrderItem[];
  coupons: typeof INITIAL_COUPONS;
  cms: typeof CMS_CONTENT;
  
  // Admin Methods
  isAdmin: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: OrderItem["status"]) => void;
  addReview: (review: Omit<Review, "id" | "date">) => void;
  updateCms: (section: keyof typeof CMS_CONTENT, data: any) => void;
  createOrder: (order: Omit<OrderItem, "id" | "orderNumber" | "date">) => OrderItem;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Chanderi Silk",
    "Handspun Nehru Jacket",
    "Kanjivaram Saree",
    "Natural Indigo",
    "Pashmina"
  ]);
  const [appliedCoupon, setAppliedCoupon] = useState<typeof INITIAL_COUPONS[0] | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persistent Admin State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [collections, setCollections] = useState<CollectionItem[]>(INITIAL_COLLECTIONS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [cms, setCms] = useState(CMS_CONTENT);
  const [isAdmin, setIsAdmin] = useState(false);

  // Initialize from LocalStorage if available
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("loomloft_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem("loomloft_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedRecent = localStorage.getItem("loomloft_recent");
      if (savedRecent) setRecentlyViewed(JSON.parse(savedRecent));

      const savedAdmin = localStorage.getItem("loomloft_admin");
      if (savedAdmin === "true") setIsAdmin(true);
    } catch {
      // LocalStorage unavailable in SSR or private mode
    }
  }, []);

  // Save Cart & Wishlist
  useEffect(() => {
    try {
      localStorage.setItem("loomloft_cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("loomloft_wishlist", JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (product: Product, size?: string, color?: string, quantity = 1) => {
    const selectedSize = size || product.sizes[0] || "Standard";
    const selectedColor = color || (product.colors[0] ? product.colors[0].name : "Standard");
    const lineId = `${product.id}-${selectedSize}-${selectedColor}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === lineId);
      if (existing) {
        return prev.map((item) =>
          item.id === lineId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: lineId,
          product,
          quantity,
          size: selectedSize,
          color: selectedColor
        }
      ];
    });

    showToast(`Added "${product.name}" to your bag`, "success");
    setCartOpen(true);
  };

  const removeFromCart = (lineId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== lineId));
    showToast("Item removed from your bag", "info");
  };

  const updateQuantity = (lineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(lineId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === lineId ? { ...item, quantity } : item))
    );
  };

  const moveToWishlist = (lineId: string) => {
    const item = cart.find((i) => i.id === lineId);
    if (item) {
      removeFromCart(lineId);
      if (!isInWishlist(item.product.id)) {
        setWishlist((prev) => [...prev, item.product]);
        showToast("Moved to your Wishlist", "success");
      }
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from Wishlist`, "info");
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`Saved "${product.name}" to Wishlist`, "success");
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const addRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, 8);
      try {
        localStorage.setItem("loomloft_recent", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((q) => q.toLowerCase() !== query.toLowerCase());
      return [query.trim(), ...filtered].slice(0, 6);
    });
  };

  const applyCoupon = (code: string) => {
    const found = coupons.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.active
    );
    if (!found) {
      return { success: false, message: "Invalid or expired promotional code." };
    }
    setAppliedCoupon(found);
    showToast(`Code "${found.code}" applied! ${found.discountPercent}% off.`, "success");
    return { success: true, message: `Applied ${found.discountPercent}% off discount.` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast("Promotional code removed", "info");
  };

  const freeShippingThreshold = 2999;
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartDiscount = appliedCoupon
    ? Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100)
    : 0;
  const cartShipping = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? 0 : 250;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShipping);

  // Admin Methods
  const adminLogin = (password: string) => {
    // Standard default admin password for demo/showcase
    if (password === "loomloft2026" || password === "admin") {
      setIsAdmin(true);
      try {
        localStorage.setItem("loomloft_admin", "true");
      } catch {}
      showToast("Welcome back, LoomLoft Master Curator", "success");
      return true;
    }
    showToast("Incorrect security code", "error");
    return false;
  };

  const adminLogout = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem("loomloft_admin");
    } catch {}
    showToast("Logged out of Admin Portal", "info");
  };

  const addProduct = (newProd: Omit<Product, "id">) => {
    const id = `prod-${Date.now()}`;
    const product: Product = { ...newProd, id };
    setProducts((prev) => [product, ...prev]);
    showToast(`Added product "${product.name}"`, "success");
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
    showToast("Product updated successfully", "success");
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast("Product deleted", "info");
  };

  const updateOrderStatus = (orderId: string, status: OrderItem["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Order status updated to ${status}`, "success");
  };

  const addReview = (rev: Omit<Review, "id" | "date">) => {
    const newRev: Review = {
      ...rev,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    };
    setReviews((prev) => [newRev, ...prev]);
    showToast("Thank you! Your verified review has been submitted.", "success");
  };

  const updateCms = (section: keyof typeof CMS_CONTENT, data: any) => {
    setCms((prev) => ({
      ...prev,
      [section]: data
    }));
    showToast("Homepage CMS updated successfully", "success");
  };

  const createOrder = (orderData: Omit<OrderItem, "id" | "orderNumber" | "date">) => {
    const newOrder: OrderItem = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `LL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split("T")[0]
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        moveToWishlist,
        clearCart,
        cartOpen,
        setCartOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartTotal,
        freeShippingThreshold,
        wishlist,
        toggleWishlist,
        isInWishlist,
        recentlyViewed,
        addRecentlyViewed,
        quickViewProduct,
        setQuickViewProduct,
        searchOpen,
        setSearchOpen,
        recentSearches,
        addRecentSearch,
        toasts,
        showToast,
        removeToast,
        products,
        collections,
        reviews,
        orders,
        coupons,
        cms,
        isAdmin,
        adminLogin,
        adminLogout,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        addReview,
        updateCms,
        createOrder
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
