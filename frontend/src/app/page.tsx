"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Product } from "../types";

// Datos mockup iniciales para el Catálogo de Tecnología
const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "MacBook Pro M3 14\"",
    slug: "macbook-pro-m3-14",
    description: "Chip M3 con CPU de 8 núcleos y GPU de 10 núcleos, memoria unificada de 8 GB, SSD de 512 GB.",
    price: 1599,
    category: "Laptops",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop",
    stock: 5,
    featured: true,
  },
  {
    id: "p2",
    name: "iPhone 15 Pro",
    slug: "iphone-15-pro",
    description: "Diseño de titanio de calidad aeroespacial, chip A17 Pro, sistema de cámaras Pro súper potente.",
    price: 999,
    category: "Celulares",
    imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600&auto=format&fit=crop",
    stock: 12,
    featured: true,
  },
  {
    id: "p3",
    name: "Auriculares Sony WH-1000XM5",
    slug: "sony-wh-1000xm5",
    description: "Noise cancelling líder de la industria, calidad de sonido excepcional con audio de alta resolución sin cables.",
    price: 349,
    category: "Audio",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
    stock: 8,
    featured: false,
  },
  {
    id: "p4",
    name: "Monitor Gaming 27\" QHD",
    slug: "monitor-gaming-27-qhd",
    description: "Panel IPS con resolución QHD de 2560x1440 píxeles, frecuencia de actualización de 165Hz y 1ms de tiempo de respuesta.",
    price: 299,
    category: "Monitores",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600&auto=format&fit=crop",
    stock: 3,
    featured: false,
  },
  {
    id: "p5",
    name: "Teclado Mecánico Custom 65%",
    slug: "teclado-mecanico-custom-65",
    description: "Interruptores lineales lubricados de fábrica, chasis de aluminio, retroiluminación RGB configurable.",
    price: 189,
    category: "Accesorios",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop",
    stock: 15,
    featured: true,
  },
];

export default function Home() {
  const { addItem } = useCart();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  const toggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter((id) => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  const filteredProducts = selectedCategory === "Todos"
    ? MOCK_PRODUCTS
    : MOCK_PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="flex-grow bg-white pb-16">
      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-[#f4f6fa] rounded-3xl border border-border/40 overflow-hidden flex flex-col md:flex-row items-center justify-between p-8 md:p-16 gap-8">
          <div className="flex-1 max-w-xl space-y-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0e1e38] tracking-tight leading-tight">
              Ingeniería de excelencia para tu vida digital
            </h1>
            <p className="text-[#505f79] text-base sm:text-lg leading-relaxed">
              Descubre la nueva generación de hardware de ingeniería de precisión. El minimalismo se fusiona con el máximo rendimiento en nuestra nueva colección exclusiva.
            </p>
            <div>
              <button 
                onClick={() => setSelectedCategory("Todos")}
                className="bg-[#095ce8] hover:bg-[#0052cc] text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                Ver productos
              </button>
            </div>
          </div>
          <div className="flex-1 w-full max-w-lg md:max-w-none">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-white/60">
              <img
                src="https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?q=80&w=800&auto=format&fit=crop"
                alt="Minimalist Setup"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Explora por categoría */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-[#0e1e38]">Explora por categoría</h2>
            <p className="text-sm text-[#505f79] mt-1">Descubre nuestros productos especializados.</p>
          </div>
          <button 
            onClick={() => setSelectedCategory("Todos")}
            className="text-sm font-bold text-[#095ce8] hover:underline flex items-center gap-1 transition-all"
          >
            Ver todas las categorías &rarr;
          </button>
        </div>

        {/* Categories Grid - Asymmetric Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Big Card - Left */}
          <div 
            onClick={() => setSelectedCategory("Accesorios")}
            className="md:col-span-1 md:row-span-2 group relative h-[520px] rounded-2xl overflow-hidden border border-border cursor-pointer transition-all duration-300 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
            <img
              src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=600&auto=format&fit=crop"
              alt="Hardware"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-6 left-6 z-20 text-white">
              <h3 className="text-2xl font-bold">Hardware</h3>
              <p className="text-xs text-white/80 mt-1">Componentes de alto rendimiento</p>
            </div>
          </div>

          {/* Small Top-Left */}
          <div 
            onClick={() => setSelectedCategory("Audio")}
            className="group relative h-[248px] rounded-2xl overflow-hidden border border-border cursor-pointer transition-all duration-300 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <img
              src="https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?q=80&w=600&auto=format&fit=crop"
              alt="Audio"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-6 left-6 z-20 text-white">
              <h3 className="text-xl font-bold">Audio</h3>
              <p className="text-xs text-white/80 mt-1">Sonido premium</p>
            </div>
          </div>

          {/* Small Top-Right */}
          <div 
            onClick={() => setSelectedCategory("Accesorios")}
            className="group relative h-[248px] rounded-2xl overflow-hidden border border-border cursor-pointer transition-all duration-300 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <img
              src="https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop"
              alt="Accesorios"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-6 left-6 z-20 text-white">
              <h3 className="text-xl font-bold">Accesorios</h3>
              <p className="text-xs text-white/80 mt-1">Periféricos ergonómicos</p>
            </div>
          </div>

          {/* Medium Bottom - spans 2 columns */}
          <div 
            onClick={() => setSelectedCategory("Monitores")}
            className="md:col-span-2 group relative h-[248px] rounded-2xl overflow-hidden border border-border cursor-pointer transition-all duration-300 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <img
              src="https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=800&auto=format&fit=crop"
              alt="Estaciones de Trabajo"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-6 left-6 z-20 text-white">
              <h3 className="text-2xl font-bold">Estaciones de Trabajo</h3>
              <p className="text-xs text-white/80 mt-1">Setups diseñados para la productividad</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Hardware */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-[#0e1e38]">Trending Hardware</h2>
          </div>
          <div className="flex space-x-2">
            <button className="p-2.5 rounded-full border border-border hover:bg-gray-50 text-[#0e1e38] transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="p-2.5 rounded-full border border-border hover:bg-gray-50 text-[#0e1e38] transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isFavorite = favorites.includes(product.id);
            // Simulate sale tag for featured or specific items
            const hasSale = product.price > 500;
            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-border/80 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] bg-[#f4f6fa] overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Sale Badge */}
                  {hasSale && (
                    <span className="absolute top-4 left-4 bg-[#e02b2b] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                      -15% Sale
                    </span>
                  )}

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white text-gray-400 hover:text-red-500 shadow-md transition-colors"
                  >
                    <svg
                      className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>

                {/* Details */}
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-xs font-semibold text-[#505f79] uppercase tracking-wider mb-1">
                    {product.category}
                  </span>
                  <h3 className="font-bold text-[#0e1e38] text-base mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* Price and Cart Button */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
                    <span className="text-lg font-extrabold text-[#0e1e38]">
                      ${product.price.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                    </span>
                    <button
                      onClick={() => addItem(product, 1)}
                      disabled={product.stock === 0}
                      className={`p-2.5 rounded-full flex items-center justify-center transition-all ${
                        product.stock === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed border"
                          : "bg-white border border-border text-[#0e1e38] hover:bg-[#095ce8] hover:text-white hover:border-[#095ce8] shadow-sm hover:shadow active:scale-95"
                      }`}
                    >
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Registration Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="bg-[#095ce8] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white max-w-xl text-center md:text-left leading-snug">
            Regístrate para poder comprar y obtener beneficios.
          </h2>
          <div>
            <button className="bg-white text-[#095ce8] font-bold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition-all shadow-md active:scale-95 whitespace-nowrap">
              Registrarse
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
