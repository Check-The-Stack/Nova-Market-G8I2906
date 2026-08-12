import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      distinct: ['category'],
      select: {
        category: true
      }
    });

    const categories = products.map(p => p.category);

    return res.json({ success: true, data: categories });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener las categorías'
    });
  }
};
