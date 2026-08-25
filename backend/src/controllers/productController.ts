import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

interface InMemoryProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  onSale?: boolean;
  badge?: string;
  category: string;
  brand: string;
  model: string;
  color: string;
  imageUrl: string;
  stock: number;
  featured: boolean;
}

// Unified in-memory catalog with full specs, brands, models, colors, and sales
let IN_MEMORY_PRODUCTS: InMemoryProduct[] = [
  {
    id: "p1",
    name: "MacBook Pro 16 M3 Max",
    slug: "macbook-pro-16-m3-max",
    description: "Chip M3 Max de Apple con CPU de 16 núcleos, GPU de 40 núcleos, 36GB RAM, 1TB SSD. Pantalla Liquid Retina XDR de 16.2 pulgadas con ProMotion 120Hz.",
    price: 3499.0,
    originalPrice: 3899.0,
    onSale: false,
    badge: "PREMIUM",
    category: "Laptops",
    brand: "Apple",
    model: "MacBook Pro 16",
    color: "Gris Espacial",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
    stock: 8,
    featured: true,
  },
  {
    id: "p2",
    name: "iPhone 15 Pro Max 256GB Titanium",
    slug: "iphone-15-pro-max-256gb",
    description: "Diseño de titanio de calidad aeroespacial, Chip A17 Pro, Cámara de 48 MP con zoom óptico de 5x y Botón de Acción personalizable.",
    price: 1299.0,
    originalPrice: 1449.0,
    onSale: true,
    badge: "SALE",
    category: "Celulares",
    brand: "Apple",
    model: "iPhone 15 Pro Max",
    color: "Titanio Natural",
    imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800&auto=format&fit=crop",
    stock: 15,
    featured: true,
  },
  {
    id: "p3",
    name: "Monitor Sony Inzone M9 4K 144Hz IPS",
    slug: "sony-inzone-m9-4k",
    description: "Monitor Gaming 27'' 4K HDR10 con Full Array Local Dimming, DisplayPort 1.4 y HDMI 2.1 con G-Sync Compatible y Auto HDR para PS5.",
    price: 899.0,
    originalPrice: 999.0,
    onSale: false,
    badge: "PREMIUM",
    category: "Monitores",
    brand: "Sony",
    model: "Inzone M9",
    color: "Blanco / Negro",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
    stock: 5,
    featured: true,
  },
  {
    id: "p4",
    name: "Sony WH-1000XM5 Wireless Headphones",
    slug: "sony-wh-1000xm5",
    description: "Auriculares inalámbricos con cancelación de ruido líder en la industria con 8 micrófonos y procesador Auto NC Optimizer.",
    price: 399.0,
    originalPrice: 449.0,
    onSale: true,
    badge: "SALE",
    category: "Audio",
    brand: "Sony",
    model: "WH-1000XM5",
    color: "Negro",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    stock: 12,
    featured: true,
  },
  {
    id: "p5",
    name: "Logitech MX Master 3S Performance Mouse",
    slug: "logitech-mx-master-3s",
    description: "Mouse inalámbrico ergonómico con desplazamiento Quiet Clicks, sensor de 8K DPI para cualquier superficie y botón de gestos.",
    price: 99.0,
    originalPrice: 129.0,
    onSale: true,
    badge: "SALE",
    category: "Perifericos",
    brand: "Logitech",
    model: "MX Master 3S",
    color: "Grafito",
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop",
    stock: 20,
    featured: false,
  },
  {
    id: "p6",
    name: "Teclado Mecánico Keychron Q1 Pro Wireless",
    slug: "keychron-q1-pro",
    description: "Teclado mecánico custom de aluminio QMK/VIA con switches Gateron G Pro y conectividad Bluetooth 5.1 multidispositivo.",
    price: 199.0,
    originalPrice: 229.0,
    onSale: false,
    badge: "BEST SELLER",
    category: "Perifericos",
    brand: "Keychron",
    model: "Q1 Pro",
    color: "Negro Carbono",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop",
    stock: 10,
    featured: false,
  },
  {
    id: "p7",
    name: "Dell XPS 15 Intel i9 64GB RAM 2TB",
    slug: "dell-xps-15-i9",
    description: "Pantalla OLED 3.5K Touch, GeForce RTX 4070, chasis de aluminio pulido y batería de 86Wh.",
    price: 2899.0,
    originalPrice: 3199.0,
    onSale: false,
    badge: "PREMIUM",
    category: "Laptops",
    brand: "Dell",
    model: "XPS 15",
    color: "Plata Platino",
    imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800&auto=format&fit=crop",
    stock: 3,
    featured: true,
  },
  {
    id: "p8",
    name: "Samsung Galaxy S24 Ultra 512GB Titanium",
    slug: "samsung-galaxy-s24-ultra",
    description: "Galaxy AI integrado, S-Pen, Cámara de 200 MP, Pantalla QHD+ Dynamic AMOLED 2X.",
    price: 1399.0,
    originalPrice: 1599.0,
    onSale: true,
    badge: "SALE",
    category: "Celulares",
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    color: "Titanio Gris",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800&auto=format&fit=crop",
    stock: 7,
    featured: true,
  },
];

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, featured, onSale } = req.query;

    try {
      const where: any = {};
      if (category && category !== 'Todas') where.category = String(category);
      if (featured === 'true') where.featured = true;
      if (search) {
        where.OR = [
          { name: { contains: String(search), mode: 'insensitive' } },
          { description: { contains: String(search), mode: 'insensitive' } }
        ];
      }

      const dbProducts = await prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });

      if (dbProducts && dbProducts.length > 0) {
        // Enriquecer con campos extendidos
        const enriched = dbProducts.map((p) => {
          const match = IN_MEMORY_PRODUCTS.find((m) => m.id === p.id || m.slug === p.slug || m.name === p.name);
          return {
            ...p,
            brand: match?.brand || 'NovaTech',
            model: match?.model || p.name,
            color: match?.color || 'Negro',
            onSale: match?.onSale ?? false,
            originalPrice: match?.originalPrice,
            badge: match?.badge,
          };
        });
        return res.json({ success: true, data: enriched });
      }
    } catch (dbErr) {
      console.log('[PRODUCTS] Database offline or empty, using in-memory catalog');
    }

    // Filtrar catálogo en memoria
    let filtered = [...IN_MEMORY_PRODUCTS];
    if (category && category !== 'Todas') {
      filtered = filtered.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
    }
    if (featured === 'true') {
      filtered = filtered.filter((p) => p.featured);
    }
    if (onSale === 'true') {
      filtered = filtered.filter((p) => p.onSale);
    }
    if (search) {
      const term = String(search).toLowerCase();
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term) || p.brand.toLowerCase().includes(term)
      );
    }

    return res.json({ success: true, data: filtered });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error al obtener productos' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    try {
      const product = await prisma.product.findUnique({ where: { id } });
      if (product) {
        const match = IN_MEMORY_PRODUCTS.find((m) => m.id === product.id || m.slug === product.slug);
        return res.json({
          success: true,
          data: {
            ...product,
            brand: match?.brand || 'NovaTech',
            model: match?.model || product.name,
            color: match?.color || 'Negro',
            onSale: match?.onSale ?? false,
            originalPrice: match?.originalPrice,
            badge: match?.badge,
          }
        });
      }
    } catch (dbErr) {}

    const found = IN_MEMORY_PRODUCTS.find((p) => p.id === id || p.slug === id);
    if (!found) {
      return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    }

    return res.json({ success: true, data: found });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error al obtener producto' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, price, category, imageUrl, stock, featured, brand, model, color, onSale, originalPrice, badge } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({ success: false, error: 'Nombre, precio y categoría son obligatorios' });
    }

    const newProd = {
      id: 'p-' + Date.now(),
      name,
      slug: slug || ('p-' + Date.now()),
      description: description || '',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : (onSale ? Math.round(Number(price) * 1.2) : undefined),
      onSale: Boolean(onSale),
      badge: onSale ? (badge || 'SALE') : (featured ? 'BEST SELLER' : undefined),
      category,
      brand: brand || 'NovaTech',
      model: model || name,
      color: color || 'Negro',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?q=80&w=600&auto=format&fit=crop',
      stock: Number(stock || 1),
      featured: Boolean(featured),
    };

    try {
      const created = await prisma.product.create({
        data: {
          id: newProd.id,
          name: newProd.name,
          slug: newProd.slug,
          description: newProd.description,
          price: newProd.price,
          category: newProd.category,
          imageUrl: newProd.imageUrl,
          stock: newProd.stock,
          featured: newProd.featured,
        }
      });
      console.log('[PRODUCTS] Created product in DB:', created.name);
    } catch (dbErr) {
      console.log('[PRODUCTS] DB offline, saved to in-memory catalog');
    }

    IN_MEMORY_PRODUCTS = [newProd, ...IN_MEMORY_PRODUCTS];
    return res.status(201).json({ success: true, data: newProd });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error al crear producto' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    try {
      await prisma.product.update({
        where: { id },
        data: {
          ...(body.name && { name: body.name }),
          ...(body.description && { description: body.description }),
          ...(body.price !== undefined && { price: Number(body.price) }),
          ...(body.category && { category: body.category }),
          ...(body.imageUrl && { imageUrl: body.imageUrl }),
          ...(body.stock !== undefined && { stock: Number(body.stock) }),
          ...(body.featured !== undefined && { featured: Boolean(body.featured) }),
        }
      });
    } catch (dbErr) {
      console.log('[PRODUCTS] DB offline, updating in-memory catalog');
    }

    const index = IN_MEMORY_PRODUCTS.findIndex((p) => p.id === id);
    if (index > -1) {
      IN_MEMORY_PRODUCTS[index] = {
        ...IN_MEMORY_PRODUCTS[index],
        ...body,
        price: body.price !== undefined ? Number(body.price) : IN_MEMORY_PRODUCTS[index].price,
        originalPrice: body.originalPrice !== undefined ? (body.originalPrice ? Number(body.originalPrice) : undefined) : IN_MEMORY_PRODUCTS[index].originalPrice,
        onSale: body.onSale !== undefined ? Boolean(body.onSale) : IN_MEMORY_PRODUCTS[index].onSale,
      };
      return res.json({ success: true, data: IN_MEMORY_PRODUCTS[index] });
    }

    const newProd = {
      id,
      name: body.name || 'Producto',
      slug: body.slug || ('p-' + Date.now()),
      description: body.description || '',
      price: Number(body.price || 0),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      onSale: Boolean(body.onSale),
      badge: body.badge,
      category: body.category || 'General',
      brand: body.brand || 'NovaTech',
      model: body.model || 'Modelo',
      color: body.color || 'Negro',
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?q=80&w=600&auto=format&fit=crop',
      stock: Number(body.stock || 1),
      featured: Boolean(body.featured),
    };
    IN_MEMORY_PRODUCTS.push(newProd);

    return res.json({ success: true, data: newProd });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error al actualizar producto' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    try {
      await prisma.product.delete({ where: { id } });
    } catch (dbErr) {
      console.log('[PRODUCTS] DB offline, deleting from in-memory catalog');
    }

    IN_MEMORY_PRODUCTS = IN_MEMORY_PRODUCTS.filter((p) => p.id !== id);
    return res.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error al eliminar producto' });
  }
};
