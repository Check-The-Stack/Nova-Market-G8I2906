# Test Plan — NovaMarket MVP

## 1. Análisis de Requerimientos

| Funcionalidad | Qué debe hacer | Qué pasa si falla | Casos de uso |
|---|---|---|---|
| **Autenticación** | Login con email/contraseña y recuperación de contraseña | Usuario no puede entrar → bloqueo total del flujo | Login correcto, login con credenciales inválidas, recuperación de contraseña, sesión expirada |
| **Catálogo** | Mostrar productos con filtros y búsqueda | Usuario no encuentra productos → frustración, abandono | Búsqueda por nombre, filtro por categoría, producto sin stock |
| **Carrito** | Agregar, quitar y modificar cantidades | Usuario no puede comprar → pérdida de venta | Agregar producto, eliminar producto, actualizar cantidad, carrito vacío |
| **Checkout** | Procesar pago y dirección de envío | Transacción no completada → pérdida de confianza | Pago exitoso, pago rechazado, dirección inválida, cupón aplicado |
| **Admin** | Gestionar productos, usuarios y pedidos | Negocio no puede operar | Crear producto, editar stock, ver pedidos, bloquear usuario |

## 2. Propuesta de Arquitectura Inicial

**Stack sugerido:**
- **Frontend:** React 18 + Next.js 14 (App Router) + Tailwind CSS
- **Backend:** Next.js API Routes (monorepo con Turbopack)
- **Base de datos:** PostgreSQL (Supabase)
- **Autenticación:** Supabase Auth (email/contraseña)
- **Almacenamiento:** Supabase Storage (imágenes de productos)
- **Testing:** Cypress (E2E), Vitest (unitario)

**Módulos principales:**
```
Frontend (Next.js) ─────► API Routes ─────► Supabase
     │                        │
     ▼                        ▼
  Componentes            Controladores
   - Auth                - auth.ts
   - Catalog             - products.ts
   - Cart                - cart.ts
   - Checkout            - orders.ts
   - Admin               - admin.ts
```

**Conexión entre módulos:**
- Frontend llama a `/api/*` (Next.js API Routes)
- API Routes ejecutan lógica de negocio y consultan Supabase (PostgreSQL)
- Supabase Auth maneja sesiones JWT
- Carrito se persiste en base de datos (usuario autenticado) o localStorage (invitado)

## 4. Estructura de Carpetas

```
/
├── frontend/          # Next.js App Router
│   ├── app/
│   │   ├── (auth)/    # login, register, recover
│   │   ├── catalog/   # productos con filtros
│   │   ├── cart/      # carrito de compras
│   │   ├── checkout/  # pago y dirección
│   │   └── admin/     # gestión interna
│   ├── components/    # UI reutilizable
│   ├── lib/           # helpers, clientes Supabase
│   └── tests/         # tests unitarios (Vitest)
├── backend/           # API Routes (dentro de Next.js)
│   └── app/api/       # /api/auth, /api/products, /api/orders
├── qa/
│   ├── test-plan/     # este documento
│   ├── test-cases/    # casos detallados por funcionalidad
│   └── reports/       # reportes de ejecución
├── supabase/          # migraciones, seed, tipos
└── tests/             # tests E2E (Cypress)
```

## 5. Test Cases

Los casos de prueba se gestionan en Google Sheets:
[Test Cases - NovaMarket](https://docs.google.com/spreadsheets/d/1RYbz4uN3KENSKV31LULXoPePyRRxn1XaRYNn-g_xQ9U/edit?usp=sharing)

## 6. Objetivos de testing

Validar que las funcionalidades críticas del MVP (auth, catálogo, carrito, checkout, admin) funcionan de forma consistente y segura.

## 6. Alcance

**Sí se prueba:**
- Funcionales (login, carrito, checkout, admin CRUD)
- Integración básica (API catálogo ↔ carrito)
- Usabilidad mínima (flujo de compra en < 3 pasos)
- Rendimiento básico (tiempo de carga < 2s en catálogo)

**No se prueba:**
- Pruebas de seguridad avanzada
- Stress testing masivo
- Localización multilenguaje
- Pagos reales, integraciones externas

## 7. Estrategia de pruebas

- **Manual** para casos críticos (checkout, admin)
- **Automatización inicial** con Cypress en login y carrito

## 8. Tipos de prueba

- Funcionales (login, carrito, checkout)
- Integración (API catálogo ↔ carrito)
- Usabilidad (flujo de compra en < 3 pasos)
- Rendimiento básico (tiempo de carga < 2s en catálogo)
- Regresión

## 9. Criterios de aceptación

- Usuario puede registrarse y loguearse sin errores
- Carrito permite agregar/eliminar productos en menos de 2 clics
- Checkout procesa pagos válidos y rechaza inválidos con mensaje claro
- Filtrar catálogo en 1 click
- Admin puede crear producto con nombre, precio, categoría e imagen

## 11. Cronograma

| Semana | Actividad |
|--------|-----------|
| 1 | Análisis de requerimientos, test plan, arquitectura inicial, proto-persona, estructura de carpetas |
| 2 | Casos de prueba login y catálogo |
| 3 | Casos de prueba carrito |
| 4 | Casos de prueba checkout |
| 5 | Casos de prueba admin |
| 6 | Regresión y usabilidad |
| 7 | Reporte final y correcciones |
