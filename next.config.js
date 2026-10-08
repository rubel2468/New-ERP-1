/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel-compatible output
  // output: 'standalone', // Uncomment if needed for Docker deploy

  // Allow images from external domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.s3.amazonaws.com',
      },
    ],
  },

  // Webpack config for server-side packages (pdfkit, nodemailer etc.)
  webpack: (config, { isServer }) => {
    if (isServer) {
      // pdfkit and other Node.js native modules
      config.externals = [...(config.externals || []), 'canvas', 'jsdom'];
    }
    return config;
  },
};

module.exports = nextConfig;

