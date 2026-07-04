# Contexto del Proyecto — NovaMarket

## Stack
- **Runtime**: Node.js
- **Base de datos**: PostgreSQL
- **Package manager**: pnpm (no usar npm)
- **Frontend**: React 18 + TypeScript + Vite + Tailwind
- **Backend**: Express + TypeScript + Prisma
- **Auth**: JWT
- **Orquestación**: TurboRepo

## Reglas

### Commits
Descriptivos con formato `tipo: mensaje`. Tipos: feat, fix, refactor, style, docs, chore, test.

### Pull Requests
Crear issue → rama desde `develop` (`feat/x`) → PR contra `develop` con revisores.

### Antes de empezar
```bash
git pull && pnpm install
```

### Entorno
Variables en `.env`, archivo en `.gitignore`, usar `.env.example` como plantilla.

### Responsive
Mobile-first. Breakpoints Tailwind: sm(640), md(768), lg(1024), xl(1280). Formularios y tablas adaptables.

### Código
- TypeScript estricto, evitar `any`
- Componentes funcionales con hooks
- PascalCase para componentes, camelCase para servicios
- Estado con Context API (no Redux)
- Llamadas API en `services/`, no en componentes
- Errores con formato `{ success: false, error: string }`
