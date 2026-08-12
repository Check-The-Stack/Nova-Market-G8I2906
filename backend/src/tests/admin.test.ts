import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const prismaMock = {
  user: {
    count: jest.fn<any>(),
  },
  product: {
    count: jest.fn<any>(),
  },
  order: {
    count: jest.fn<any>(),
    groupBy: jest.fn<any>(),
    findMany: jest.fn<any>(),
    findUnique: jest.fn<any>(),
    update: jest.fn<any>(),
  },
  $transaction: jest.fn<any>((cb: any) => cb(prismaMock)),
};

jest.unstable_mockModule('../config/prisma.js', () => ({
  __esModule: true,
  prisma: prismaMock,
}));

// Importar dinámicamente para que el mock surta efecto en ESM
const { default: app } = await import('../app.js');
const { default: request } = await import('supertest');
const { default: jwt } = await import('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const adminToken = jwt.sign({ id: 'admin-uuid', email: 'admin@novamarket.com', role: 'admin' }, JWT_SECRET);
const customerToken = jwt.sign({ id: 'customer-uuid', email: 'customer@novamarket.com', role: 'customer' }, JWT_SECRET);

describe('Admin Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/admin/stats', () => {
    it('should return 401 if user is not authenticated', async () => {
      const res = await request(app).get('/api/admin/stats');
      expect(res.status).toBe(401);
    });

    it('should return 403 if user is not an admin', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.status).toBe(403);
    });

    it('should return stats successfully if user is admin', async () => {
      prismaMock.user.count.mockResolvedValue(10);
      prismaMock.product.count.mockResolvedValue(25);
      prismaMock.order.count.mockResolvedValue(5);
      prismaMock.order.groupBy.mockResolvedValue([
        {
          status: 'paid',
          _count: { id: 3 },
          _sum: { total: 300 },
        },
        {
          status: 'pending',
          _count: { id: 2 },
          _sum: { total: 100 },
        },
      ]);
      prismaMock.order.findMany.mockResolvedValue([
        { id: 'order-1', total: 100, status: 'paid', user: { name: 'User 1' } },
      ]);

      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalUsers).toBe(10);
      expect(res.body.data.totalProducts).toBe(25);
      expect(res.body.data.totalOrders).toBe(5);
      expect(res.body.data.totalRevenue).toBe(400); // 300 + 100
      expect(res.body.data.statusBreakdown).toEqual({ paid: 3, pending: 2 });
      expect(res.body.data.latestOrders).toHaveLength(1);
    });
  });

  describe('PUT /api/admin/orders/:id/status', () => {
    const orderId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

    it('should return 403 if user is not an admin', async () => {
      const res = await request(app)
        .put(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ status: 'paid' });
      expect(res.status).toBe(403);
    });

    it('should return 400 if status is invalid', async () => {
      const res = await request(app)
        .put(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'invalid-status' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Estado no válido');
    });

    it('should return 404 if order does not exist', async () => {
      prismaMock.order.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .put(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'paid' });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Pedido no encontrado');
    });

    it('should successfully update order status', async () => {
      prismaMock.order.findUnique.mockResolvedValue({ id: orderId, status: 'pending' });
      prismaMock.order.update.mockResolvedValue({ id: orderId, status: 'shipped' });

      const res = await request(app)
        .put(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'shipped' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('shipped');
      expect(prismaMock.order.update).toHaveBeenCalledTimes(1);
    });
  });
});
