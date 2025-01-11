/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['my-app-user-profiles.s3.us-east-1.amazonaws.com']
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side specific configuration
      if (!config.resolve) {
        config.resolve = {};
      }
      if (!config.resolve.fallback) {
        config.resolve.fallback = {};
      }

      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Node.js modules that should be marked as false in client-side
        pg: false,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        // Crypto and stream polyfills needed for AWS Amplify
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;
