"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { Product } from "../types";
import api from "../services/api";

const DEMO_PRODUCTS: (Product & { originalPrice?: number; badge?: string })[] = [
  {
    id: "p1",
    name: "MacBook Pro 16 M3 Max",
    slug: "macbook-pro-16-m3-max",
    description: "Chip M3 Max de Apple con CPU de 16 núcleos, GPU de 40 núcleos, 36GB RAM, 1TB SSD",
    price: 3499.0,
    originalPrice: 3899.0,
    badge: "PREMIUM",
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
    originalPrice: 1449.0,
    badge: "BEST SELLER",
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
    originalPrice: 999.0,
    badge: "PREMIUM",
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
    originalPrice: 449.0,
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
    id: "p5",
    name: "Logitech MX Master 3S Performance Mouse",
    slug: "logitech-mx-master-3s",
    description: "Mouse inalámbrico ergonómico con desplazamiento Quiet Clicks y sensor de 8K DPI",
    price: 99.0,
    originalPrice: 129.0,
    badge: "SALE",
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
    originalPrice: 229.0,
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
    id: "p7",
    name: "Dell XPS 15 Intel i9 64GB RAM 2TB",
    slug: "dell-xps-15-i9",
    description: "Pantalla OLED 3.5K Touch, GeForce RTX 4070, chasis de aluminio pulido",
    price: 2899.0,
    originalPrice: 3199.0,
    badge: "PREMIUM",
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
    originalPrice: 1599.0,
    badge: "SALE",
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

export default function HomePage() {
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [products, setProducts] = useState<(Product & { originalPrice?: number; badge?: string })[]>(DEMO_PRODUCTS);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  // Search & Filter State on Home Page
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [maxPrice, setMaxPrice] = useState<number>(4000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          const list = response.data.map((p: any) => {
            const fb = DEMO_PRODUCTS.find((d) => d.id === p.id || d.name === p.name);
            return {
              ...p,
              originalPrice: p.originalPrice || fb?.originalPrice || (p.onSale ? p.price * 1.15 : undefined),
              badge: p.badge || fb?.badge || (p.onSale ? "SALE" : (p.featured ? "BEST SELLER" : undefined)),
              brand: p.brand || fb?.brand || "NovaTech",
              model: p.model || fb?.model || p.name,
              color: p.color || fb?.color || "Negro",
              onSale: p.onSale ?? fb?.onSale ?? false,
            };
          });
          setProducts(list);
          try {
            localStorage.setItem("novamarket_admin_products", JSON.stringify(list));
          } catch (e) {}
          return;
        } else if (response.data?.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          setProducts(response.data.data);
          try {
            localStorage.setItem("novamarket_admin_products", JSON.stringify(response.data.data));
          } catch (e) {}
          return;
        }
      } catch (err) {
        console.log("Using fallback catalog products");
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

      setProducts(DEMO_PRODUCTS);
    };
    fetchProducts();
  }, []);

  // Filter products for the interactive section
  const filteredProducts = products
    .filter((p) => {
      const matchCategory =
        selectedCategory === "Todas" || p.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPrice = p.price <= maxPrice;
      const matchStock = !onlyInStock || p.stock > 0;
      return matchCategory && matchSearch && matchPrice && matchStock;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Todas");
    setMaxPrice(4000);
    setOnlyInStock(false);
    setSortBy("featured");
  };

  // Carousel navigation (TC-017)
  const itemsPerPage = 3;
  const maxCarouselPages = Math.ceil(products.length / itemsPerPage);
  
  const handlePrevCarousel = () => {
    setCarouselIndex((prev) => (prev > 0 ? prev - 1 : maxCarouselPages - 1));
  };

  const handleNextCarousel = () => {
    setCarouselIndex((prev) => (prev < maxCarouselPages - 1 ? prev + 1 : 0));
  };

  const carouselItems = products.slice(
    carouselIndex * itemsPerPage,
    carouselIndex * itemsPerPage + itemsPerPage
  );

  return (
    <div className="space-y-16 py-6 pb-16">
      
      {/* 1. HERO BANNER - HIGH IMPACT MODERN DESIGN (TC-012) */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 md:p-14 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md lg:max-w-xl space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-400 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span>Nuevos Lanzamientos 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.15] tracking-tight text-white">
            Ingeniería de excelencia para tu{" "}
            <span className="gradient-text font-black">
              vida digital
            </span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed font-normal">
            Descubre tecnología de vanguardia, hardware de alto rendimiento y periféricos diseñados para profesionales y apasionados de la innovación.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/products"
              className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-6 py-3 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all text-sm flex items-center space-x-2"
            >
              <span>Explorar Catálogo Completo</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              href="/products?category=Laptops"
              className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-5 py-3 rounded-xl transition-all text-sm"
            >
              Ver Laptops M3
            </Link>
          </div>
        </div>

        {/* Hero Showcase Image */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end relative z-10">
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80 bg-slate-900 group">
            <img
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop"
              alt="Setup Tech NovaMarket"
              className="w-full h-72 md:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* 2. PROMOTIONAL BANNER: 35% OFF (TC-013) */}
      <section className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 text-center md:text-left z-10">
          <span className="bg-white/20 backdrop-blur-xs text-white text-[11px] font-black uppercase px-3 py-1 rounded-full border border-white/30 tracking-wider">
            ⚡ OFERTA LIMITADA
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Potenciá tu productividad — <span className="text-amber-300">Hasta 35% OFF</span>
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            Aprovecha descuentos exclusivos en monitores 4K, teclados mecánicos y accesorios profesionales.
          </p>
        </div>

        <Link
          href="/products?category=Perifericos"
          className="bg-white text-indigo-700 hover:bg-slate-50 font-black px-6 py-3 rounded-xl shadow-lg transition-all text-xs shrink-0 transform active:scale-95 z-10"
        >
          Ver Ofertas Especiales &rarr;
        </Link>
      </section>

      {/* 3. VALUE PROPOSITION BADGES */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center space-x-3.5">
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Garantía Oficial</h4>
            <p className="text-[11px] text-slate-500">12 meses de cobertura total</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center space-x-3.5">
          <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Envío Gratis</h4>
            <p className="text-[11px] text-slate-500">En compras mayores a $150</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center space-x-3.5">
          <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Hasta 12 Cuotas</h4>
            <p className="text-[11px] text-slate-500">Con todas las tarjetas</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center space-x-3.5">
          <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Soporte Técnico</h4>
            <p className="text-[11px] text-slate-500">Atención personalizada 24/7</p>
          </div>
        </div>
      </section>

      {/* 4. TRENDING HARDWARE CAROUSEL (TC-016, TC-017, TC-027, TC-028) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Trending Hardware</h2>
            <p className="text-xs text-slate-500 mt-0.5">Los productos más elegidos y mejor valorados de la semana</p>
          </div>

          {/* Carousel Controls (TC-017) */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevCarousel}
              className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
              title="Anterior"
              aria-label="Anterior"
            >
              ←
            </button>
            <button
              onClick={handleNextCarousel}
              className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
              title="Siguiente"
              aria-label="Siguiente"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {carouselItems.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group relative"
            >
              {/* Top Row: Badge (TC-027, TC-028) & Heart */}
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-1.5">
                  {product.badge === "SALE" && (
                    <span className="bg-rose-500 text-white text-[10px] font-black tracking-wider px-2.5 py-0.5 rounded-full uppercase shadow-2xs">
                      OFERTA
                    </span>
                  )}
                  {product.badge === "BEST SELLER" && (
                    <span className="bg-amber-500 text-white text-[10px] font-black tracking-wider px-2.5 py-0.5 rounded-full uppercase shadow-2xs">
                      BEST SELLER
                    </span>
                  )}
                  {product.badge === "PREMIUM" && (
                    <span className="bg-slate-900 text-amber-300 text-[10px] font-black tracking-wider px-2.5 py-0.5 rounded-full uppercase shadow-2xs">
                      ★ PREMIUM
                    </span>
                  )}
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                    {product.category}
                  </span>
                </div>

                <button
                  onClick={() => toggleFavorite(product)}
                  className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors shadow-2xs cursor-pointer"
                  aria-label="Guardar en favoritos"
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

              {/* Product Thumbnail */}
              <Link href={`/products/${product.id}`} className="block w-full h-48 rounded-xl overflow-hidden bg-slate-50 relative">
                <img
                  src={product.imageUrl || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              {/* Info */}
              <div className="space-y-1.5 flex-1">
                <Link href={`/products/${product.id}`} className="hover:text-blue-600 transition-colors">
                  <h3 className="font-bold text-slate-900 text-base line-clamp-1">{product.name}</h3>
                </Link>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{product.description}</p>
              </div>

              {/* Price with Crossed-out original price (TC-027) & Add to Cart */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-slate-400 line-through block font-medium">
                      ${product.originalPrice.toLocaleString("es-AR")}
                    </span>
                  )}
                  <span className="font-extrabold text-blue-600 text-xl">${product.price.toLocaleString("es-AR")}</span>
                </div>
                <button
                  onClick={() => addItem(product)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 flex items-center space-x-1.5 text-xs transition-all transform active:scale-95 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Agregar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE SEARCH & FILTERS ON HOME PAGE */}
      <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Buscador y Filtros de Productos
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Encuentra rápidamente productos por nombre, categoría, rango de precio o stock disponible.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
              {filteredProducts.length} productos encontrados
            </span>
            {(searchQuery || selectedCategory !== "Todas" || onlyInStock || maxPrice < 4000) && (
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:underline cursor-pointer"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Filters Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Real-time Search Input */}
          <div className="md:col-span-5 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o descripción (ej: MacBook, Sony, iPhone)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-2xs"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Price Range Slider */}
          <div className="md:col-span-4 bg-slate-50 border border-slate-200 rounded-xl p-2.5 px-3.5 space-y-1">
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
              <span>Precio máximo:</span>
              <span className="text-blue-600 font-extrabold">${maxPrice.toLocaleString("es-AR")}</span>
            </div>
            <input
              type="range"
              min={50}
              max={4000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
            />
          </div>

          {/* Sort & Stock Controls */}
          <div className="md:col-span-3 flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
            </select>

            <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 cursor-pointer select-none bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl shrink-0">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-3.5 h-3.5 text-blue-600 rounded-xs border-slate-300 focus:ring-blue-500"
              />
              <span>En stock</span>
            </label>
          </div>

        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid based on Home Filters */}
        {filteredProducts.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl p-10 text-center space-y-3 border border-slate-200">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-slate-400 shadow-2xs">
              🔍
            </div>
            <h3 className="text-base font-bold text-slate-900">No encontramos productos con estos filtros</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Intenta ampliar el rango de precio o borrar el término de búsqueda.
            </p>
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-blue-600 hover:underline inline-block cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            {filteredProducts.slice(0, 8).map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group relative"
              >
                {/* Top Row: Category Badge & Heart */}
                <div className="flex items-center justify-between relative z-10">
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-extrabold tracking-wider px-2.5 py-1 rounded-full uppercase border border-blue-100">
                    {product.category}
                  </span>
                  <button
                    onClick={() => toggleFavorite(product)}
                    className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors shadow-2xs cursor-pointer"
                    aria-label="Guardar en favoritos"
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

                {/* Product Thumbnail */}
                <Link href={`/products/${product.id}`} className="block w-full h-44 rounded-xl overflow-hidden bg-slate-50 relative">
                  <img
                    src={product.imageUrl || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Info */}
                <div className="space-y-1.5 flex-1">
                  <Link href={`/products/${product.id}`} className="hover:text-blue-600 transition-colors">
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{product.name}</h3>
                  </Link>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{product.description}</p>
                </div>

                {/* Price & Add to Cart CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-[10px] text-slate-400 line-through block font-medium">
                        ${product.originalPrice.toLocaleString("es-AR")}
                      </span>
                    )}
                    <span className="font-extrabold text-blue-600 text-lg">${product.price.toLocaleString("es-AR")}</span>
                  </div>
                  <button
                    onClick={() => addItem(product)}
                    disabled={product.stock <= 0}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-1 transition-all ${
                      product.stock > 0
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-xs active:scale-95 cursor-pointer"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <span>+ Agregar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. CATEGORIES GRID (TC-014, TC-015) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Categorías Destacadas</h2>
            <p className="text-xs text-slate-500 mt-0.5">Encuentra los componentes y equipos que necesitas</p>
          </div>
          <Link href="/products" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Ver todas las categorías &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { name: "Laptops", count: "12 productos", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&auto=format&fit=crop" },
            { name: "Celulares", count: "18 productos", image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=400&auto=format&fit=crop" },
            { name: "Monitores", count: "8 productos", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=400&auto=format&fit=crop" },
            { name: "Audio", count: "15 productos", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop" },
            { name: "Perifericos", count: "24 productos", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=400&auto=format&fit=crop" },
          ].map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${cat.name}`}
              className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-end h-40 p-4"
            >
              <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/30 transition-colors z-10" />
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="relative z-20 text-white">
                <h3 className="font-extrabold text-sm tracking-wide">{cat.name}</h3>
                <p className="text-[11px] text-slate-200">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. REGISTRATION CTA BANNER (TC-011, TC-019) */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl text-white">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            ¿Aún no tienes una cuenta en NovaMarket?
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-lg">
            Crea tu cuenta gratis en menos de 1 minuto para seguir tus pedidos, guardar tus direcciones y acceder a promociones exclusivas.
          </p>
        </div>
        <Link
          href="/register"
          className="bg-white text-blue-700 hover:bg-slate-100 font-extrabold px-8 py-3.5 rounded-xl shadow-lg transition-all text-sm shrink-0 transform active:scale-95"
        >
          Crear mi cuenta
        </Link>
      </section>

    </div>
  );
}
