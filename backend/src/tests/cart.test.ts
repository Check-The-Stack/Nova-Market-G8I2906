import { jest, describe, it, expect, beforeEach } from '@jest/globals';

export const prismaMock = {
  user: {
    findUnique: jest.fn<any>(),
  },
  product: {
    findUnique: jest.fn<any>(),
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
const { default: jwt } = await import('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const customerToken = jwt.sign({ id: 'customer-uuid', email: 'customer@novamarket.com', role: 'customer' }, JWT_SECRET);

describe('Cart Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/cart', () => {
    it('should return the existing cart for the authenticated user', async () => {
      const mockCart = {
        id: 'cart-uuid',
        userId: 'customer-uuid',
        items: [
          {
            id: 'item-uuid-1',
            productId: 'product-uuid-1',
            quantity: 2,
            product: {
              id: 'product-uuid-1',
              name: 'Product 1',
              price: 100,
              stock: 10,
            },
          },
        ],
      };

      prismaMock.cart.findUnique.mockResolvedValue(mockCart);

      const res = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(mockCart.id);
      expect(res.body.data.items).toHaveLength(1);
      expect(prismaMock.cart.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should create and return a new cart if the user does not have one', async () => {
      const mockCart = {
        id: 'new-cart-uuid',
        userId: 'customer-uuid',
        items: [],
      };

      prismaMock.cart.findUnique.mockResolvedValue(null);
      prismaMock.cart.create.mockResolvedValue(mockCart);

      const res = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(mockCart.id);
      expect(res.body.data.items).toHaveLength(0);
      expect(prismaMock.cart.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.cart.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /api/cart/items', () => {
    const validPayload = {
      productId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      quantity: 2,
    };

    it('should successfully add a new item to the cart', async () => {
      prismaMock.product.findUnique.mockResolvedValue({
        id: validPayload.productId,
        name: 'Product 1',
        stock: 10,
        price: 100,
      });

      prismaMock.cart.findUnique
        .mockResolvedValueOnce({
          id: 'cart-uuid',
          userId: 'customer-uuid',
        })
        .mockResolvedValueOnce({
          id: 'cart-uuid',
          userId: 'customer-uuid',
          items: [
            {
              id: 'item-uuid',
              productId: validPayload.productId,
              quantity: 2,
              product: { id: validPayload.productId, name: 'Product 1', stock: 10, price: 100 },
            },
          ],
        });

      prismaMock.cartItem.findUnique.mockResolvedValue(null);
      prismaMock.cartItem.create.mockResolvedValue({});

      const res = await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(validPayload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toHaveLength(1);
      expect(prismaMock.cartItem.create).toHaveBeenCalledTimes(1);
    });

    it('should return 404 if the product to add does not exist', async () => {
      prismaMock.product.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(validPayload);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Producto no encontrado');
    });

    it('should return 400 if requested quantity exceeds stock', async () => {
      prismaMock.product.findUnique.mockResolvedValue({
        id: validPayload.productId,
        name: 'Product 1',
        stock: 1, // Solamente 1 en stock, pedimos 2
        price: 100,
      });

      prismaMock.cart.findUnique.mockResolvedValue({
        id: 'cart-uuid',
        userId: 'customer-uuid',
      });

      prismaMock.cartItem.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(validPayload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Stock insuficiente');
    });
  });

  describe('PUT /api/cart/items/:productId', () => {
    const productId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    const validUpdatePayload = { quantity: 5 };

    it('should update the item quantity in the cart', async () => {
      prismaMock.cart.findUnique
        .mockResolvedValueOnce({
          id: 'cart-uuid',
          userId: 'customer-uuid',
        })
        .mockResolvedValueOnce({
          id: 'cart-uuid',
          userId: 'customer-uuid',
          items: [
            {
              id: 'item-uuid',
              productId,
              quantity: 5,
              product: { id: productId, name: 'Product 1', stock: 10 },
            },
          ],
        });

      prismaMock.cartItem.findUnique.mockResolvedValue({
        id: 'item-uuid',
        cartId: 'cart-uuid',
        productId,
        quantity: 2,
        product: {
          id: productId,
          name: 'Product 1',
          stock: 10,
        },
      });

      prismaMock.cartItem.update.mockResolvedValue({});

      const res = await request(app)
        .put(`/api/cart/items/${productId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send(validUpdatePayload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items[0].quantity).toBe(5);
      expect(prismaMock.cartItem.update).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if updated quantity exceeds stock', async () => {
      prismaMock.cart.findUnique.mockResolvedValue({
        id: 'cart-uuid',
        userId: 'customer-uuid',
      });

      prismaMock.cartItem.findUnique.mockResolvedValue({
        id: 'item-uuid',
        cartId: 'cart-uuid',
        productId,
        quantity: 2,
        product: {
          id: productId,
          name: 'Product 1',
          stock: 4, // Stock 4, solicitamos 5
        },
      });

      const res = await request(app)
        .put(`/api/cart/items/${productId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send(validUpdatePayload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Stock insuficiente');
    });
  });

  describe('DELETE /api/cart/items/:productId', () => {
    const productId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

    it('should successfully remove the item from the cart', async () => {
      prismaMock.cart.findUnique
        .mockResolvedValueOnce({
          id: 'cart-uuid',
          userId: 'customer-uuid',
        })
        .mockResolvedValueOnce({
          id: 'cart-uuid',
          userId: 'customer-uuid',
          items: [],
        });

      prismaMock.cartItem.findUnique.mockResolvedValue({
        id: 'item-uuid',
        cartId: 'cart-uuid',
        productId,
      });

      prismaMock.cartItem.delete.mockResolvedValue({});

      const res = await request(app)
        .delete(`/api/cart/items/${productId}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toHaveLength(0);
      expect(prismaMock.cartItem.delete).toHaveBeenCalledTimes(1);
    });
  });
});
