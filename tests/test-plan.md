# Test Plan — NovaMarket MVP

## 1. Objetivos
Validar flujo completo de compra sin errores críticos.

## 2. Alcance
**Sí se prueba**: autenticación, catálogo, carrito, checkout, admin CRUD.
**No se prueba**: pagos reales, integraciones externas, rendimiento bajo carga.

## 3. Tipos de prueba
- Funcionales (end-to-end)
- Integración (API)
- Usabilidad (flujo compra)
- Regresión

## 4. Criterios de aceptación
- Registro en < 30s
- Filtrar catálogo en 1 click
- Agregar al carrito en 2 clicks
- Checkout en < 2 min
- Admin crea producto con nombre, precio, categoría e imagen

## 5. Casos de prueba

### TC-001: Registro exitoso
1. Ir a /register
2. Completar nombre, email, contraseña
3. Click "Crear cuenta"
4. **Esperado**: Redirige a Home, navbar muestra nombre

### TC-002: Login exitoso
1. Ir a /login
2. Ingresar credenciales válidas
3. Click "Iniciar sesión"
4. **Esperado**: Redirige a Home

### TC-003: Filtrar por categoría
1. Ir a /catalog
2. Click "Periféricos"
3. **Esperado**: Solo productos de esa categoría

### TC-004: Agregar al carrito
1. Desde /catalog, click "Agregar"
2. **Esperado**: Badge del carrito se actualiza

### TC-005: Checkout completo
1. Tener items en carrito
2. Ir a /checkout
3. Completar dirección
4. Click "Confirmar pedido"
5. **Esperado**: Carrito vacío, redirige a Home

## 6. Cronograma

| Semana | Actividad |
|--------|-----------|
| 1 | Definir test plan y casos |
| 2-3 | Pruebas de integración |
| 4-5 | Pruebas funcionales |
| 6 | Regresión y usabilidad |
| 7 | Corrección de bugs |
| 8 | Pruebas finales |
