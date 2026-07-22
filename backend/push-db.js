import { execSync } from 'child_process';
import fs from 'fs';

const envContent = fs.readFileSync('./backend/.env', 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    envVars[match[1]] = value;
  }
});

console.log('Pushing Prisma schema to Supabase...');
execSync('npx prisma@5.22.0 db push --schema=./backend/prisma/schema.prisma', {
  stdio: 'inherit',
  env: { ...process.env, ...envVars }
});
console.log('Push completed successfully!');
