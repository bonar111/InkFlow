// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['book.inksearch.co'],
  },
  // Dodajemy opcję basePath, jeśli to konieczne
  // basePath: '/src',
};

export default nextConfig;
