import { z } from 'zod';

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string({
        required_error: 'El ID del producto es obligatorio',
      }).uuid('El ID del producto debe ser un UUID válido'),
      quantity: z.number({
        required_error: 'La cantidad es obligatoria',
      }).int('La cantidad debe ser un número entero').positive('La cantidad debe ser mayor a 0'),
    })
  ).min(1, 'La orden debe contener al menos un producto'),
  shippingAddress: z.object({
    street: z.string({
      required_error: 'La calle es obligatoria',
    }).min(3, 'La calle debe tener al menos 3 caracteres'),
    city: z.string({
      required_error: 'La ciudad es obligatoria',
    }).min(2, 'La ciudad debe tener al menos 2 caracteres'),
    state: z.string({
      required_error: 'El estado/provincia es obligatorio',
    }).min(2, 'El estado/provincia debe tener al menos 2 caracteres'),
    zipCode: z.string({
      required_error: 'El código postal es obligatorio',
    }).min(3, 'El código postal debe tener al menos 3 caracteres'),
    country: z.enum(['AR', 'CL', 'MX', 'CO', 'PE', 'UY', 'OTHER']).optional().default('AR'),
  }, {
    required_error: 'La dirección de envío es obligatoria',
  }),
});
