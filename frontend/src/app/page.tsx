"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { Product } from "../types";
import api from "../services/api";

const INITIAL_DEMO_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "MacBook Pro 16 M3 Max",
    slug: "macbook-pro-16-m3-max",
    description: "Chip M3 Max de Apple con CPU de 16 núcleos, GPU de 40 núcleos, 36GB RAM, 1TB SSD. Pantalla Liquid Retina XDR de 16.2 pulgadas.",
    price: 3499.0,
    originalPrice: 3899.0,
    onSale: false,
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
    description: "Diseño de titanio aeroespacial, Chip A17 Pro, Cámara de 48 MP con zoom óptico de 5x y Botón de Acción.",
    price: 1299.0,
    originalPrice: 1449.0,
    onSale: true,
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
    name: "OmniHub Smart Terminal Pro",
    slug: "omnihub-smart-terminal",
    description: "Unified control for your entire ecosystem with Matter support, audio Hi-Fi and built-in AI voice assistant.",
    price: 129.5,
    originalPrice: 159.0,
    onSale: true,
    badge: "BEST SELLER",
    category: "Smart Home",
    brand: "NovaTech",
    model: "OmniHub Pro",
    color: "Gris Grafito",
    imageUrl: "https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=800&auto=format&fit=crop",
    stock: 25,
    featured: true,
  },
  {
    id: "p4",
    name: "Sony WH-1000XM5 Wireless Headphones",
    slug: "sony-wh-1000xm5",
    description: "Auriculares inalámbricos con cancelación de ruido líder en la industria con 8 micrófonos y procesador Auto NC Optimizer.",
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
    id: "p5",
    name: "Logitech MX Master 3S Performance Mouse",
    slug: "logitech-mx-master-3s",
    description: "Mouse inalámbrico ergonómico con desplazamiento Quiet Clicks, sensor de 8K DPI para cualquier superficie y botón de gestos.",
    price: 89.0,
    originalPrice: 115.0,
    onSale: true,
    badge: "SALE",
    category: "Perifericos",
    brand: "Logitech",
    model: "MX Master 3S",
    color: "Gris Claro",
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop",
    stock: 20,
    featured: false,
  },
  {
    id: "p6",
    name: "Monitor Visionary 4K Display OLED",
    slug: "monitor-visionary-4k",
    description: "144Hz refresh rate with HDR 1000, 99% DCI-P3 color accuracy for creative professionals and gaming.",
    price: 749.0,
    originalPrice: 899.0,
    onSale: false,
    badge: "PREMIUM",
    category: "Monitores",
    brand: "Visionary",
    model: "4K Display Pro",
    color: "Plata",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
    stock: 6,
    featured: true,
  },
  {
    id: "p7",
    name: "Teclado Mecánico Keychron Q1 Pro Wireless",
    slug: "keychron-q1-pro",
    description: "Teclado mecánico custom de aluminio QMK/VIA con switches Gateron G Pro y conectividad Bluetooth 5.1 multidispositivo.",
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
    category: "Celulares",
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    color: "Titanio Gris",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800&auto=format&fit=crop",
    stock: 7,
    featured: true,
  },
];

export default function HomePage() {
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [products, setProducts] = useState<Product[]>(INITIAL_DEMO_PRODUCTS);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        let list: Product[] = [];
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          list = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          list = response.data.data;
        }

        if (list.length > 0) {
          setProducts(list);
          try {
            localStorage.setItem("novamarket_admin_products", JSON.stringify(list));
          } catch (e) {}
          return;
        }
      } catch (err) {
        console.log("Using fallback catalog products");
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

      setProducts(INITIAL_DEMO_PRODUCTS);
    };
    fetchProducts();
  }, []);

  // Carousel controls (4 items per view as in UI mockup)
  const itemsPerPage = 4;
  const maxPages = Math.ceil(products.length / itemsPerPage);

  const handlePrevCarousel = () => {
    setCarouselIndex((prev) => (prev > 0 ? prev - 1 : maxPages - 1));
  };

  const handleNextCarousel = () => {
    setCarouselIndex((prev) => (prev < maxPages - 1 ? prev + 1 : 0));
  };

  const visibleCarouselProducts = products.slice(
    carouselIndex * itemsPerPage,
    carouselIndex * itemsPerPage + itemsPerPage
  );

  return (
    <div className="space-y-16 py-4 pb-16">
      
      {/* 1. HERO BANNER - PORTADA HOME (portada-home.png) */}
      <section className="w-full">
        <img
          src="/images/portada-home.png"
          alt="Ingeniería de excelencia para tu vida digital"
          className="w-full h-auto rounded-3xl block"
        />
      </section>

      {/* 2. BENTO GRID: "Explora Nuestro productos" - EXACT UI MATCH */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Explora Nuestro productos
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Descubre nuestros productos especializados.
          </p>
          <div className="pt-1">
            <Link
              href="/products"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1"
            >
              <span>Ver todas las categorías</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Bento Grid 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          
          {/* Card 1: Hardware Pro (Left Tall Card - 5 cols, 2 rows) */}
          <Link
            href="/products?category=Computación"
            className="md:col-span-5 relative rounded-3xl overflow-hidden bg-slate-900 group min-h-[380px] md:min-h-[480px] shadow-sm flex flex-col justify-end p-6 border border-slate-200"
          >
            <img
              src="/images/bento-hardware.png"
              alt="Hardware Pro"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10" />
            <div className="relative z-20 text-white space-y-1">
              <h3 className="text-lg font-black tracking-wide">Hardware Pro</h3>
              <p className="text-xs text-slate-300">Componentes de máxima potencia</p>
            </div>
          </Link>

          {/* Right Side 3 Cards (7 cols) */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Card 2: Audio & Headphones */}
            <Link
              href="/products?category=Audio"
              className="relative rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-2xs group min-h-[220px] flex items-center justify-center p-4"
            >
              <img
                src="/images/bento-headphones.png"
                alt="Audio & Headphones"
                className="max-h-44 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-4 left-4 z-20 text-slate-900">
                <span className="text-xs font-bold bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
                  Audio Hi-Fi
                </span>
              </div>
            </Link>

            {/* Card 3: Peripherals & Mouse */}
            <Link
              href="/products?category=Perifericos"
              className="relative rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-2xs group min-h-[220px] flex flex-col justify-end p-5"
            >
              <img
                src="/images/bento-mouse.png"
                alt="Peripherals"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="relative z-20 text-slate-900">
                <span className="text-xs font-bold bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
                  Periféricos
                </span>
              </div>
            </Link>

            {/* Card 4: Workspaces (Spans full width of right side) */}
            <Link
              href="/products?category=Monitores"
              className="sm:col-span-2 relative rounded-3xl overflow-hidden bg-slate-900 group min-h-[230px] flex flex-col justify-end p-6 border border-slate-200 shadow-sm"
            >
              <img
                src="/images/bento-workspace.png"
                alt="Workspaces"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent z-10" />
              <div className="relative z-20 text-white space-y-1">
                <h3 className="text-base font-black tracking-wide">Estaciones de Trabajo</h3>
                <p className="text-xs text-slate-300">Setups profesionales minimalistas</p>
              </div>
            </Link>

          </div>

        </div>
      </section>

      {/* 3. SECTION: TRENDING HARDWARE (CAROUSEL WITH 4 CARDS) - EXACT UI MATCH */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Trending Hardware
          </h2>

          {/* Carousel Arrows */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevCarousel}
              className="w-9 h-9 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
              aria-label="Anterior"
            >
              &lt;
            </button>
            <button
              onClick={handleNextCarousel}
              className="w-9 h-9 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
              aria-label="Siguiente"
            >
              &gt;
            </button>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleCarouselProducts.map((product) => (
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
                <div>
                  {(product.onSale || (product.originalPrice && product.originalPrice > product.price)) && (
                    <span className="text-[11px] text-slate-400 line-through font-semibold block">
                      ${(product.originalPrice || Math.round(product.price * 1.2)).toLocaleString("es-AR")}
                    </span>
                  )}
                  <span className={`text-base font-extrabold ${product.onSale ? "text-rose-600" : "text-blue-600"}`}>
                    ${product.price.toLocaleString("es-AR")}
                  </span>
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
      </section>

      {/* 4. SOLID BLUE CTA BANNER - EXACT UI MATCH (Landing Page (Inicio).jpg) */}
      <section className="bg-blue-600 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md text-white">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
            Regístrate para poder comprar y obtener beneficios.
          </h2>
        </div>

        <Link
          href="/register"
          className="bg-white text-slate-900 hover:bg-slate-100 font-black px-10 py-3.5 rounded-xl shadow-md transition-all text-sm shrink-0 transform active:scale-95"
        >
          Registrate
        </Link>
      </section>

    </div>
  );
}
