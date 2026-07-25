"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { Product } from "../types";

const TRENDING_PRODUCTS: Product[] = [
  {
    id: "t1",
    name: "OmniHub Smart Terminal",
    slug: "omnihub-smart-terminal",
    description: "Unified control for your entire ecosystem with Matter support and AI",
    price: 129.5,
    category: "Smart Home",
    imageUrl: "https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=600&auto=format&fit=crop",
    stock: 10,
    featured: true,
  },
  {
    id: "t2",
    name: "OmniHub Smart Terminal",
    slug: "omnihub-smart-terminal-2",
    description: "Unified control for your entire ecosystem with Matter support and AI",
    price: 129.5,
    category: "Smart Home",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
    stock: 8,
    featured: true,
  },
  {
    id: "t3",
    name: "OmniHub Smart Terminal",
    slug: "omnihub-smart-terminal-3",
    description: "Unified control for your entire ecosystem with Matter support and AI",
    price: 129.5,
    category: "Smart Home",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
    stock: 12,
    featured: true,
  },
  {
    id: "t4",
    name: "OmniHub Smart Terminal",
    slug: "omnihub-smart-terminal-4",
    description: "Unified control for your entire ecosystem with Matter support and AI",
    price: 129.5,
    category: "Smart Home",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop",
    stock: 5,
    featured: true,
  },
];

export default function HomePage() {
  const { addItem } = useCart();
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-16 py-6 pb-16">
      
      {/* HERO BANNER - FIGMA EXACT MATCH */}
      <section className="bg-slate-100/90 rounded-3xl p-8 sm:p-12 md:p-14 border border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-10 shadow-xs">
        <div className="max-w-md lg:max-w-lg space-y-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.15] tracking-tight">
            Ingeniería de excelencia para tu{" "}
            <span className="relative inline-block text-blue-600 font-black">
              vida digital
              <span className="block h-1 bg-blue-600 rounded-full mt-1 w-full" />
            </span>
          </h1>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-normal">
            Descubre la nueva generación de hardware de ingeniería de precisión. El minimalismo se fusiona con el máximo rendimiento en nuestra nueva colección exclusiva.
          </p>
        </div>

        {/* Laptop Hero Image Exact Match from User Upload */}
        <div className="w-full md:w-1/2 flex justify-end">
          <div className="w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white">
            <img
              src="/images/hero-banner.png"
              alt="Bienvenido a tu Catálogo Digital - Setup NovaMarket"
              className="w-full h-auto max-h-[380px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* EXPLORA NUESTROS PRODUCTOS - ULTRA CLEAN HIGH IMPACT BENTO GRID (NO TEXT OVERLAY) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Explora Nuestro productos</h2>
            <p className="text-sm text-slate-500 mt-1">Descubre nuestros productos especializados.</p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
            Ver todas las categorías &rarr;
          </Link>
        </div>

        {/* Bento Grid con Fotografía de Alto Impacto Limpia */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Izquierda Alto (Hardware Futurista de Alto Impacto) */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 min-h-[380px] border border-slate-200/80 shadow-xs group">
            <img
              src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1000&auto=format&fit=crop"
              alt="Hardware y componentes de alta precisión"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>

          {/* Columna Derecha (3 Cards) */}
          <div className="md:col-span-2 space-y-6 flex flex-col justify-between">
            
            {/* Fila Superior (2 Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Card 2: Audífonos Estudio Minimalista */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-100 min-h-[180px] border border-slate-200/80 shadow-xs group">
                <img
                  src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop"
                  alt="Auriculares de estudio de alta fidelidad"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Card 3: Periféricos y Mouse Ergonómico Clean */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-100 min-h-[180px] border border-slate-200/80 shadow-xs group">
                <img
                  src="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop"
                  alt="Mouse y teclado ergonómico de precisión"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

            </div>

            {/* Card 4: Fila Inferior Ancha (Setup Workspace Dual Monitor Ultra-Clean) */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 min-h-[180px] border border-slate-200/80 shadow-xs group">
              <img
                src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?q=80&w=1000&auto=format&fit=crop"
                alt="Workspace con monitores duales de alta definición"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

          </div>

        </div>
      </section>

      {/* TRENDING HARDWARE CAROUSEL/GRID */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900">Trending Hardware</h2>
          <div className="flex items-center space-x-2">
            <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
              &lt;
            </button>
            <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
              &gt;
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRENDING_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 relative group"
            >
              {/* Top Row: Badge & Wishlist Heart */}
              <div className="flex items-center justify-between relative z-10">
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-xs uppercase border border-blue-100">
                  BEST SELLER
                </span>
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                >
                  <svg
                    className={`w-4 h-4 shrink-0 ${favorites[product.id] ? "fill-red-500 text-red-500" : "fill-none"}`}
                    width="16"
                    height="16"
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
              <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Info */}
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">{product.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{product.description}</p>
              </div>

              {/* Price & Add to Cart Button */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="font-bold text-blue-600 text-base">${product.price.toFixed(2)}</span>
                <button
                  onClick={() => addItem(product)}
                  className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-xs font-bold text-base"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER - FIGMA EXACT MATCH */}
      <section className="bg-blue-600 rounded-xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md text-white">
        <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-center sm:text-left">
          Regístrate para poder comprar y obtener beneficios.
        </h2>
        <Link
          href="/register"
          className="bg-white text-slate-900 font-extrabold px-8 py-3 rounded-lg hover:bg-slate-100 transition-colors shadow-xs text-sm shrink-0"
        >
          Regístrate
        </Link>
      </section>

    </div>
  );
}
