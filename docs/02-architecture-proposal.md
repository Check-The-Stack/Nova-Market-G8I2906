# Propuesta de Arquitectura

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| DB | PostgreSQL via Supabase (Prisma ORM) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Validación | Zod |
| Paquetería | pnpm workspace |

## Diagrama

```
Browser → Vite proxy → Express API → Prisma → PostgreSQL
  (React)    /api      (REST)         (ORM)
```

## Decisiones

- **Prisma sobre Mongoose**: Tipado fuerte generado desde schema, migrations fáciles, mejor DX.
- **Context API sobre Redux**: Suficiente para MVP (carrito + auth).
- **Carrito en frontend**: Context API con useReducer. Sin persistencia en backend para el MVP.
- **JWT sin refresh tokens**: Token 7d, almacenado en localStorage. Simple para MVP.

## Estructura

```
nova-market/
├── frontend/src/
│   ├── components/   # layout, ui, product, cart
│   ├── pages/        # Home, Login, Register, Catalog, Cart, Checkout, Admin/*
│   ├── context/      # AuthContext, CartContext
│   └── services/     # api, productService, orderService
├── backend/src/
│   ├── routes/       # auth, products, orders, admin
│   ├── middleware/   # auth (JWT protect, adminOnly), errorHandler
│   └── config/       # prisma client
├── docs/             # Documentación, análisis, prototipos, docs
└── tests/            # Test plan, casos de prueba, reportes
```
