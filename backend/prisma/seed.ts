import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Limpiando la base de datos...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log('👤 Creando usuarios de prueba...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  const customerPassword = await bcrypt.hash('customer123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Administrador Nova',
      email: 'admin@novamarket.com',
      password: adminPassword,
      role: 'admin',
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Juan Pérez',
      email: 'juan@novamarket.com',
      password: customerPassword,
      role: 'customer',
    },
  });

  console.log('📦 Creando productos tecnológicos...');
  const products = [
    {
      name: 'Smartphone Nova X1',
      slug: 'smartphone-nova-x1',
      description: 'El último grito en tecnología móvil con pantalla AMOLED de 6.7 pulgadas, 12GB de RAM, 256GB de almacenamiento y cámara triple de 108MP.',
      price: 799.99,
      category: 'Smartphones',
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop',
      stock: 50,
      featured: true,
    },
    {
      name: 'Laptop Pro 16',
      slug: 'laptop-pro-16',
      description: 'Potencia sin límites para profesionales del diseño y desarrollo. Procesador de última generación, 32GB RAM, 1TB SSD y tarjeta gráfica dedicada.',
      price: 1499.99,
      category: 'Laptops',
      imageUrl: 'https://images.unsplash.com/photo-1496181130204-7552cc14ac1a?q=80&w=600&auto=format&fit=crop',
      stock: 20,
      featured: true,
    },
    {
      name: 'Auriculares Wireless SoundPro',
      slug: 'auriculares-wireless-soundpro',
      description: 'Cancelación activa de ruido híbrida, hasta 40 horas de autonomía y sonido de alta fidelidad. Perfectos para el día a día o viajes.',
      price: 199.99,
      category: 'Audio',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
      stock: 100,
      featured: false,
    },
    {
      name: 'Teclado Mecánico RGB Nova',
      slug: 'teclado-mecanico-rgb-nova',
      description: 'Interruptores mecánicos táctiles silenciosos, retroiluminación RGB totalmente configurable y reposamuñecas ergonómico desmontable.',
      price: 89.99,
      category: 'Accesorios',
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop',
      stock: 75,
      featured: false,
    },
    {
      name: 'Smartwatch Sport Active',
      slug: 'smartwatch-sport-active',
      description: 'Tu compañero ideal de entrenamiento. Monitoreo de ritmo cardíaco, GPS integrado, resistencia al agua 5 ATM y batería de larga duración.',
      price: 149.99,
      category: 'Smartwatches',
      imageUrl: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=600&auto=format&fit=crop',
      stock: 40,
      featured: true,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('✅ Base de datos poblada exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando la semilla:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
