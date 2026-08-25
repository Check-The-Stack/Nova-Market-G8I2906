"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { Product } from "../../types";
import api from "../../services/api";

const CATALOG_FALLBACK: Product[] = [
  {
    id: "p1",
    name: "MacBook Pro 16 M3 Max",
    slug: "macbook-pro-16-m3-max",
    description: "Chip M3 Max de Apple con CPU de 16 núcleos, GPU de 40 núcleos, 36GB RAM, 1TB SSD. Pantalla Liquid Retina XDR de 16.2 pulgadas.",
    price: 3499.0,
    originalPrice: 3899.0,
    onSale: false,
    badge: "PREMIUM",
    category: "Computación",
    brand: "Apple",
    model: "MacBook Pro 16",
    color: "Gris Espacial",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
    stock: 8,
    featured: true,
  },
  {
    id: "p2",
    name: "iPhone 15 Pro Max 256GB Titanium",
    slug: "iphone-15-pro-max-256gb",
    description: "Diseño de titanio de calidad aeroespacial, Chip A17 Pro, Cámara de 48 MP con zoom óptico de 5x.",
    price: 1299.0,
    originalPrice: 1449.0,
    onSale: true,
    badge: "BEST SELLER",
    category: "Smart Home",
    brand: "Apple",
    model: "iPhone 15 Pro Max",
    color: "Titanio Natural",
    imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800&auto=format&fit=crop",
    stock: 15,
    featured: true,
  },
  {
    id: "p3",
    name: "OmniHub Smart Terminal",
    slug: "omnihub-smart-terminal",
    description: "Unified control for your entire ecosystem with Matter support and AI voice assistant.",
    price: 129.5,
    originalPrice: 159.0,
    onSale: true,
    badge: "BEST SELLER",
    category: "Smart Home",
    brand: "NovaTech",
    model: "OmniHub",
    color: "Gris Grafito",
    imageUrl: "https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=800&auto=format&fit=crop",
    stock: 25,
    featured: true,
  },
  {
    id: "p4",
    name: "Velox G-700 Mouse",
    slug: "velox-g-700-mouse",
    description: "32,000 DPI ultra-responsive optical sensor with honeycomb lightweight design.",
    price: 89.0,
    originalPrice: 115.0,
    onSale: true,
    badge: "SALE",
    category: "Perifericos",
    brand: "Velox",
    model: "G-700",
    color: "Negro",
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop",
    stock: 30,
    featured: true,
  },
  {
    id: "p5",
    name: "Visionary 4K Display",
    slug: "visionary-4k-display",
    description: "144Hz refresh rate with HDR 1000 and 99% DCI-P3 color accuracy for creative work.",
    price: 749.0,
    originalPrice: 899.0,
    onSale: false,
    badge: "PREMIUM",
    category: "Computación",
    brand: "Visionary",
    model: "4K Pro",
    color: "Plata",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
    stock: 7,
    featured: true,
  },
  {
    id: "p6",
    name: "Sony WH-1000XM5 Wireless Headphones",
    slug: "sony-wh-1000xm5",
    description: "Auriculares inalámbricos con cancelación de ruido líder en la industria y sonido de alta fidelidad.",
    price: 399.0,
    originalPrice: 449.0,
    onSale: true,
    badge: "SALE",
    category: "Audio",
    brand: "Sony",
    model: "WH-1000XM5",
    color: "Negro",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    stock: 12,
    featured: true,
  },
  {
    id: "p7",
    name: "Teclado Mecánico Keychron Q1 Pro Wireless",
    slug: "keychron-q1-pro",
    description: "Teclado mecánico custom de aluminio QMK/VIA con switches Gateron G Pro.",
    price: 199.0,
    originalPrice: 229.0,
    onSale: false,
    badge: "BEST SELLER",
    category: "Perifericos",
    brand: "Keychron",
    model: "Q1 Pro",
    color: "Negro Carbono",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop",
    stock: 10,
    featured: false,
  },
  {
    id: "p8",
    name: "Samsung Galaxy S24 Ultra 512GB Titanium",
    slug: "samsung-galaxy-s24-ultra",
    description: "Galaxy AI integrado, S-Pen, Cámara de 200 MP, Pantalla QHD+ Dynamic AMOLED 2X.",
    price: 1399.0,
    originalPrice: 1599.0,
    onSale: true,
    badge: "SALE",
    category: "Smart Home",
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    color: "Titanio Gris",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800&auto=format&fit=crop",
    stock: 7,
    featured: true,
  },
];

const CATEGORIES = ["Todo tecnología", "Computación", "Audio", "Smart Home", "Storage", "Perifericos"];

const COLOR_MAP: Record<string, { bg: string; border: string }> = {
  "Negro": { bg: "bg-slate-900", border: "border-slate-800" },
  "Negro Carbono": { bg: "bg-neutral-900", border: "border-neutral-800" },
  "Gris Espacial": { bg: "bg-slate-700", border: "border-slate-600" },
  "Gris Grafito": { bg: "bg-stone-700", border: "border-stone-600" },
  "Titanio Natural": { bg: "bg-zinc-400", border: "border-zinc-500" },
  "Titanio Gris": { bg: "bg-slate-500", border: "border-slate-600" },
  "Plata": { bg: "bg-slate-200", border: "border-slate-300" },
  "Plata Platino": { bg: "bg-slate-100", border: "border-slate-300" },
  "Blanco / Negro": { bg: "bg-slate-300", border: "border-slate-400" },
  "Grafito": { bg: "bg-neutral-800", border: "border-neutral-700" },
};

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get("category") || "Todo tecnología";
  const initialSearch = searchParams?.get("search") || "";

  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [products, setProducts] = useState<Product[]>(CATALOG_FALLBACK);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory === "Todas" ? "Todo tecnología" : initialCategory
  );
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedBrand, setSelectedBrand] = useState<string>("Todas");
  const [selectedModel, setSelectedModel] = useState<string>("Todos");
  const [selectedColor, setSelectedColor] = useState<string>("Todos");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(4000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name-asc">("featured");
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);

        const res = await api.get("/products");
        let list: Product[] = [];
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          list = res.data;
        } else if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          list = res.data.data;
        }

        if (list.length > 0) {
          const enriched = list.map((p) => {
            const fallbackMatch = CATALOG_FALLBACK.find((f) => f.id === p.id || f.name === p.name);
            return {
              ...p,
              brand: p.brand || fallbackMatch?.brand || "NovaTech",
              model: p.model || fallbackMatch?.model || p.name,
              color: p.color || fallbackMatch?.color || "Negro",
              onSale: p.onSale ?? fallbackMatch?.onSale ?? false,
              originalPrice: p.originalPrice || fallbackMatch?.originalPrice || (p.onSale ? p.price * 1.2 : undefined),
              badge: p.badge || fallbackMatch?.badge || (p.onSale ? "SALE" : undefined),
            };
          });
          setProducts(enriched);
          try {
            localStorage.setItem("novamarket_admin_products", JSON.stringify(enriched));
          } catch (e) {}
          return;
        }
      } catch (err) {
        console.log("Using local/fallback products catalog");
      }

      try {
        const stored = localStorage.getItem("novamarket_admin_products");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed);
            return;
          }
        }
      } catch (e) {}

      setProducts(CATALOG_FALLBACK);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchParams?.get("category")) {
      const cat = searchParams.get("category");
      setSelectedCategory(cat === "Todas" ? "Todo tecnología" : (cat || "Todo tecnología"));
    }
    if (searchParams?.get("search")) setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  // Derived lists for filters
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach((p) => {
      if (p.brand) brands.add(p.brand);
    });
    return ["Todas", ...Array.from(brands)];
  }, [products]);

  const availableModels = useMemo(() => {
    const models = new Set<string>();
    products.forEach((p) => {
      if (selectedBrand === "Todas" || p.brand?.toLowerCase() === selectedBrand.toLowerCase()) {
        if (p.model) models.add(p.model);
      }
    });
    return ["Todos", ...Array.from(models)];
  }, [products, selectedBrand]);

  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach((p) => {
      if (p.color) colors.add(p.color);
    });
    return ["Todos", ...Array.from(colors)];
  }, [products]);

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        const matchCategory =
          selectedCategory === "Todo tecnología" ||
          p.category?.toLowerCase() === selectedCategory.toLowerCase() ||
          (selectedCategory === "Computación" && (p.category === "Laptops" || p.category === "Monitores"));

        // Search Query filter
        const matchSearch =
          !searchQuery ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));

        // Brand filter
        const matchBrand =
          selectedBrand === "Todas" || p.brand?.toLowerCase() === selectedBrand.toLowerCase();

        // Model filter
        const matchModel =
          selectedModel === "Todos" || p.model?.toLowerCase() === selectedModel.toLowerCase();

        // Color filter
        const matchColor =
          selectedColor === "Todos" || p.color?.toLowerCase() === selectedColor.toLowerCase();

        // Price range filter
        const matchPrice = p.price >= minPrice && p.price <= maxPrice;

        // Stock availability
        const matchStock = !onlyInStock || p.stock > 0;

        return matchCategory && matchSearch && matchBrand && matchModel && matchColor && matchPrice && matchStock;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [
    products,
    selectedCategory,
    searchQuery,
    selectedBrand,
    selectedModel,
    selectedColor,
    minPrice,
    maxPrice,
    onlyInStock,
    sortBy,
  ]);

  const resetAllFilters = () => {
    setSelectedCategory("Todo tecnología");
    setSearchQuery("");
    setSelectedBrand("Todas");
    setSelectedModel("Todos");
    setSelectedColor("Todos");
    setMinPrice(0);
    setMaxPrice(4000);
    setOnlyInStock(false);
    setSortBy("featured");
  };

  const hasActiveFilters =
    selectedCategory !== "Todo tecnología" ||
    searchQuery !== "" ||
    selectedBrand !== "Todas" ||
    selectedModel !== "Todos" ||
    selectedColor !== "Todos" ||
    minPrice > 0 ||
    maxPrice < 4000 ||
    onlyInStock;

  return (
    <div className="space-y-8 py-4 pb-16">
      
      {/* 1. TOP PROMO SPECIAL BANNER - PORTADA CATALOGO (portada.png) */}
      <section className="w-full">
        <img
          src="/images/portada.png"
          alt="Promo Especial - Potenciá tu productividad Hasta 35% OFF"
          className="w-full h-auto rounded-3xl block"
        />
      </section>

      {/* 2. HORIZONTAL CATEGORY PILLS BAR - EXACT UI MATCH (Catalo.png) */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none py-1 flex-1">
          {/* Toggle Filter Button */}
          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className={`p-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              showFilterDrawer || hasActiveFilters
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
            title="Filtros avanzados"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span className="hidden sm:inline">Filtros</span>
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? "bg-blue-100 text-blue-700 font-extrabold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="shrink-0 hidden md:block">
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="featured">Destacados</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="name-asc">Nombre (A - Z)</option>
          </select>
        </div>

      </div>

      {/* 3. ADVANCED FILTERS PANEL (Expandable) */}
      {showFilterDrawer && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900">Filtros Avanzados de Búsqueda</h3>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
              >
                Limpiar todos los filtros
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Search Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Buscar por palabra</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="MacBook, Mouse, 4K..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Marca</label>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setSelectedModel("Todos");
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {availableBrands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Model Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Modelo</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {availableModels.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Color Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Color</label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {availableColors.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="sm:col-span-2 space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Rango de Precio:</span>
                <span className="text-blue-600">${minPrice} — ${maxPrice.toLocaleString("es-AR")}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={maxPrice}
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  placeholder="Min"
                  className="w-24 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                />
                <span className="text-slate-400 text-xs">a</span>
                <input
                  type="number"
                  min={minPrice}
                  max={4000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  placeholder="Max"
                  className="w-24 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900"
                />
                <input
                  type="range"
                  min={50}
                  max={4000}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="flex-1 accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                />
              </div>
            </div>

            {/* Stock Availability */}
            <div className="sm:col-span-2 flex items-center justify-end">
              <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer select-none bg-slate-50 border border-slate-200 p-3 rounded-2xl w-full sm:w-auto">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span>Mostrar solo productos con stock disponible</span>
              </label>
            </div>

          </div>
        </div>
      )}

      {/* 4. PRODUCTS GRID (4 COLUMNS) - EXACT UI MATCH (Catalo.png) */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center space-y-4 shadow-2xs">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-2xl mx-auto text-slate-400 border border-slate-200">
            🔍
          </div>
          <h3 className="text-xl font-bold text-slate-900">No encontramos productos</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No hay artículos que coincidan con los filtros seleccionados. Intenta ampliar el rango de precio o cambiar la categoría.
          </p>
          <button
            onClick={resetAllFilters}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md cursor-pointer"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group relative"
            >
              {/* Top Row: Badge & Heart */}
              <div className="flex items-center justify-between relative z-10">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wide ${
                  product.badge === "SALE" || product.onSale
                    ? "bg-rose-50 text-rose-600 border border-rose-200"
                    : product.badge === "PREMIUM"
                    ? "bg-slate-900 text-amber-300"
                    : "bg-blue-50 text-blue-700 border border-blue-100"
                }`}>
                  {product.badge || (product.onSale ? "SALE" : "BEST SELLER")}
                </span>

                <button
                  onClick={() => toggleFavorite(product)}
                  className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors shadow-2xs cursor-pointer"
                  aria-label="Favorito"
                >
                  <svg
                    className={`w-3.5 h-3.5 ${isFavorite(product.id) ? "fill-rose-500 text-rose-500" : "fill-none"}`}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.683a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Product Image */}
              <Link href={`/products/${product.id}`} className="block w-full h-44 rounded-xl overflow-hidden bg-slate-50 relative">
                <img
                  src={product.imageUrl || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              {/* Info */}
              <div className="space-y-1 flex-1">
                <Link href={`/products/${product.id}`} className="hover:text-blue-600 transition-colors block">
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{product.name}</h3>
                </Link>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{product.description}</p>
              </div>

              {/* Price & Solid Blue '+' Button (Exact UI Match) */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-baseline gap-2">
                  <span className={`text-base font-extrabold ${product.onSale ? "text-blue-600" : "text-slate-900"}`}>
                    ${product.price.toLocaleString("es-AR")}
                  </span>
                  {(product.onSale || (product.originalPrice && product.originalPrice > product.price)) && (
                    <span className="text-xs text-slate-400 line-through font-semibold">
                      ${(product.originalPrice || Math.round(product.price * 1.2)).toLocaleString("es-AR")}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => addItem(product)}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold text-lg transition-all shadow-xs active:scale-95 cursor-pointer"
                  title="Agregar al carrito"
                  aria-label="Agregar al carrito"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400 font-bold">Cargando catálogo...</div>}>
      <ProductsCatalogContent />
    </Suspense>
  );
}
