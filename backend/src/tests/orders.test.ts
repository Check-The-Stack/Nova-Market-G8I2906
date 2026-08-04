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
    findMany: jest.fn<any>(),
    findUnique: jest.fn<any>(),
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
const otherCustomerToken = jwt.sign({ id: 'other-uuid', email: 'other@novamarket.com', role: 'customer' }, JWT_SECRET);
const adminToken = jwt.sign({ id: 'admin-uuid', email: 'admin@novamarket.com', role: 'admin' }, JWT_SECRET);

describe('Orders Endpoints', () => {
  beforeEach(() => {
    prismaMock.$transaction.mockImplementation((cb: any) => cb(prismaMock));
    jest.clearAllMocks();
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

  describe('GET /api/orders', () => {
    it('should retrieve orders for the authenticated customer', async () => {
      const mockOrders = [
        { id: 'order-1', userId: 'customer-uuid', total: 100, status: 'pending', items: [] },
      ];

      prismaMock.order.findMany.mockResolvedValue(mockOrders);

      const res = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].id).toBe('order-1');
    });

    it('should retrieve orders for the authenticated customer via /my-orders pathname', async () => {
      const mockOrders = [
        { id: 'order-1', userId: 'customer-uuid', total: 100, status: 'pending', items: [] },
      ];

      prismaMock.order.findMany.mockResolvedValue(mockOrders);

      const res = await request(app)
        .get('/api/orders/my-orders')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe('GET /api/orders/:id', () => {
    const orderId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

    it('should successfully return order details if user is the owner', async () => {
      prismaMock.order.findUnique.mockResolvedValue({
        id: orderId,
        userId: 'customer-uuid',
        total: 150,
        status: 'pending',
        items: []
      });

      const res = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(orderId);
    });

    it('should successfully return order details if user is admin but not the owner', async () => {
      prismaMock.order.findUnique.mockResolvedValue({
        id: orderId,
        userId: 'customer-uuid',
        total: 150,
        status: 'pending',
        items: []
      });

      const res = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 403 if user is not the owner and not an admin', async () => {
      prismaMock.order.findUnique.mockResolvedValue({
        id: orderId,
        userId: 'customer-uuid',
        total: 150,
        status: 'pending',
        items: []
      });

      const res = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${otherCustomerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Acceso denegado');
    });
  });

  describe('GET /api/orders/admin', () => {
    it('should return all orders for admins', async () => {
      const mockOrders = [
        { id: 'order-1', userId: 'customer-1', total: 100 },
        { id: 'order-2', userId: 'customer-2', total: 200 },
      ];

      prismaMock.order.findMany.mockResolvedValue(mockOrders);

      const res = await request(app)
        .get('/api/orders/admin')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
    });

    it('should return 403 for regular customers trying to access admin route', async () => {
      const res = await request(app)
        .get('/api/orders/admin')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
    });
  });
});
