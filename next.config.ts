import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
    outputFileTracingIncludes: {
      "/*": ["./prisma/**/*", "./dev.db"],
    },
  },
};

export default nextConfig;
