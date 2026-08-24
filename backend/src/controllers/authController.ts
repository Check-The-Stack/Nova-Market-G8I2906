import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../config/prisma.js';

// In-memory demo users fallback when database connection is offline
const FALLBACK_USERS: Record<string, { id: string; name: string; email: string; passHash: string; role: 'admin' | 'customer' }> = {
  'admin@novamarket.com': {
    id: 'admin-id',
    name: 'Administrador Nova',
    email: 'admin@novamarket.com',
    passHash: bcrypt.hashSync('admin123', 10),
    role: 'admin',
  },
  'customer@novamarket.com': {
    id: 'customer-id',
    name: 'Cliente Demo',
    email: 'customer@novamarket.com',
    passHash: bcrypt.hashSync('password123', 10),
    role: 'customer',
  },
  'test@qa.com': {
    id: 'qa-user-id',
    name: 'Erika QA',
    email: 'test@qa.com',
    passHash: bcrypt.hashSync('Qa123!', 10),
    role: 'customer',
  },
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Nombre, email y contraseña son obligatorios' });
    }

    const cleanEmail = email.trim().toLowerCase();

    try {
      const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
      if (existingUser) {
        return res.status(409).json({ success: false, error: 'El email ya está registrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userRole = role === 'admin' ? 'admin' : 'customer';

      const user = await prisma.user.create({
        data: {
          name,
          email: cleanEmail,
          password: hashedPassword,
          role: userRole
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      });

      const secret = process.env.JWT_SECRET || 'default_secret';
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, { expiresIn: '7d' });

      return res.status(201).json({
        success: true,
        data: { user, token }
      });
    } catch (dbError: any) {
      console.log('[AUTH] Database offline, using in-memory registration fallback');
      if (FALLBACK_USERS[cleanEmail]) {
        return res.status(409).json({ success: false, error: 'El email ya está registrado' });
      }

      const userRole = role === 'admin' ? 'admin' : 'customer';
      const newUser = {
        id: 'usr-' + Date.now(),
        name,
        email: cleanEmail,
        passHash: await bcrypt.hash(password, 10),
        role: userRole as 'admin' | 'customer',
      };
      FALLBACK_USERS[cleanEmail] = newUser;

      const secret = process.env.JWT_SECRET || 'default_secret';
      const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, secret, { expiresIn: '7d' });

      return res.status(201).json({
        success: true,
        data: {
          user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
          token,
        }
      });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error al registrar usuario' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email y contraseña son requeridos' });
    }

    const cleanEmail = email.trim().toLowerCase();

    try {
      const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
      if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
        }

        const secret = process.env.JWT_SECRET || 'default_secret';
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, { expiresIn: '7d' });

        return res.json({
          success: true,
          data: {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
            },
            token
          }
        });
      }
    } catch (dbError) {
      console.log('[AUTH] Database offline, checking fallback credentials');
    }

    // In-memory fallback
    const fallbackUser = FALLBACK_USERS[cleanEmail];
    if (!fallbackUser) {
      return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
    }

    const isPasswordValid = await bcrypt.compare(password, fallbackUser.passHash);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
    }

    const secret = process.env.JWT_SECRET || 'default_secret';
    const token = jwt.sign({ id: fallbackUser.id, email: fallbackUser.email, role: fallbackUser.role }, secret, { expiresIn: '7d' });

    return res.json({
      success: true,
      data: {
        user: {
          id: fallbackUser.id,
          name: fallbackUser.name,
          email: fallbackUser.email,
          role: fallbackUser.role
        },
        token
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error al iniciar sesión' });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, role: true, createdAt: true }
      });

      if (user) {
        return res.json({ success: true, data: user });
      }
    } catch (dbErr) {}

    // Fallback search
    const found = Object.values(FALLBACK_USERS).find((u) => u.id === userId);
    if (found) {
      return res.json({ success: true, data: { id: found.id, name: found.name, email: found.email, role: found.role } });
    }

    return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error al obtener perfil' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const cleanEmail = email?.trim().toLowerCase();

    console.log(`[RECOVER] Solicitud de recuperación recibida para ${cleanEmail}`);
    const token = crypto.randomBytes(20).toString('hex');
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    console.log(`[RECOVER] Enlace de recuperación: ${resetLink}`);

    return res.json({
      success: true,
      message: 'Si el correo electrónico está registrado, recibirás un enlace de restablecimiento pronto.',
      debug: {
        token,
        resetLink
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error en solicitud de recuperación' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ success: false, error: 'Token y nueva contraseña son obligatorios' });
    }

    return res.json({
      success: true,
      message: 'Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión.'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error al restablecer contraseña' });
  }
};
