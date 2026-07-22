import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.thyigetucvykvnelypyp:Vik_Dua_033@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
    }
  }
});

async function pushSchema() {
  console.log('Verificando tablas en Supabase...');
  
  await prisma.$queryRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT NOT NULL,
      "email" TEXT UNIQUE NOT NULL,
      "password" TEXT NOT NULL,
      "role" TEXT NOT NULL DEFAULT 'customer',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await prisma.$queryRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Product" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT NOT NULL,
      "slug" TEXT UNIQUE NOT NULL,
      "description" TEXT NOT NULL,
      "price" DOUBLE PRECISION NOT NULL,
      "category" TEXT NOT NULL,
      "imageUrl" TEXT NOT NULL,
      "stock" INTEGER NOT NULL DEFAULT 0,
      "featured" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await prisma.$queryRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Order" (
      "id" TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL REFERENCES "User"("id"),
      "total" DOUBLE PRECISION NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'pending',
      "street" TEXT NOT NULL,
      "city" TEXT NOT NULL,
      "state" TEXT NOT NULL,
      "zipCode" TEXT NOT NULL,
      "country" TEXT NOT NULL DEFAULT 'AR',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await prisma.$queryRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "OrderItem" (
      "id" TEXT PRIMARY KEY,
      "orderId" TEXT NOT NULL REFERENCES "Order"("id"),
      "productId" TEXT NOT NULL REFERENCES "Product"("id"),
      "quantity" INTEGER NOT NULL,
      "price" DOUBLE PRECISION NOT NULL
    );
  `);

  console.log('¡Tablas verificadas y listas en Supabase!');
  await prisma.$disconnect();
}

pushSchema().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
