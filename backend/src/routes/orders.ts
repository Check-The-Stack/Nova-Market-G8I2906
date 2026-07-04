import { Router } from 'express';
import prisma from '../config/prisma';
import { protect, type AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/', protect, async (req: AuthRequest, res) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!items?.length) {
      return res.status(400).json({ success: false, error: 'Items required' });
    }

    const orderItems = [];
    let total = 0;

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        return res.status(404).json({ success: false, error: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, error: `Insufficient stock for ${product.name}` });
      }
      orderItems.push({ productId: product.id, quantity: item.quantity, price: product.price });
      total += product.price * item.quantity;
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user!.userId,
        items: { create: orderItems },
        total,
        shippingAddress,
      },
    });

    for (const item of orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return res.status(201).json({ success: true, data: order });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

router.get('/', protect, async (req: AuthRequest, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: orders });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
