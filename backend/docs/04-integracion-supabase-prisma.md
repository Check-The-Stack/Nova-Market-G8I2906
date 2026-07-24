# ⚡ Integración de Supabase con Prisma ORM

**Proyecto:** NovaMarket (MVP)  
**Módulo:** Backend  
**Versión:** 1.0  
**Fecha:** 24/07/2026  
**Autor:** Equipo de Desarrollo Backend NovaMarket  

---

## 1. Introducción y Arquitectura

Este documento describe la integración y configuración inicial entre la plataforma **Supabase** (PostgreSQL gestionado en la nube) y **Prisma ORM** en el backend de NovaMarket.

### 1.1 Diagrama de Conexión

```text
                        ┌───────────────────────────────────────────────┐
                        │                NovaMarket Backend             │
                        │                                               │
                        │    ┌──────────────────┐ ┌──────────────────┐  │
                        │    │  Prisma Client   │ │ Supabase Client  │  │
                        │    │ (src/config/     │ │ (src/config/     │  │
                        │    │   prisma.ts)     │ │   supabase.ts)   │  │
                        │    └─────────┬────────┘ └─────────┬────────┘  │
                        └──────────────┼────────────────────┼───────────┘
                                       │                    │
                          Port 6543    │                    │ HTTPS / REST API
                       (PgBouncer) /   │                    │
                          Port 5432    ▼                    ▼
                        ┌───────────────────────────────────────────────┐
                        │             Supabase Cloud Service            │
                        │                                               │
                        │   ┌───────────────────┐  ┌────────────────┐   │
                        │   │  PostgreSQL DB    │  │  Storage/Auth  │   │
                        │   └───────────────────┘  └────────────────┘   │
                        └───────────────────────────────────────────────┘
```

### 1.2 Por qué Prisma + Supabase

- **Prisma ORM**: Proporciona auto-completado y tipado fuerte (TypeScript), migraciones declarativas y consultas eficientes sobre la base de datos relacional.
- **Supabase**: Provee una base de datos PostgreSQL alojada y escalable, administrada con PgBouncer para connection pooling, almacenamiento de archivos (Storage) y autenticación.

---

## 2. Configuración de Variables de Entorno

En el archivo `backend/.env` se definen las variables necesarias para conectar tanto Prisma como la API JS de Supabase:

```env
PORT=4000

# 1. Connection Pooling (PgBouncer - Puerto 6543)
# Utilizado por la aplicación Express en runtime para optimizar conexiones simultáneas.
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# 2. Conexión Directa (Puerto 5432)
# Utilizado exclusivamente por Prisma CLI para ejecutar migraciones y comandos 'prisma db push'.
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# 3. Credenciales de la API de Supabase
SUPABASE_URL="https://[PROJECT_REF].supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# 4. Clave secreta para JWT interno
JWT_SECRET="novamarket_super_secret_jwt_key_2026"
```

---

## 3. Configuración de Prisma (`schema.prisma`)

El archivo [backend/prisma/schema.prisma](file:///c:/Users/vikdu/OneDrive/Escritorio/Nova-Market-G8I2906/backend/prisma/schema.prisma) configura el proveedor de datos de la siguiente manera:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

- `url`: Utiliza el puerto con **PgBouncer** (`6543`) e incluye la opción `?pgbouncer=true`.
- `directUrl`: Conecta al puerto PostgreSQL directo (`5432`) permitiendo a Prisma administrar modificaciones de esquema (DDL) y migraciones que PgBouncer no soporta en modo transacción.

---

## 4. Módulos de Inicialización de Clientes

### 4.1 Prisma Client (`src/config/prisma.ts`)

Instancia singleton de Prisma Client con gestión de reutilización en desarrollo:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
```

### 4.2 Supabase JS Client (`src/config/supabase.ts`)

Instancia del cliente SDK oficial `@supabase/supabase-js` para operaciones directas de Supabase (como Storage de imágenes de productos):

```typescript
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const globalForSupabase = globalThis as unknown as { supabase: SupabaseClient };

export const supabase =
  globalForSupabase.supabase ||
  createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForSupabase.supabase = supabase;
}

export default supabase;
```

---

## 5. Scripts de Comandos y Flujo de Trabajo

### 5.1 Generar Tipos de Prisma Client
```bash
pnpm --filter backend run db:generate
```

### 5.2 Sincronizar el Esquema con Supabase
```bash
pnpm --filter backend run db:push
```

### 5.3 Poblar la Base de Datos (Seeding)
```bash
pnpm --filter backend run db:seed
```

### 5.4 Ejecutar el Servidor en Desarrollo
```bash
pnpm --filter backend run dev
```

---

## 6. Diagnóstico y Solución de Problemas Frecuentes

### 6.1 `Prepared statement does not exist`
- **Causa**: Ocurre al usar el pooler PgBouncer en Transaction Mode sin indicarle a Prisma que use `pgbouncer=true`.
- **Solución**: Asegurarse de que `DATABASE_URL` contenga el parámetro `?pgbouncer=true` al final.

### 6.2 Error de Conexión en `prisma db push` / `prisma migrate`
- **Causa**: PgBouncer bloquea comandos DDL (Data Definition Language) como `CREATE TABLE` o `ALTER TABLE`.
- **Solución**: Verificar que `directUrl = env("DIRECT_URL")` esté presente en `schema.prisma` y apuntando al puerto `5432` de Supabase.

### 6.3 Límite de Conexiones Excedido
- **Causa**: Demasiadas instancias locales abriendo conexiones directas.
- **Solución**: Utilizar el connection pooler de Supabase (`aws-0-us-east-1.pooler.supabase.com:6543`) para consultas runtime y mantener el patrón Singleton en `prisma.ts`.

---

## 7. Próximos Pasos

1. Implementar la carga de imágenes de productos conectando `src/config/supabase.ts` con Supabase Storage (Bucket `product-images`).
2. Configurar políticas de Row Level Security (RLS) en Supabase si se expone la API directamente.
