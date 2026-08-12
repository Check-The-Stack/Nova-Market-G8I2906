import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string({
    required_error: 'El nombre es obligatorio',
  }).min(2, 'El nombre debe tener al menos 2 caracteres'),
  slug: z.string({
    required_error: 'El slug es obligatorio',
  }).regex(/^[a-z0-9-]+$/, 'El slug debe contener únicamente letras minúsculas, números y guiones'),
  description: z.string({
    required_error: 'La descripción es obligatoria',
  }).min(10, 'La descripción debe tener al menos 10 caracteres'),
  price: z.number({
    required_error: 'El precio es obligatorio',
    invalid_type_error: 'El precio debe ser un número',
  }).positive('El precio debe ser mayor a 0'),
  category: z.string({
    required_error: 'La categoría es obligatoria',
  }).min(2, 'La categoría debe tener al menos 2 caracteres'),
  imageUrl: z.string({
    required_error: 'La URL de la imagen es obligatoria',
  }).url('La URL de la imagen no es válida'),
  stock: z.number().int('El stock debe ser un número entero').nonnegative('El stock no puede ser negativo').optional().default(0),
  featured: z.boolean().optional().default(false),
});

export const updateProductSchema = createProductSchema.partial();
