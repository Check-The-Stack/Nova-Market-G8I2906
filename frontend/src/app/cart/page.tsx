"use client";

import React from "react";
import { useCart } from "../../context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cartItems, removeItem, updateQuantity, clearCart, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="bg-secondary/40 p-4 rounded-full text-muted-foreground mb-6">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Tu carrito está vacío</h2>
        <p className="text-muted-foreground max-w-sm mb-8">
          Aún no has agregado ningún producto tecnológico. ¡Explora nuestro catálogo para encontrar las mejores ofertas!
        </p>
        <Link href="/" className="bg-primary text-primary-foreground text-sm font-semibold px-6 py-3 rounded-lg hover:bg-primary-hover transition-all shadow-sm">
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between border-b border-border pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Tu Carrito de Compra</h1>
          <p className="text-sm text-muted-foreground mt-1">Revisa tus productos seleccionados</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-muted-foreground hover:text-destructive border border-border px-3 py-1.5 rounded-lg hover:border-destructive transition-all"
        >
          Vaciar Carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.product.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-background border border-border rounded-xl gap-4 hover:border-primary/20 transition-all duration-300"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden shrink-0">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">{item.product.name}</h3>
                  <span className="text-xs text-muted-foreground">{item.product.category}</span>
                  <div className="text-sm font-bold text-primary sm:hidden mt-1">
                    ${item.product.price.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Controls and Price */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-none pt-3 sm:pt-0">
                {/* Quantity Editor */}
                <div className="flex items-center border border-border rounded-lg bg-secondary/30">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all rounded-l-lg"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-semibold text-foreground w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all rounded-r-lg"
                  >
                    +
                  </button>
                </div>

                {/* Price (Desktop) */}
                <div className="hidden sm:block text-right w-24">
                  <span className="font-bold text-foreground">
                    ${(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 bg-secondary/30 border border-border p-6 rounded-2xl h-fit">
          <h2 className="text-lg font-bold text-foreground mb-4">Resumen del Pedido</h2>
          <div className="space-y-3 pb-4 border-b border-border/80 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>${cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Envío</span>
              <span className="text-primary font-medium">Gratis</span>
            </div>
          </div>
          <div className="flex justify-between items-center py-4 text-base font-extrabold text-foreground mb-6">
            <span>Total</span>
            <span>${cartTotal.toLocaleString()}</span>
          </div>

          <Link href="/checkout" className="w-full bg-primary text-primary-foreground text-sm font-semibold py-3 rounded-lg flex items-center justify-center hover:bg-primary-hover shadow-sm transition-all">
            Proceder al Pago
          </Link>

          <Link href="/" className="mt-4 w-full border border-border hover:bg-background text-muted-foreground text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center transition-all">
            Seguir Comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
