// /easytrade-ui/next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',        // Or 'https' if the images from example.com are HTTPS
        hostname: 'easytrade.com', // Whitelisting example.com as per your previous config
      },
      // If you have other external image domains, add them here as new objects:
      // {
      //   protocol: 'https',
      //   hostname: 'another-image-host.com',
      // },
      // If you plan to serve images from your Spring Boot backend (e.g., at localhost:8080)
      // during development, you might add:
      // {
      //   protocol: 'http',
      //   hostname: 'localhost',
      //   port: '8080', // Only if your Spring Boot app is serving images on this port
      // },
    ],
  },
  // You can add other Next.js configurations here if needed in the future
};

module.exports = nextConfig; // Use CommonJS export for .js file
