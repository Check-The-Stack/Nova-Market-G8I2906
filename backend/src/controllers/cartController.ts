import { Response } from 'express';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Usuario no autenticado' });
    }

    // Buscar el carrito, si no existe lo creamos
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: { product: true },
            orderBy: { createdAt: 'asc' }
          }
        }
      });
    }

    return res.json({ success: true, data: cart });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error al obtener el carrito' });
  }
};

export const addItemToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { productId, quantity } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Usuario no autenticado' });
    }

    // Verificar si el producto existe
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }

    // Obtener o crear el carrito del usuario
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    // Verificar si el producto ya está en el carrito
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    });

    const targetQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    // Verificar stock disponible
    if (product.stock < targetQuantity) {
      return res.status(400).json({
        success: false,
        error: `Stock insuficiente. Disponible: ${product.stock}, solicitado: ${targetQuantity}`
      });
    }

    if (existingItem) {
      // Actualizar cantidad
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: targetQuantity }
      });
    } else {
      // Crear nuevo ítem en el carrito
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        }
      });
    }

    // Retornar el carrito actualizado
    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    return res.json({ success: true, data: updatedCart });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error al agregar ítem al carrito' });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Usuario no autenticado' });
    }

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
    }

    // Verificar si el ítem existe en el carrito
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      },
      include: { product: true }
    });

    if (!existingItem) {
      return res.status(404).json({ success: false, error: 'El producto no está en el carrito' });
    }

    // Verificar stock disponible
    if (existingItem.product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: `Stock insuficiente. Disponible: ${existingItem.product.stock}, solicitado: ${quantity}`
      });
    }

    // Actualizar cantidad del ítem
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity }
    });

    // Retornar el carrito actualizado
    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    return res.json({ success: true, data: updatedCart });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error al actualizar el carrito' });
  }
};

export const removeItemFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Usuario no autenticado' });
    }

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
    }

    // Verificar si el ítem existe
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    });

    if (!existingItem) {
      return res.status(404).json({ success: false, error: 'El producto no está en el carrito' });
    }

    // Eliminar el ítem
    await prisma.cartItem.delete({
      where: { id: existingItem.id }
    });

    // Retornar el carrito actualizado
    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    return res.json({ success: true, data: updatedCart });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error al eliminar ítem del carrito' });
  }
};
