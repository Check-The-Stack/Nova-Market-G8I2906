"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Product } from "../../types";
import Link from "next/link";
import api from "../../services/api";

const DEMO_CATALOG: Product[] = [
  {
    id: "p1",
    name: "MacBook Pro 16 M3 Max",
    slug: "macbook-pro-16-m3-max",
    description: "Chip M3 Max de Apple con CPU de 16 núcleos, GPU de 40 núcleos, 36GB RAM, 1TB SSD",
    price: 3499.0,
    originalPrice: 3899.0,
    onSale: false,
    badge: "PREMIUM",
    category: "Laptops",
    brand: "Apple",
    model: "MacBook Pro 16",
    color: "Gris Espacial",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
    stock: 8,
    featured: true,
  },
  {
    id: "p2",
    name: "iPhone 15 Pro Max 256GB Titanium",
    slug: "iphone-15-pro-max",
    description: "Pantalla Super Retina XDR de 6.7 pulgadas, Chip A17 Pro, Cámara de 48 MP",
    price: 1299.0,
    originalPrice: 1449.0,
    onSale: true,
    badge: "SALE",
    category: "Celulares",
    brand: "Apple",
    model: "iPhone 15 Pro Max",
    color: "Titanio Natural",
    imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800&auto=format&fit=crop",
    stock: 15,
    featured: true,
  },
  {
    id: "p3",
    name: 'Monitor LG UltraGear 34" Curved OLED 240Hz',
    slug: "monitor-lg-ultragear-34",
    description: "Pantalla OLED curva QHD, tiempo de respuesta de 0.03ms, G-Sync compatible",
    price: 999.0,
    originalPrice: 1199.0,
    onSale: true,
    badge: "SALE",
    category: "Monitores",
    brand: "LG",
    model: "UltraGear 34",
    color: "Negro",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
    stock: 3,
    featured: true,
  },
  {
    id: "p4",
    name: "Sony WH-1000XM5 Wireless Headphones",
    slug: "sony-wh-1000xm5",
    description: "Auriculares inalámbricos con cancelación de ruido líder en el mercado",
    price: 399.0,
    originalPrice: 449.0,
    onSale: true,
    badge: "SALE",
    category: "Audio",
    brand: "Sony",
    model: "WH-1000XM5",
    color: "Negro",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    stock: 12,
    featured: true,
  },
  {
    id: "p5",
    name: "Logitech MX Master 3S Performance Mouse",
    slug: "logitech-mx-master-3s",
    description: "Mouse inalámbrico ergonómico con desplazamiento Quiet Clicks y sensor de 8K DPI",
    price: 99.0,
    originalPrice: 129.0,
    onSale: true,
    badge: "SALE",
    category: "Perifericos",
    brand: "Logitech",
    model: "MX Master 3S",
    color: "Grafito",
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop",
    stock: 20,
    featured: false,
  },
];

type AdminView = "dashboard" | "products" | "categories" | "orders" | "customers" | "coupons" | "settings";

export default function AdminDashboardPage() {
  const { user, isAuthenticated, login } = useAuth();
  const [currentView, setCurrentView] = useState<AdminView>("dashboard");

  // State Data
  const [products, setProducts] = useState<Product[]>(DEMO_CATALOG);
  const [productFilterTab, setProductFilterTab] = useState<"all" | "sale" | "low_stock">("all");

  // Cargar productos directamente de la API
  useEffect(() => {
    async function loadAdminProducts() {
      try {
        const res = await api.get("/products");
        const list = res.data?.data || (Array.isArray(res.data) ? res.data : []);
        if (list && Array.isArray(list) && list.length > 0) {
          setProducts(list);
          try {
            localStorage.setItem("novamarket_admin_products", JSON.stringify(list));
          } catch (e) {}
          return;
        }
      } catch (err) {
        console.log("API offline, checking local storage for admin products");
      }

      try {
        const stored = localStorage.getItem("novamarket_admin_products");
        if (stored) {
          setProducts(JSON.parse(stored));
        }
      } catch (e) {}
    }
    loadAdminProducts();
  }, []);

  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    try {
      localStorage.setItem("novamarket_admin_products", JSON.stringify(updatedProducts));
    } catch (e) {}
  };

  // CATEGORIES STATE
  const [categories, setCategories] = useState([
    { id: "cat1", name: "Laptops", icon: "💻", description: "Notebooks y estaciones de trabajo portátiles", status: "Activa" },
    { id: "cat2", name: "Celulares", icon: "📱", description: "Smartphones y accesorios móviles", status: "Activa" },
    { id: "cat3", name: "Monitores", icon: "🖥️", description: "Displays OLED y monitores de alta frecuencia", status: "Activa" },
    { id: "cat4", name: "Audio", icon: "🎧", description: "Auriculares Noise Cancelling y parlantes", status: "Activa" },
    { id: "cat5", name: "Perifericos", icon: "⌨️", description: "Teclados mecánicos y mouses de alta precisión", status: "Activa" },
  ]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: "", icon: "💻", description: "", status: "Activa" });

  // ORDERS STATE & DETAIL MODAL
  const [orders, setOrders] = useState([
    {
      id: "ORD-839102",
      customer: "Alex Rivera",
      email: "alex.rivera@gmail.com",
      phone: "+54 11 9876-5432",
      address: "Av. Corrientes 1234, Piso 4 A (Argentina)",
      paymentMethod: "Tarjeta de Crédito",
      deliveryMethod: "Envío Expreso a Domicilio",
      total: 3499.0,
      status: "En camino",
      date: "2026-08-11",
      items: [
        { name: "MacBook Pro 16 M3 Max", quantity: 1, price: 3499.0, imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&auto=format&fit=crop" },
      ],
    },
    {
      id: "ORD-948210",
      customer: "María Gómez",
      email: "maria.gomez@gmail.com",
      phone: "+54 11 4433-2211",
      address: "Calle Mitre 456 (Argentina)",
      paymentMethod: "Débito / Transferencia",
      deliveryMethod: "Retiro en Sucursal Central",
      total: 1698.0,
      status: "Entregado",
      date: "2026-08-05",
      items: [
        { name: "iPhone 15 Pro Max 256GB Titanium", quantity: 1, price: 1299.0, imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=400&auto=format&fit=crop" },
        { name: "Sony WH-1000XM5 Wireless Headphones", quantity: 1, price: 399.0, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop" },
      ],
    },
    {
      id: "ORD-109283",
      customer: "Carlos Pérez",
      email: "carlos.perez@gmail.com",
      phone: "+54 11 5566-7788",
      address: "Av. Santa Fe 980 (Argentina)",
      paymentMethod: "Tarjeta de Crédito",
      deliveryMethod: "Envío Expreso a Domicilio",
      total: 399.0,
      status: "Procesando",
      date: "2026-08-10",
      items: [
        { name: "Sony WH-1000XM5 Wireless Headphones", quantity: 1, price: 399.0, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop" },
      ],
    },
  ]);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<any | null>(null);

  // CUSTOMERS STATE & MODAL
  const [customers, setCustomers] = useState([
    { id: "u1", name: "Alex Rivera", email: "alex.rivera@gmail.com", phone: "+54 11 9876-5432", address: "Av. Corrientes 1234, CABA", role: "customer", status: "Activa", ordersCount: 4, spent: "$5,197.00" },
    { id: "u2", name: "Administrador Nova", email: "admin@novamarket.com", phone: "+54 11 0000-0000", address: "Oficina Central Nova", role: "admin", status: "Activa", ordersCount: 0, spent: "$0.00" },
    { id: "u3", name: "María Gómez", email: "maria.gomez@gmail.com", phone: "+54 11 4433-2211", address: "Calle Mitre 456, CABA", role: "customer", status: "Activa", ordersCount: 2, spent: "$1,698.00" },
    { id: "u4", name: "Carlos Pérez", email: "carlos.perez@gmail.com", phone: "+54 11 5566-7788", address: "Av. Santa Fe 980, CABA", role: "customer", status: "Activa", ordersCount: 1, spent: "$399.00" },
  ]);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);
  const [customerForm, setCustomerForm] = useState({ name: "", email: "", phone: "", address: "", role: "customer", status: "Activa" });

  // COUPONS STATE & ADVANCED MODAL
  const [coupons, setCoupons] = useState([
    {
      id: "c1",
      code: "NOVA10",
      description: "10% de descuento en la primera compra",
      discountType: "percentage",
      discountValue: 10,
      minPurchase: 100,
      validFrom: "2026-08-01",
      validTo: "2026-12-31",
      uses: 45,
      status: "Activo",
    },
    {
      id: "c2",
      code: "BIENVENIDA",
      description: "15% OFF para nuevos usuarios registrados",
      discountType: "percentage",
      discountValue: 15,
      minPurchase: 150,
      validFrom: "2026-08-01",
      validTo: "2026-10-30",
      uses: 128,
      status: "Activo",
    },
    {
      id: "c3",
      code: "CYBER2026",
      description: "$50 de regalo en compras superiores a $500",
      discountType: "fixed",
      discountValue: 50,
      minPurchase: 500,
      validFrom: "2026-11-01",
      validTo: "2026-11-30",
      uses: 12,
      status: "Pausado",
    },
  ]);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null);
  const [couponForm, setCouponForm] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "10",
    minPurchase: "100",
    validFrom: "2026-08-01",
    validTo: "2026-12-31",
    status: "Activo",
  });

  // PRODUCT MODAL STATE
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    originalPrice: "",
    onSale: false,
    badge: "SALE",
    brand: "Apple",
    model: "",
    color: "Negro",
    category: "Laptops",
    imageUrl: "",
    stock: "",
    featured: false,
  });

  const handleQuickAdminLogin = () => {
    login("mock-admin-jwt-token", {
      id: "admin-id-demo",
      name: "Administrador Nova",
      email: "admin@novamarket.com",
      role: "admin",
    });
  };

  // CATEGORY HANDLERS
  const handleOpenCategoryModal = (cat?: any) => {
    if (cat) {
      setEditingCategory(cat);
      setCategoryForm({ name: cat.name, icon: cat.icon, description: cat.description, status: cat.status });
    } else {
      setEditingCategory(null);
      setCategoryForm({ name: "", icon: "💻", description: "", status: "Activa" });
    }
    setIsCategoryModalOpen(true);
  };

  const handleSubmitCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const newCat = {
      id: editingCategory ? editingCategory.id : "cat-" + Date.now(),
      name: categoryForm.name,
      icon: categoryForm.icon,
      description: categoryForm.description,
      status: categoryForm.status,
    };

    if (editingCategory) {
      setCategories((prev) => prev.map((c) => (c.id === editingCategory.id ? newCat : c)));
    } else {
      setCategories((prev) => [...prev, newCat]);
    }
    setIsCategoryModalOpen(false);
  };

  // CUSTOMER HANDLERS
  const handleOpenCustomerModal = (customer?: any) => {
    if (customer) {
      setEditingCustomer(customer);
      setCustomerForm({
        name: customer.name,
        email: customer.email,
        phone: customer.phone || "",
        address: customer.address || "",
        role: customer.role,
        status: customer.status || "Activa",
      });
    } else {
      setEditingCustomer(null);
      setCustomerForm({ name: "", email: "", phone: "", address: "", role: "customer", status: "Activa" });
    }
    setIsCustomerModalOpen(true);
  };

  const handleToggleCustomerStatus = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === "Suspendida" ? "Activa" : "Suspendida" } : c
      )
    );
  };

  const handleDeleteCustomer = (id: string) => {
    if (confirm("¿Está seguro de eliminar este usuario?")) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleSubmitCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCust = {
      id: editingCustomer ? editingCustomer.id : "u-" + Date.now(),
      name: customerForm.name,
      email: customerForm.email,
      phone: customerForm.phone,
      address: customerForm.address,
      role: customerForm.role,
      status: customerForm.status,
      ordersCount: editingCustomer ? editingCustomer.ordersCount : 0,
      spent: editingCustomer ? editingCustomer.spent : "$0.00",
    };

    if (editingCustomer) {
      setCustomers((prev) => prev.map((c) => (c.id === editingCustomer.id ? newCust : c)));
    } else {
      setCustomers((prev) => [...prev, newCust]);
    }
    setIsCustomerModalOpen(false);
  };

  // COUPON HANDLERS
  const handleOpenCouponModal = (coupon?: any) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setCouponForm({
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue.toString(),
        minPurchase: coupon.minPurchase.toString(),
        validFrom: coupon.validFrom,
        validTo: coupon.validTo,
        status: coupon.status,
      });
    } else {
      setEditingCoupon(null);
      setCouponForm({
        code: "",
        description: "",
        discountType: "percentage",
        discountValue: "10",
        minPurchase: "100",
        validFrom: new Date().toISOString().split("T")[0],
        validTo: "2026-12-31",
        status: "Activo",
      });
    }
    setIsCouponModalOpen(true);
  };

  const handleSubmitCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const newCoup = {
      id: editingCoupon ? editingCoupon.id : "c-" + Date.now(),
      code: couponForm.code.toUpperCase().trim(),
      description: couponForm.description,
      discountType: couponForm.discountType,
      discountValue: parseFloat(couponForm.discountValue) || 0,
      minPurchase: parseFloat(couponForm.minPurchase) || 0,
      validFrom: couponForm.validFrom,
      validTo: couponForm.validTo,
      uses: editingCoupon ? editingCoupon.uses : 0,
      status: couponForm.status,
    };

    if (editingCoupon) {
      setCoupons((prev) => prev.map((c) => (c.id === editingCoupon.id ? newCoup : c)));
    } else {
      setCoupons((prev) => [...prev, newCoup]);
    }
    setIsCouponModalOpen(false);
  };

  // PRODUCT HANDLERS
  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price.toString(),
        originalPrice: product.originalPrice ? product.originalPrice.toString() : (product.price * 1.15).toFixed(0),
        onSale: !!product.onSale,
        badge: product.badge || "SALE",
        brand: product.brand || "Apple",
        model: product.model || product.name,
        color: product.color || "Negro",
        category: product.category,
        imageUrl: product.imageUrl,
        stock: product.stock.toString(),
        featured: product.featured,
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: "",
        slug: "",
        description: "",
        price: "",
        originalPrice: "",
        onSale: false,
        badge: "SALE",
        brand: "Apple",
        model: "",
        color: "Negro",
        category: categories[0]?.name || "Laptops",
        imageUrl: "",
        stock: "",
        featured: false,
      });
    }
    setIsProductModalOpen(true);
  };

  const handleToggleProductSale = async (productId: string) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;

    const nextOnSale = !targetProduct.onSale;
    const updatedProd: Product = {
      ...targetProduct,
      onSale: nextOnSale,
      originalPrice: nextOnSale ? (targetProduct.originalPrice || Math.round(targetProduct.price * 1.2)) : undefined,
      badge: nextOnSale ? (targetProduct.badge || "SALE") : undefined,
    };

    const updatedList = products.map((p) => (p.id === productId ? updatedProd : p));
    saveProducts(updatedList);

    try {
      await api.put(`/products/${productId}`, updatedProd);
    } catch (err) {
      console.log("Error syncing sale status to API:", err);
    }
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(productForm.price) || 0;
    const parsedOriginalPrice = productForm.originalPrice ? parseFloat(productForm.originalPrice) : (productForm.onSale ? Math.round(parsedPrice * 1.2) : undefined);

    const newProd: Product = {
      id: editingProduct ? editingProduct.id : "p-" + Date.now(),
      name: productForm.name,
      slug: productForm.slug || "p-" + Date.now(),
      description: productForm.description,
      price: parsedPrice,
      originalPrice: productForm.onSale ? parsedOriginalPrice : undefined,
      onSale: productForm.onSale,
      badge: productForm.onSale ? (productForm.badge || "SALE") : undefined,
      brand: productForm.brand,
      model: productForm.model,
      color: productForm.color,
      category: productForm.category,
      imageUrl: productForm.imageUrl || "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?q=80&w=600&auto=format&fit=crop",
      stock: parseInt(productForm.stock, 10) || 1,
      featured: productForm.featured,
    };

    if (editingProduct) {
      const updatedList = products.map((p) => (p.id === editingProduct.id ? newProd : p));
      saveProducts(updatedList);
      try {
        await api.put(`/products/${editingProduct.id}`, newProd);
      } catch (err) {
        console.log("Error updating product via API:", err);
      }
    } else {
      const updatedList = [newProd, ...products];
      saveProducts(updatedList);
      try {
        await api.post("/products", newProd);
      } catch (err) {
        console.log("Error creating product via API:", err);
      }
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("¿Está seguro de eliminar este producto del catálogo?")) return;
    const updatedList = products.filter((p) => p.id !== productId);
    saveProducts(updatedList);
    try {
      await api.delete(`/products/${productId}`);
    } catch (err) {
      console.log("Error deleting product via API:", err);
    }
  };

  // Access Denied Screen
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-16 px-4 text-center max-w-lg mx-auto space-y-6">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-4xl font-black shadow-md border border-blue-100">
          🔒
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Panel de Control de Administración</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Se requieren privilegios de Administrador para gestionar el e-commerce.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 text-left text-xs space-y-2 w-full">
          <span className="font-extrabold text-slate-900 block border-b border-slate-200 pb-1">
            🔑 Credenciales Generales de Acceso:
          </span>
          <div className="flex justify-between">
            <span className="text-slate-500">Usuario Admin:</span>
            <span className="font-mono font-bold text-slate-900">admin@novamarket.com</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Contraseña:</span>
            <span className="font-mono font-bold text-slate-900">admin123</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={handleQuickAdminLogin}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md text-xs transition-all text-center cursor-pointer"
          >
            🚀 Iniciar como Admin Demo
          </button>
          <Link
            href="/login"
            className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3.5 px-4 rounded-xl text-xs text-center transition-colors"
          >
            Ir a Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-slate-50/50">
      
      {/* LATERAL SIDEBAR MENU */}
      <aside className="w-full md:w-64 bg-slate-900 text-white shrink-0 p-5 space-y-8 flex flex-col justify-between">
        <div className="space-y-6">
          
          {/* Header Badge */}
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md">
              N
            </div>
            <div>
              <h2 className="font-black text-sm tracking-tight">NovaAdmin</h2>
              <span className="text-[10px] text-blue-400 font-extrabold uppercase tracking-wider block">
                Gestión E-Commerce
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-bold">
            <button
              onClick={() => setCurrentView("dashboard")}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                currentView === "dashboard"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-base">📊</span>
              <span>Dashboard / Métricas</span>
            </button>

            <button
              onClick={() => setCurrentView("products")}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                currentView === "products"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-base">📦</span>
              <span>Productos e Inventario</span>
            </button>

            <button
              onClick={() => setCurrentView("categories")}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                currentView === "categories"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-base">📁</span>
              <span>Categorías</span>
            </button>

            <button
              onClick={() => setCurrentView("orders")}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                currentView === "orders"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-base">🧾</span>
              <span>Pedidos y Ventas</span>
            </button>

            <button
              onClick={() => setCurrentView("customers")}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                currentView === "customers"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-base">👥</span>
              <span>Clientes y Usuarios</span>
            </button>

            <button
              onClick={() => setCurrentView("coupons")}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                currentView === "coupons"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-base">🏷️</span>
              <span>Cupones y Descuentos</span>
            </button>

            <button
              onClick={() => setCurrentView("settings")}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                currentView === "settings"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-base">⚙️</span>
              <span>Configuración</span>
            </button>
          </nav>
        </div>

        {/* Footer Admin User Info */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="truncate">
            <p className="font-extrabold truncate text-white">{user.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
          </div>
          <Link href="/" className="p-2 text-slate-400 hover:text-white transition-colors" title="Volver a la tienda">
            ↗️
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
        
        {/* VIEW 1: DASHBOARD / METRICS */}
        {currentView === "dashboard" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Resumen General de la Tienda</h1>
              <p className="text-xs text-slate-500">Métricas principales de rendimiento y ventas de NovaMarket.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Ventas Totales</span>
                <p className="text-2xl font-black text-slate-900">$6,595.00</p>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                  ↑ +18.4% este mes
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Pedidos Totales</span>
                <p className="text-2xl font-black text-blue-600">{orders.length}</p>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block">
                  3 pedidos activos
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Clientes Registrados</span>
                <p className="text-2xl font-black text-slate-900">{customers.length}</p>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                  +3 hoy
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Stock Bajo (&le; 5)</span>
                <p className="text-2xl font-black text-rose-500">
                  {products.filter((p) => p.stock <= 5).length} Ítems
                </p>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full inline-block">
                  Revisar reposición
                </span>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-black text-slate-900 text-sm">Últimas Órdenes de Compra</h3>
                <button onClick={() => setCurrentView("orders")} className="text-xs font-bold text-blue-600 hover:underline">
                  Ver todas &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {orders.slice(0, 3).map((ord) => (
                  <div key={ord.id} className="flex items-center justify-between text-xs p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <span className="font-mono font-black text-slate-900">{ord.id}</span>
                      <p className="text-slate-500">{ord.customer} ({ord.email})</p>
                    </div>
                    <span className="font-black text-slate-900">${ord.total.toFixed(2)}</span>
                    <button
                      onClick={() => setSelectedOrderDetail(ord)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-extrabold border border-blue-100 cursor-pointer"
                    >
                      👁️ Ver Detalle
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: PRODUCTOS E INVENTARIO */}
        {currentView === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Catálogo e Inventario de Productos</h1>
                <p className="text-xs text-slate-500">Administra precios, ofertas, descuentos, stock y nuevos artículos de la tienda.</p>
              </div>
              <button
                onClick={() => handleOpenProductModal()}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>+</span>
                <span>Agregar Nuevo Producto</span>
              </button>
            </div>

            {/* Sub-tabs / Filters */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => setProductFilterTab("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  productFilterTab === "all"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Todos ({products.length})
              </button>
              <button
                onClick={() => setProductFilterTab("sale")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  productFilterTab === "sale"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                }`}
              >
                <span>🔥 En Oferta</span>
                <span className="font-mono text-[10px]">({products.filter((p) => p.onSale).length})</span>
              </button>
              <button
                onClick={() => setProductFilterTab("low_stock")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  productFilterTab === "low_stock"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                }`}
              >
                ⚠️ Stock Bajo ({products.filter((p) => p.stock <= 5).length})
              </button>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-[11px] font-extrabold text-slate-400 uppercase border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3.5">Producto</th>
                      <th className="px-6 py-3.5">Categoría / Marca</th>
                      <th className="px-6 py-3.5 text-center">Estado Oferta</th>
                      <th className="px-6 py-3.5 text-right">Precio Actual</th>
                      <th className="px-6 py-3.5 text-center">Stock</th>
                      <th className="px-6 py-3.5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products
                      .filter((p) => {
                        if (productFilterTab === "sale") return p.onSale;
                        if (productFilterTab === "low_stock") return p.stock <= 5;
                        return true;
                      })
                      .map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                            <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />
                            <div>
                              <p className="line-clamp-1">{p.name}</p>
                              {p.badge && (
                                <span className="text-[9px] font-black uppercase text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 mt-0.5 inline-block">
                                  {p.badge}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-600">
                            <div>{p.category}</div>
                            {p.brand && <div className="text-[10px] text-slate-400 font-bold">{p.brand}</div>}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleToggleProductSale(p.id)}
                              className={`px-3 py-1 rounded-full text-[11px] font-extrabold border transition-all cursor-pointer ${
                                p.onSale
                                  ? "bg-rose-500 hover:bg-rose-600 text-white border-rose-600 shadow-2xs"
                                  : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200"
                              }`}
                              title={p.onSale ? "Click para desactivar oferta" : "Click para poner en oferta"}
                            >
                              {p.onSale ? "🔥 En Oferta (SALE)" : "⚪ Regular"}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {p.onSale && p.originalPrice && (
                              <span className="text-[10px] text-slate-400 line-through block font-medium">
                                ${p.originalPrice.toLocaleString("es-AR")}
                              </span>
                            )}
                            <span className={`font-extrabold ${p.onSale ? "text-rose-600 font-black text-sm" : "text-slate-900"}`}>
                              ${p.price.toLocaleString("es-AR")}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${p.stock <= 5 ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>
                              {p.stock} un.
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleOpenProductModal(p)} className="text-xs font-bold text-slate-700 hover:text-blue-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                                Editar
                              </button>
                              <button onClick={() => handleDeleteProduct(p.id)} className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 cursor-pointer">
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: CATEGORÍAS (CRUD COMPLETO) */}
        {currentView === "categories" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Gestión de Categorías</h1>
                <p className="text-xs text-slate-500">Crea, edita y organiza las familias de productos de la tienda.</p>
              </div>
              <button
                onClick={() => handleOpenCategoryModal()}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                + Crear Nueva Categoría
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl bg-slate-50 p-2.5 rounded-2xl border border-slate-100">{cat.icon}</span>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-sm">{cat.name}</h3>
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${cat.status === "Activa" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                          {cat.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">{cat.description || "Sin descripción asignada."}</p>

                  <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenCategoryModal(cat)}
                      className="text-xs font-bold text-slate-700 hover:text-blue-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                    >
                      ✏️ Editar Categoría
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: PEDIDOS (VER EN DETALLE Y ESTADOS) */}
        {currentView === "orders" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Gestión de Pedidos y Ventas</h1>
              <p className="text-xs text-slate-500">Consulta los detalles completos de las compras y actualiza sus estados de envío.</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-2xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-[11px] font-extrabold text-slate-400 uppercase border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3.5">Nº Orden</th>
                    <th className="px-6 py-3.5">Cliente</th>
                    <th className="px-6 py-3.5">Fecha</th>
                    <th className="px-6 py-3.5 text-right">Total</th>
                    <th className="px-6 py-3.5 text-center">Estado del Envío</th>
                    <th className="px-6 py-3.5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-black text-slate-900">{ord.id}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{ord.customer}</p>
                        <p className="text-[11px] text-slate-400">{ord.email}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{ord.date}</td>
                      <td className="px-6 py-4 text-right font-black text-blue-600">${ord.total.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">
                        <select
                          value={ord.status}
                          onChange={(e) => {
                            const val = e.target.value;
                            setOrders((prev) => prev.map((o) => (o.id === ord.id ? { ...o, status: val } : o)));
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="Procesando">⏳ Procesando</option>
                          <option value="En camino">🚚 En camino</option>
                          <option value="Entregado">✓ Entregado</option>
                          <option value="Cancelado">✕ Cancelado</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrderDetail(ord)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold px-3 py-1.5 rounded-xl border border-blue-100 cursor-pointer transition-colors"
                        >
                          👁️ Ver Detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 5: CLIENTES Y USUARIOS (DETALLE, EDITAR, SUSPENDER, ELIMINAR) */}
        {currentView === "customers" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Clientes y Usuarios Registrados</h1>
                <p className="text-xs text-slate-500">Gestión de usuarios, edición de perfiles, suspensión y roles.</p>
              </div>
              <button
                onClick={() => handleOpenCustomerModal()}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                + Registrar Nuevo Usuario
              </button>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-2xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-[11px] font-extrabold text-slate-400 uppercase border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3.5">Usuario</th>
                    <th className="px-6 py-3.5">Contacto / Teléfono</th>
                    <th className="px-6 py-3.5 text-center">Rol</th>
                    <th className="px-6 py-3.5 text-center">Estado</th>
                    <th className="px-6 py-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-extrabold text-slate-900">{c.name}</p>
                        <p className="text-[11px] text-slate-400">{c.email}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <p>{c.phone || "Sin registro"}</p>
                        <p className="text-[10px] text-slate-400 truncate">{c.address || "Sin dirección"}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${c.role === "admin" ? "bg-purple-50 text-purple-700 border border-purple-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
                          {c.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${c.status === "Suspendida" ? "bg-rose-50 text-rose-600 border border-rose-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
                          {c.status || "Activa"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenCustomerModal(c)}
                            className="text-xs font-bold text-slate-700 hover:text-blue-600 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                            title="Editar usuario"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleToggleCustomerStatus(c.id)}
                            className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border cursor-pointer ${
                              c.status === "Suspendida"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                            }`}
                          >
                            {c.status === "Suspendida" ? "Activar" : "🚫 Suspender"}
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(c.id)}
                            className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-100 cursor-pointer"
                            title="Eliminar usuario"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 6: CUPONES DE DESCUENTO AVANZADOS */}
        {currentView === "coupons" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Cupones y Promociones Avanzadas</h1>
                <p className="text-xs text-slate-500">Configura palabras clave, fechas de vigencia y condiciones de compra mínima.</p>
              </div>
              <button
                onClick={() => handleOpenCouponModal()}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                + Crear Nuevo Cupón
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {coupons.map((coup) => (
                <div key={coup.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <span className="font-mono font-black text-base text-blue-600 bg-blue-50 px-3 py-1 rounded-xl border border-blue-100">
                      {coup.code}
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${coup.status === "Activo" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                      {coup.status}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-800">{coup.description}</p>

                  <div className="bg-slate-50 rounded-2xl p-3 text-xs space-y-1.5 text-slate-600 border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Valor Descuento:</span>
                      <span className="font-black text-slate-900">
                        {coup.discountType === "percentage" ? `${coup.discountValue}% OFF` : `$${coup.discountValue}.00 OFF`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Compra Mínima:</span>
                      <span className="font-bold text-slate-900">${coup.minPurchase}.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Vigencia:</span>
                      <span className="font-medium text-slate-700">{coup.validFrom} al {coup.validTo}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200">
                      <span className="text-slate-400">Usos Aplicados:</span>
                      <span className="font-bold text-blue-600">{coup.uses} canjes</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleOpenCouponModal(coup)}
                      className="text-xs font-bold text-slate-700 hover:text-blue-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                    >
                      ✏️ Editar Configuración
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 7: CONFIGURACIÓN */}
        {currentView === "settings" && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Configuración General de la Tienda</h1>
              <p className="text-xs text-slate-500">Ajustes globales de NovaMarket.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre Comercial de la Tienda</label>
                <input type="text" defaultValue="NovaMarket Tech Store" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900" />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Correo de Notificaciones Administrativas</label>
                <input type="email" defaultValue="soporte@novamarket.com" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Moneda Principal</label>
                  <select defaultValue="USD" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900">
                    <option value="USD">Dólares ($ USD)</option>
                    <option value="ARS">Pesos Argentinos ($ ARS)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Impuesto a las Ventas (%)</label>
                  <input type="number" defaultValue="8" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900" />
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert("Ajustes guardados correctamente.")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-6 rounded-xl shadow-md cursor-pointer"
              >
                Guardar Ajustes
              </button>
            </div>
          </div>
        )}

      </main>

      {/* MODAL 1: DETALLE DE PEDIDO */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setSelectedOrderDetail(null)} />

          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 z-10 animate-in fade-in zoom-in-95 duration-200 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase border border-blue-100">
                  Comprobante de Orden
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">Orden #{selectedOrderDetail.id}</h3>
              </div>
              <button onClick={() => setSelectedOrderDetail(null)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs">
                ✕
              </button>
            </div>

            {/* Customer Details */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Cliente / Nombre:</span>
                <span className="font-bold text-slate-900">{selectedOrderDetail.customer}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Correo Electrónico:</span>
                <span className="font-bold text-slate-900">{selectedOrderDetail.email}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Teléfono:</span>
                <span className="font-bold text-slate-900">{selectedOrderDetail.phone}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Dirección de Entrega:</span>
                <span className="font-bold text-slate-900">{selectedOrderDetail.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Método de Pago:</span>
                <span className="font-bold text-blue-600">{selectedOrderDetail.paymentMethod}</span>
              </div>
            </div>

            {/* Items Purchased */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-900 border-b border-slate-100 pb-2">Ítems Comprados:</h4>
              {selectedOrderDetail.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                    <div>
                      <h5 className="font-bold text-slate-900">{item.name}</h5>
                      <span className="text-[11px] text-slate-400">Cantidad: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-200 text-sm">
              <span className="font-bold text-slate-500">Monto Total de la Orden</span>
              <span className="text-xl font-black text-blue-600">${selectedOrderDetail.total.toFixed(2)}</span>
            </div>

            <button onClick={() => setSelectedOrderDetail(null)} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition-colors">
              Cerrar Detalle
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: CREAR / EDITAR CATEGORÍA */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                {editingCategory ? "Editar Categoría" : "Crear Nueva Categoría"}
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSubmitCategory} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre de la Categoría</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="Ej: Gaming & Consolas"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ícono / Emoji</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                    placeholder="🎮"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 text-center text-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estado</label>
                  <select
                    value={categoryForm.status}
                    onChange={(e) => setCategoryForm({ ...categoryForm, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Activa">Activa</option>
                    <option value="Inactiva">Inactiva</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descripción corta</label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Descripción de la categoría..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 font-bold border border-slate-200 rounded-xl text-slate-600">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer">
                  Guardar Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CREAR / EDITAR CLIENTE */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                {editingCustomer ? "Editar Usuario" : "Registrar Nuevo Usuario"}
              </h3>
              <button onClick={() => setIsCustomerModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSubmitCustomer} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={customerForm.email}
                  onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rol de Usuario</label>
                  <select
                    value={customerForm.role}
                    onChange={(e) => setCustomerForm({ ...customerForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="customer">Cliente</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estado Cuenta</label>
                  <select
                    value={customerForm.status}
                    onChange={(e) => setCustomerForm({ ...customerForm, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Activa">Activa</option>
                    <option value="Suspendida">Suspendida</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dirección</label>
                <input
                  type="text"
                  value={customerForm.address}
                  onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsCustomerModalOpen(false)} className="px-4 py-2 font-bold border border-slate-200 rounded-xl text-slate-600">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer">
                  Guardar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CREAR / EDITAR CUPÓN (CONFIGURACIÓN AVANZADA) */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                {editingCoupon ? "Configurar Cupón" : "Crear Nuevo Cupón Promocional"}
              </h3>
              <button onClick={() => setIsCouponModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSubmitCoupon} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Palabra Clave del Cupón (Código)</label>
                <input
                  type="text"
                  required
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  placeholder="Ej: CYBER2026"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-black text-slate-900 uppercase focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descripción / Promoción</label>
                <input
                  type="text"
                  required
                  value={couponForm.description}
                  onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                  placeholder="Ej: 15% OFF en compras mayores a $150"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Descuento</label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="percentage">Porcentaje (%)</option>
                    <option value="fixed">Monto Fijo ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Valor del Descuento</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={couponForm.discountValue}
                    onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                    placeholder="15"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Condición: Compra Mínima Requerida ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={couponForm.minPurchase}
                  onChange={(e) => setCouponForm({ ...couponForm, minPurchase: e.target.value })}
                  placeholder="100.00"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Válido Desde (Fecha)</label>
                  <input
                    type="date"
                    required
                    value={couponForm.validFrom}
                    onChange={(e) => setCouponForm({ ...couponForm, validFrom: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Válido Hasta (Fecha)</label>
                  <input
                    type="date"
                    required
                    value={couponForm.validTo}
                    onChange={(e) => setCouponForm({ ...couponForm, validTo: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Estado del Cupón</label>
                <select
                  value={couponForm.status}
                  onChange={(e) => setCouponForm({ ...couponForm, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Activo">Activo</option>
                  <option value="Pausado">Pausado</option>
                  <option value="Expirado">Expirado</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsCouponModalOpen(false)} className="px-4 py-2 font-bold border border-slate-200 rounded-xl text-slate-600">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer">
                  Guardar Configuración
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: CREAR / EDITAR PRODUCTO */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitProduct} className="p-6 overflow-y-auto space-y-4 flex-grow text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre del Producto</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500"
                  placeholder="Ej: MacBook Pro M3 Max"
                />
              </div>

              {/* Marca, Modelo y Color */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Marca</label>
                  <input
                    type="text"
                    required
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 font-semibold"
                    placeholder="Apple, Sony, etc."
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Modelo</label>
                  <input
                    type="text"
                    required
                    value={productForm.model}
                    onChange={(e) => setProductForm({ ...productForm, model: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 font-semibold"
                    placeholder="M3 Max 16, WH-1000XM5"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Color</label>
                  <input
                    type="text"
                    required
                    value={productForm.color}
                    onChange={(e) => setProductForm({ ...productForm, color: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 font-semibold"
                    placeholder="Negro, Gris Espacial, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoría</label>
                  <select
                    required
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Precio Actual / Oferta ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                    placeholder="1299.00"
                  />
                </div>
              </div>

              {/* SECCIÓN ESPECIAL: CONFIGURAR OFERTA / DESCUENTO */}
              <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="onSaleCheckbox"
                      checked={productForm.onSale}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        const currentPrice = parseFloat(productForm.price) || 0;
                        setProductForm({
                          ...productForm,
                          onSale: isChecked,
                          originalPrice: isChecked && !productForm.originalPrice ? (currentPrice * 1.2).toFixed(0) : productForm.originalPrice,
                          badge: isChecked ? (productForm.badge || "SALE") : "",
                        });
                      }}
                      className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500 cursor-pointer"
                    />
                    <label htmlFor="onSaleCheckbox" className="font-extrabold text-rose-900 cursor-pointer text-xs">
                      🔥 Poner este producto en Oferta (SALE / Descuento)
                    </label>
                  </div>
                  {productForm.onSale && (
                    <span className="bg-rose-500 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                      Oferta Activa
                    </span>
                  )}
                </div>

                {productForm.onSale && (
                  <div className="grid grid-cols-2 gap-3 pt-1 animate-in fade-in duration-200">
                    <div>
                      <label className="block font-bold text-rose-900 mb-1">
                        Precio Normal / Lista ($ - Tachado)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required={productForm.onSale}
                        value={productForm.originalPrice}
                        onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-rose-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-rose-500"
                        placeholder="1499.00"
                      />
                      {parseFloat(productForm.originalPrice) > parseFloat(productForm.price) && (
                        <p className="text-[10px] text-emerald-700 font-extrabold mt-1">
                          🎉 {Math.round((1 - parseFloat(productForm.price) / parseFloat(productForm.originalPrice)) * 100)}% de Descuento aplicado
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-bold text-rose-900 mb-1">
                        Etiqueta / Badge Promocional
                      </label>
                      <select
                        value={productForm.badge}
                        onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-rose-300 rounded-xl font-extrabold text-rose-700 focus:outline-none focus:border-rose-500 cursor-pointer"
                      >
                        <option value="SALE">🔥 SALE</option>
                        <option value="OFERTA">⚡ OFERTA</option>
                        <option value="35% OFF">🏷️ 35% OFF</option>
                        <option value="20% OFF">🏷️ 20% OFF</option>
                        <option value="BEST SELLER">⭐ BEST SELLER</option>
                        <option value="PREMIUM">★ PREMIUM</option>
                        <option value="LIQUIDACIÓN">💥 LIQUIDACIÓN</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Disponible</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500"
                    placeholder="10"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">URL de Imagen</label>
                  <input
                    type="url"
                    required
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descripción</label>
                <textarea
                  required
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500"
                  placeholder="Especificaciones clave..."
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="featured"
                  checked={productForm.featured}
                  onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="featured" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Marcar como Producto Destacado (Featured)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 font-bold border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
