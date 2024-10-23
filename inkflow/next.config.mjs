// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['book.inksearch.co'],
  },
  experimental: {
    appDir: true,
  },
  // Dodajemy opcję basePath, jeśli to konieczne
  // basePath: '/src',
};

export default nextConfig;
