import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "*.preview.emergentagent.com",
    "*.cluster-5.preview.emergentcf.cloud",
    "*.preview.emergentcf.cloud",
  ],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
