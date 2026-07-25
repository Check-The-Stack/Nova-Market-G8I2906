"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { Product } from "../../types";
import api from "../../services/api";

const CATALOG_FALLBACK: (Product & { badge?: string; oldPrice?: number })[] = [
  {
    id: "c1",
    name: "OmniHub Smart Terminal",
    slug: "omnihub-smart-terminal-c1",
    description: "Unified control for your entire ecosystem with Matter support and AI",
    price: 129.5,
    category: "Smart Home",
    imageUrl: "https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=600&auto=format&fit=crop",
    stock: 10,
    featured: true,
    badge: "BEST SELLER",
  },
  {
    id: "c2",
    name: "OmniHub Smart Terminal",
    slug: "omnihub-smart-terminal-c2",
    description: "Unified control for your entire ecosystem with Matter support and AI",
    price: 129.5,
    category: "Smart Home",
    imageUrl: "https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=600&auto=format&fit=crop",
    stock: 8,
    featured: true,
    badge: "BEST SELLER",
  },
  {
    id: "c3",
    name: "Velox G-700 Mouse",
    slug: "velox-g-700-mouse",
    description: "32,000 DPI ultra-responsive optical sensor with honeycomb lightweight...",
    price: 89.0,
    oldPrice: 115.0,
    category: "Computación",
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop",
    stock: 15,
    featured: false,
    badge: "SALE",
  },
  {
    id: "c4",
    name: "Visionary 4K Display",
    slug: "visionary-4k-display",
    description: "144Hz refresh rate with HDR 1000 and 99% DCI-P3 color accuracy for...",
    price: 749.0,
    category: "Computación",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600&auto=format&fit=crop",
    stock: 4,
    featured: true,
    badge: "PREMIUM",
  },
  {
    id: "c5",
    name: "OmniHub Smart Terminal",
    slug: "omnihub-smart-terminal-c5",
    description: "Unified control for your entire ecosystem with Matter support and AI",
    price: 129.5,
    category: "Smart Home",
    imageUrl: "https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=600&auto=format&fit=crop",
    stock: 10,
    featured: true,
    badge: "BEST SELLER",
  },
  {
    id: "c6",
    name: "OmniHub Smart Terminal",
    slug: "omnihub-smart-terminal-c6",
    description: "Unified control for your entire ecosystem with Matter support and AI",
    price: 129.5,
    category: "Smart Home",
    imageUrl: "https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=600&auto=format&fit=crop",
    stock: 8,
    featured: true,
    badge: "BEST SELLER",
  },
  {
    id: "c7",
    name: "Velox G-700 Mouse",
    slug: "velox-g-700-mouse-c7",
    description: "32,000 DPI ultra-responsive optical sensor with honeycomb lightweight...",
    price: 89.0,
    oldPrice: 115.0,
    category: "Computación",
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop",
    stock: 15,
    featured: false,
    badge: "SALE",
  },
  {
    id: "c8",
    name: "Visionary 4K Display",
    slug: "visionary-4k-display-c8",
    description: "144Hz refresh rate with HDR 1000 and 99% DCI-P3 color accuracy for...",
    price: 749.0,
    category: "Computación",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600&auto=format&fit=crop",
    stock: 4,
    featured: true,
    badge: "PREMIUM",
  },
];

const CATEGORIES = ["Todo tecnología", "Computación", "Audio", "Smart Home", "Storage"];

export default function ProductsPage() {
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("Todo tecnología");
  const [products, setProducts] = useState<(Product & { badge?: string; oldPrice?: number })[]>(CATALOG_FALLBACK);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await api.get("/products");
        if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.log("Backend offline or empty, using catalog fallback");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts =
    selectedCategory === "Todo tecnología"
      ? products
      : products.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="space-y-10 py-6 pb-16">
      
      {/* PROMO SPECIAL BANNER - FIGMA MATCH */}
      <section className="bg-slate-900 rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-lg border border-slate-800">
        <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-md">
          <img
            src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop"
            alt="Promo Laptop"
            className="w-full h-auto max-h-[300px] object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 space-y-4 text-right md:text-right flex flex-col items-end">
          <span className="text-xs font-bold tracking-widest text-blue-400 uppercase">PROMO ESPECIAL</span>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight">
            Potenciá tu <br />
            productividad
          </h1>
          <div className="pt-2">
            <p className="text-sm text-slate-300">Hasta</p>
            <p className="text-5xl font-black text-blue-400">35%<span className="text-2xl font-bold">OFF</span></p>
            <p className="text-xs text-slate-300 mt-1">en laptops seleccionadas</p>
          </div>
        </div>
      </section>

      {/* CATEGORY FILTER BAR */}
      <section className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
        <button className="bg-slate-900 text-white rounded-lg p-2.5 flex-shrink-0 hover:bg-slate-800 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>

        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
              selectedCategory === cat
                ? "bg-primary text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* PRODUCT GRID - 4 COLUMNS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 relative group"
          >
            {/* Badge */}
            <div className="flex items-center justify-between">
              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-sm uppercase">
                {product.badge || "FEATURED"}
              </span>
            </div>

            {/* Thumbnail */}
            <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Content */}
            <div className="space-y-1">
              <Link href={`/products/${product.id}`} className="font-bold text-slate-900 text-sm hover:text-primary transition-colors">
                {product.name}
              </Link>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{product.description}</p>
            </div>

            {/* Price & Action */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-baseline space-x-2">
                <span className="font-bold text-primary text-base">${product.price.toFixed(2)}</span>
                {product.oldPrice && (
                  <span className="text-xs text-slate-400 line-through">${product.oldPrice.toFixed(2)}</span>
                )}
              </div>
              <button
                onClick={() => addItem(product)}
                className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition-colors shadow-sm"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </section>

    </div>
  );
}
