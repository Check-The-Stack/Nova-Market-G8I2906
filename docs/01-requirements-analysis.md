# Análisis de Requerimientos Técnicos

## Funcionalidades MVP

| Módulo | Funcionalidad | Prioridad |
|--------|---------------|-----------|
| Autenticación | Registro de usuario | Alta |
| Autenticación | Inicio de sesión | Alta |
| Autenticación | Perfil de usuario | Media |
| Catálogo | Listar productos | Alta |
| Catálogo | Filtrar por categoría | Alta |
| Catálogo | Buscar productos | Media |
| Catálogo | Detalle de producto | Alta |
| Carrito | Agregar producto | Alta |
| Carrito | Modificar cantidad | Alta |
| Carrito | Eliminar producto | Alta |
| Checkout | Formulario de dirección | Alta |
| Checkout | Confirmación de pedido | Alta |
| Admin | CRUD de productos | Alta |
| Admin | Visualizar pedidos | Media |
| Admin | Actualizar estado pedido | Media |

## Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`

### Products
- `GET /api/products?category=&search=&page=&limit=`
- `GET /api/products/:slug`

### Orders
- `POST /api/orders`
- `GET /api/orders`

### Admin (protegido + admin)
- `GET /api/admin/products`
- `POST /api/admin/products`
- `PUT /api/admin/products/:id`
- `DELETE /api/admin/products/:id`
- `GET /api/admin/orders`
- `PUT /api/admin/orders/:id/status`

## Modelos

- **User**: id, name, email, password, role, createdAt, updatedAt
- **Product**: id, name, slug, description, price, category, imageUrl, stock, featured, createdAt, updatedAt
- **Order**: id, userId, items[{productId, quantity, price}], total, status, shippingAddress, createdAt, updatedAt
