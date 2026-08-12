"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../services/api";

const COUNTRIES = [
  { code: "AR", name: "Argentina" },
  { code: "CL", name: "Chile" },
  { code: "MX", name: "México" },
  { code: "CO", name: "Colombia" },
  { code: "PE", name: "Perú" },
  { code: "UY", name: "Uruguay" },
  { code: "OTHER", name: "Otro País" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("+54 11 9876-5432");
  const [country, setCountry] = useState("AR");
  const [address, setAddress] = useState("Av. Corrientes 1234");
  const [city, setCity] = useState("Buenos Aires");
  const [stateName, setStateName] = useState("CABA");
  const [zipCode, setZipCode] = useState("C1043");

  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "home">("home");
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "debit" | "transfer">("credit");

  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8892");
  const [cardHolder, setCardHolder] = useState("");
  const [expDate, setExpDate] = useState("12/28");
  const [cvv, setCvv] = useState("123");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  const shippingCost = deliveryMethod === "home" ? 15.0 : 0.0;
  const estimatedTax = cartTotal * 0.08;
  const finalTotal = cartTotal + shippingCost + estimatedTax;

  useEffect(() => {
    if (isAuthenticated && user) {
      const parts = user.name.split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
      setCardHolder(user.name.toUpperCase());
    }
  }, [isAuthenticated, user]);

  const handleConfirmPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const orderData = {
      id: generatedId,
      createdAt: new Date().toISOString(),
      status: "processing",
      shippingAddress: {
        street: address || "Av. Corrientes 1234",
        city: city || "Buenos Aires",
        state: stateName || "CABA",
        zipCode: zipCode || "C1043",
        country: country || "AR",
        phone: phone || "+54 11 9876-5432",
      },
      phone: phone || "+54 11 9876-5432",
      items: cartItems.map((item) => ({
        id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        product: item.product,
      })),
      total: finalTotal,
      paymentMethod,
      deliveryMethod,
    };

    // Guardar en pedidos locales
    try {
      const existing = JSON.parse(localStorage.getItem("novamarket_user_orders") || "[]");
      localStorage.setItem("novamarket_user_orders", JSON.stringify([orderData, ...existing]));
    } catch (err) {}

    try {
      const res = await api.post("/orders", orderData);
      setCreatedOrder(res.data?.order || orderData);
    } catch (err) {
      setCreatedOrder(orderData);
    } finally {
      setIsSubmitting(false);
      clearCart();
    }
  };

  // Confirmation Success Screen
  if (createdOrder) {
    const selectedCountryObj = COUNTRIES.find((c) => c.code === country);
    return (
      <div className="py-12 px-4 max-w-xl mx-auto text-center space-y-6 animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl font-black mx-auto shadow-lg shadow-emerald-500/20">
          ✓
        </div>

        <div className="space-y-2">
          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase">
            ¡Compra Confirmada!
          </span>
          <h2 className="text-3xl font-black text-slate-900">¡Gracias por tu pedido!</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Tu compra <strong>#{createdOrder.id}</strong> ha sido registrada. Hemos comenzado con la preparación de tus productos.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 text-left text-xs space-y-3 shadow-2xs">
          <div className="flex justify-between border-b border-slate-100 pb-2.5">
            <span className="text-slate-500">Número de Orden</span>
            <span className="font-extrabold text-slate-900">{createdOrder.id}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2.5">
            <span className="text-slate-500">Teléfono de Contacto</span>
            <span className="font-bold text-slate-900">{phone}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2.5">
            <span className="text-slate-500">Dirección de Entrega</span>
            <span className="font-bold text-slate-900">{address}, {city} ({selectedCountryObj?.name || country})</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-slate-500">Monto Total Pagado</span>
            <span className="font-black text-blue-600 text-base">${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/profile?tab=orders"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md text-xs transition-all text-center"
          >
            Ver Mis Pedidos y Tracking
          </Link>
          <Link
            href="/"
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-4 rounded-xl text-xs text-center transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  // Prompt if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Tu carrito está vacío</h2>
        <p className="text-xs text-slate-500">Agrega productos al carrito para proceder con el checkout.</p>
        <Link href="/products" className="inline-block bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs">
          Ir al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Checkout y Pago</h1>
        <p className="text-xs text-slate-500 mt-1">Completa tus datos de contacto, envío y pago de forma segura.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleConfirmPurchase} className="space-y-6">
            
            {/* STEP 1: Datos de Contacto y Envío */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Datos Personales y de Envío</h2>
                  <p className="text-xs text-slate-400">¿Dónde y a quién entregaremos tu compra?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Apellido</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono de Contacto</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej: +54 11 9876-5432"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">País</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Calle y Altura</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ej: Av. Corrientes 1234, Piso 4 A"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ciudad</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Provincia / Código Postal</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="CABA"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="C1043"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 2: Método de Entrega */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Método de Envío</h2>
                  <p className="text-xs text-slate-400">Selecciona tu preferencia de entrega</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  onClick={() => setDeliveryMethod("home")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
                    deliveryMethod === "home"
                      ? "border-blue-600 bg-blue-50/50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === "home"}
                    onChange={() => setDeliveryMethod("home")}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">Envío Expreso a Domicilio</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Recibe en 24 a 48 horas hábiles</p>
                    <span className="text-xs font-bold text-blue-600 mt-1 block">+$15.00</span>
                  </div>
                </label>

                <label
                  onClick={() => setDeliveryMethod("pickup")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
                    deliveryMethod === "pickup"
                      ? "border-blue-600 bg-blue-50/50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === "pickup"}
                    onChange={() => setDeliveryMethod("pickup")}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">Retiro en Sucursal Central</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Retira gratis hoy mismo</p>
                    <span className="text-xs font-bold text-emerald-600 mt-1 block">¡GRATIS!</span>
                  </div>
                </label>
              </div>
            </div>

            {/* STEP 3: Pago */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Método de Pago</h2>
                  <p className="text-xs text-slate-400">Procesamiento seguro encriptado SSL</p>
                </div>
              </div>

              <div className="flex gap-3 border-b border-slate-200 pb-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("credit")}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    paymentMethod === "credit"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  💳 Tarjeta de Crédito
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("debit")}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    paymentMethod === "debit"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  🏦 Débito / Transferencia
                </button>
              </div>

              {/* Credit Card Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Número de Tarjeta</label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Titular de la Tarjeta</label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 uppercase focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Vencimiento</label>
                    <input
                      type="text"
                      required
                      value={expDate}
                      onChange={(e) => setExpDate(e.target.value)}
                      placeholder="MM/AA"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">CVV</label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 px-6 rounded-2xl shadow-lg shadow-blue-600/30 text-sm transition-all transform active:scale-98 flex items-center justify-center space-x-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Procesando pedido...</span>
                ) : (
                  <>
                    <span>Confirmar y Pagar ${finalTotal.toFixed(2)}</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Order Items Summary */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-6 sticky top-24">
          <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3">Resumen de la Orden</h2>

          {/* Items */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cartItems.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center space-x-3 text-xs">
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg p-1 shrink-0 flex items-center justify-center overflow-hidden">
                  <img src={product.imageUrl} alt={product.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 truncate">{product.name}</h4>
                  <p className="text-[11px] text-slate-400">Cant: {quantity}</p>
                </div>
                <span className="font-extrabold text-slate-900">${(product.price * quantity).toLocaleString("es-AR")}</span>
              </div>
            ))}
          </div>

          {/* Breakdown */}
          <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">${cartTotal.toLocaleString("es-AR")}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span className="font-bold text-emerald-600">
                {shippingCost === 0 ? "GRATIS" : `$${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Impuestos (8%)</span>
              <span className="font-bold text-slate-900">${estimatedTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-900 font-extrabold pt-3 border-t border-slate-200 text-sm">
              <span>Total a pagar</span>
              <span className="text-xl font-black text-blue-600">${finalTotal.toFixed(2)}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
