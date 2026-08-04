# Endpoints del Panel de Administración (API Admin)

Este documento detalla los nuevos endpoints expuestos para la gestión administrativa de **NovaMarket**.

---

## 1. Endpoints Implementados

### 1.1 GET `/api/admin/stats`
- **Función**: Obtiene métricas generales y de facturación para el dashboard principal de administración.
- **Acceso**: Privado (Requiere JWT + Rol `admin`).
- **Respuesta (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "totalUsers": 10,
      "totalProducts": 25,
      "totalOrders": 5,
      "totalRevenue": 400,
      "statusBreakdown": {
        "paid": 3,
        "pending": 2
      },
      "latestOrders": [
        {
          "id": "order-uuid",
          "total": 100,
          "status": "paid",
          "user": {
            "id": "user-uuid",
            "name": "Juan Pérez",
            "email": "juan@example.com"
          },
          "createdAt": "2026-08-04T20:00:00.000Z"
        }
      ]
    }
  }
  ```

### 1.2 PUT `/api/admin/orders/:id/status`
- **Función**: Permite actualizar el estado de una orden.
- **Acceso**: Privado (Requiere JWT + Rol `admin`).
- **Body JSON**:
  ```json
  {
    "status": "shipped" // Valores permitidos: 'pending', 'paid', 'shipped', 'cancelled'
  }
  ```
- **Respuesta (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "order-uuid",
      "status": "shipped",
      "user": {
        "id": "user-uuid",
        "name": "Juan Pérez",
        "email": "juan@example.com"
      },
      "items": [
        {
          "id": "item-uuid",
          "productId": "prod-uuid",
          "quantity": 1,
          "price": 100,
          "product": {
            "name": "Producto 1"
          }
        }
      ]
    }
  }
  ```

---

## 2. Archivo de Pruebas
Las pruebas se encuentran en el archivo:
[backend/src/tests/admin.test.ts](file:///c:/Users/vikdu/OneDrive/Escritorio/Nova-Market-G8I2906/backend/src/tests/admin.test.ts)

---

## 3. Ejecución de las Pruebas
Para correr el suite de pruebas en el backend, utiliza el siguiente comando desde la raíz del proyecto:

```bash
pnpm --filter backend test
```
