import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../config/prisma';
import { protect, type AuthRequest } from '../middleware/auth';

const router = Router();

function signToken(userId: string, role: string): string {
  const secret = process.env.JWT_SECRET || 'dev-secret';
  return jwt.sign({ userId, role }, secret, { expiresIn: '7d' });
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });
    const token = signToken(user.id, user.role);
    return res.status(201).json({ success: true, data: { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token } });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    const token = signToken(user.id, user.role);
    return res.json({ success: true, data: { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token } });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

router.get('/profile', protect, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    return res.json({ success: true, data: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
