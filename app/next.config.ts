import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // better-sqlite3 is a native Node.js addon — must run only on server
  serverExternalPackages: ['better-sqlite3', '@prisma/adapter-better-sqlite3'],
  // Turbopack config (Next.js 16 default)
  turbopack: {},
};

export default nextConfig;
