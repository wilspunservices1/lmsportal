import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true, // ⛔ Skips ESLint checks during builds
  },
  typescript: {
    ignoreBuildErrors: true, // <--- Ignores TS errors during production build
  },
  unoptimized: true,
  images : {
    remotePatterns : [
      // {
      //   protocol : 'https',
      //   hostname : '***/res.cloudinary.com',
      //   pathname : '/ddj5gisb3/image/upload/**',
      //   port : '',
      // }
      {
<<<<<<< HEAD
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/ddj5gisb3/image/upload/**',
      }
    ]
  }
=======
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/ddj5gisb3/image/upload/**",
      },
    ],
    // Only disable optimization if absolutely necessary
    unoptimized: process.env.NODE_ENV === "development",
  },

  // Compiler options
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Webpack configuration for alias resolution & fallback
  webpack: (config) => {
    // ✅ Add alias resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
      "@/db": path.resolve(__dirname, "src/db"),
      "@/schemas": path.resolve(__dirname, "src/db/schemas"),
      "@/components": path.resolve(__dirname, "src/components"),
    };

    // ✅ Preserve existing fallback settings
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false, // Prevents errors when fs module is not needed
    };

    return config;
  },


  // Experimental features
  experimental: {
    // Enable optimized page loading
    optimizeCss: true,
    // Better handling of hydration
    scrollRestoration: true,
  },
>>>>>>> 2947b7414a8bd25a94ed3997280bb6c6503749c0
};

export default nextConfig;


// https://res.cloudinary.com/ddj5gisb3/image/upload/v1728283106/courses/ai-generated-8136172_1280_a3p57l.png
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'res.cloudinary.com',
//         pathname: '/ddj5gisb3/image/upload/**',
//       },
//     ],
//   },
// };

// export default nextConfig;





// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: false,
// };

// export default nextConfig;


