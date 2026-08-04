# Pruebas de Integración del Carrito de Compra (API Cart)

Este documento detalla la cobertura, estrategia de mocking y los casos de prueba implementados para validar la funcionalidad del carrito de compra.

---

## 1. Archivo de Pruebas
Las pruebas se encuentran en el archivo:
[backend/src/tests/cart.test.ts](file:///c:/Users/vikdu/OneDrive/Escritorio/Nova-Market-G8I2906/backend/src/tests/cart.test.ts)

---

## 2. Endpoints Cubiertos

### 2.1 GET `/api/cart`
- **Caso 1**: Retornar el carrito existente de un usuario autenticado con sus respectivos ítems y detalles del producto.
- **Caso 2**: Crear y retornar un carrito nuevo y vacío de forma automática si el usuario no posee uno al momento de hacer la consulta.

### 2.2 POST `/api/cart/items`
- **Caso 1**: Agregar un producto nuevo al carrito con éxito.
- **Caso 2**: Retornar error `404` si el producto que se intenta agregar no existe en la base de datos.
- **Caso 3**: Retornar error `400` ("Stock insuficiente") si la cantidad solicitada excede el stock disponible del producto.

### 2.3 PUT `/api/cart/items/:productId`
- **Caso 1**: Actualizar exitosamente la cantidad de un ítem existente en el carrito.
- **Caso 2**: Retornar error `400` ("Stock insuficiente") si la cantidad a actualizar supera el stock disponible.

### 2.4 DELETE `/api/cart/items/:productId`
- **Caso 1**: Eliminar correctamente un producto del carrito.

---

## 3. Estrategia de Mocking (Prisma ORM)
Dado que las pruebas de integración no deben interactuar directamente con la base de datos física para mantener velocidad y consistencia, se mockea la instancia de Prisma Client mediante `jest.unstable_mockModule`:

- Se define `prismaMock` para simular las llamadas a los modelos de base de datos (`user`, `product`, `cart`, `cartItem`).
- Se utiliza el encadenamiento de respuestas con `.mockResolvedValueOnce()` para controlar el flujo secuencial en endpoints que realizan múltiples consultas a la misma tabla (como verificar la existencia del carrito y luego retornarlo actualizado).

---

## 4. Ejecución de las Pruebas
Para correr el suite de pruebas en el backend, utiliza el siguiente comando desde la raíz del proyecto:

```bash
pnpm --filter backend test
```
