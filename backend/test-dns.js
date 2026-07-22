import dns from 'dns';

const poolers = [
  'aws-0-sa-east-1.pooler.supabase.com',
  'aws-0-us-east-1.pooler.supabase.com',
  'aws-0-us-west-1.pooler.supabase.com',
  'aws-0-eu-west-1.pooler.supabase.com',
  'aws-0-ap-southeast-1.pooler.supabase.com'
];

poolers.forEach(host => {
  dns.lookup(host, (err, addr) => {
    console.log(`${host} -> ${err ? err.message : addr}`);
  });
});
