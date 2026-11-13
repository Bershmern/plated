/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@plated/ui', '@plated/db'],
  reactStrictMode: true,
};

export default nextConfig;
