/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['my-app-user-profiles.s3.us-east-1.amazonaws.com']
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        pg: false,
        fs: false,
        net: false,
        tls: false,
        dns: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
