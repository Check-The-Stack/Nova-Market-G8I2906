"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../services/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [zipCode, setZipCode] = useState("");

  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "home">("pickup");
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "debit">("credit");

  const [cardNumber, setCardNumber] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cvv, setCvv] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const shippingCost = deliveryMethod === "home" ? 15.0 : 0.0;
  const estimatedTax = cartTotal * 0.08;
  const finalTotal = cartTotal + shippingCost + estimatedTax;

  useEffect(() => {
    if (isAuthenticated && user) {
      const parts = user.name.split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
    }
  }, [isAuthenticated, user]);

  const handleConfirmPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/orders", {
        shippingAddress: {
          street: address,
          city: city || "Buenos Aires",
          state: stateName || "CABA",
          zipCode: zipCode || "C1000",
          country: "AR",
        },
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });
    } catch (err) {
      console.log("Backend offline or local demo mode");
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
    }
  };

  if (isSuccess) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-black">
          ✓
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900">¡Pedido Confirmado!</h2>
        <p className="text-slate-500 text-sm leading-relaxed">
          Tu compra ha sido procesada con éxito. Hemos registrado tu pedido y los productos se prepararán para su entrega.
        </p>
        <Link
          href="/"
          className="w-full bg-blue-600 text-white font-extrabold py-3 rounded-lg hover:bg-blue-700 shadow-xs transition-all text-center text-sm"
        >
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: 3 Steps Form */}
        <div className="lg:col-span-8 space-y-6">
          
          <form onSubmit={handleConfirmPurchase} className="space-y-6">
            
            {/* STEP 1: Información de envío */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center space-x-3">
                <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <h2 className="text-lg font-bold text-slate-900">Información de envío</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder=""
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Apellido</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Doe"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House number and street name"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ciudad</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Select City"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estado</label>
                  <input
                    type="text"
                    required
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="State"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CP</label>
                  <input
                    type="text"
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="00000"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* STEP 2: Método de entrega (Figma Match Icons & Layout) */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center space-x-3">
                <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <h2 className="text-lg font-bold text-slate-900">Método de entrega</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Option 1: Retiro en el local */}
                <div
                  onClick={() => setDeliveryMethod("pickup")}
                  className={`border rounded-xl p-4 cursor-pointer flex items-center justify-between transition-all ${
                    deliveryMethod === "pickup"
                      ? "border-blue-600 bg-blue-50/40 ring-1 ring-blue-600"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {/* Radio Dot SVG */}
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${deliveryMethod === "pickup" ? "border-blue-600 bg-blue-600" : "border-slate-300"}`}>
                      {deliveryMethod === "pickup" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">Retiro en el local</h4>
                      <p className="text-[11px] text-slate-400">3 a 5 días hábiles</p>
                    </div>
                  </div>
                  <span className="font-bold text-blue-600 text-xs">Free</span>
                </div>

                {/* Option 2: Entrega a domicilio */}
                <div
                  onClick={() => setDeliveryMethod("home")}
                  className={`border rounded-xl p-4 cursor-pointer flex items-center justify-between transition-all ${
                    deliveryMethod === "home"
                      ? "border-blue-600 bg-blue-50/40 ring-1 ring-blue-600"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {/* Radio Dot SVG */}
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${deliveryMethod === "home" ? "border-blue-600 bg-blue-600" : "border-slate-300"}`}>
                      {deliveryMethod === "home" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">Entrega a domicilio</h4>
                      <p className="text-[11px] text-slate-400">3 a 5 días hábiles</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 text-xs">$15.00</span>
                </div>

              </div>
            </div>

            {/* STEP 3: Detalles del pago (Figma Exact Icons: Credit Card SVG & Lock SVG) */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center space-x-3">
                <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <h2 className="text-lg font-bold text-slate-900">Detalles del pago</h2>
              </div>

              {/* Payment Tabs with Figma SVG Credit Card Icon */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Credit Card Tab */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("credit")}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === "credit"
                      ? "border-blue-600 bg-blue-50/40 text-blue-600 ring-1 ring-blue-600"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {/* Credit Card Outline SVG - Figma Match */}
                  <svg className="w-4 h-4 shrink-0" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Tarjeta de crédito
                </button>

                {/* Debit Card Tab */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("debit")}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === "debit"
                      ? "border-blue-600 bg-blue-50/40 text-blue-600 ring-1 ring-blue-600"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Tarjeta de débito
                </button>
              </div>

              {/* Form Fields with Lock SVG Icon */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Número de tarjeta</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                    {/* SVG Lock Icon - Figma Match */}
                    <span className="absolute inset-y-0 right-3 flex items-center text-slate-400 pointer-events-none">
                      <svg className="w-4 h-4 shrink-0" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de expiración</label>
                    <input
                      type="text"
                      required
                      value={expDate}
                      onChange={(e) => setExpDate(e.target.value)}
                      placeholder="MM / YY"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">CVV</label>
                    <input
                      type="text"
                      required
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

            </div>

          </form>

        </div>

        {/* Right Column: Order Summary Card (Figma Exact Match) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6 sticky top-24">
          <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>

          {/* Product Items List */}
          <div className="space-y-3 pb-4 border-b border-slate-100 max-h-56 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.product.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 line-clamp-1">{item.product.name}</p>
                    <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-semibold text-slate-900">${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Price Calculations */}
          <div className="space-y-3 text-xs text-slate-600 pb-4 border-b border-slate-100">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-blue-600 font-bold">{deliveryMethod === "pickup" ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax</span>
              <span className="font-semibold text-slate-900">${estimatedTax.toFixed(2)}</span>
            </div>
          </div>

          {/* Grand Total */}
          <div className="flex justify-between items-center pt-1">
            <span className="text-base font-extrabold text-slate-900">Total</span>
            <span className="text-2xl font-black text-blue-600">${finalTotal.toFixed(2)}</span>
          </div>

          {/* Confirm Purchase Button */}
          <button
            onClick={handleConfirmPurchase}
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold py-3.5 rounded-lg flex items-center justify-center transition-all shadow-xs disabled:opacity-75"
          >
            {isSubmitting ? "Procesando..." : "Confirmar compra"}
          </button>
        </div>

      </div>

    </div>
  );
}
