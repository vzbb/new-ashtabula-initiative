import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: '/home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites/contractor-match/my-app',
  },
};

export default nextConfig;