# 🏗️ Propuesta de Arquitectura del Backend

**Proyecto:** NovaMarket (MVP)  
**Módulo:** Backend  
**Versión:** 1.0  
**Fecha:** 06/07/2026  
**Autor:** Victor Duarte

---

# 1. Introducción

Este documento describe la arquitectura técnica propuesta para el backend de NovaMarket.

Su propósito es definir la estructura general del sistema, las tecnologías seleccionadas y la forma en que los distintos componentes interactúan para garantizar un desarrollo mantenible, escalable y seguro.

---

# 2. Objetivos de la Arquitectura

La arquitectura del backend tiene como finalidad proporcionar una base sólida para el desarrollo del MVP, asegurando una correcta organización del código y una comunicación eficiente con el frontend.

Los principales objetivos son:

- Implementar una API REST siguiendo buenas prácticas.
- Mantener una separación clara entre las distintas capas de la aplicación.
- Facilitar el mantenimiento y la escalabilidad del proyecto.
- Gestionar el acceso a la base de datos mediante Prisma ORM.
- Proteger los recursos mediante autenticación basada en JWT.
- Centralizar la lógica de negocio en servicios reutilizables.

---

# 3. Stack Tecnológico

| Tecnología | Función |
|------------|----------|
| Node.js | Entorno de ejecución |
| Express | Framework para la API REST |
| TypeScript | Lenguaje de programación |
| PostgreSQL | Base de datos relacional |
| Prisma ORM | Acceso a la base de datos |
| JWT | Autenticación |
| pnpm | Gestión de dependencias |
| TurboRepo | Administración del monorepo |

---

# 4. Arquitectura General

El backend actuará como intermediario entre el frontend y la base de datos.

```text
                 Usuario
                    │
                    ▼
        Frontend (Next.js)
                    │
             HTTP / HTTPS
                    │
                    ▼
          API REST (Express)
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
 Controllers     Services   Middlewares
                    │
                    ▼
             Prisma ORM
                    │
                    ▼
              PostgreSQL
```

