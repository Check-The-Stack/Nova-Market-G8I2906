"use client";

import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cartItems, removeItem, updateQuantity, cartTotal } = useCart();
  const [promoCode, setPromoCode] = useState("");

  const estimatedTax = cartTotal * 0.08;
  const grandTotal = cartTotal + estimatedTax;

  if (cartItems.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="bg-slate-100 p-6 rounded-full text-slate-400 mb-6">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Tu carrito está vacío</h2>
        <p className="text-slate-500 max-w-sm mb-8 text-sm">
          Aún no has agregado ningún producto. ¡Explora nuestro catálogo para encontrar las mejores ofertas!
        </p>
        <Link href="/products" className="bg-primary text-white text-sm font-extrabold px-8 py-3 rounded-lg hover:bg-primary-hover transition-all shadow-sm">
          Ir a Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Carrito</h1>
        <p className="text-sm text-slate-500 mt-1">
          Tienes {cartItems.reduce((acc, i) => acc + i.quantity, 0)} artículos en tu bolsa.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.product.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start justify-between gap-4 shadow-sm hover:shadow-md transition-shadow relative"
            >
              {/* Image & Text Info */}
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 pt-1">
                  <h3 className="font-bold text-slate-900 text-base">{item.product.name}</h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {item.product.category} · Space Gray
                  </p>
                  
                  {/* Quantity selector (Figma Pill) */}
                  <div className="pt-3 flex items-center">
                    <div className="flex items-center bg-slate-100 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2.5 py-1 hover:bg-slate-200 rounded-l-lg transition-colors"
                      >
                        –
                      </button>
                      <span className="px-3 py-1">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2.5 py-1 hover:bg-slate-200 rounded-r-lg transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Price & Delete */}
              <div className="flex sm:flex-col justify-between sm:items-end w-full sm:w-auto h-full pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                <span className="font-bold text-primary text-lg">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                  title="Eliminar producto"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Right Column: Order Summary (Figma Match) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>

          {/* Breakdown */}
          <div className="space-y-3 text-xs text-slate-600 pb-4 border-b border-slate-100">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-amber-700 font-medium">Calculated at checkout</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax</span>
              <span className="font-semibold text-slate-900">${estimatedTax.toFixed(2)}</span>
            </div>
          </div>

          {/* Promo Code Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Codigo promocional</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter code"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button className="bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors">
                Agregar
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-2">
            <span className="text-base font-extrabold text-slate-900">Total</span>
            <span className="text-2xl font-black text-primary">${grandTotal.toFixed(2)}</span>
          </div>

          {/* Buttons */}
          <div className="space-y-3 pt-2">
            <Link
              href="/checkout"
              className="w-full bg-primary hover:bg-primary-hover text-white text-sm font-extrabold py-3 rounded-lg flex items-center justify-center transition-all shadow-sm"
            >
              Finalizar compra
            </Link>
            <Link
              href="/products"
              className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold py-2.5 rounded-lg flex items-center justify-center transition-all"
            >
              Continuar comprando
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
