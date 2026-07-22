import dns from 'dns';

const subdomains = ['db', 'aws-0-sa-east-1.pooler', 'aws-0-us-east-1.pooler', 'aws-0-us-west-1.pooler', 'aws-0-eu-central-1.pooler', 'aws-0-eu-west-1.pooler'];

subdomains.forEach(sub => {
  const host = `${sub}.supabase.com`;
  dns.lookup(host, (err, addr) => {
    console.log(`${host}: ${err ? err.code : addr}`);
  });
});
