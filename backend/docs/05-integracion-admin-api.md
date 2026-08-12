# 📘 Guía de Integración para el Desarrollador Frontend: Panel de Administración (Productos)

Este documento detalla cómo debe conectarse la pantalla de administración (**Admin Page**) a los endpoints del backend para gestionar el catálogo de productos (CRUD).

---

## 🔑 1. Autenticación y Autorización
Todos los endpoints de escritura/modificación (`POST`, `PUT`, `DELETE`) requieren privilegios de administrador.
- El backend valida el rol del usuario a través de un **token JWT** enviado en la cabecera HTTP `Authorization`.
- Formato: `Authorization: Bearer <JWT_TOKEN>`
- En el frontend, el cliente Axios preconfigurado en [api.ts](file:///c:/Users/vikdu/OneDrive/Escritorio/Nova-Market-G8I2906/frontend/src/services/api.ts) ya inyecta automáticamente este token desde el `localStorage` (`novamarket_token`), por lo que se recomienda usar dicha instancia para todas las llamadas.

---

## 📡 2. Especificación de Endpoints (API)

### 📌 Obtener todos los productos (Listar)
* **Método:** `GET`
* **Ruta:** `/products` (o `/products?category=...&search=...&featured=true` para filtros)
* **Acceso:** Público (No requiere autenticación)
* **Respuesta Exitosa (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-producto-1",
      "name": "MacBook Pro M3",
      "slug": "macbook-pro-m3",
      "description": "Especificaciones detalladas...",
      "price": 1599,
      "category": "Laptops",
      "imageUrl": "https://...",
      "stock": 10,
      "featured": true,
      "createdAt": "2026-07-27T12:00:00Z"
    }
  ]
}
```

---

### 📌 Crear un nuevo producto
* **Método:** `POST`
* **Ruta:** `/products`
* **Acceso:** Privado (Admin)
* **Payload requerido (`JSON`):**
```json
{
  "name": "Nombre del Producto",
  "slug": "nombre-del-producto", 
  "description": "Descripción de mínimo 10 caracteres...",
  "price": 99.99,
  "category": "Categoría",
  "imageUrl": "https://imagen-valida.com/foto.jpg",
  "stock": 15,
  "featured": false
}
```
* **Validaciones críticas en Backend (Zod):**
  * `slug`: Debe estar en minúsculas, usar solo letras, números y guiones (expresión regular: `/^[a-z0-9-]+$/`).
  * `price`: Debe ser un número estrictamente mayor que 0.
  * `stock`: Debe ser un entero no negativo (mínimo `0`).
  * `imageUrl`: Debe ser una URL válida.
* **Respuestas de Error:**
  * **`400 Bad Request`** (Campos inválidos):
    ```json
    {
      "success": false,
      "error": "Error de validación en los datos enviados",
      "details": [
        { "path": "price", "message": "El precio debe ser mayor a 0" },
        { "path": "slug", "message": "El slug debe contener únicamente letras minúsculas..." }
      ]
    }
    ```
  * **`409 Conflict`** (Slug repetido):
    ```json
    {
      "success": false,
      "error": "Ya existe un producto con ese slug"
    }
    ```

---

### 📌 Actualizar un producto
* **Método:** `PUT`
* **Ruta:** `/products/:id`
* **Acceso:** Privado (Admin)
* **Payload (`JSON`):** Cualquier subconjunto de los campos del producto (esquema parcial).
* **Respuesta Exitosa (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-producto-1",
    "name": "Nuevo Nombre",
    ...
  }
}
```

---

### 📌 Eliminar un producto
* **Método:** `DELETE`
* **Ruta:** `/products/:id`
* **Acceso:** Privado (Admin)
* **Respuesta Exitosa (200 OK):**
```json
{
  "success": true,
  "message": "Producto eliminado correctamente"
}
```

---

## 💻 3. Ejemplo de Código en React / Next.js (Admin Page)

El encargado del frontend puede implementar la integración de la siguiente manera dentro de la vista de administración:

### A. Cargar los productos reales
```typescript
import api from "@/services/api";
import { useEffect, useState } from "react";
import { Product } from "@/types";

// Dentro del componente:
const [products, setProducts] = useState<Product[]>([]);
const [error, setError] = useState("");

useEffect(() => {
  api.get("/products")
    .then((res) => {
      if (res.data.success) {
        setProducts(res.data.data);
      }
    })
    .catch((err) => setError("Error al cargar productos"));
}, []);
```

### B. Crear un nuevo producto (Manejo de errores del backend)
```typescript
const handleCreateProduct = async (formData: Omit<Product, 'id'>) => {
  try {
    const res = await api.post("/products", formData);
    if (res.data.success) {
      setProducts([res.data.data, ...products]);
      // Cerrar modal y limpiar formulario
    }
  } catch (err: any) {
    if (err.response?.status === 400) {
      // Mostrar errores de validación de Zod al usuario
      const validationErrors = err.response.data.details; 
      console.log("Errores de validación:", validationErrors);
    } else {
      console.error("Error general:", err.response?.data?.error || err.message);
    }
  }
};
```

### C. Eliminar un producto
```typescript
const handleDeleteProduct = async (id: string) => {
  if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

  try {
    const res = await api.delete(`/products/${id}`);
    if (res.data.success) {
      setProducts(products.filter((p) => p.id !== id));
    }
  } catch (err) {
    console.error("Error al eliminar", err);
  }
};
```
