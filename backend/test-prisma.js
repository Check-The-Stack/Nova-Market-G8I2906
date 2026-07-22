import { PrismaClient } from '@prisma/client';

const poolers = [
  'aws-0-sa-east-1.pooler.supabase.com',
  'aws-0-us-east-1.pooler.supabase.com',
  'aws-0-us-west-1.pooler.supabase.com',
  'aws-0-eu-central-1.pooler.supabase.com',
  'aws-0-eu-west-1.pooler.supabase.com',
  'aws-0-ap-southeast-1.pooler.supabase.com'
];

async function check() {
  for (const host of poolers) {
    console.log(`Trying ${host}...`);
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: `postgresql://postgres.thyigetucvykvnelypyp:Vik_Dua_033@${host}:6543/postgres`
        }
      }
    });
    try {
      await prisma.$connect();
      console.log(`SUCCESS ON ${host}!`);
      await prisma.$disconnect();
      break;
    } catch (err) {
      console.log(`${host}: ${err.message}`);
      await prisma.$disconnect();
    }
  }
}

check();
