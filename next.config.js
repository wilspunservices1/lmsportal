const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  eslint: {
    ignoreDuringBuilds: true, // ⛔ Skips ESLint checks during builds
  },

  typescript: {
    ignoreBuildErrors: true, // ⛔ Ignores TS errors during production build
  },

  images: {
    unoptimized: true,
    domains: ["res.cloudinary.com"],
  },
};

module.exports = nextConfig;