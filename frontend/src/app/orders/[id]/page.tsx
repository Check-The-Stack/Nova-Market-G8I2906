"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from "../../../services/api";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = (params?.id as string) ?? "";
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrderDetail() {
      try {
        setLoading(true);
        const res = await api.get(`/orders/${orderId}`);
        if (res.data) setOrder(res.data);
      } catch (err) {
        console.log("Demo order detail view");
        setOrder({
          id: orderId || "ORD-839102",
          total: 3499.0,
          status: "processing",
          createdAt: new Date().toISOString(),
          shippingAddress: {
            street: "Av. Corrientes 1234",
            city: "Buenos Aires",
            state: "CABA",
            zipCode: "C1043",
            country: "AR",
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
        });
      } finally {
        setLoading(false);
      }
    }
    fetchOrderDetail();
  }, [orderId]);

  if (loading) {
    return <div className="py-20 text-center text-slate-500 font-semibold text-sm">Cargando detalle del pedido...</div>;
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
      
      {/* Breadcrumb */}
      <Link href="/orders" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-blue-600 space-x-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Volver a Mis Pedidos</span>
      </Link>

      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
          <div>
            <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Detalle de Orden
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-2">Orden #{order?.id}</h1>
          </div>

          <span className="bg-emerald-50 text-emerald-700 text-xs font-extrabold px-3 py-1.5 rounded-full border border-emerald-200 self-start sm:self-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            En Preparación / Envío
          </span>
        </div>

        {/* Status Timeline */}
        <div className="py-4">
          <h4 className="text-xs font-bold text-slate-800 mb-4">Estado del Envío:</h4>
          <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-bold">
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto">✓</div>
              <p className="text-blue-600">Recibido</p>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto">✓</div>
              <p className="text-blue-600">Procesando</p>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto border-2 border-blue-600">3</div>
              <p className="text-blue-600">En camino</p>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">4</div>
              <p className="text-slate-400">Entregado</p>
            </div>
          </div>
        </div>

        {/* Address Info */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1 text-xs">
          <h4 className="font-bold text-slate-900">Dirección de Entrega:</h4>
          <p className="text-slate-600">{order?.shippingAddress?.street}, {order?.shippingAddress?.city}</p>
          <p className="text-slate-400">{order?.shippingAddress?.state}, {order?.shippingAddress?.zipCode} - Argentina</p>
        </div>

        {/* Items List */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-bold text-slate-900">Productos comprados:</h4>
          {order?.items?.map((item: any) => (
            <div key={item.id} className="flex items-center space-x-4 p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
              <div className="w-16 h-16 bg-white border border-slate-100 rounded-xl p-1 shrink-0 flex items-center justify-center">
                <img src={item.product?.imageUrl || "/placeholder.png"} alt="Product" className="max-h-full max-w-full object-contain" />
              </div>
              <div className="flex-1 min-w-0 text-xs">
                <h5 className="font-bold text-slate-900 truncate">{item.product?.name}</h5>
                <p className="text-slate-400 mt-0.5">Precio unitario: ${item.price.toLocaleString("es-AR")}</p>
              </div>
              <div className="text-right text-xs">
                <span className="text-slate-400 block">Cant: {item.quantity}</span>
                <span className="font-black text-blue-600 text-sm">${(item.price * item.quantity).toLocaleString("es-AR")}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-slate-900">
          <span className="text-sm font-extrabold">Monto Total Pagado:</span>
          <span className="text-2xl font-black text-blue-600">${order?.total?.toLocaleString("es-AR")}</span>
        </div>

      </div>

    </div>
  );
}
