"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product?: {
    id: string;
    name: string;
    imageUrl: string;
  };
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items?: OrderItem[];
  street?: string;
  city?: string;
}

const DEMO_ORDERS: Order[] = [
  {
    id: "ORD-948210",
    total: 1698.0,
    status: "delivered",
    createdAt: "2026-08-05T14:32:00Z",
    street: "Av. Corrientes 1234",
    city: "Buenos Aires",
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
  {
    id: "ORD-839102",
    total: 3499.0,
    status: "processing",
    createdAt: "2026-08-11T10:15:00Z",
    street: "Av. Corrientes 1234",
    city: "Buenos Aires",
    items: [
      {
        id: "i3",
        quantity: 1,
        price: 3499.0,
        product: {
          id: "p1",
          name: "MacBook Pro 16 M3 Max",
          imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&auto=format&fit=crop",
        },
      },
    ],
  },
];

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>(DEMO_ORDERS);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const res = await api.get("/orders");
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setOrders(res.data);
        } else if (res.data?.orders && Array.isArray(res.data.orders) && res.data.orders.length > 0) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.log("Using demo order history");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
      case "completado":
      case "entregado":
        return (
          <span className="bg-emerald-50 text-emerald-700 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Entregado
          </span>
        );
      case "processing":
      case "procesando":
      case "en camino":
        return (
          <span className="bg-blue-50 text-blue-700 text-xs font-extrabold px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            En Preparación
          </span>
        );
      default:
        return (
          <span className="bg-amber-50 text-amber-700 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Pendiente
          </span>
        );
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (selectedFilter === "all") return true;
    return o.status.toLowerCase() === selectedFilter.toLowerCase();
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mis Pedidos</h1>
          <p className="text-xs text-slate-500 mt-1">
            Consulta el historial y seguimiento de todas tus compras en NovaMarket.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          {["all", "processing", "delivered"].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === filter
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {filter === "all" ? "Todos" : filter === "processing" ? "En Camino" : "Entregados"}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900">No tienes pedidos registrados</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Cuando realices una compra, aparecerán aquí para que puedas hacer seguimiento de tu envío.
          </p>
          <Link href="/products" className="inline-block bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs">
            Ir al Catálogo
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs hover:shadow-md transition-all space-y-5"
            >
              {/* Order Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-slate-900">Orden #{order.id}</span>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Realizada el {new Date(order.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(order.status)}
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-xs font-extrabold text-blue-600 hover:text-blue-700 underline"
                  >
                    Ver Detalle &rarr;
                  </Link>
                </div>
              </div>

              {/* Items Preview */}
              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 text-xs">
                    <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl p-1 shrink-0 flex items-center justify-center">
                      <img
                        src={item.product?.imageUrl || "/placeholder.png"}
                        alt={item.product?.name || "Producto"}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">{item.product?.name || "Producto Tecnológico"}</h4>
                      <p className="text-slate-500 font-medium">Cantidad: {item.quantity}</p>
                    </div>
                    <span className="font-extrabold text-slate-900">${(item.price * item.quantity).toLocaleString("es-AR")}</span>
                  </div>
                ))}
              </div>

              {/* Order Bottom */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Total de la Orden:</span>
                <span className="text-lg font-black text-blue-600">${order.total.toLocaleString("es-AR")}</span>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
