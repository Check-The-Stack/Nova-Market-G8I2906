import { PrismaClient } from '@prisma/client';

const regions = [
  'aws-0-us-east-1',
  'aws-0-sa-east-1',
  'aws-0-us-west-1',
  'aws-0-eu-central-1',
  'aws-0-eu-west-1',
  'aws-0-ap-southeast-1'
];

async function check() {
  for (const reg of regions) {
    const url = `postgresql://postgres.thyigetucvykvnelypyp:Vik_Dua_033@${reg}.pooler.supabase.com:6543/postgres?pgbouncer=true`;
    console.log(`Testing region: ${reg}...`);
    const prisma = new PrismaClient({
      datasources: { db: { url } }
    });
    try {
      await prisma.$connect();
      console.log(`SUCCESS ON REGION: ${reg} !`);
      await prisma.$disconnect();
      return url;
    } catch (err) {
      console.log(`${reg} ERROR: ${err.message}`);
      await prisma.$disconnect();
    }
  }
  console.log("No pooler region succeeded yet.");
}

check();
