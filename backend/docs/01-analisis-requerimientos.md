# 📄 Análisis de Requerimientos Técnicos Funcionales

**Proyecto:** NovaMarket (MVP)  
**Módulo:** Backend  
**Versión:** 1.0  
**Fecha:** 06/07/2026  
**Autor:** Victor Duarte

---

# 1. Introducción

## Propósito

Este documento tiene como objetivo identificar y documentar los requerimientos técnicos funcionales del backend para el desarrollo del MVP (Minimum Viable Product) de **NovaMarket**.

El análisis servirá como base para el diseño de la arquitectura, la implementación de la API REST, el modelo de datos y la lógica de negocio del sistema.

---

# 2. Contexto del Proyecto

NovaMarket es una empresa dedicada a la venta de productos tecnológicos, como accesorios, periféricos y gadgets.

Actualmente comercializa sus productos a través de redes sociales y marketplaces externos, lo que genera limitaciones en la gestión del catálogo, el seguimiento de pedidos y la experiencia de compra de los clientes.

El objetivo del proyecto es desarrollar una plataforma web propia que permita centralizar estas operaciones mediante un sistema de comercio electrónico.

---

# 3. Objetivo del Backend

El backend será responsable de proporcionar una API REST segura y escalable que permita:

- Registrar y autenticar usuarios.
- Gestionar el catálogo de productos.
- Administrar las categorías.
- Gestionar el carrito de compras.
- Registrar pedidos.
- Permitir la administración del catálogo por parte de los administradores.
- Garantizar la comunicación entre el frontend y la base de datos.

---

# 4. Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| Node.js | Runtime |
| Express | Framework Backend |
| TypeScript | Lenguaje |
| PostgreSQL | Base de Datos |
| Prisma ORM | Acceso a datos |
| JWT | Autenticación |
| pnpm | Gestor de paquetes |
| TurboRepo | Monorepo |

---

# 5. Actores del Sistema

## Cliente

Usuario que utiliza la plataforma para realizar compras.

### Funcionalidades

- Registrarse.
- Iniciar sesión.
- Consultar el catálogo.
- Filtrar productos por categoría.
- Agregar productos al carrito.
- Modificar cantidades del carrito.
- Eliminar productos del carrito.
- Finalizar una compra.

---

## Administrador

Usuario encargado de administrar el contenido de la tienda.

### Funcionalidades

- Iniciar sesión.
- Crear productos.
- Editar productos.
- Eliminar productos.
- Consultar pedidos realizados.

---