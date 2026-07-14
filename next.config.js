/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for better development practices
  reactStrictMode: true,
  
  // i18n is handled client-side/customly, so the native config block is removed to avoid App Router warnings
  
  // Add webpack configuration if needed
  webpack: (config, { isServer }) => {
    // Add custom webpack configuration here if needed
    return config;
  },
  
  // Add environment variables if needed
  env: {
    // Add environment variables here
  },
  
  // Add headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
