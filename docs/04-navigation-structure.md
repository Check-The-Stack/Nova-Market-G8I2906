# Estructura de Navegación

```
Home → Catálogo → Producto → Carrito → Checkout
  │         │
  └── Login/Register
         │
       Admin ── Dashboard
                ├── Products (CRUD)
                └── Orders (listado + estado)
```

## Rutas

| Ruta | Página | Acceso |
|------|--------|--------|
| / | Home | Público |
| /login | Login | Público |
| /register | Register | Público |
| /catalog | Catálogo | Público |
| /products/:slug | Detalle | Público |
| /cart | Carrito | Público |
| /checkout | Checkout | Usuarios |
| /admin | Dashboard | Admin |
| /admin/products | Admin Productos | Admin |
| /admin/orders | Admin Pedidos | Admin |

## Componentes

- **Navbar**: logo, enlaces, auth state, badge carrito
- **Footer**: info legal
- **Button/Input/Card**: primitivas UI
- **ProductCard/ProductGrid**: catálogo
- **CartItem/CartSummary**: carrito
