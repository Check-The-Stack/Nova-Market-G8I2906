# Registro de Cambios del Backend (Changelog)

Este documento detalla todas las modificaciones, características y correcciones que se han realizado en el backend de **NovaMarket**.

---

## [2026-07-27] - Implementación de Validación de Peticiones y Correcciones del Compilador

### Añadido
- **Middleware de Validación Genérico:**
  - [validationMiddleware.ts](file:///c:/Users/vikdu/OneDrive/Escritorio/Nova-Market-G8I2906/backend/src/middleware/validationMiddleware.ts): Middleware genérico que intercepta las solicitudes HTTP y valida `req.body` contra esquemas de Zod. Responde con `400 Bad Request` y un desglose detallado de los errores en caso de fallo.
- **Esquemas de Validación Zod:**
  - [authSchemas.ts](file:///c:/Users/vikdu/OneDrive/Escritorio/Nova-Market-G8I2906/backend/src/schemas/authSchemas.ts): Esquemas para validar las peticiones de registro (`registerSchema`) y login (`loginSchema`).
  - [productSchemas.ts](file:///c:/Users/vikdu/OneDrive/Escritorio/Nova-Market-G8I2906/backend/src/schemas/productSchemas.ts): Esquemas para crear (`createProductSchema`) y actualizar (`updateProductSchema`) productos, obligando al uso de slugs formateados correctamente, precios positivos, URLs de imagen válidas y stocks no negativos.
  - [orderSchemas.ts](file:///c:/Users/vikdu/OneDrive/Escritorio/Nova-Market-G8I2906/backend/src/schemas/orderSchemas.ts): Esquema para validar la creación de órdenes (`createOrderSchema`), comprobando la dirección de envío y garantizando que se envíe al menos un ítem con IDs UUID válidos y cantidades mayores a cero.

### Modificado
- **Rutas de la API (Integración de validaciones):**
  - [authRoutes.ts](file:///c:/Users/vikdu/OneDrive/Escritorio/Nova-Market-G8I2906/backend/src/routes/authRoutes.ts): Añadida la validación previa en los endpoints `/register` y `/login`.
  - [productRoutes.ts](file:///c:/Users/vikdu/OneDrive/Escritorio/Nova-Market-G8I2906/backend/src/routes/productRoutes.ts): Añadida la validación previa en las operaciones de creación (`POST /`) y modificación (`PUT /:id`).
  - [orderRoutes.ts](file:///c:/Users/vikdu/OneDrive/Escritorio/Nova-Market-G8I2906/backend/src/routes/orderRoutes.ts): Añadida la validación previa al crear una orden (`POST /`).
- **Controlador de Órdenes:**
  - [orderController.ts](file:///c:/Users/vikdu/OneDrive/Escritorio/Nova-Market-G8I2906/backend/src/controllers/orderController.ts): Tipado explícito de la variable `tx` (`Prisma.TransactionClient`) dentro del bloque transaccional `$transaction` para solucionar errores de compilación de TypeScript (`noImplicitAny`).

---

