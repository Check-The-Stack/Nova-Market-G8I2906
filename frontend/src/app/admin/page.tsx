"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Product } from "../../types";
import Link from "next/link";
import api from "../../services/api";

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
    stock: "",
    featured: false,
  });
  const [formError, setFormError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Fetch products on mount
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchProducts();
    }
  }, [isAuthenticated, user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/products");
      if (res.data && res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError("No se pudieron cargar los productos. Compruebe que el backend esté en ejecución.");
    } finally {
      setLoading(false);
    }
  };

  // Open modal for creating
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: "",
      category: "",
      imageUrl: "",
      stock: "",
      featured: false,
    });
    setFormError("");
    setFieldErrors({});
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      imageUrl: product.imageUrl,
      stock: product.stock.toString(),
      featured: product.featured,
    });
    setFormError("");
    setFieldErrors({});
    setIsModalOpen(true);
  };

  // Handle Delete
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("¿Está seguro de que desea eliminar este producto?")) return;

    try {
      const res = await api.delete(`/products/${productId}`);
      if (res.data && res.data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch (err: any) {
      console.error("Error deleting product:", err);
      alert(err.response?.data?.error || "Error al eliminar el producto.");
    }
  };

  // Handle Form Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
    // Clear error for that field when user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Auto-generate slug from name if creating
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nameVal = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, name: nameVal };
      if (!editingProduct) {
        // Generate a clean slug
        updated.slug = nameVal
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }
      return updated;
    });

    if (fieldErrors["name"]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next["name"];
        return next;
      });
    }
  };

  // Submit Handler (Create/Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    setFieldErrors({});

    const payload = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      imageUrl: formData.imageUrl,
      stock: parseInt(formData.stock, 10),
      featured: formData.featured,
    };

    try {
      let res;
      if (editingProduct) {
        // Update product
        res = await api.put(`/products/${editingProduct.id}`, payload);
      } else {
        // Create product
        res = await api.post("/products", payload);
      }

      if (res.data && res.data.success) {
        // Refresh products list
        await fetchProducts();
        setIsModalOpen(false);
      }
    } catch (err: any) {
      console.error("Error submitting form:", err);
      if (err.response?.status === 400 && err.response.data?.details) {
        // Map Zod errors
        const errors: Record<string, string> = {};
        err.response.data.details.forEach((detail: any) => {
          // detail.path could be an array like ["price"] or string
          const path = Array.isArray(detail.path) ? detail.path[0] : detail.path;
          if (path) {
            errors[path] = detail.message;
          }
        });
        setFieldErrors(errors);
        setFormError("Por favor corrija los errores de validación.");
      } else if (err.response?.status === 409) {
        setFieldErrors({ slug: "El slug ya está registrado por otro producto." });
        setFormError(err.response.data?.error || "Conflicto al guardar el producto.");
      } else {
        setFormError(err.response?.data?.error || "Ocurrió un error inesperado al guardar el producto.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Protection of Rol
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
        <div className="bg-destructive/10 text-destructive p-4 rounded-full mb-6">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Acceso Denegado</h2>
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          Esta sección del portal requiere privilegios de Administrador. Por favor, inicia sesión con una cuenta autorizada para continuar.
        </p>
        <Link href="/login" className="bg-primary text-primary-foreground text-sm font-semibold px-6 py-3 rounded-lg hover:bg-primary-hover transition-all shadow-sm">
          Ir al Login Administrativo
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="border-b border-border pb-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Administrador Nova</h1>
          <p className="text-sm text-muted-foreground mt-1">Portal de gestión del catálogo e inventario de NovaMarket</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-primary-hover shadow-sm transition-all"
        >
          Nuevo Producto
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-secondary/20 border border-border p-5 rounded-xl">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Productos Activos</span>
          <p className="text-2xl font-bold text-foreground mt-2">{products.length}</p>
        </div>
        <div className="bg-secondary/20 border border-border p-5 rounded-xl">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Valor total del inventario</span>
          <p className="text-2xl font-bold text-foreground mt-2">
            ${products.reduce((acc, curr) => acc + curr.price * curr.stock, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-secondary/20 border border-border p-5 rounded-xl">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Bajo Inventario</span>
          <p className="text-2xl font-bold text-primary mt-2">
            {products.filter((p) => p.stock <= 5).length} Items
          </p>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm flex items-center gap-3">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>{error}</div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">Inventario de Productos</h2>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-sm text-muted-foreground">
              Cargando productos del catálogo...
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center text-sm text-muted-foreground">
              No hay productos registrados en el catálogo. ¡Crea el primero!
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/30 text-xs font-semibold text-muted-foreground uppercase border-b border-border">
                <tr>
                  <th className="px-6 py-3">Producto</th>
                  <th className="px-6 py-3">Categoría</th>
                  <th className="px-6 py-3 text-right">Precio</th>
                  <th className="px-6 py-3 text-center">Stock</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground flex items-center gap-3">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-8 h-8 rounded object-cover border border-border shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=100&auto=format&fit=crop";
                        }}
                      />
                      <span>{product.name}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{product.category}</td>
                    <td className="px-6 py-4 text-right font-medium text-foreground">${product.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center font-medium">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          product.stock <= 5 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                        }`}
                      >
                        {product.stock} unidades
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="text-xs text-muted-foreground hover:text-foreground font-semibold px-2 py-1 rounded border border-border hover:bg-background transition-all"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-xs text-destructive hover:bg-destructive/10 px-2 py-1 rounded transition-all font-semibold"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modern Product Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-background border border-border w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-grow">
              {formError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-xs font-semibold">
                  {formError}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary ${
                    fieldErrors.name ? "border-destructive focus:ring-destructive" : "border-border"
                  }`}
                  placeholder="Ej. MacBook Pro M3"
                />
                {fieldErrors.name && <p className="text-destructive text-[11px] mt-1">{fieldErrors.name}</p>}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Slug (URL limpia)</label>
                <input
                  type="text"
                  required
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary ${
                    fieldErrors.slug ? "border-destructive focus:ring-destructive" : "border-border"
                  }`}
                  placeholder="ej-macbook-pro-m3"
                />
                {fieldErrors.slug && <p className="text-destructive text-[11px] mt-1">{fieldErrors.slug}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Categoría</label>
                <select
                  required
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary ${
                    fieldErrors.category ? "border-destructive focus:ring-destructive" : "border-border"
                  }`}
                >
                  <option value="">Seleccione una categoría</option>
                  <option value="Laptops">Laptops</option>
                  <option value="Celulares">Celulares</option>
                  <option value="Audio">Audio</option>
                  <option value="Smart Home">Smart Home</option>
                  <option value="Computación">Computación</option>
                  <option value="Storage">Storage</option>
                </select>
                {fieldErrors.category && <p className="text-destructive text-[11px] mt-1">{fieldErrors.category}</p>}
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">URL de la Imagen</label>
                <input
                  type="url"
                  required
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary ${
                    fieldErrors.imageUrl ? "border-destructive focus:ring-destructive" : "border-border"
                  }`}
                  placeholder="https://images.unsplash.com/..."
                />
                {fieldErrors.imageUrl && <p className="text-destructive text-[11px] mt-1">{fieldErrors.imageUrl}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Precio ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary ${
                      fieldErrors.price ? "border-destructive focus:ring-destructive" : "border-border"
                    }`}
                    placeholder="1599.00"
                  />
                  {fieldErrors.price && <p className="text-destructive text-[11px] mt-1">{fieldErrors.price}</p>}
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Stock</label>
                  <input
                    type="number"
                    required
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary ${
                      fieldErrors.stock ? "border-destructive focus:ring-destructive" : "border-border"
                    }`}
                    placeholder="10"
                  />
                  {fieldErrors.stock && <p className="text-destructive text-[11px] mt-1">{fieldErrors.stock}</p>}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Descripción</label>
                <textarea
                  required
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary ${
                    fieldErrors.description ? "border-destructive focus:ring-destructive" : "border-border"
                  }`}
                  placeholder="Especificaciones del producto (mínimo 10 caracteres)..."
                />
                {fieldErrors.description && <p className="text-destructive text-[11px] mt-1">{fieldErrors.description}</p>}
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="featured" className="text-sm text-foreground select-none font-medium">
                  Marcar como Producto Destacado (Featured)
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold border border-border rounded-lg text-muted-foreground hover:bg-secondary/20 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-all disabled:opacity-50"
                >
                  {submitting ? "Guardando..." : "Guardar Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

