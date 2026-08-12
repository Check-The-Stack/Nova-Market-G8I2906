"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

export const CartDrawer: React.FC = () => {
  const {
    cartItems,
    cartTotal,
    cartItemsCount,
    removeItem,
    updateQuantity,
    isCartOpen,
    closeCart,
  } = useCart();

  const FREE_SHIPPING_THRESHOLD = 150;
  const progressToFreeShipping = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    if (isCartOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h2 className="text-xl font-bold text-slate-900">Tu Carrito ({cartItemsCount})</h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors"
              aria-label="Cerrar carrito"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-blue-50/70 p-3 px-5 border-b border-blue-100">
            {remainingForFreeShipping > 0 ? (
              <p className="text-xs text-blue-800 font-medium mb-1.5 flex items-center justify-between">
                <span>Agrega <strong>${remainingForFreeShipping.toFixed(2)}</strong> más para <strong>Envío Gratis</strong></span>
                <span className="text-[11px] font-bold text-blue-600">{Math.round(progressToFreeShipping)}%</span>
              </p>
            ) : (
              <p className="text-xs text-emerald-800 font-semibold mb-1.5 flex items-center space-x-1">
                <span>🎉 ¡Felicidades! Tienes <strong>Envío Gratis</strong> garantizado</span>
              </p>
            )}
            <div className="w-full bg-blue-200/60 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12 space-y-3">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                </div>
                <p className="text-base font-semibold text-slate-700">Tu carrito está vacío</p>
                <p className="text-xs text-slate-400 max-w-xs">¡Explora nuestro catálogo y descubre la mejor tecnología al mejor precio!</p>
                <button
                  onClick={closeCart}
                  className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-700 underline"
                >
                  Continuar comprando
                </button>
              </div>
            ) : (
              cartItems.map(({ product, quantity }) => (
                <div key={product.id} className="flex space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100 relative group hover:border-slate-200 transition-all">
                  <div className="w-16 h-16 bg-white rounded-lg p-1.5 flex-shrink-0 border border-slate-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={product.imageUrl || "/placeholder.png"}
                      alt={product.name}
                      className="object-contain max-h-full max-w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate pr-6">{product.name}</h4>
                    <p className="text-xs font-extrabold text-blue-600 mt-0.5">
                      ${product.price.toLocaleString("es-AR")}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2 py-0.5 text-xs text-slate-500 hover:bg-slate-100 font-bold transition-colors"
                        >
                          -
                        </button>
                        <span className="px-2.5 text-xs font-bold text-slate-800">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="px-2 py-0.5 text-xs text-slate-500 hover:bg-slate-100 font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-slate-900">
                        ${(product.price * quantity).toLocaleString("es-AR")}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(product.id)}
                    className="absolute top-2.5 right-2.5 text-slate-300 hover:text-rose-500 transition-colors p-1"
                    aria-label="Eliminar ítem"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50/90 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">${cartTotal.toLocaleString("es-AR")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span className="font-semibold text-emerald-600">
                    {remainingForFreeShipping === 0 ? "GRATIS" : "Calculado en checkout"}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span className="text-base text-blue-600">${cartTotal.toLocaleString("es-AR")}</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-4 rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 text-sm transition-all transform active:scale-98"
                >
                  <span>Iniciar Checkout</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-center text-xs block transition-colors"
                >
                  Ver carrito completo
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
