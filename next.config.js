/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for better development practices
  reactStrictMode: true,
  
  // Configure i18n for internationalization
  i18n: {
    locales: ['en', 'yo', 'ig', 'ha', 'pcm'],
    defaultLocale: 'en',
    localeDetection: true,
  },
  
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
