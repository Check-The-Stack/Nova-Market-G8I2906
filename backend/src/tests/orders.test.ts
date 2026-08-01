import { jest, describe, it, expect, beforeEach } from '@jest/globals';

export const prismaMock = {
  user: {
    findUnique: jest.fn<any>(),
  },
  product: {
    findUnique: jest.fn<any>(),
    update: jest.fn<any>(),
  },
  order: {
    create: jest.fn<any>(),
  },
  $transaction: jest.fn<any>((cb: any) => cb(prismaMock)),
};

jest.unstable_mockModule('../config/prisma.js', () => ({
  __esModule: true,
  prisma: prismaMock,
}));

const { default: app } = await import('../app.js');
const { default: request } = await import('supertest');
const { default: jwt } = await import('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const customerToken = jwt.sign({ id: 'customer-uuid', email: 'customer@novamarket.com', role: 'customer' }, JWT_SECRET);

describe('Orders Endpoints', () => {
  beforeEach(() => {
    prismaMock.$transaction.mockImplementation((cb: any) => cb(prismaMock));
  });

  describe('POST /api/orders', () => {
    const validOrderPayload = {
      items: [
        { productId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', quantity: 2 }
      ],
      shippingAddress: {
        street: 'Av. Siempreviva 742',
        city: 'Springfield',
        state: 'Oregon',
        zipCode: '12345',
        country: 'OTHER'
      }
    };

    it('should create an order successfully if stock is available', async () => {
      // Mock del producto encontrado con stock suficiente
      prismaMock.product.findUnique.mockResolvedValue({
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        name: 'Product 1',
        price: 100,
        stock: 5
      });

      // Mock de la transacción exitosa de Prisma que actualiza stock y crea la orden
      prismaMock.product.update.mockResolvedValue({});
      prismaMock.order.create.mockResolvedValue({
        id: 'order-uuid',
        userId: 'customer-uuid',
        total: 200,
        status: 'pending',
        street: 'Av. Siempreviva 742',
        city: 'Springfield',
        state: 'Oregon',
        zipCode: '12345',
        country: 'OTHER',
        items: [
          {
            id: 'item-uuid',
            productId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            quantity: 2,
            price: 100
          }
        ]
      });

      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(validOrderPayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.total).toBe(200);
    });

    it('should fail to create order if stock is insufficient', async () => {
      // Mock del producto con stock insuficiente (tiene 1, pedimos 2)
      prismaMock.product.findUnique.mockResolvedValue({
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        name: 'Product 1',
        price: 100,
        stock: 1
      });

      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(validOrderPayload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Stock insuficiente');
    });
  });
});
