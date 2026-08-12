"use client";

import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cartItems, removeItem, updateQuantity, cartTotal, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState<string>("");

  const FREE_SHIPPING_THRESHOLD = 150;
  const progressToFreeShipping = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    if (promoCode.trim().toUpperCase() === "NOVA10") {
      setAppliedDiscount(0.10); // 10% OFF
    } else if (promoCode.trim().toUpperCase() === "NOVA20") {
      setAppliedDiscount(0.20); // 20% OFF
    } else {
      setPromoError("Código promocional inválido (Prueba NOVA10)");
    }
  };

  const discountAmount = cartTotal * appliedDiscount;
  const estimatedTax = (cartTotal - discountAmount) * 0.08;
  const shippingCost = remainingForFreeShipping === 0 ? 0 : 15.0;
  const grandTotal = cartTotal - discountAmount + estimatedTax + shippingCost;

  if (cartItems.length === 0) {
    return (
      <div className="py-20 px-4 text-center max-w-md mx-auto space-y-5">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mx-auto">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Tu carrito está vacío</h2>
        <p className="text-slate-500 text-xs leading-relaxed">
          Explora nuestro catálogo para encontrar laptops, celulares, periféricos y la última tecnología.
        </p>
        <Link href="/products" className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-8 py-3 rounded-xl shadow-md transition-all">
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mi Carrito de Compras</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tienes {cartItems.reduce((acc, i) => acc + i.quantity, 0)} artículos en tu bolsa.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:underline"
        >
          Vaciar carrito
        </button>
      </div>

      {/* Free Shipping Progress Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-blue-900">
          <span>
            {remainingForFreeShipping > 0 ? (
              <>Agrega <strong>${remainingForFreeShipping.toFixed(2)}</strong> más para obtener <strong>Envío Gratis</strong></>
            ) : (
              <>🎉 ¡Felicidades! Tienes <strong>Envío Gratis</strong> asegurado</>
            )}
          </span>
          <span>{Math.round(progressToFreeShipping)}%</span>
        </div>
        <div className="w-full bg-blue-200/70 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressToFreeShipping}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start justify-between gap-4 shadow-2xs hover:shadow-md transition-all relative"
            >
              {/* Image & Text Info */}
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 p-1 shrink-0 flex items-center justify-center">
                  <img
                    src={product.imageUrl || "/placeholder.png"}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wide bg-blue-50 px-2 py-0.5 rounded-full">
                    {product.category}
                  </span>
                  <Link href={`/products/${product.id}`} className="hover:text-blue-600 transition-colors block">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">{product.name}</h3>
                  </Link>
                  <p className="text-xs text-slate-500 font-semibold">${product.price.toLocaleString("es-AR")} c/u</p>
                  
                  {/* Quantity selector */}
                  <div className="pt-2 flex items-center">
                    <div className="flex items-center bg-slate-100 rounded-xl border border-slate-200 text-slate-800 text-xs font-bold overflow-hidden">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="px-3 py-1.5 hover:bg-slate-200 transition-colors"
                      >
                        –
                      </button>
                      <span className="px-3 py-1.5">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="px-3 py-1.5 hover:bg-slate-200 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Total Price & Delete */}
              <div className="flex sm:flex-col justify-between sm:items-end w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                <span className="font-black text-blue-600 text-lg sm:text-xl">
                  ${(product.price * quantity).toLocaleString("es-AR")}
                </span>
                <button
                  onClick={() => removeItem(product.id)}
                  className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                  title="Eliminar producto"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

            </div>
          ))}

          {/* Continue shopping link */}
          <div className="pt-2">
            <Link href="/products" className="inline-flex items-center text-xs font-bold text-blue-600 hover:underline space-x-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Continuar explorando el catálogo</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Summary Card */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-6">
          <h2 className="text-lg font-extrabold text-slate-900">Resumen de Compra</h2>

          {/* Promo Code Input */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <label className="text-xs font-bold text-slate-700">¿Tienes un cupón de descuento?</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Ej: NOVA10"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-bold focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shrink-0"
              >
                Aplicar
              </button>
            </div>
            {promoError && <p className="text-[11px] text-rose-500 font-semibold">{promoError}</p>}
            {appliedDiscount > 0 && (
              <p className="text-[11px] text-emerald-600 font-bold">¡Descuento del {appliedDiscount * 100}% aplicado!</p>
            )}
          </form>

          {/* Price Breakdown */}
          <div className="space-y-3 text-xs text-slate-600 pt-4 border-t border-slate-100">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">${cartTotal.toLocaleString("es-AR")}</span>
            </div>
            {appliedDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Descuento ({appliedDiscount * 100}%)</span>
                <span>-${discountAmount.toLocaleString("es-AR")}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Envío</span>
              <span className="font-bold text-emerald-600">
                {shippingCost === 0 ? "GRATIS" : `$${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Impuestos est. (8%)</span>
              <span className="font-bold text-slate-900">${estimatedTax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-200 text-slate-900">
              <span className="text-sm font-extrabold">Total Final</span>
              <span className="text-2xl font-black text-blue-600">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <Link
            href="/checkout"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md shadow-blue-500/20 active:scale-98"
          >
            <span>Iniciar Checkout</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

      </div>

    </div>
  );
}
