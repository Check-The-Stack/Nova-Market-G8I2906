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

const CATEGORIES = ["Todos", "Laptops", "Celulares", "Audio", "Monitores", "Accesorios"];

export default function Home() {
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredProducts = selectedCategory === "Todos"
    ? MOCK_PRODUCTS
    : MOCK_PRODUCTS.filter(p => p.category === selectedCategory);

  return (
    <div className="flex-grow pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-secondary/30 border-b border-border py-20 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
          <span className="text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 px-3 py-1.5 rounded-full mb-6">
            Novedades Tecnológicas
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground max-w-3xl">
            Descubre los Dispositivos del Futuro en NovaMarket
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Una colección curada de lo último en hardware, smartphones y accesorios premium, lista para potenciar tu productividad y entretenimiento.
          </p>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Filters Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/60 pb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Nuestro Catálogo</h2>
            <p className="text-sm text-muted-foreground mt-1">Explora productos según su categoría</p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background text-muted-foreground border-border hover:text-foreground hover:bg-secondary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col bg-background rounded-xl border border-border overflow-hidden hover:shadow-md hover:border-primary/30 transition-all duration-300"
            >
              {/* Product Image */}
              <div className="relative aspect-video bg-muted overflow-hidden">
                {/* Fallback mock visual representation using CSS gradient when image fails */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/5" />
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {product.featured && (
                  <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-1 rounded">
                    Destacado
                  </span>
                )}
                {product.stock <= 3 && (
                  <span className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-1 rounded">
                    Últimas unidades ({product.stock})
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5 flex flex-col flex-grow">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">
                  {product.category}
                </span>
                <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 flex-grow mb-4">
                  {product.description}
                </p>

                {/* Price and Action */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
                  <span className="text-xl font-extrabold text-foreground">
                    ${product.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => addItem(product, 1)}
                    disabled={product.stock === 0}
                    className={`text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all ${
                      product.stock === 0
                        ? "bg-secondary text-muted-foreground cursor-not-allowed border border-border"
                        : "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {product.stock === 0 ? "Sin Stock" : "Añadir"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
