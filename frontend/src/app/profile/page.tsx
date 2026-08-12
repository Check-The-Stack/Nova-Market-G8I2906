"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const DEMO_ORDERS = [
  {
    id: "ORD-839102",
    trackingCode: "TRK-84920194",
    total: 3499.0,
    status: "processing",
    createdAt: "2026-08-11T10:15:00Z",
    estimatedDelivery: "Mañana antes de las 18:00 hs",
    carrier: "Expreso Nova Direct",
    shippingAddress: {
      street: "Av. Corrientes 1234, Piso 4 A",
      city: "Buenos Aires",
      state: "CABA",
      zipCode: "C1043",
      country: "Argentina",
      phone: "+54 11 9876-5432",
    },
    items: [
      {
        id: "i3",
        quantity: 1,
        price: 3499.0,
        product: {
          id: "p1",
          name: "MacBook Pro 16 M3 Max",
          imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
        },
      },
    ],
  },
  {
    id: "ORD-948210",
    trackingCode: "TRK-71029381",
    total: 1698.0,
    status: "delivered",
    createdAt: "2026-08-05T14:32:00Z",
    estimatedDelivery: "Entregado el 7 de Agosto",
    carrier: "Andreani Envíos",
    shippingAddress: {
      street: "Av. Corrientes 1234",
      city: "Buenos Aires",
      state: "CABA",
      zipCode: "C1043",
      country: "Argentina",
      phone: "+54 11 9876-5432",
    },
    items: [
      {
        id: "i1",
        quantity: 1,
        price: 1299.0,
        product: {
          id: "p2",
          name: "iPhone 15 Pro Max 256GB Titanium",
          imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=400&auto=format&fit=crop",
        },
      },
      {
        id: "i2",
        quantity: 1,
        price: 399.0,
        product: {
          id: "p4",
          name: "Sony WH-1000XM5 Wireless Headphones",
          imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop",
        },
      },
    ],
  },
];

function ProfileContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams?.get("tab") === "orders" ? "orders" : "profile";

  const { user, updateUser, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "orders">(initialTab);
  
  // Profile Edit Form State
  const [name, setName] = useState(user?.name || "Alex Rivera");
  const [email, setEmail] = useState(user?.email || "alex.rivera@gmail.com");
  const [phone, setPhone] = useState("+54 11 9876-5432");
  const [address, setAddress] = useState("Av. Corrientes 1234, Piso 4 A");
  const [city, setCity] = useState("Buenos Aires");
  const [country, setCountry] = useState("Argentina");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Orders State & Tracking Modal
  const [orders, setOrders] = useState<any[]>([]);
  const [orderFilter, setOrderFilter] = useState<"all" | "processing" | "delivered">("all");
  const [trackingOrder, setTrackingOrder] = useState<any | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // Load orders (combine API / local stored checkout orders / fallback)
  useEffect(() => {
    const localOrders = JSON.parse(localStorage.getItem("novamarket_user_orders") || "[]");
    const combined = [...localOrders, ...DEMO_ORDERS];
    
    // Deduplicate by ID
    const uniqueMap = new Map();
    combined.forEach((item) => {
      if (!uniqueMap.has(item.id)) uniqueMap.set(item.id, item);
    });
    setOrders(Array.from(uniqueMap.values()));
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      updateUser({
        ...user,
        name,
        email,
      });
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === "all") return true;
    return o.status?.toLowerCase() === orderFilter.toLowerCase();
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-8">
      
      {/* Header Profile Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg border border-blue-400/30">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-black">{name}</h1>
            <p className="text-xs text-blue-200">{email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-blue-500/20 text-blue-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-blue-400/30 uppercase">
                Cliente VIP Nova
              </span>
              {user?.role === "admin" && (
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-400/30 uppercase">
                  Administrador
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 space-x-8 text-sm font-extrabold text-slate-500">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 transition-all flex items-center space-x-2 ${
            activeTab === "profile" ? "text-blue-600 border-b-2 border-blue-600" : "hover:text-slate-800"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Mis Datos Personales</span>
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 transition-all flex items-center space-x-2 ${
            activeTab === "orders" ? "text-blue-600 border-b-2 border-blue-600" : "hover:text-slate-800"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span>Mis Pedidos y Tracking ({orders.length})</span>
        </button>
      </div>

      {/* TAB 1: MIS DATOS PERSONALES */}
      {activeTab === "profile" && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs max-w-2xl space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">Editar Perfil</h3>
            <p className="text-xs text-slate-400">Actualiza tus datos para agilizar tus próximas compras.</p>
          </div>

          {saveSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-3 rounded-xl font-bold flex items-center space-x-2">
              <span>✓ ¡Tus datos se han guardado con éxito!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nombre Completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Teléfono Principal</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">País</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Dirección Predeterminada</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-6 rounded-xl shadow-md text-xs transition-all active:scale-98"
            >
              Guardar Cambios
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: MIS PEDIDOS Y TRACKING */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          
          {/* Order Filter Pills */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setOrderFilter("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                orderFilter === "all" ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Todos los pedidos ({orders.length})
            </button>
            <button
              onClick={() => setOrderFilter("processing")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                orderFilter === "processing" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              🚚 En Camino / Preparación
            </button>
            <button
              onClick={() => setOrderFilter("delivered")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                orderFilter === "delivered" ? "bg-emerald-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              ✓ Entregados
            </button>
          </div>

          {/* Orders Cards Grid */}
          <div className="space-y-4">
            {filteredOrders.map((ord) => {
              const isDelivered = ord.status?.toLowerCase() === "delivered" || ord.status?.toLowerCase() === "entregado";
              return (
                <div
                  key={ord.id}
                  className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2 text-xs">
                    <div>
                      <span className="font-black text-slate-900 text-sm">Orden #{ord.id}</span>
                      <p className="text-slate-400 text-[11px]">
                        Fecha: {new Date(ord.createdAt || Date.now()).toLocaleDateString("es-AR")}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      {isDelivered ? (
                        <span className="bg-emerald-50 text-emerald-700 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Entregado
                        </span>
                      ) : (
                        <span className="bg-blue-50 text-blue-700 text-xs font-extrabold px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                          En Camino / Preparación
                        </span>
                      )}

                      <button
                        onClick={() => setTrackingOrder(ord)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-3.5 py-1.5 rounded-xl text-xs transition-colors flex items-center space-x-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Hacer Tracking</span>
                      </button>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="space-y-2">
                    {ord.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center space-x-3 text-xs">
                        <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg p-1 shrink-0 flex items-center justify-center">
                          <img
                            src={item.product?.imageUrl || item.imageUrl || "/placeholder.png"}
                            alt="Producto"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <span className="font-bold text-slate-800 flex-1 truncate">
                          {item.product?.name || item.name || "Producto Tecnológico Nova"}
                        </span>
                        <span className="text-slate-400 font-semibold">x{item.quantity || 1}</span>
                        <span className="font-extrabold text-slate-900">${((item.price || ord.total) * (item.quantity || 1)).toLocaleString("es-AR")}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Monto total:</span>
                    <span className="text-base font-black text-blue-600">${ord.total?.toLocaleString("es-AR")}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TRACKING MODAL */}
      {trackingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setTrackingOrder(null)} />
          
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase border border-blue-100">
                  Seguimiento en Vivo
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Orden #{trackingOrder.id}</h3>
              </div>
              <button
                onClick={() => setTrackingOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Carrier & Code */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Código de Tracking:</span>
                <span className="font-mono font-bold text-slate-900">{trackingOrder.trackingCode || "TRK-9028103"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Empresa de Transporte:</span>
                <span className="font-bold text-blue-600">{trackingOrder.carrier || "Expreso Nova Direct"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimación de Entrega:</span>
                <span className="font-bold text-emerald-600">{trackingOrder.estimatedDelivery || "En las próximas 24 hs"}</span>
              </div>
            </div>

            {/* Interactive Timeline */}
            <div className="space-y-4 py-2">
              <h4 className="text-xs font-bold text-slate-900">Pasos del Envío:</h4>
              
              <div className="space-y-4 relative pl-6 border-l-2 border-blue-500">
                <div className="relative">
                  <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-blue-600 border-2 border-white ring-2 ring-blue-500" />
                  <h5 className="text-xs font-bold text-slate-900">Pedido Recibido y Pagado</h5>
                  <p className="text-[11px] text-slate-400">Orden confirmada correctamente en el sistema</p>
                </div>

                <div className="relative">
                  <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-blue-600 border-2 border-white ring-2 ring-blue-500" />
                  <h5 className="text-xs font-bold text-slate-900">En empaquetado y control de calidad</h5>
                  <p className="text-[11px] text-slate-400">Verificando serie y sellado de fábrica</p>
                </div>

                <div className="relative">
                  <span className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-white ${
                    trackingOrder.status === "delivered" ? "bg-blue-600 ring-2 ring-blue-500" : "bg-blue-500 animate-ping ring-2 ring-blue-400"
                  }`} />
                  <h5 className="text-xs font-bold text-slate-900">Despachado en unidad de reparto</h5>
                  <p className="text-[11px] text-slate-400">Conduciendo hacia tu dirección ({trackingOrder.shippingAddress?.street || "Domicilio cliente"})</p>
                </div>

                <div className="relative">
                  <span className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-white ${
                    trackingOrder.status === "delivered" ? "bg-emerald-500 ring-2 ring-emerald-400" : "bg-slate-300"
                  }`} />
                  <h5 className={`text-xs font-bold ${trackingOrder.status === "delivered" ? "text-emerald-600" : "text-slate-400"}`}>
                    Entrega Confirmada
                  </h5>
                  <p className="text-[11px] text-slate-400">Firma del receptor en domicilio</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setTrackingOrder(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition-colors"
            >
              Cerrar ventana
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-slate-500 text-sm">Cargando perfil...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
