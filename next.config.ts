import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'assets.romain-guillemot.dev',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: "tailwindcss.com",
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: "media.licdn.com",
                pathname: "/**"
            }
        ],
    },
};

export default nextConfig;