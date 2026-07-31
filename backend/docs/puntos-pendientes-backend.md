# 📋 Informe de Puntos Pendientes del Backend — NovaMarket

Este informe ha sido preparado para detallar el estado actual de desarrollo del backend, comparando lo implementado contra las especificaciones técnicas y de diseño, e identificando con precisión qué tareas quedan por realizar.

---

## 🔍 Resumen del Estado Actual

El backend está construido con **Express + TypeScript + Prisma ORM + PostgreSQL (Supabase)**. Actualmente se han implementado las bases del proyecto, incluyendo:
- Autenticación con JWT (Registro, Login, obtener perfil).
- Operaciones básicas de catálogo de productos (CRUD con validaciones Zod y control de roles).
- Creación de pedidos con decremento automático de stock y transacciones de base de datos.

Sin embargo, existen discrepancias entre los documentos de especificación (`02-endpoints-api.md`, `05-backend-specification.md`, `test-plan.md`) y el código actual. A continuación se desglosan los puntos pendientes agrupados por prioridad.

---

## 🚀 Puntos Pendientes por Completar

### 1. Funcionalidades e Integraciones Incompletas (Prioridad Alta)

*   **Endpoint de Categorías (`GET /api/categories`):**
    *   *Estado:* **Pendiente de implementación.**
    *   *Detalle:* Está definido en la especificación (`02-endpoints-api.md`) para proveer al frontend una lista de categorías disponibles, pero no existe en las rutas ni controladores. Se puede implementar obteniendo los valores distintos (distinct) de la columna `category` en la tabla `Product` de forma dinámica, o definiendo un catálogo estático.
*   **Endpoints del Carrito de Compras (`/api/cart`):**
    *   *Estado:* **Pendiente / Decisión de Diseño.**
    *   *Detalle:* La especificación del API define los endpoints para persistir el carrito (`GET /api/cart`, `POST /api/cart/items`, `PUT /api/cart/items/:productId`, `DELETE /api/cart/items/:productId`). Actualmente, el frontend implementa la persistencia únicamente de forma local en `localStorage` mediante `CartContext.tsx`.
    *   *Acción:* Se debe decidir si se implementarán estos endpoints en el backend (lo que requeriría añadir las tablas `Cart` y `CartItem` en `schema.prisma`) o si se modificará la documentación para reflejar que el carrito es 100% del lado del cliente.
*   **Obtención de Detalles de un Pedido Específico (`GET /api/orders/:id`):**
    *   *Estado:* **Pendiente de implementación.**
    *   *Detalle:* Listado en `02-endpoints-api.md`, pero ausente en el controlador y rutas del backend. Un cliente autenticado (o administrador) debería poder consultar el detalle completo de un pedido mediante su UUID.

---

### 2. Ajustes de Rutas y Funcionalidades Existentes (Prioridad Media)

*   **Paginación y Límites en el Catálogo de Productos:**
    *   *Estado:* **Incompleto.**
    *   *Detalle:* El endpoint `GET /api/products` recibe filtros de categoría, búsqueda y destacados, pero no implementa los query params `page` y `limit` definidos en la especificación para la paginación.
    *   *Acción:* Actualizar `productController.ts` para que use los comandos `skip` y `take` de Prisma.
*   **Discrepancia en las Rutas de Pedidos (Orders):**
    *   *Estado:* **Desviación de especificación.**
    *   *Detalle:*
        *   Para mis pedidos: El backend usa `/api/orders/my-orders` mientras que la especificación indica `/api/orders` (GET).
        *   Para pedidos de administración: El backend usa `/api/orders/admin` mientras que la especificación indica `/api/admin/orders` (GET).
    *   *Acción:* Alinear las rutas en `orderRoutes.ts` con la especificación original o actualizar el documento de especificación.
*   **Recuperación de Contraseñas:**
    *   *Estado:* **Pendiente.**
    *   *Detalle:* Mencionado en el plan de pruebas (`test-plan.md`), pero no existe soporte ni de base de datos ni de endpoints en el backend actual.

---

### 3. Pruebas y Aseguramiento de Calidad (Prioridad Media/Baja)

*   **Suite de Pruebas Unitarias e Integración:**
    *   *Estado:* **Pendiente.**
    *   *Detalle:* El documento `05-backend-specification.md` define un plan de pruebas utilizando **Jest** y **Supertest** para verificar flujos de Auth, Products y Orders, pero no se ha configurado ninguna herramienta de testing en el backend (no hay Jest en `package.json` ni archivos de prueba `.test.ts`).
    *   *Acción:* Configurar Jest/Supertest y escribir pruebas de integración clave.

---

## 📊 Matriz de Comparativa: Especificación vs. Implementación

| Endpoint / Requerimiento | Método | Ruta Especificada | Ruta en Código | Estado |
| :--- | :---: | :--- | :--- | :---: |
| Registrar Usuario | POST | `/api/auth/register` | `/api/auth/register` | ✅ Completado |
| Login | POST | `/api/auth/login` | `/api/auth/login` | ✅ Completado |
| Perfil de Usuario | GET | `/api/auth/me` | `/api/auth/me` | ✅ Completado |
| Listar Catálogo | GET | `/api/products` | `/api/products` | ⚠️ Parcial (Falta paginación) |
| Detalle de Producto | GET | `/api/products/:id` | `/api/products/:id` | ✅ Completado |
| Crear Producto | POST | `/api/products` | `/api/products` | ✅ Completado |
| Actualizar Producto | PUT | `/api/products/:id` | `/api/products/:id` | ✅ Completado |
| Eliminar Producto | DELETE | `/api/products/:id` | `/api/products/:id` | ✅ Completado |
| Listar Categorías | GET | `/api/categories` | *No existe* | ❌ Pendiente |
| Ver Carrito | GET | `/api/cart` | *No existe* | ❌ Pendiente / LocalStorage |
| Agregar al Carrito | POST | `/api/cart/items` | *No existe* | ❌ Pendiente / LocalStorage |
| Actualizar Carrito | PUT | `/api/cart/items/:productId` | *No existe* | ❌ Pendiente / LocalStorage |
| Eliminar del Carrito | DELETE | `/api/cart/items/:productId` | *No existe* | ❌ Pendiente / LocalStorage |
| Crear Pedido | POST | `/api/orders` | `/api/orders` | ✅ Completado |
| Mis Pedidos | GET | `/api/orders` | `/api/orders/my-orders` | ⚠️ Desviación en la ruta |
| Detalle de Pedido | GET | `/api/orders/:id` | *No existe* | ❌ Pendiente |
| Pedidos de Admin | GET | `/api/admin/orders` | `/api/orders/admin` | ⚠️ Desviación en la ruta |

---

## 🛠️ Próximos Pasos Sugeridos

1.  **Definir el alcance del Carrito:** Confirmar si el carrito se mantendrá únicamente en el frontend con `localStorage` (suficiente para un MVP inicial) o si necesitamos crear el modelo relacional en la base de datos de Supabase.
2.  **Alinear y complementar endpoints de Pedidos:** Implementar `GET /api/orders/:id` y corregir los pathnames para que coincidan con la especificación.
3.  **Implementar categorías:** Crear un endpoint sencillo `GET /api/categories` para que el frontend pueda poblar sus menús desplegables de manera dinámica.
