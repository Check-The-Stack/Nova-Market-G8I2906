import dns from 'dns';

const pools = [
  'aws-0-sa-east-1',
  'aws-0-us-east-1',
  'aws-0-us-west-1',
  'aws-0-eu-central-1',
  'aws-0-eu-west-1',
  'aws-0-ap-southeast-1'
];

pools.forEach(p => {
  const host = `${p}.pooler.supabase.com`;
  const username = `postgres.thyigetucvykvnelypyp`;
  // Test TCP connect via net
  import('net').then(net => {
    const socket = net.connect(6543, host, () => {
      console.log(`CONNECTED to ${host}:6543`);
      socket.destroy();
    });
    socket.on('error', (e) => {
      // console.log(`FAILED ${host}:6543 - ${e.message}`);
    });
  });
});
