/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: 'http://localhost:4000/api/:path*',
    },
  ],
};

export default nextConfig;
