# NovaMarket

Plataforma e-commerce MVP para venta de productos tecnológicos.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + TypeScript + Vite + Tailwind |
| Backend | Node.js + Express + TypeScript + Prisma |
| DB | PostgreSQL |
| Auth | JWT |
| Project | [Trello](https://trello.com/b/yHZs5QmF) |

## Estructura

```
nova-market/
├── frontend/     # React SPA
├── backend/      # Express REST API + Prisma
├── docs/         # Documentación, análisis, prototipos (UX/UI)
├── tests/        # Test plan, casos de prueba, reportes (QA)
└── README.md
```

## Requisitos

- Node.js >= 18
- pnpm >= 8

## Instalación

```bash
pnpm install
cd backend
cp .env.example .env
# Configurar DATABASE_URL y JWT_SECRET
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

## Equipo

- Frontend: componentes, estado, rutas, estilos
- Backend: API, Prisma, auth, validación
- UX/UI: investigación, prototipos, diseño visual
- QA: test plan, casos de prueba, reportes
