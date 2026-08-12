import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const prismaMock = {
  user: {
    findUnique: jest.fn<any>(),
  },
  product: {
    findUnique: jest.fn<any>(),
    findMany: jest.fn<any>(),
    count: jest.fn<any>(),
    create: jest.fn<any>(),
    update: jest.fn<any>(),
    delete: jest.fn<any>(),
  },
  order: {
    findUnique: jest.fn<any>(),
    findMany: jest.fn<any>(),
    create: jest.fn<any>(),
    update: jest.fn<any>(),
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
const adminToken = jwt.sign({ id: 'admin-uuid', email: 'admin@novamarket.com', role: 'admin' }, JWT_SECRET);
const customerToken = jwt.sign({ id: 'customer-uuid', email: 'customer@novamarket.com', role: 'customer' }, JWT_SECRET);

describe('Products Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/products', () => {
    it('should return a list of products', async () => {
      const mockProducts = [
        { id: '1', name: 'Product 1', slug: 'p1', description: 'Desc 1', price: 10, category: 'Cat', imageUrl: 'img', stock: 5, featured: false },
        { id: '2', name: 'Product 2', slug: 'p2', description: 'Desc 2', price: 20, category: 'Cat', imageUrl: 'img', stock: 10, featured: true }
      ];

      prismaMock.product.findMany.mockResolvedValue(mockProducts);

      const res = await request(app).get('/api/products');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
    });
  });

  describe('POST /api/products', () => {
    const newProduct = {
      name: 'New Product',
      slug: 'new-product',
      description: 'New Description',
      price: 150,
      category: 'Electronics',
      imageUrl: 'http://img.png',
      stock: 10,
      featured: true
    };

    it('should allow creation if user is admin', async () => {
      prismaMock.product.findUnique.mockResolvedValue(null);
      prismaMock.product.create.mockResolvedValue({ id: 'new-uuid', ...newProduct });

      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newProduct);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(newProduct.name);
    });
  });
});
