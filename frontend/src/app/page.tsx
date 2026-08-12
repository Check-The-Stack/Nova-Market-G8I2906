"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { Product } from "../types";
import api from "../services/api";

const DEMO_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "MacBook Pro 16 M3 Max",
    slug: "macbook-pro-16-m3-max",
    description: "Chip M3 Max de Apple con CPU de 16 núcleos, GPU de 40 núcleos, 36GB RAM, 1TB SSD",
    price: 3499.0,
    category: "Laptops",
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
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop",
    stock: 10,
    featured: false,
  },
];

export default function HomePage() {
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setProducts(response.data);
        }
      } catch (err) {
        console.log("Using fallback catalog products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);


  return (
    <div className="space-y-16 py-6 pb-16">
      
      {/* HERO BANNER - HIGH IMPACT MODERN DESIGN */}
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
              <span>Explorar Catálogo</span>
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

      {/* VALUE PROPOSITION BADGES */}
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

      {/* CATEGORIES GRID */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Categorías Destacadas</h2>
            <p className="text-xs text-slate-500 mt-0.5">Encuentra los componentes y equipos que necesitas</p>
          </div>
          <Link href="/products" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Ver todas &rarr;
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

      {/* FEATURED PRODUCTS SHOWCASE */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Productos Destacados</h2>
            <p className="text-xs text-slate-500 mt-0.5">Seleccionados por nuestro equipo técnico por su alta demanda</p>
          </div>
          <Link href="/products" className="text-xs font-bold text-blue-600 hover:underline">
            Ir al catálogo &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 6).map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group relative"
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

              {/* Product Thumbnail & Quick View Link */}
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

              {/* Price & Add to Cart CTA */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Precio Contado</span>
                  <span className="font-extrabold text-blue-600 text-xl">${product.price.toLocaleString("es-AR")}</span>
                </div>
                <button
                  onClick={() => addItem(product)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 flex items-center space-x-1.5 text-xs transition-all transform active:scale-95"
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

      {/* REGISTRATION CTA BANNER */}
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
