import { Router } from 'express';
import prisma from '../config/prisma';
import { protect, adminOnly, type AuthRequest } from '../middleware/auth';

const router = Router();

router.use(protect, adminOnly);

router.get('/products', async (_req: AuthRequest, res) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json({ success: true, data: products });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/products', async (req: AuthRequest, res) => {
  try {
    const product = await prisma.product.create({
      data: {
        ...req.body,
        slug: req.body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      },
    });
    return res.status(201).json({ success: true, data: product });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

router.put('/products/:id', async (req: AuthRequest, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body,
    });
    return res.json({ success: true, data: product });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

router.delete('/products/:id', async (req: AuthRequest, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    return res.json({ success: true, message: 'Product deleted' });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

router.get('/orders', async (_req: AuthRequest, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: orders });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

router.put('/orders/:id/status', async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    const valid = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!valid.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
    });
    return res.json({ success: true, data: order });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
