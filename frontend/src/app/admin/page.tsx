"use client";

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Product } from "../../types";
import Link from "next/link";

// Mockup inicial de productos en panel de administrador
const INITIAL_PRODUCTS: Product[] = [
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
];

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Protección de Rol
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
        <div className="bg-destructive/10 text-destructive p-4 rounded-full mb-6">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Acceso Denegado</h2>
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          Esta sección del portal requiere privilegios de Administrador. Por favor, inicia sesión con una cuenta autorizada para continuar.
        </p>
        <Link href="/login" className="bg-primary text-primary-foreground text-sm font-semibold px-6 py-3 rounded-lg hover:bg-primary-hover transition-all shadow-sm">
          Ir al Login Administrativo
        </Link>
      </div>
    );
  }

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

  return (
    <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="border-b border-border pb-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Panel de Administración</h1>
          <p className="text-sm text-muted-foreground mt-1">Portal de gestión del catálogo e inventario de NovaMarket</p>
        </div>
        <button className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-primary-hover shadow-sm transition-all">
          Nuevo Producto
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-secondary/20 border border-border p-5 rounded-xl">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Ventas Simuladas</span>
          <p className="text-2xl font-bold text-foreground mt-2">$24,950</p>
        </div>
        <div className="bg-secondary/20 border border-border p-5 rounded-xl">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Productos Activos</span>
          <p className="text-2xl font-bold text-foreground mt-2">{products.length}</p>
        </div>
        <div className="bg-secondary/20 border border-border p-5 rounded-xl">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Bajo Inventario</span>
          <p className="text-2xl font-bold text-primary mt-2">1 Item</p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">Inventario de Productos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/30 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
              <tr>
                <th className="px-6 py-3">Producto</th>
                <th className="px-6 py-3">Categoría</th>
                <th className="px-6 py-3 text-right">Precio</th>
                <th className="px-6 py-3 text-center">Stock</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-secondary/10 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground flex items-center gap-3">
                    <img src={product.imageUrl} alt={product.name} className="w-8 h-8 rounded object-cover border border-border shrink-0" />
                    <span>{product.name}</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{product.category}</td>
                  <td className="px-6 py-4 text-right font-medium text-foreground">${product.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center font-medium">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      product.stock <= 5 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                    }`}>
                      {product.stock} unidades
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button className="text-xs text-muted-foreground hover:text-foreground font-semibold px-2 py-1 rounded border border-border hover:bg-background transition-all">
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-xs text-destructive hover:bg-destructive/10 px-2 py-1 rounded transition-all font-semibold"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
