# NovaMarket

Plataforma e-commerce MVP para venta de productos tecnológicos.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + TypeScript + Vite + Tailwind |
| Backend | Node.js + Express + TypeScript + Prisma |
| DB | PostgreSQL |
| Auth | JWT |

## Requisitos

- Node.js >= 18
- pnpm >= 8

## Instalación

```bash
pnpm install
cd backend
cp .env.example .env   # configurar DATABASE_URL y JWT_SECRET
npx prisma generate
npx prisma db push
npx prisma db seed
```

## Desarrollo

```bash
pnpm dev
```

Frontend → http://localhost:3000
Backend  → http://localhost:4000

## Documentación

- `docs/` — Requerimientos, arquitectura, proto-persona, navegación
- `tests/` — Test plan y casos de prueba
- `CONTEXT.md` — Reglas del proyecto para el equipo
