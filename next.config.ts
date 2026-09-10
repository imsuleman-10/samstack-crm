import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '192.168.100.10',
    '192.168.100.10:3000',
    '192.168.100.10:3001',
    'localhost:3000',
    'localhost:3001',
    '127.0.0.1:3000',
    '127.0.0.1:3001',
  ],
  experimental: {
    serverActions: {
      allowedOrigins: [
        '192.168.100.10:3000',
        '192.168.100.10:3001',
        'localhost:3000',
        'localhost:3001',
        '127.0.0.1:3000',
        '127.0.0.1:3001',
      ],
    },
  },
};

export default nextConfig;
