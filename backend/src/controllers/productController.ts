import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, featured } = req.query;

    const where: any = {};

    if (category) {
      where.category = String(category);
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } }
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, data: products });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error al obtener productos' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }

    return res.json({ success: true, data: product });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error al obtener producto' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, price, category, imageUrl, stock, featured } = req.body;

    if (!name || !slug || !description || price === undefined || !category || !imageUrl) {
      return res.status(400).json({ success: false, error: 'Todos los campos obligatorios deben proporcionarse' });
    }

    const existingProduct = await prisma.product.findUnique({ where: { slug } });
    if (existingProduct) {
      return res.status(409).json({ success: false, error: 'Ya existe un producto con ese slug' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: Number(price),
        category,
        imageUrl,
        stock: Number(stock || 0),
        featured: Boolean(featured)
      }
    });

    return res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error al crear producto' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, description, price, category, imageUrl, stock, featured } = req.body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(price !== undefined && { price: Number(price) }),
        ...(category && { category }),
        ...(imageUrl && { imageUrl }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(featured !== undefined && { featured: Boolean(featured) })
      }
    });

    return res.json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error al actualizar producto' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }

    await prisma.product.delete({ where: { id } });

    return res.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error al eliminar producto' });
  }
};
