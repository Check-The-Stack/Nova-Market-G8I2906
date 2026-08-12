# Documentación General del Proyecto NovaMarket E-Commerce

**NovaMarket** es una plataforma e-commerce moderna y de alto impacto visual desarrollada para la comercialización de productos tecnológicos (laptops, smartphones, monitores, audio y periféricos). El sistema cuenta con una arquitectura monorepo de alto rendimiento, un flujo de compras cliente end-to-end completo y un Panel de Control Administrativo profesional con menú lateral.

---

## 🚀 Arquitectura del Sistema

* **Estructura**: Monorepo administrado por **Turborepo** y **pnpm workspaces**.
* **Frontend**: Next.js 14 (App Router) + React 18 + TailwindCSS 3 + TypeScript.
* **Backend**: Express + TypeScript + Prisma ORM + Supabase PostgreSQL.
* **Servidores en Desarrollo**:
  * Frontend: `http://localhost:3000`
  * Backend API: `http://localhost:4000/api`

---

## 🎨 Sistema de Diseño y Experiencia de Usuario (UX/UI)

1. **Tipografía & Estilos**:
   * Fuentes primarias Google: **Outfit** (para títulos de alto impacto y badges) e **Inter** (para textos de lectura).
   * Soporte para **Glassmorphism**, bordes suavizados (`rounded-3xl`), gradientes tailos y animaciones fluidas (`badge-pulse`, `slide-in-from-left`).

2. **Navegación Inteligente (`Navbar.tsx`)**:
   * Ocultamiento automático de botones de compra (Favoritos y Carrito) cuando el administrador se encuentra navegando dentro del área `/admin`.
   * Buscador interactivo integrado.
   * Menú desplegable de usuario con accesos a *Mi Perfil*, *Mis Favoritos*, *Mis Pedidos y Tracking* y *Panel de Admin*.

---

## 🛒 Módulos del Cliente y Flujo de Compras

1. **Página Principal (`app/page.tsx`)**:
   * Hero Banner promocional con llamado a la acción.
   * Bento-grid de **Categorías Destacadas** (laptops, celulares, monitores, audio, periféricos).
   * Sellos de confianza de envío, garantía oficial de 12 meses y cuotas.

2. **Catálogo y Filtros (`app/products/page.tsx`)**:
   * Búsqueda en tiempo real.
   * Ordenamiento por precio (*Menor a Mayor*, *Mayor a Menor*, *Destacados*).
   * Filtro "Solo en Stock" y pills de categoría.

3. **Detalle del Producto (`app/products/[id]/page.tsx`)**:
   * Galería de fotos y miniaturas.
   * Selector de cantidad en tiempo real e indicador de stock.
   * Pestañas desplegables con especificaciones técnicas, política de envío y botón para guardar en **Favoritos**.

4. **Carrito y Carrito Flotante (`CartDrawer.tsx` y `app/cart/page.tsx`)**:
   * Drawer deslizable lateral que abre automáticamente al añadir productos.
   * Barra de progreso interactiva para el beneficio de **Envío Gratis** (umbral de $150).
   * Validación de cupones de descuento (ej: `NOVA10` para 10% OFF).

5. **Checkout Multi-Paso (`app/checkout/page.tsx`)**:
   * Registro completo de datos de entrega incluyendo **País** y **Teléfono de Contacto**.
   * Selección de método de envío y formulario de pago simulado.
   * Pantalla de confirmación de pedido con número de orden generado y desglose detallado.

6. **Lista de Favoritos (`app/favorites/page.tsx` & `FavoritesContext.tsx`)**:
   * Almacenamiento persistente en `localStorage`.
   * Acción de **"Añadir al Carrito"** directo desde la vista de favoritos.

7. **Perfil de Usuario y Tracking de Envíos (`app/profile/page.tsx`)**:
   * Edición de datos personales (nombre, correo, teléfono, dirección).
   * Historial de compras con filtro por pedidos *En Camino* y *Entregados*.
   * **Modal de Tracking en Vivo**: Timeline interactivo de 4 pasos con código de seguimiento (`TRK-XXXXX`) y transporte.

8. **Widgets Globales**:
   * **Burbuja de Soporte Flotante (`SupportBubble.tsx`)**: Widget en esquina inferior derecha con chat en tiempo real y opciones rápidas (FAQ, envíos, garantías).
   * **Banner de Cookies Flotante (`CookieBanner.tsx`)**: Ventana flotante en la esquina inferior izquierda con animación de entrada `slide-in-from-left` y guardado de consentimiento en `localStorage`.
   * **Centro Legal (`app/legal/page.tsx`)**: Documentación oficial completa para *Preguntas Frecuentes*, *Políticas de Devolución*, *Garantía Oficial*, *Política de Privacidad* y *Términos de Uso*.

---

## 🛠️ Panel de Control de Administración (`/admin`)

* **Acceso Administrativo**:
  * **URL**: `http://localhost:3000/admin`
  * **Usuario Admin**: `admin@novamarket.com`
  * **Contraseña**: `admin123`
  * **Bypass de 1 Clic**: Botón *"🚀 Iniciar como Admin Demo"* en la pantalla de bloqueo.

* **Menú Lateral (Sidebar)**:
  1. 📊 **Dashboard / Métricas**: KPIs de Ventas Totales ($6,595.00), Pedidos Totales, Clientes Registrados y Stock Bajo.
  2. 📦 **Productos e Inventario**: CRUD completo (Crear, Editar, Eliminar productos, cambiar precios y stock).
  3. 📁 **Categorías**: Crear y editar familias de productos, íconos emoji y descripciones.
  4. 🧾 **Pedidos y Ventas**: Lista de órdenes, visualización de comprobantes en detalle y actualización de estado (*Procesando*, *En camino*, *Entregado*, *Cancelado*).
  5. 👥 **Clientes y Usuarios**: Gestión de usuarios registrados, cambio de rol (`admin` / `customer`), suspensión de cuentas y eliminación.
  6. 🏷️ **Cupones y Descuentos**: Creación avanzada de cupones con código clave, tipo de descuento (% o $), compra mínima requerida y vigencia por fechas.
  7. ⚙️ **Configuración de la Tienda**: Nombre comercial, email de notificaciones, impuestos y moneda.

---

## 🔑 Variables de Entorno Configuradas

* `backend/.env`:
  * `DATABASE_URL` (Supabase PgBouncer pooler connection string)
  * `DIRECT_URL` (Supabase Direct PostgreSQL connection string)
  * `JWT_SECRET` (`novamarket_super_secret_jwt_key_2026`)
  * `PORT` (`4000`)
* `frontend/.env.local`:
  * `NEXT_PUBLIC_API_URL` (`http://localhost:4000/api`)

---

## ⚙️ Estado de Implementación del Backend (API)

**1. Gestión de Usuarios y Autenticación**
- [x] Login y roles de usuario (`POST /api/auth/login`)
- [x] Registro y recuperación de contraseña (`POST /api/auth/register`, etc)
- [x] Obtener perfil propio (`GET /api/auth/me`)
- [ ] Edición de perfil de usuario (Pendiente)
- [ ] CRUD de clientes para el Admin (Pendiente)

**2. Productos y Categorías**
- [x] Listar y buscar productos (`GET /api/products`)
- [x] Detalle de producto (`GET /api/products/:id`)
- [x] CRUD de Productos para Admin (`POST`, `PUT`, `DELETE /api/products`)
- [x] Listar categorías (`GET /api/categories`)
- [ ] CRUD de Categorías para Admin (Pendiente)

**3. Pedidos y Carrito**
- [x] CRUD de Carrito de compras (`/api/cart`)
- [x] Crear pedido (`POST /api/orders`)
- [x] Historial de pedidos de usuario (`GET /api/orders/my-orders` y `GET /api/orders/:id`)
- [x] Listar pedidos para Admin (`GET /api/admin/orders`)
- [x] Actualizar estado de pedido (`PUT /api/admin/orders/:id/status`)
- [ ] Sistema de Tracking en vivo por código (Pendiente)

**4. Cupones y Dashboard**
- [x] Estadísticas generales del Dashboard (`GET /api/admin/stats`)
- [ ] Validar cupones en carrito (Pendiente)
- [ ] CRUD de Cupones para Admin (Pendiente)
- [ ] Configuración global de la tienda (Pendiente)
