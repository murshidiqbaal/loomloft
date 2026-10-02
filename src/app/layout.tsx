import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import LoadingScreen from "@/components/layout/LoadingScreen";
import CustomCursor from "@/components/layout/CustomCursor";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import SearchOverlay from "@/components/search/SearchOverlay";
import ProductQuickViewModal from "@/components/products/ProductQuickViewModal";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import Toast from "@/components/layout/Toast";
import "@/lib/appwrite";

export const metadata: Metadata = {
  metadataBase: new URL("https://loomloft.net"),
  title: "LOOM LOFT — Quality in Every Thread | Handloom Fashion & Heritage Weaves",
  description:
    "Official website for LoomLoft. Timeless Indian handloom craftsmanship, pure Kanjivaram silks, Chanderi suits, handspun tussar bandhgalas, and artisanal textiles.",
  keywords: [
    "LoomLoft",
    "Handloom fashion",
    "Chanderi silk",
    "Kanjivaram saree",
    "Tussar silk bandhgala",
    "Indian handloom luxury",
    "Quality in every thread",
    "Artisanal weaving"
  ],
  authors: [{ name: "LoomLoft Guild" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png"
  },
  openGraph: {
    title: "LOOM LOFT — Quality in Every Thread",
    description: "Timeless handloom craftsmanship, reimagined for the modern wardrobe.",
    url: "https://loomloft.net",
    siteName: "LoomLoft",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "LoomLoft Official Heritage Brand"
      }
    ],
    locale: "en_IN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "LOOM LOFT — Quality in Every Thread",
    description: "Timeless handloom craftsmanship, reimagined for the modern wardrobe.",
    images: ["/logo.png"]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-[#151715]">
        <StoreProvider>
          {/* Branded Golden Thread Loader */}
          <LoadingScreen />

          {/* Luxury Custom Cursor (Desktop Only) */}
          <CustomCursor />

          {/* Sticky Luxury Navbar */}
          <Navbar />

          {/* Main Viewport Content */}
          <main className="flex-1">{children}</main>

          {/* Multi-Column Brand Footer */}
          <Footer />

          {/* Global Interactive Overlays */}
          <CartDrawer />
          <SearchOverlay />
          <ProductQuickViewModal />
          <WhatsAppButton />
          <Toast />
        </StoreProvider>
      </body>
    </html>
  );
}
