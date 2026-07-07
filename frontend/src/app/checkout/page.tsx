"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Si no hay productos, redirigir al catálogo
    if (cartItems.length === 0 && !isSuccess) {
      router.push("/");
    }
    // Precargar nombre si el usuario está autenticado
    if (isAuthenticated && user) {
      setName(user.name);
    }
  }, [cartItems, isAuthenticated, user, isSuccess, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !city || !zip || !phone) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart(); // Vaciar carrito
    }, 1200);
  };

  if (isSuccess) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
        <div className="bg-primary/10 text-primary p-4 rounded-full mb-6">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-foreground mb-3">¡Pedido Confirmado!</h2>
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          Hemos recibido los detalles de tu compra y tu pedido ha sido simulado con éxito. En un entorno de producción real, recibirías la factura e información de seguimiento por correo.
        </p>
        <Link href="/" className="w-full bg-primary text-primary-foreground text-sm font-semibold py-3 rounded-lg hover:bg-primary-hover shadow-sm transition-all text-center">
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="border-b border-border pb-6 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Checkout Simulado</h1>
        <p className="text-sm text-muted-foreground mt-1">Completa los datos de entrega para finalizar tu compra</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-lg font-bold text-foreground pb-2 border-b border-border/60">Datos de Envío</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Nombre Completo
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre y Apellido"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Dirección y Altura
                </label>
                <input
                  id="address"
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Av. Rivadavia 1234, Piso 2 Dpto A"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Ciudad / Provincia
                </label>
                <input
                  id="city"
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ciudad Autónoma de Buenos Aires"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label htmlFor="zipCode" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Código Postal
                </label>
                <input
                  id="zipCode"
                  type="text"
                  required
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="C1000"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="phone" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Número de Teléfono
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="11 5555 5555"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="bg-secondary/40 border border-border p-4 rounded-xl space-y-2 mt-6">
              <h3 className="text-sm font-bold text-foreground">Método de Pago</h3>
              <p className="text-xs text-muted-foreground">
                Esta es una plataforma de simulación. Al confirmar, tu orden será procesada inmediatamente como simulacro de entrega.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground text-sm font-semibold py-3 rounded-lg flex items-center justify-center hover:bg-primary-hover shadow-sm transition-all disabled:opacity-75"
            >
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                "Finalizar Compra"
              )}
            </button>
          </form>
        </div>

        {/* Order Details (Sidebar) */}
        <div className="lg:col-span-5">
          <div className="bg-secondary/30 border border-border p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-foreground">Tu Pedido</h2>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 border-b border-border pb-4">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center text-sm gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-muted overflow-hidden shrink-0 border border-border">
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground line-clamp-1">{item.product.name}</span>
                      <span className="text-xs text-muted-foreground">Cant: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-semibold text-foreground shrink-0">
                    ${(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm pt-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Costo de Envío</span>
                <span className="text-primary font-medium">Gratis</span>
              </div>
              <div className="flex justify-between items-center text-base font-extrabold text-foreground pt-4 border-t border-border/40">
                <span>Total a Pagar</span>
                <span>${cartTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
