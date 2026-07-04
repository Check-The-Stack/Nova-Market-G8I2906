import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  { name: 'Mouse Inalámbrico Logitech MX Master 3S', slug: 'mouse-logitech-mx-master-3s', description: 'Mouse ergonómico con sensor de 8000 DPI, silencioso y recargable.', price: 89900, category: 'perifericos', imageUrl: '/images/mx-master-3s.jpg', stock: 15 },
  { name: 'Teclado Mecánico Keychron K8 Pro', slug: 'teclado-keychron-k8-pro', description: 'Teclado mecánico inalámbrico RGB, switches Gateron hot-swappable.', price: 129900, category: 'perifericos', imageUrl: '/images/keychron-k8.jpg', stock: 10 },
  { name: 'Cable USB-C a USB-C 2m', slug: 'cable-usb-c-2m', description: 'Cable trenzado de nailon, carga rápida 100W PD, transferencia 10Gbps.', price: 12900, category: 'cables', imageUrl: '/images/usb-c-cable.jpg', stock: 50 },
  { name: 'Hub USB-C 7 en 1', slug: 'hub-usb-c-7-en-1', description: 'Hub multipuerto con HDMI 4K, USB-A 3.0, lector SD, PD 100W.', price: 45900, category: 'accesorios', imageUrl: '/images/usb-hub.jpg', stock: 20 },
  { name: 'Auriculares Sony WH-1000XM5', slug: 'auriculares-sony-wh-1000xm5', description: 'Auriculares inalámbricos con cancelación de ruido activa, 30h batería.', price: 299900, category: 'audio', imageUrl: '/images/sony-xm5.jpg', stock: 8 },
  { name: 'SSD Portátil Samsung T7 1TB', slug: 'ssd-samsung-t7-1tb', description: 'Disco SSD externo USB 3.2, 1050MB/s lectura, resistente a golpes.', price: 119900, category: 'almacenamiento', imageUrl: '/images/samsung-t7.jpg', stock: 12 },
];

async function main() {
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }
  console.log('Seed completado:', products.length, 'productos');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
