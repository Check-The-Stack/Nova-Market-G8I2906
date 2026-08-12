"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "../../../context/CartContext";
import { useFavorites } from "../../../context/FavoritesContext";
import { Product } from "../../../types";
import api from "../../../services/api";

const DEMO_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "MacBook Pro 16 M3 Max",
    slug: "macbook-pro-16-m3-max",
    description: "Chip M3 Max de Apple con CPU de 16 núcleos, GPU de 40 núcleos, 36GB RAM, 1TB SSD. Pantalla Liquid Retina XDR de 16.2 pulgadas con ProMotion 120Hz.",
    price: 3499.0,
    category: "Laptops",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
    stock: 8,
    featured: true,
  },
  {
    id: "p2",
    name: "iPhone 15 Pro Max 256GB Titanium",
    slug: "iphone-15-pro-max-256gb",
    description: "Diseño de titanio de calidad aeroespacial, Chip A17 Pro, Cámara de 48 MP con zoom óptico de 5x y Botón de Acción personalizable.",
    price: 1299.0,
    category: "Celulares",
    imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800&auto=format&fit=crop",
    stock: 15,
    featured: true,
  },
  {
    id: "p3",
    name: "Monitor Sony Inzone M9 4K 144Hz IPS",
    slug: "sony-inzone-m9-4k",
    description: "Monitor Gaming 27'' 4K HDR10 con Full Array Local Dimming, DisplayPort 1.4 y HDMI 2.1 con G-Sync Compatible y Auto HDR para PS5.",
    price: 899.0,
    category: "Monitores",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
    stock: 5,
    featured: true,
  },
  {
    id: "p4",
    name: "Sony WH-1000XM5 Wireless Headphones",
    slug: "sony-wh-1000xm5",
    description: "Auriculares inalámbricos con cancelación de ruido líder en la industria con 8 micrófonos y procesador Auto NC Optimizer.",
    price: 399.0,
    category: "Audio",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    stock: 12,
    featured: true,
  },
  {
    id: "p5",
    name: "Logitech MX Master 3S Performance Mouse",
    slug: "logitech-mx-master-3s",
    description: "Mouse inalámbrico ergonómico con desplazamiento Quiet Clicks, sensor de 8K DPI para cualquier superficie y botón de gestos.",
    price: 99.0,
    category: "Perifericos",
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop",
    stock: 20,
    featured: false,
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "shipping">("desc");

  const productId = (params?.id as string) ?? "";

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) return;
      try {
        setLoading(true);
        const res = await api.get(`/products/${productId}`);
        if (res.data) {
          setProduct(res.data);
        } else {
          const fallback = DEMO_PRODUCTS.find((p) => p.id === productId || p.slug === productId);
          setProduct(fallback || DEMO_PRODUCTS[0]);
        }
      } catch (err) {
        const fallback = DEMO_PRODUCTS.find((p) => p.id === productId || p.slug === productId);
        setProduct(fallback || DEMO_PRODUCTS[0]);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 font-semibold text-sm">
        Cargando detalles del producto...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Producto no encontrado</h2>
        <p className="text-xs text-slate-500">El producto solicitado no está disponible en este momento.</p>
        <Link href="/products" className="inline-block bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs">
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push("/checkout");
  };

  const relatedProducts = DEMO_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-blue-600">Inicio</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-blue-600">Catálogo</Link>
        <span>/</span>
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs overflow-hidden flex items-center justify-center min-h-[380px]">
            <img
              src={product.imageUrl || "/placeholder.png"}
              alt={product.name}
              className="max-h-96 object-contain hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[product.imageUrl, product.imageUrl, product.imageUrl].map((img, idx) => (
              <button
                key={idx}
                className="bg-white p-2 rounded-xl border border-slate-200 hover:border-blue-500 transition-all aspect-square flex items-center justify-center overflow-hidden"
              >
                <img src={img} alt="Thumbnail" className="max-h-20 object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info & Actions */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="bg-blue-50 text-blue-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase border border-blue-100">
                {product.category}
              </span>
              {product.stock > 0 ? (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Stock Disponible ({product.stock})
                </span>
              ) : (
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                  Sin Stock
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 leading-tight">{product.name}</h1>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-blue-600">${product.price.toLocaleString("es-AR")}</span>
              <span className="text-xs font-semibold text-slate-400">IVA incluido</span>
            </div>
            <p className="text-xs text-emerald-600 font-bold">
              💳 Hasta 12 cuotas de ${(product.price / 12).toFixed(2)} sin interés
            </p>
          </div>

          {/* Short description */}
          <p className="text-xs text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block">Cantidad:</label>
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 w-36 overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-200 transition-colors font-bold text-sm"
                >
                  -
                </button>
                <span className="flex-1 text-center font-bold text-sm text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-200 transition-colors font-bold text-sm"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`w-full py-3.5 px-6 rounded-xl font-extrabold text-sm shadow-md transition-all flex items-center justify-center space-x-2 ${
                product.stock > 0
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-98"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Añadir al Carrito</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 px-6 rounded-xl text-sm transition-all shadow-xs cursor-pointer"
            >
              Comprar Ahora
            </button>

            <button
              type="button"
              onClick={() => toggleFavorite(product)}
              className={`w-full py-3 px-6 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 border border-slate-200 hover:border-rose-300 ${
                isFavorite(product.id)
                  ? "bg-rose-50 text-rose-600 border-rose-200"
                  : "bg-white text-slate-700 hover:bg-rose-50/50"
              }`}
            >
              <svg
                className={`w-4 h-4 ${isFavorite(product.id) ? "fill-rose-500 text-rose-500" : "fill-none text-slate-400"}`}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.683a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{isFavorite(product.id) ? "Quitar de Favoritos" : "Guardar en Favoritos"}</span>
            </button>
          </div>

          {/* Trust points */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs text-slate-600 font-medium">
            <div className="flex items-center space-x-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Garantía oficial 1 año</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Envío seguro asegurado</span>
            </div>
          </div>
        </div>

      </div>

      {/* Tabs section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
        <div className="flex border-b border-slate-200 space-x-6 text-sm font-bold text-slate-500">
          <button
            onClick={() => setActiveTab("desc")}
            className={`pb-3 transition-all ${activeTab === "desc" ? "text-blue-600 border-b-2 border-blue-600" : "hover:text-slate-800"}`}
          >
            Descripción
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`pb-3 transition-all ${activeTab === "specs" ? "text-blue-600 border-b-2 border-blue-600" : "hover:text-slate-800"}`}
          >
            Especificaciones
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`pb-3 transition-all ${activeTab === "shipping" ? "text-blue-600 border-b-2 border-blue-600" : "hover:text-slate-800"}`}
          >
            Envío y Devolución
          </button>
        </div>

        <div className="text-xs text-slate-600 leading-relaxed space-y-3">
          {activeTab === "desc" && (
            <p>{product.description} Todos nuestros productos cuentan con empaque sellado original de fábrica y soporte oficial.</p>
          )}

          {activeTab === "specs" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                <span className="font-semibold text-slate-500">Categoría</span>
                <span className="font-bold text-slate-900">{product.category}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                <span className="font-semibold text-slate-500">Condición</span>
                <span className="font-bold text-slate-900">Nuevo en caja</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                <span className="font-semibold text-slate-500">Garantía</span>
                <span className="font-bold text-slate-900">12 Meses Oficial</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                <span className="font-semibold text-slate-500">Origen</span>
                <span className="font-bold text-slate-900">Importación Oficial</span>
              </div>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-2">
              <p className="font-bold text-slate-900">Despacho en 24 horas hábiles</p>
              <p>Realizamos envíos a todo el país mediante correo expreso. Una vez confirmado tu pago, recibirás el código de seguimiento por correo electrónico.</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900">Productos Relacionados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {relatedProducts.map((rel) => (
            <Link
              key={rel.id}
              href={`/products/${rel.id}`}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-center space-x-4 group"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden shrink-0">
                <img src={rel.imageUrl} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{rel.name}</h4>
                <p className="text-xs font-extrabold text-blue-600 mt-1">${rel.price.toLocaleString("es-AR")}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
