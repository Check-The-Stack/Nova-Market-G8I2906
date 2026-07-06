# 📡 Especificación de Endpoints API

**Proyecto:** NovaMarket (MVP)  
**Módulo:** Backend  
**Versión:** 1.0  
**Fecha:** 06/07/2026  
**Autor:** Victor Duarte

---

# 1. Introducción

Este documento define los endpoints de la API REST que serán implementados por el backend de NovaMarket.

Su objetivo es establecer un contrato de comunicación entre el frontend y el backend, especificando las rutas disponibles, los métodos HTTP, los parámetros esperados, las respuestas y los códigos de estado.

---

# 2. Convenciones de la API

## URL Base

```
/api
```

## Formato de Respuesta

### Respuesta Exitosa

```json
{
    "success": true,
    "data": {}
}
```

### Respuesta de Error

```json
{
    "success": false,
    "error": "Descripción del error"
}
```

---

# 3. Autenticación

La autenticación se realizará mediante **JWT (JSON Web Token)**.

Las rutas protegidas deberán recibir el siguiente encabezado:

```
Authorization: Bearer <token>
```

---

# 4. Endpoints

## 4.1 Autenticación

### Registrar Usuario

| Campo | Valor |
|--------|--------|
| Método | POST |
| Endpoint | `/api/auth/register` |
| Autenticación | No |

### Body

```json
{
    "name": "Juan Pérez",
    "email": "juan@email.com",
    "password": "12345678"
}
```

### Respuesta

```json
{
    "success": true,
    "data": {
        "message": "Usuario registrado correctamente"
    }
}
```

### Códigos HTTP

| Código | Descripción |
|---------|-------------|
|201|Usuario creado|
|400|Datos inválidos|
|409|Email ya registrado|

---

### Login

| Campo | Valor |
|--------|--------|
| Método | POST |
| Endpoint | `/api/auth/login` |
| Autenticación | No |

### Body

```json
{
    "email":"juan@email.com",
    "password":"12345678"
}
```

### Respuesta

```json
{
    "success": true,
    "data": {
        "token":"JWT",
        "user":{
            "id":1,
            "name":"Juan Pérez",
            "role":"CLIENT"
        }
    }
}
```

### Códigos HTTP

| Código | Descripción |
|---------|-------------|
|200|Login correcto|
|401|Credenciales inválidas|

---

## 4.2 Productos

### Obtener Catálogo

| Campo | Valor |
|--------|--------|
| Método | GET |
| Endpoint | `/api/products` |
| Autenticación | No |

### Query Params

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
|category|string|Filtrar por categoría|
|search|string|Buscar productos|
|page|number|Número de página|
|limit|number|Cantidad de registros|

### Respuesta

```json
{
    "success": true,
    "data":[]
}
```

---

### Obtener Producto

| Método | GET |
|---------|-----|
| Endpoint | `/api/products/:id` |

---

### Crear Producto

| Método | POST |
|---------|------|
| Endpoint | `/api/products` |
| Autenticación | ADMIN |

---

### Actualizar Producto

| Método | PUT |
|---------|-----|
| Endpoint | `/api/products/:id` |
| Autenticación | ADMIN |

---

### Eliminar Producto

| Método | DELETE |
|---------|--------|
| Endpoint | `/api/products/:id` |
| Autenticación | ADMIN |

---

## 4.3 Categorías

### Obtener Categorías

| Método | GET |
|---------|-----|
| Endpoint | `/api/categories` |

---

## 4.4 Carrito

### Obtener Carrito

| Método | GET |
|---------|-----|
| Endpoint | `/api/cart` |
| Autenticación | CLIENT |

---

### Agregar Producto

| Método | POST |
|---------|------|
| Endpoint | `/api/cart/items` |
| Autenticación | CLIENT |

---

### Actualizar Cantidad

| Método | PUT |
|---------|-----|
| Endpoint | `/api/cart/items/:productId` |
| Autenticación | CLIENT |

---

### Eliminar Producto

| Método | DELETE |
|---------|--------|
| Endpoint | `/api/cart/items/:productId` |
| Autenticación | CLIENT |

---

## 4.5 Pedidos

### Crear Pedido

| Método | POST |
|---------|------|
| Endpoint | `/api/orders` |
| Autenticación | CLIENT |

---

### Obtener Mis Pedidos

| Método | GET |
|---------|-----|
| Endpoint | `/api/orders` |
| Autenticación | CLIENT |

---

### Obtener Pedido

| Método | GET |
|---------|-----|
| Endpoint | `/api/orders/:id` |
| Autenticación | CLIENT |

---

### Obtener Todos los Pedidos

| Método | GET |
|---------|-----|
| Endpoint | `/api/admin/orders` |
| Autenticación | ADMIN |

---

# 5. Códigos HTTP Utilizados

| Código | Significado |
|---------|-------------|
|200|Solicitud exitosa|
|201|Recurso creado|
|204|Recurso eliminado|
|400|Solicitud incorrecta|
|401|No autenticado|
|403|Acceso denegado|
|404|Recurso no encontrado|
|409|Conflicto|
|500|Error interno del servidor|

---

# 6. Resumen

La API seguirá una arquitectura REST utilizando recursos claramente definidos, respuestas estandarizadas en formato JSON y autenticación mediante JWT.

Todos los endpoints administrativos requerirán permisos de administrador, mientras que las operaciones de compra estarán disponibles únicamente para usuarios autenticados.