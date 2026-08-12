import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string({
    required_error: 'El ID del producto es obligatorio',
  }).uuid('El ID del producto debe ser un UUID válido'),
  quantity: z.number({
    required_error: 'La cantidad es obligatoria',
  }).int('La cantidad debe ser un número entero').positive('La cantidad debe ser mayor a 0'),
});

export const updateCartItemSchema = z.object({
  quantity: z.number({
    required_error: 'La cantidad es obligatoria',
  }).int('La cantidad debe ser un número entero').positive('La cantidad debe ser mayor a 0'),
});
