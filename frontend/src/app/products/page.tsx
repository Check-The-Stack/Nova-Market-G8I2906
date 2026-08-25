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
    description: "Chip M3 Max de Apple con CPU de 16 núcleos, GPU de 40 núcleos, 36GB RAM, 1TB SSD",
    price: 3499.0,
    category: "Laptops",
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
    description: "Diseño de titanio de calidad aeroespacial, Chip A17 Pro, Cámara de 48 MP",
    price: 1299.0,
    category: "Celulares",
    brand: "Apple",
    model: "iPhone 15 Pro Max",
    color: "Titanio Natural",
    imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800&auto=format&fit=crop",
    stock: 15,
    featured: true,
  },
  {
    id: "p3",
    name: "Monitor Sony Inzone M9 4K 144Hz IPS",
    slug: "sony-inzone-m9-4k",
    description: "Monitor Gaming 27'' 4K HDR10 con Full Array Local Dimming, DisplayPort 1.4 y HDMI 2.1",
    price: 899.0,
    category: "Monitores",
    brand: "Sony",
    model: "Inzone M9",
    color: "Blanco / Negro",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
    stock: 5,
    featured: true,
  },
  {
    id: "p4",
    name: "Sony WH-1000XM5 Wireless Headphones",
    slug: "sony-wh-1000xm5",
    description: "Auriculares inalámbricos con cancelación de ruido líder en la industria y audio de alta resolución",
    price: 399.0,
    category: "Audio",
    brand: "Sony",
    model: "WH-1000XM5",
    color: "Negro",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    stock: 12,
    featured: true,
  },
  {
    id: "p5",
    name: "Logitech MX Master 3S Performance Mouse",
    slug: "logitech-mx-master-3s",
    description: "Mouse inalámbrico ergonómico con desplazamiento Quiet Clicks y sensor de 8K DPI",
    price: 99.0,
    category: "Perifericos",
    brand: "Logitech",
    model: "MX Master 3S",
    color: "Grafito",
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop",
    stock: 20,
    featured: false,
  },
  {
    id: "p6",
    name: "Teclado Mecánico Keychron Q1 Pro Wireless",
    slug: "keychron-q1-pro",
    description: "Teclado mecánico custom de aluminio QMK/VIA con switches Gateron G Pro",
    price: 199.0,
    category: "Perifericos",
    brand: "Keychron",
    model: "Q1 Pro",
    color: "Negro Carbono",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop",
    stock: 10,
    featured: false,
  },
  {
    id: "p7",
    name: "Dell XPS 15 Intel i9 64GB RAM 2TB",
    slug: "dell-xps-15-i9",
    description: "Pantalla OLED 3.5K Touch, GeForce RTX 4070, chasis de aluminio pulido",
    price: 2899.0,
    category: "Laptops",
    brand: "Dell",
    model: "XPS 15",
    color: "Plata Platino",
    imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800&auto=format&fit=crop",
    stock: 3,
    featured: true,
  },
  {
    id: "p8",
    name: "Samsung Galaxy S24 Ultra 512GB Titanium",
    slug: "samsung-galaxy-s24-ultra",
    description: "Galaxy AI integrado, S-Pen, Cámara de 200 MP, Pantalla QHD+ Dynamic AMOLED 2X",
    price: 1399.0,
    category: "Celulares",
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    color: "Titanio Gris",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800&auto=format&fit=crop",
    stock: 7,
    featured: true,
  },
];

const CATEGORIES = ["Todas", "Laptops", "Celulares", "Monitores", "Audio", "Perifericos"];

const COLOR_MAP: Record<string, { bg: string; border: string }> = {
  "Negro": { bg: "bg-slate-900", border: "border-slate-800" },
  "Negro Carbono": { bg: "bg-neutral-900", border: "border-neutral-800" },
  "Gris Espacial": { bg: "bg-slate-600", border: "border-slate-500" },
  "Titanio Gris": { bg: "bg-stone-500", border: "border-stone-400" },
  "Titanio Natural": { bg: "bg-amber-200/80", border: "border-amber-300" },
  "Plata Platino": { bg: "bg-slate-300", border: "border-slate-400" },
  "Grafito": { bg: "bg-zinc-700", border: "border-zinc-600" },
  "Blanco / Negro": { bg: "bg-gradient-to-tr from-slate-900 via-slate-100 to-white", border: "border-slate-300" },
};

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get("category") || "Todas";
  const initialSearch = searchParams?.get("search") || "";

  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [products, setProducts] = useState<Product[]>(CATALOG_FALLBACK);

  // Filter states: Marca, Modelo, Color, Precio Minimo, Precio Maximo, Categoría, Búsqueda, Stock, Orden
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedBrand, setSelectedBrand] = useState<string>("Todas");
  const [selectedModel, setSelectedModel] = useState<string>("Todos");
  const [selectedColor, setSelectedColor] = useState<string>("Todos");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(4000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name-asc">("featured");
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
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
          // Normalize and inject brand/model/color if not present in DB
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

      // Check if admin has customized products in localStorage
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
    if (searchParams?.get("category")) setSelectedCategory(searchParams.get("category") || "Todas");
    if (searchParams?.get("search")) setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  // Derived unique lists for filters
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach((p) => {
      if (p.brand) brands.add(p.brand);
    });
    return ["Todas", ...Array.from(brands).sort()];
  }, [products]);

  const availableModels = useMemo(() => {
    const models = new Set<string>();
    products.forEach((p) => {
      if (selectedBrand === "Todas" || p.brand === selectedBrand) {
        if (p.model) models.add(p.model);
      }
    });
    return ["Todos", ...Array.from(models).sort()];
  }, [products, selectedBrand]);

  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach((p) => {
      if (p.color) colors.add(p.color);
    });
    return ["Todos", ...Array.from(colors).sort()];
  }, [products]);

  // Reset model selection if chosen brand doesn't contain that model
  useEffect(() => {
    if (selectedModel !== "Todos" && !availableModels.includes(selectedModel)) {
      setSelectedModel("Todos");
    }
  }, [selectedBrand, availableModels, selectedModel]);

  // Comprehensive Filtering
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchCategory =
          selectedCategory === "Todas" || p.category?.toLowerCase() === selectedCategory.toLowerCase();
        const matchBrand =
          selectedBrand === "Todas" || p.brand?.toLowerCase() === selectedBrand.toLowerCase();
        const matchModel =
          selectedModel === "Todos" || p.model?.toLowerCase() === selectedModel.toLowerCase();
        const matchColor =
          selectedColor === "Todos" || p.color?.toLowerCase() === selectedColor.toLowerCase();
        const matchSearch =
          !searchQuery ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (p.model && p.model.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (p.color && p.color.toLowerCase().includes(searchQuery.toLowerCase())) ||
          p.category?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchPrice = p.price >= minPrice && p.price <= maxPrice;
        const matchStock = !onlyInStock || p.stock > 0;

        return matchCategory && matchBrand && matchModel && matchColor && matchSearch && matchPrice && matchStock;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, selectedCategory, selectedBrand, selectedModel, selectedColor, searchQuery, minPrice, maxPrice, onlyInStock, sortBy]);

  const resetAllFilters = () => {
    setSelectedCategory("Todas");
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
    selectedCategory !== "Todas" ||
    searchQuery !== "" ||
    selectedBrand !== "Todas" ||
    selectedModel !== "Todos" ||
    selectedColor !== "Todos" ||
    minPrice > 0 ||
    maxPrice < 4000 ||
    onlyInStock ||
    sortBy !== "featured";

  return (
    <div className="space-y-8 py-6 pb-16">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Catálogo de Productos</h1>
          <p className="text-xs text-slate-500 mt-1">
            Filtra por Marca, Modelo, Color y Rango de Precios para encontrar el equipo ideal.
          </p>
        </div>

        {/* Top Search bar & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por marca, modelo o palabra clave..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
          >
            <option value="featured">Destacados</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="name-asc">Nombre: A - Z</option>
          </select>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden bg-blue-600 text-white p-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs"
          >
            <span>Filtros</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const count =
            cat === "Todas"
              ? products.length
              : products.filter((p) => p.category?.toLowerCase() === cat.toLowerCase()).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span>{cat}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === cat ? "bg-blue-700 text-blue-100" : "bg-slate-100 text-slate-500"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Content Grid: Filters Sidebar + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: FILTERS SIDEBAR (MARCA, MODELO, COLOR, PRECIO MIN Y MAX)     */}
        {/* ========================================================================= */}
        <aside className={`lg:col-span-3 space-y-6 ${showMobileFilters ? "block" : "hidden lg:block"}`}>
          
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-6">
            
            {/* Header / Reset */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">Filtros de Búsqueda</h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="text-[11px] font-bold text-rose-500 hover:text-rose-600 hover:underline"
                >
                  Limpiar todo
                </button>
              )}
            </div>

            {/* 1. FILTRO DE MARCA */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>🏷️ Marca</span>
                {selectedBrand !== "Todas" && (
                  <span className="text-[10px] text-blue-600 font-semibold cursor-pointer" onClick={() => setSelectedBrand("Todas")}>
                    (Restablecer)
                  </span>
                )}
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {availableBrands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. FILTRO DE MODELO */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>📱 Modelo</span>
                {selectedModel !== "Todos" && (
                  <span className="text-[10px] text-blue-600 font-semibold cursor-pointer" onClick={() => setSelectedModel("Todos")}>
                    (Restablecer)
                  </span>
                )}
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {availableModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. FILTRO DE COLOR */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>🎨 Color</span>
                {selectedColor !== "Todos" && (
                  <span className="text-[10px] text-blue-600 font-semibold cursor-pointer" onClick={() => setSelectedColor("Todos")}>
                    (Restablecer)
                  </span>
                )}
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {availableColors.map((color) => {
                  const isSelected = selectedColor === color;
                  const colorDetails = COLOR_MAP[color];
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(isSelected ? "Todos" : color)}
                      className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all flex items-center space-x-1.5 cursor-pointer ${
                        isSelected
                          ? "bg-blue-50 border-blue-600 text-blue-900 shadow-2xs"
                          : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {colorDetails && (
                        <span className={`w-3 h-3 rounded-full shrink-0 border ${colorDetails.bg} ${colorDetails.border}`} />
                      )}
                      <span className="truncate">{color}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. FILTRO DE PRECIO MINIMO Y MAXIMO */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-900 block">
                💵 Rango de Precios
              </label>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">Precio Mínimo</span>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-slate-400 font-bold text-xs">$</span>
                    <input
                      type="number"
                      min={0}
                      max={maxPrice}
                      value={minPrice}
                      onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-6 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">Precio Máximo</span>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-slate-400 font-bold text-xs">$</span>
                    <input
                      type="number"
                      min={minPrice}
                      max={10000}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Math.max(minPrice, Number(e.target.value)))}
                      className="w-full pl-6 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Slider Visual */}
              <input
                type="range"
                min={50}
                max={4000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>$0</span>
                <span>Hasta ${maxPrice.toLocaleString("es-AR")}</span>
              </div>
            </div>

            {/* 5. SOLO EN STOCK */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-xs border-slate-300 focus:ring-blue-500"
                />
                <span>Solo con stock disponible</span>
              </label>
            </div>

          </div>

        </aside>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: PRODUCTS LIST & ACTIVE FILTER TAGS                          */}
        {/* ========================================================================= */}
        <main className="lg:col-span-9 space-y-5">
          
          {/* Active Filter Pills Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Filtros aplicados:</span>
              
              {selectedCategory !== "Todas" && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-lg">
                  Cat: {selectedCategory}
                  <button onClick={() => setSelectedCategory("Todas")} className="hover:text-blue-900 font-black">✕</button>
                </span>
              )}

              {selectedBrand !== "Todas" && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-lg">
                  Marca: {selectedBrand}
                  <button onClick={() => setSelectedBrand("Todas")} className="hover:text-indigo-900 font-black">✕</button>
                </span>
              )}

              {selectedModel !== "Todos" && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-lg">
                  Modelo: {selectedModel}
                  <button onClick={() => setSelectedModel("Todos")} className="hover:text-purple-900 font-black">✕</button>
                </span>
              )}

              {selectedColor !== "Todos" && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                  Color: {selectedColor}
                  <button onClick={() => setSelectedColor("Todos")} className="hover:text-emerald-900 font-black">✕</button>
                </span>
              )}

              {(minPrice > 0 || maxPrice < 4000) && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-lg">
                  ${minPrice} - ${maxPrice}
                  <button onClick={() => { setMinPrice(0); setMaxPrice(4000); }} className="hover:text-amber-900 font-black">✕</button>
                </span>
              )}

              {!hasActiveFilters && (
                <span className="text-[11px] text-slate-400 italic">Ningún filtro específico (Mostrando todo)</span>
              )}
            </div>

            <span className="text-xs font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full shrink-0">
              {filteredProducts.length} {filteredProducts.length === 1 ? "producto" : "productos"}
            </span>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">No encontramos productos coincidentes</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No hay productos que cumplan con la combinación de Marca, Modelo, Color y Rango de Precio seleccionada.
              </p>
              <button
                onClick={resetAllFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-all"
              >
                Limpiar todos los filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group relative"
                >
                  {/* Top Bar: Category, Brand & Heart */}
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold tracking-wider px-2.5 py-0.5 rounded-full uppercase">
                        {product.category}
                      </span>
                      {product.brand && (
                        <span className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          {product.brand}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => toggleFavorite(product)}
                      className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors shadow-2xs cursor-pointer"
                      aria-label="Favorito"
                    >
                      <svg
                        className={`w-4 h-4 ${isFavorite(product.id) ? "fill-rose-500 text-rose-500" : "fill-none"}`}
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

                  {/* Image Thumbnail */}
                  <Link href={`/products/${product.id}`} className="block w-full h-44 rounded-xl overflow-hidden bg-slate-50 relative">
                    <img
                      src={product.imageUrl || "/placeholder.png"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Product Details Info: Model & Color Specs */}
                  <div className="space-y-1.5 flex-1">
                    <Link href={`/products/${product.id}`} className="hover:text-blue-600 transition-colors block">
                      <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{product.name}</h3>
                    </Link>
                    
                    {/* Model & Color Badges */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      {product.model && <span>Mod: <strong className="text-slate-700">{product.model}</strong></span>}
                      {product.color && <span>• Color: <strong className="text-slate-700">{product.color}</strong></span>}
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{product.description}</p>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      {(product.onSale || (product.originalPrice && product.originalPrice > product.price)) && (
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-xs text-slate-400 line-through font-semibold">
                            ${(product.originalPrice || Math.round(product.price * 1.2)).toLocaleString("es-AR")}
                          </span>
                          <span className="text-[9px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                            {product.originalPrice && product.originalPrice > product.price
                              ? `-${Math.round((1 - product.price / product.originalPrice) * 100)}%`
                              : "OFERTA"}
                          </span>
                        </div>
                      )}
                      <span className={`text-lg font-extrabold ${product.onSale || (product.originalPrice && product.originalPrice > product.price) ? "text-rose-600 font-black" : "text-blue-600"}`}>
                        ${product.price.toLocaleString("es-AR")}
                      </span>
                      {product.stock > 0 ? (
                        <span className="text-[10px] text-emerald-600 font-semibold block">Stock: {product.stock} un.</span>
                      ) : (
                        <span className="text-[10px] text-rose-500 font-semibold block">Sin stock</span>
                      )}
                    </div>

                    <button
                      onClick={() => addItem(product)}
                      disabled={product.stock <= 0}
                      className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center transition-all ${
                        product.stock > 0
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-xs active:scale-95 cursor-pointer"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                      aria-label="Agregar al carrito"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>

      </div>

    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-slate-500 text-sm font-semibold">Cargando catálogo...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
