import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../config/prisma.js';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Nombre, email y contraseña son obligatorios' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'El email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === 'admin' ? 'admin' : 'customer';

    const user = await prisma.user.create({
      data: {
        name,
        email,
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

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
    }

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
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error al iniciar sesión' });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }

    return res.json({ success: true, data: user });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error al obtener perfil' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Por seguridad, respondemos con éxito para no revelar qué correos existen en el sistema.
      // Pero no generamos ningún token.
      return res.json({
        success: true,
        message: 'Si el correo electrónico está registrado, recibirás un enlace de restablecimiento pronto.'
      });
    }

    // Generar token y expiración (1 hora)
    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires
      }
    });

    // En un entorno productivo enviaríamos un correo electrónico aquí.
    // Para propósitos de este MVP y testing, lo imprimimos en consola y lo retornamos.
    console.log(`[RECOVER] Token de restablecimiento para ${email}: ${token}`);
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    console.log(`[RECOVER] Enlace: ${resetLink}`);

    return res.json({
      success: true,
      message: 'Si el correo electrónico está registrado, recibirás un enlace de restablecimiento pronto.',
      // Se expone el token en desarrollo/test para facilidad de pruebas
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

    // Buscar el usuario por token y validar que no haya expirado
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'El token de restablecimiento es inválido o ha expirado.'
      });
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar contraseña y limpiar campos de token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    });

    return res.json({
      success: true,
      message: 'Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión.'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error al restablecer contraseña' });
  }
};
