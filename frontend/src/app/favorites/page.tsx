"use client";

import React from "react";
import Link from "next/link";
import { useFavorites } from "../../context/FavoritesContext";
import { useCart } from "../../context/CartContext";

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();
  const { addItem } = useCart();

  const handleMoveToCart = (product: any) => {
    addItem(product, 1);
  };

  if (favorites.length === 0) {
    return (
      <div className="py-20 px-4 text-center max-w-md mx-auto space-y-5">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-3xl font-black mx-auto">
          ❤️
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Tu lista de favoritos está vacía</h2>
        <p className="text-slate-500 text-xs leading-relaxed">
          Guarda tus artículos favoritos haciendo clic en el ícono de corazón de cualquier producto para comprarlos más adelante.
        </p>
        <Link
          href="/products"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-8 py-3 rounded-xl shadow-md transition-all"
        >
          Explorar Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mis Favoritos</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tienes {favorites.length} {favorites.length === 1 ? "producto guardado" : "productos guardados"} en tu lista de deseos.
          </p>
        </div>
        <Link href="/products" className="text-xs font-bold text-blue-600 hover:underline">
          Seguir explorando &rarr;
        </Link>
      </div>

      {/* Favorites Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {favorites.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group relative"
          >
            {/* Top Bar: Category & Remove Button */}
            <div className="flex items-center justify-between relative z-10">
              <span className="bg-blue-50 text-blue-700 text-[10px] font-extrabold tracking-wider px-2.5 py-0.5 rounded-full uppercase border border-blue-100">
                {product.category}
              </span>

              <button
                onClick={() => removeFavorite(product.id)}
                className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 hover:bg-rose-100 transition-colors shadow-2xs"
                title="Quitar de favoritos"
                aria-label="Quitar de favoritos"
              >
                <svg className="w-4 h-4 fill-rose-500" viewBox="0 0 24 24" stroke="currentColor">
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
            <Link href={`/products/${product.id}`} className="block w-full h-44 rounded-2xl overflow-hidden bg-slate-50 relative">
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

            {/* Price & Add to Cart Button */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="font-black text-blue-600 text-lg">${product.price.toLocaleString("es-AR")}</span>
                {product.stock > 0 ? (
                  <span className="text-[10px] text-emerald-600 font-bold">En Stock</span>
                ) : (
                  <span className="text-[10px] text-rose-500 font-bold">Sin Stock</span>
                )}
              </div>

              <button
                onClick={() => handleMoveToCart(product)}
                disabled={product.stock <= 0}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-all ${
                  product.stock > 0
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Añadir al Carrito</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
