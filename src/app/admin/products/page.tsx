"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { Product } from "@/data/mockData";
import { formatPrice } from "@/lib/utils";
import {
  Package,
  Plus,
  Trash2,
  Edit,
  Eye,
  Check,
  X,
  Search,
  SlidersHorizontal,
  Sparkles
} from "lucide-react";

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, showToast } = useStore();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: 6990,
    originalPrice: 8490,
    category: "Festive",
    collection: "Heritage Series",
    fabric: "Pure Chanderi Silk",
    origin: "Chanderi, Madhya Pradesh",
    weaveTechnique: "Hand-thrown Shuttle Pit Loom",
    description: "",
    sizes: "XS, S, M, L, XL",
    stock: 12,
    images: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
    badge: "Masterpiece",
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      sku: `LL-WEAVE-${Math.floor(100 + Math.random() * 900)}`,
      price: 7490,
      originalPrice: 9490,
      category: "Festive",
      collection: "Heritage Series",
      fabric: "Pure Chanderi Silk with Zari",
      origin: "Pranpur, Chanderi",
      weaveTechnique: "Pit Loom Hand-thrown Shuttle",
      description: "An authentic handloom creation woven from unadulterated native threads with delicate hand-beaten gold booties.",
      sizes: "XS, S, M, L, XL",
      stock: 15,
      images: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
      badge: "Artisan Edition",
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false
    });
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      sku: p.sku,
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      category: p.category,
      collection: p.collection,
      fabric: p.fabric,
      origin: p.origin,
      weaveTechnique: p.weaveTechnique,
      description: p.description,
      sizes: p.sizes.join(", "),
      stock: p.stock,
      images: p.images.join("\n"),
      badge: p.badge || "",
      isFeatured: !!p.isFeatured,
      isNewArrival: !!p.isNewArrival,
      isBestSeller: !!p.isBestSeller
    });
    setModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const sizesArr = form.sizes.split(",").map((s) => s.trim()).filter(Boolean);
    const imagesArr = form.images.split("\n").map((url) => url.trim()).filter(Boolean);
    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: form.name,
        slug,
        sku: form.sku,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice),
        category: form.category as any,
        collection: form.collection,
        fabric: form.fabric,
        origin: form.origin,
        weaveTechnique: form.weaveTechnique,
        description: form.description,
        sizes: sizesArr.length ? sizesArr : ["Free Size"],
        stock: Number(form.stock),
        images: imagesArr.length ? imagesArr : [editingProduct.images[0]],
        badge: form.badge,
        isFeatured: form.isFeatured,
        isNewArrival: form.isNewArrival,
        isBestSeller: form.isBestSeller
      });
    } else {
      addProduct({
        name: form.name,
        slug,
        sku: form.sku,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice),
        category: form.category as any,
        collection: form.collection,
        fabric: form.fabric,
        origin: form.origin,
        weaveTechnique: form.weaveTechnique,
        description: form.description,
        story: {
          thread: "Hand-reeled indigenous silk spun on traditional charkha.",
          craft: "Woven on wooden pit looms with generational interlocking technique.",
          originCluster: form.origin,
          artisanNote: "Handcrafted by master guild weavers with zero electric motors.",
          careInstructions: [
            "Specialist dry clean only",
            "Store wrapped in breathable unbleached muslin"
          ]
        },
        colors: [
          { name: "Forest", hex: "#072618" },
          { name: "Gold", hex: "#e5a110" }
        ],
        sizes: sizesArr.length ? sizesArr : ["Standard"],
        stock: Number(form.stock),
        rating: 5.0,
        reviewCount: 1,
        images: imagesArr.length ? imagesArr : ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"],
        badge: form.badge,
        isFeatured: form.isFeatured,
        isNewArrival: form.isNewArrival,
        isBestSeller: form.isBestSeller,
        tags: [form.category, form.collection]
      });
    }

    setModalOpen(false);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-800 gap-4">
        <div>
          <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#f5b92e] font-semibold">
            Catalog Intelligence
          </span>
          <h1 className="font-serif text-3xl font-bold uppercase tracking-wider text-white mt-1">
            HANDLOOM INVENTORY ({products.length})
          </h1>
          <p className="text-xs text-stone-400 font-sans mt-0.5">
            Create, calibrate prices, edit weaving specifications, and publish new masterworks.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-3 bg-[#e5a110] hover:bg-[#f5b92e] text-[#04160d] text-xs font-serif font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Handloom Weave</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by name, SKU, or category..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#072618] border border-stone-800 rounded-xl text-xs text-white placeholder-stone-400 focus:outline-none focus:border-[#e5a110]"
        />
      </div>

      {/* Products Table */}
      <div className="bg-[#072618] border border-stone-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 font-serif uppercase tracking-wider bg-[#04160d]">
                <th className="py-4 px-4">Garment</th>
                <th className="py-4 px-4">SKU</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-4">Loom Stock</th>
                <th className="py-4 px-4">Highlights</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 text-stone-300">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#04160d]/80 transition-colors">
                  <td className="py-3 px-4 flex items-center space-x-3">
                    <div className="relative w-11 h-14 rounded-lg overflow-hidden bg-stone-900 shrink-0 border border-stone-800">
                      <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif font-bold text-white text-sm truncate max-w-xs">{p.name}</h4>
                      <p className="text-[10px] text-stone-400 font-sans truncate max-w-xs">{p.fabric}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#f5b92e] font-semibold">{p.sku}</td>
                  <td className="py-3 px-4 font-serif">{p.category}</td>
                  <td className="py-3 px-4 font-serif font-bold text-white">{formatPrice(p.price)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      p.stock < 10 ? "bg-amber-950 text-amber-300 border border-amber-800" : "bg-emerald-950 text-emerald-300"
                    }`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1 flex-wrap">
                      {p.isFeatured && <span className="px-1.5 py-0.5 rounded bg-[#0d3824] text-[#f5b92e] text-[9px] font-serif">Featured</span>}
                      {p.isNewArrival && <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[9px] font-serif">New</span>}
                      {p.isBestSeller && <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 text-[9px] font-serif">Bestseller</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded-lg bg-[#04160d] text-stone-300 hover:text-[#f5b92e] border border-stone-800 transition-colors"
                        title="Edit product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 rounded-lg bg-[#04160d] text-stone-400 hover:text-rose-400 border border-stone-800 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#072618] border border-[#e5a110]/40 rounded-3xl p-6 sm:p-8 text-cream shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5 text-[#e5a110]" />
            </button>

            <h2 className="font-serif text-2xl font-bold uppercase tracking-wider text-white mb-1">
              {editingProduct ? "Edit Handloom Weave" : "Register New Masterwork"}
            </h2>
            <p className="text-xs text-stone-400 font-sans mb-6">
              Enter weaving technical specifications, origin cluster, sizes, and pricing.
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Chanderi Silk Kurta Set in Forest Emerald"
                  className="w-full px-4 py-2 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#e5a110]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">SKU</label>
                  <input
                    type="text"
                    required
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="w-full px-4 py-2 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#e5a110]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">Loom Stock Units</label>
                  <input
                    type="number"
                    min={1}
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                    className="w-full px-4 py-2 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#e5a110]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full px-4 py-2 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#e5a110]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                    className="w-full px-4 py-2 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#e5a110]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#e5a110]"
                  >
                    <option value="Festive">Festive</option>
                    <option value="Handloom">Handloom</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Ethnic Wear">Ethnic Wear</option>
                    <option value="Casual">Casual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">Collection</label>
                  <input
                    type="text"
                    value={form.collection}
                    onChange={(e) => setForm({ ...form, collection: e.target.value })}
                    className="w-full px-4 py-2 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#e5a110]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">Fabric Composition</label>
                  <input
                    type="text"
                    value={form.fabric}
                    onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                    className="w-full px-4 py-2 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#e5a110]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">Artisan Origin</label>
                  <input
                    type="text"
                    value={form.origin}
                    onChange={(e) => setForm({ ...form, origin: e.target.value })}
                    className="w-full px-4 py-2 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#e5a110]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">Available Sizes (comma-separated)</label>
                <input
                  type="text"
                  value={form.sizes}
                  onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                  placeholder="XS, S, M, L, XL"
                  className="w-full px-4 py-2 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#e5a110]"
                />
              </div>

              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">Image URLs (one per line)</label>
                <textarea
                  rows={2}
                  value={form.images}
                  onChange={(e) => setForm({ ...form, images: e.target.value })}
                  className="w-full px-4 py-2 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#e5a110] font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-stone-300 mb-1">Artisan Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 bg-[#04160d] border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#e5a110]"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center space-x-2 text-xs text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="accent-[#e5a110]"
                  />
                  <span>Featured</span>
                </label>
                <label className="flex items-center space-x-2 text-xs text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isNewArrival}
                    onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })}
                    className="accent-[#e5a110]"
                  />
                  <span>New Arrival</span>
                </label>
                <label className="flex items-center space-x-2 text-xs text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isBestSeller}
                    onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })}
                    className="accent-[#e5a110]"
                  />
                  <span>Bestseller</span>
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 bg-[#04160d] text-stone-400 hover:text-white rounded-xl text-xs font-serif uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#e5a110] hover:bg-[#f5b92e] text-[#04160d] font-serif font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg"
                >
                  Save Handloom Weave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
