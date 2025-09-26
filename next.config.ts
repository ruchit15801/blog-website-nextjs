import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blogcafeai.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
      // Fallback: any s3 subdomain under eu-north-1
      {
        protocol: "https",
        hostname: "*.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
