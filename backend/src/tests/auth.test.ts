import { jest, describe, it, expect, beforeEach } from '@jest/globals';

export const prismaMock = {
  user: {
    findUnique: jest.fn<any>(),
    findFirst: jest.fn<any>(),
    create: jest.fn<any>(),
    update: jest.fn<any>(),
    delete: jest.fn<any>(),
    deleteMany: jest.fn<any>(),
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
  cart: {
    findUnique: jest.fn<any>(),
    create: jest.fn<any>(),
  },
  cartItem: {
    findUnique: jest.fn<any>(),
    create: jest.fn<any>(),
    update: jest.fn<any>(),
    delete: jest.fn<any>(),
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
const { default: bcrypt } = await import('bcryptjs');

describe('Auth Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
        id: 'user-uuid',
        name: userData.name,
        email: userData.email,
        role: 'customer',
        createdAt: new Date(),
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(userData.email);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should fail if email is already registered', async () => {
      const userData = {
        name: 'Test User',
        email: 'duplicate@example.com',
        password: 'password123',
      };

      prismaMock.user.findUnique.mockResolvedValue({
        id: 'existing-id',
        email: userData.email,
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('ya está registrado');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = await bcrypt.hash(loginData.password, 10);

      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-uuid',
        name: 'Test User',
        email: loginData.email,
        password: hashedPassword,
        role: 'customer',
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe(loginData.email);
    });
  });
});
