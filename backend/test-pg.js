import pg from 'pg';

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
    const client = new pg.Client({
      connectionString: `postgresql://postgres.thyigetucvykvnelypyp:Vik_Dua_033@${host}:6543/postgres`,
      connectionTimeoutMillis: 3000
    });
    try {
      await client.connect();
      console.log(`SUCCESS ON ${host}!`);
      await client.end();
      break;
    } catch (err) {
      console.log(`${host}: ${err.message}`);
    }
  }
}

check();
