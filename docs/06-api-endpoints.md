# Especificación y Explicación de Endpoints (API REST NovaMarket)

Este documento contiene la especificación completa de todos los endpoints implementados en el servidor backend de **NovaMarket**. 

---

## 1. Módulo de Autenticación (`/api/auth`)

### `POST /api/auth/register`
- **Función**: Registra un nuevo usuario en la plataforma.
- **Acceso**: Público (Sin autenticación).
- **Body JSON**:
  ```json
  {
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "miPasswordSeguro123",
    "role": "customer" // u "admin"
  }
  ```
- **Respuesta (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "uuid-1234",
        "name": "Juan Pérez",
        "email": "juan@example.com",
        "role": "customer",
        "createdAt": "2026-07-21T22:00:00.000Z"
      },
      "token": "eyJhbGciOi..."
    }
  }
  ```

### `POST /api/auth/login`
- **Función**: Valida las credenciales ingresadas y genera un Token JWT de sesión válido por 7 días.
- **Acceso**: Público.
- **Body JSON**:
  ```json
  {
    "email": "juan@example.com",
    "password": "miPasswordSeguro123"
  }
  ```
- **Respuesta (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "uuid-1234",
        "name": "Juan Pérez",
        "email": "juan@example.com",
        "role": "customer"
      },
      "token": "eyJhbGciOi..."
    }
  }
  ```

### `GET /api/auth/me`
- **Función**: Obtiene la información del perfil del usuario actualmente autenticado.
- **Acceso**: Requerido Header `Authorization: Bearer <TOKEN_JWT>`.
- **Respuesta (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid-1234",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "customer",
      "createdAt": "2026-07-21T22:00:00.000Z"
    }
  }
  ```

---

## 2. Módulo de Productos (`/api/products`)

### `GET /api/products`
- **Función**: Obtiene el listado completo de productos del catálogo. Admite filtros por categoría, búsqueda textual y productos destacados.
- **Acceso**: Público.
- **Query Params opcionales**:
  - `category`: Filtra por categoría (ej: `tecnologia`).
  - `search`: Búsqueda por coincidencia en nombre o descripción.
  - `featured`: `true` para traer productos destacados de la home.
- **Respuesta (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "prod-001",
        "name": "Notebook Pro 15",
        "slug": "notebook-pro-15",
        "description": "Potente notebook para desarrollo",
        "price": 1250000,
        "category": "tecnologia",
        "imageUrl": "https://imagen.com/notebook.jpg",
        "stock": 10,
        "featured": true
      }
    ]
  }
  ```

### `GET /api/products/:id`
- **Función**: Devuelve el detalle completo de un producto específico mediante su ID.
- **Acceso**: Público.
- **Respuesta (200 OK)**:
  ```json
  {
    "success": true,
    "data": { "id": "prod-001", "name": "Notebook Pro 15", ... }
  }
  ```

### `POST /api/products`
- **Función**: Crea un nuevo producto en la tienda.
- **Acceso**: Privado (Requiere JWT + Rol `admin`).
- **Body JSON**:
  ```json
  {
    "name": "Monitor 4K 27",
    "slug": "monitor-4k-27",
    "description": "Monitor UHD 144Hz",
    "price": 450000,
    "category": "monitores",
    "imageUrl": "https://imagen.com/monitor.jpg",
    "stock": 15,
    "featured": true
  }
  ```
- **Respuesta (201 Created)**.

### `PUT /api/products/:id`
- **Función**: Modifica los datos o stock de un producto existente.
- **Acceso**: Privado (Requiere JWT + Rol `admin`).

### `DELETE /api/products/:id`
- **Función**: Elimina un producto de la base de datos de Supabase.
- **Acceso**: Privado (Requiere JWT + Rol `admin`).

---

## 3. Módulo de Órdenes (`/api/orders`)

### `POST /api/orders`
- **Función**: Procesa una compra enviando la lista de ítems del carrito y la dirección de entrega. Descuenta automáticamente el stock de cada producto involucrado mediante transacciones en Supabase.
- **Acceso**: Privado (Requiere JWT).
- **Body JSON**:
  ```json
  {
    "items": [
      { "productId": "prod-001", "quantity": 2 }
    ],
    "shippingAddress": {
      "street": "Av. Corrientes 1234",
      "city": "Buenos Aires",
      "state": "CABA",
      "zipCode": "1043",
      "country": "AR"
    }
  }
  ```
- **Respuesta (201 Created)**: Retorna la orden creada con su total calculado y sus ítems enlazados.

### `GET /api/orders/my-orders`
- **Función**: Lista el historial de compras y pedidos realizados por el cliente autenticado.
- **Acceso**: Privado (Requiere JWT).

### `GET /api/orders/admin`
- **Función**: Permite al administrador visualizar todas las compras realizadas en la plataforma por cualquier usuario.
- **Acceso**: Privado (Requiere JWT + Rol `admin`).
