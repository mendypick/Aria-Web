import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 82, 88],
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
