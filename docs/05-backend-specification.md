# Especificación de Backend (Supabase + Express + Prisma)

Este documento detalla la estructura, flujo de trabajo y configuración necesaria para conectar la base de datos de Supabase con el backend de Node.js + Express usando Prisma ORM.

---

## 1. Configuración del Entorno y Supabase

### 1.1 Variables de Entorno (`.env` en `backend/`)
Obtener el String de Conexión desde el panel de Supabase (**Project Settings > Database > Connection string > Direct Connection & Connection Pooling**):

```env
PORT=5000
DATABASE_URL="postgresql://postgres:[TU_PASSWORD]@db.[TU_PROJECT_REF].supabase.co:5432/postgres?pgboiler=true"
DIRECT_URL="postgresql://postgres:[TU_PASSWORD]@db.[TU_PROJECT_REF].supabase.co:5432/postgres"
JWT_SECRET="super_secret_jwt_key_novamarket"
```

> **Nota**: `DIRECT_URL` se requiere cuando se usa conexión pool (pgBouncer) en Supabase para ejecutar migraciones directas.

---

## 2. Definición del Esquema Prisma (`schema.prisma`)

Ubicación: [backend/prisma/schema.prisma](file:///c:/Users/vikdu/OneDrive/Escritorio/Nova-Market-G8I2906/backend/prisma/schema.prisma)

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  USER
  ADMIN
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  CANCELLED
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  orders    Order[]
}

model Product {
  id          String      @id @default(uuid())
  name        String
  description String
  price       Float
  stock       Int
  imageUrl    String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  orderItems  OrderItem[]
}

model Order {
  id        String      @id @default(uuid())
  userId    String
  user      User        @relation(fields: [userId], references: [id])
  total     Float
  status    OrderStatus @default(PENDING)
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  items     OrderItem[]
}

model OrderItem {
  id        String  @id @default(uuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Float
}
```

---

## 3. Endpoints REST API de la Fase Backend

### 3.1 Autenticación (`/api/auth`)
- `POST /api/auth/register`: Registro de usuarios (hash de contraseña con bcrypt).
- `POST /api/auth/login`: Autenticación y retorno de token JWT.
- `GET /api/auth/me`: Verificación de sesión de usuario autenticado.

### 3.2 Productos (`/api/products`)
- `GET /api/products`: Listado de productos con paginación/filtros.
- `GET /api/products/:id`: Detalle de producto por ID.
- `POST /api/products`: Crear producto (Ruta protegida, requiere `ADMIN`).
- `PUT /api/products/:id`: Actualizar producto (Ruta protegida, requiere `ADMIN`).
- `DELETE /api/products/:id`: Eliminar producto (Ruta protegida, requiere `ADMIN`).

### 3.3 Órdenes (`/api/orders`)
- `POST /api/orders`: Crear nueva orden de compra a partir de los ítems seleccionados.
- `GET /api/orders`: Listar órdenes del usuario autenticado.
- `GET /api/orders/admin`: Listar todas las órdenes de la plataforma (Sólo `ADMIN`).

---

## 4. Middleware de Seguridad y Validación

1. **`authMiddleware`**: Valida el header `Authorization: Bearer <JWT_TOKEN>`.
2. **`adminMiddleware`**: Verifica que `req.user.role === 'ADMIN'`.
3. **`validateBody`**: Utiliza **Zod** para validar que los payloads de entrada coincidan con los schemas esperados.

---

## 5. Plan de Pruebas Backend

- **Pruebas de Integración con Jest / Supertest**:
  - Auth: Registro de usuario exitoso y fallido por email duplicado.
  - Auth: Login exitoso devolviendo JWT válido.
  - Products: CRUD de productos restringido por rol.
  - Orders: Creación de órdenes recalculando importes y reduciendo stock.
