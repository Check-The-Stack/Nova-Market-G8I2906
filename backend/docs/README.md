# 📚 Documentación Técnica del Backend - NovaMarket

Bienvenido a la documentación técnica del módulo **Backend** de **NovaMarket**. 

Aquí encontrarás las especificaciones de arquitectura, endpoints, requerimientos y la guía de integración de la base de datos con Supabase y Prisma.

---

## 📑 Índice de Documentos

1. [01 - Análisis de Requerimientos Técnicos Funcionales](file:///c:/Users/vikdu/OneDrive/Escritorio/Nova-Market-G8I2906/backend/docs/01-analisis-requerimientos.md)  
   Especificación del propósito, alcance del backend, actores del sistema (Cliente y Administrador) y lista de funcionalidades.

2. [02 - Especificación de Endpoints API](file:///c:/Users/vikdu/OneDrive/Escritorio/Nova-Market-G8I2906/backend/docs/02-endpoints-api.md)  
   Contrato de comunicación REST API, incluyendo rutas, métodos HTTP, payloads de entrada/salida y respuestas de error para Auth, Productos, Categorías, Carrito y Ordenes.

3. [03 - Propuesta de Arquitectura Backend](file:///c:/Users/vikdu/OneDrive/Escritorio/Nova-Market-G8I2906/backend/docs/03-arquitectura-backend.md)  
   Definición de capas de la aplicación (Controllers, Services, Middlewares, Prisma ORM, PostgreSQL), flujo de peticiones y buenas prácticas.

4. [04 - Integración de Supabase con Prisma ORM](file:///c:/Users/vikdu/OneDrive/Escritorio/Nova-Market-G8I2906/backend/docs/04-integracion-supabase-prisma.md)  
   Guía de configuración del cliente de Prisma, cliente de Supabase SDK, gestión de Connection Pooling (PgBouncer) vs Conexiones Directas para migraciones, variables de entorno y solución de problemas.

---

## 🛠️ Stack del Backend

| Tecnología | Propósito |
|------------|-----------|
| **Node.js** | Entorno de ejecución JavaScript / TypeScript |
| **Express** | Framework web para API REST |
| **TypeScript** | Lenguaje tipado |
| **Prisma ORM** | Mapeo objeto-relacional e interacción con PostgreSQL |
| **Supabase** | Servicio PostgreSQL en la nube, Storage & Auth |
| **JWT & Bcrypt** | Autenticación y hash seguro de contraseñas |
