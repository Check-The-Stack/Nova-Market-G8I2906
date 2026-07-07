"use client";

import React, { useState } from "react";
import { useCart } from "../../../context/CartContext";
import { Product } from "../../../types";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// Mockup local de base de datos de productos
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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const productId = params.id as string;
  const product = MOCK_PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Producto no encontrado</h2>
        <p className="text-muted-foreground mb-6">El identificador de producto no corresponde a ningún artículo disponible.</p>
        <Link href="/" className="bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-hover transition-all shadow-sm">
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    router.push("/cart");
  };

  return (
    <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-8">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Volver al Catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image Panel */}
        <div className="relative aspect-video sm:aspect-square bg-secondary/20 rounded-2xl overflow-hidden border border-border">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info Panel */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">
              {product.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-4 mb-2">{product.name}</h1>
            <span className="text-2xl font-extrabold text-foreground">${product.price.toLocaleString()}</span>

            <p className="text-sm text-muted-foreground leading-relaxed mt-6 mb-8 border-t border-border/40 pt-6">
              {product.description}
            </p>

            {/* Spec Table */}
            <div className="border border-border/80 rounded-xl overflow-hidden text-sm bg-secondary/20 mb-8">
              <div className="grid grid-cols-3 border-b border-border/60 p-3">
                <span className="font-semibold text-muted-foreground">Estado</span>
                <span className="col-span-2 text-foreground font-medium">
                  {product.stock > 0 ? "Disponible en stock" : "Sin Stock"}
                </span>
              </div>
              <div className="grid grid-cols-3 p-3">
                <span className="font-semibold text-muted-foreground">Garantía</span>
                <span className="col-span-2 text-foreground font-medium">12 Meses de Fábrica</span>
              </div>
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-border/40">
            {product.stock > 0 && (
              <div className="flex items-center border border-border rounded-lg bg-secondary/30 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition-all font-bold"
                >
                  -
                </button>
                <span className="px-4 text-sm font-semibold text-foreground w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition-all font-bold"
                >
                  +
                </button>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full text-center py-3 rounded-lg font-semibold text-sm transition-all shadow-sm ${
                product.stock === 0
                  ? "bg-secondary text-muted-foreground cursor-not-allowed border border-border"
                  : "bg-primary text-primary-foreground hover:bg-primary-hover"
              }`}
            >
              {product.stock === 0 ? "Producto sin Stock" : "Añadir al Carrito"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
