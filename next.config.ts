import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["blogcafeai.s3.eu-north-1.amazonaws.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blogcafeai.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
