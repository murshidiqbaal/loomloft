"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/products/ProductCard";
import { formatPrice } from "@/lib/utils";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Sparkles,
  RotateCcw,
  Check
} from "lucide-react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const filterParam = searchParams.get("filter") || "";
  const categoryParam = searchParams.get("category") || "";

  const { products } = useStore();

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedCollection, setSelectedCollection] = useState<string>("");
  const [selectedFabric, setSelectedFabric] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<number>(25000);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extracted unique filter lists
  const categories = ["Handloom", "Men", "Women", "Ethnic Wear", "Casual", "Festive"];
  const collectionsList = ["Heritage Series", "Crafted Elegance", "Ethereal Weaves", "Artisan Earth"];
  const fabrics = ["Pure Chanderi Silk", "Khadi Raw Silk", "Mulberry Silk", "Muslin Cotton", "Organic Linen", "Modal Silk", "Pashmina"];
  const sizesList = ["XS", "S", "M", "L", "XL", "38", "40", "42", "44", "Free Size"];
  const colorList = [
    { name: "Forest", hex: "#072618" },
    { name: "Gold", hex: "#e5a110" },
    { name: "Ivory", hex: "#FAF7F2" },
    { name: "Indigo", hex: "#112432" },
    { name: "Maroon", hex: "#73151E" },
    { name: "Olive", hex: "#163426" }
  ];

  // Reset Filters
  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedCollection("");
    setSelectedFabric("");
    setSelectedSize("");
    setSelectedColor("");
    setMaxPrice(25000);
    setSortBy("featured");
  };

  const hasActiveFilters =
    Boolean(selectedCategory ||
    selectedCollection ||
    selectedFabric ||
    selectedSize ||
    selectedColor ||
    maxPrice < 25000);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Query search
        if (queryParam) {
          const matchQuery =
            p.name.toLowerCase().includes(queryParam.toLowerCase()) ||
            p.fabric.toLowerCase().includes(queryParam.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(queryParam.toLowerCase()));
          if (!matchQuery) return false;
        }

        // New Arrival param
        if (filterParam === "new" && !p.isNewArrival) return false;

        // Category
        if (selectedCategory && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }

        // Collection
        if (selectedCollection && !p.collection.toLowerCase().includes(selectedCollection.toLowerCase())) {
          return false;
        }

        // Fabric
        if (selectedFabric && !p.fabric.toLowerCase().includes(selectedFabric.toLowerCase())) {
          return false;
        }

        // Size
        if (selectedSize && !p.sizes.some((s) => s.toLowerCase().includes(selectedSize.toLowerCase()))) {
          return false;
        }

        // Color
        if (selectedColor && !p.colors.some((c) => c.name.toLowerCase().includes(selectedColor.toLowerCase()))) {
          return false;
        }

        // Price
        if (p.price > maxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "newest") return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [
    products,
    queryParam,
    filterParam,
    selectedCategory,
    selectedCollection,
    selectedFabric,
    selectedSize,
    selectedColor,
    maxPrice,
    sortBy
  ]);

  return (
    <div className="py-12 bg-[#FAF7F2] min-h-screen text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8 pb-6 border-b border-stone-200">
          <div className="flex items-center space-x-2 text-xs font-serif uppercase tracking-widest text-stone-500 mb-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-[#072618] font-bold">Catalog</span>
            {queryParam && (
              <>
                <span>/</span>
                <span className="text-[#e5a110] font-semibold">&ldquo;{queryParam}&rdquo;</span>
              </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-[0.12em] text-[#072618]">
                HANDLOOM CATALOG
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-stone-600 font-sans">
                Showing {filteredProducts.length} authentic handcrafted creations.
              </p>
            </div>

            {/* Sort & Mobile Filter Toggle */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-4 py-2.5 bg-[#072618] text-[#f5b92e] rounded-xl text-xs font-serif uppercase tracking-wider flex items-center space-x-2 shadow-sm"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters {hasActiveFilters && "• Active"}</span>
              </button>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-4 py-2.5 pr-8 bg-white border border-stone-300 rounded-xl text-xs font-serif uppercase tracking-wider text-stone-800 focus:outline-none focus:border-[#072618] cursor-pointer shadow-sm"
                >
                  <option value="featured">Featured Curations</option>
                  <option value="newest">Newest Additions</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Pills */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-xs font-serif uppercase tracking-wider text-stone-500 mr-1">
              Active:
            </span>
            {selectedCategory && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#072618] text-[#f5b92e] rounded-full text-xs font-serif">
                <span>{selectedCategory}</span>
                <button onClick={() => setSelectedCategory("")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCollection && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#072618] text-[#f5b92e] rounded-full text-xs font-serif">
                <span>{selectedCollection}</span>
                <button onClick={() => setSelectedCollection("")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedFabric && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#072618] text-[#f5b92e] rounded-full text-xs font-serif">
                <span>{selectedFabric}</span>
                <button onClick={() => setSelectedFabric("")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedSize && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#072618] text-[#f5b92e] rounded-full text-xs font-serif">
                <span>Size: {selectedSize}</span>
                <button onClick={() => setSelectedSize("")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedColor && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#072618] text-[#f5b92e] rounded-full text-xs font-serif">
                <span>Shade: {selectedColor}</span>
                <button onClick={() => setSelectedColor("")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {maxPrice < 25000 && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#072618] text-[#f5b92e] rounded-full text-xs font-serif">
                <span>Under {formatPrice(maxPrice)}</span>
                <button onClick={() => setMaxPrice(25000)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-xs font-serif uppercase tracking-wider text-[#072618] hover:text-[#e5a110] underline ml-2 flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          </div>
        )}

        {/* Layout Grid: Sidebar Filters (Desktop) + Product Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Sidebar Filter Column */}
          <aside className="hidden lg:block lg:col-span-3 bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <span className="font-serif text-sm font-bold uppercase tracking-widest text-[#072618]">
                Filter Catalog
              </span>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] font-serif uppercase tracking-wider text-stone-500 hover:text-[#072618] underline"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category */}
            <div>
              <h4 className="font-serif text-xs uppercase tracking-wider font-semibold text-stone-900 mb-2.5">
                Category
              </h4>
              <div className="space-y-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                    className={`flex items-center justify-between w-full text-xs py-1 px-2 rounded-lg transition-colors text-left ${
                      selectedCategory === cat
                        ? "bg-[#072618] text-[#f5b92e] font-semibold"
                        : "text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Collection */}
            <div className="pt-4 border-t border-stone-100">
              <h4 className="font-serif text-xs uppercase tracking-wider font-semibold text-stone-900 mb-2.5">
                Collection Edition
              </h4>
              <div className="space-y-1.5">
                {collectionsList.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedCollection(selectedCollection === col ? "" : col)}
                    className={`flex items-center justify-between w-full text-xs py-1 px-2 rounded-lg transition-colors text-left ${
                      selectedCollection === col
                        ? "bg-[#072618] text-[#f5b92e] font-semibold"
                        : "text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    <span>{col}</span>
                    {selectedCollection === col && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric */}
            <div className="pt-4 border-t border-stone-100">
              <h4 className="font-serif text-xs uppercase tracking-wider font-semibold text-stone-900 mb-2.5">
                Handloom Fabric
              </h4>
              <div className="space-y-1.5">
                {fabrics.map((fab) => (
                  <button
                    key={fab}
                    onClick={() => setSelectedFabric(selectedFabric === fab ? "" : fab)}
                    className={`flex items-center justify-between w-full text-xs py-1 px-2 rounded-lg transition-colors text-left ${
                      selectedFabric === fab
                        ? "bg-[#072618] text-[#f5b92e] font-semibold"
                        : "text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    <span>{fab}</span>
                    {selectedFabric === fab && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="pt-4 border-t border-stone-100">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-serif text-xs uppercase tracking-wider font-semibold text-stone-900">
                  Maximum Price
                </h4>
                <span className="text-xs font-serif font-bold text-[#072618]">
                  {formatPrice(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min={3000}
                max={25000}
                step={1000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#072618] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
                <span>{formatPrice(3000)}</span>
                <span>{formatPrice(25000)}</span>
              </div>
            </div>

            {/* Sizes */}
            <div className="pt-4 border-t border-stone-100">
              <h4 className="font-serif text-xs uppercase tracking-wider font-semibold text-stone-900 mb-2.5">
                Size
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {sizesList.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(selectedSize === sz ? "" : sz)}
                    className={`px-2.5 py-1 rounded text-xs font-serif transition-colors ${
                      selectedSize === sz
                        ? "bg-[#072618] text-[#f5b92e] font-bold"
                        : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="pt-4 border-t border-stone-100">
              <h4 className="font-serif text-xs uppercase tracking-wider font-semibold text-stone-900 mb-2.5">
                Natural Shade
              </h4>
              <div className="flex items-center space-x-2">
                {colorList.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(selectedColor === c.name ? "" : c.name)}
                    className={`w-6 h-6 rounded-full border-2 transition-all relative flex items-center justify-center ${
                      selectedColor === c.name
                        ? "border-[#072618] scale-125"
                        : "border-stone-300"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {selectedColor === c.name && (
                      <Check className="w-3 h-3 text-white drop-shadow" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto text-stone-400 mb-4">
                  <SlidersHorizontal className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  No Woven Creations Matched Criteria
                </h3>
                <p className="text-xs text-stone-500 mt-2 max-w-sm mx-auto">
                  Try broadening your price or category filters to discover other rare weaves from our master artisans.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-6 px-6 py-2.5 bg-[#072618] text-[#f5b92e] text-xs font-serif uppercase tracking-widest font-semibold rounded-xl"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Bottom-Sheet Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl z-10 text-stone-900">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <span className="font-serif text-lg font-bold text-[#072618]">
                Refine Weaves
              </span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-full text-stone-500 hover:text-stone-900"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div>
              <h4 className="font-serif text-xs uppercase tracking-wider font-semibold mb-2">Category</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-serif ${
                      selectedCategory === cat
                        ? "bg-[#072618] text-[#f5b92e] font-bold"
                        : "bg-stone-100 text-stone-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Fabrics */}
            <div>
              <h4 className="font-serif text-xs uppercase tracking-wider font-semibold mb-2">Fabric</h4>
              <div className="flex flex-wrap gap-2">
                {fabrics.map((fab) => (
                  <button
                    key={fab}
                    onClick={() => setSelectedFabric(selectedFabric === fab ? "" : fab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-serif ${
                      selectedFabric === fab
                        ? "bg-[#072618] text-[#f5b92e] font-bold"
                        : "bg-stone-100 text-stone-700"
                    }`}
                  >
                    {fab}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Price */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-serif uppercase tracking-wider font-semibold">Max Price</span>
                <span className="text-xs font-serif font-bold text-[#072618]">{formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={3000}
                max={25000}
                step={1000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#072618]"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 border border-stone-300 rounded-xl text-xs font-serif uppercase tracking-wider font-medium text-stone-700"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-2 py-3 bg-[#072618] text-[#f5b92e] rounded-xl text-xs font-serif uppercase tracking-widest font-bold shadow-lg"
              >
                Apply Filters ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2] p-12 text-center font-serif">Loading LoomLoft Weaves...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
