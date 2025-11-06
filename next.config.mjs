/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "Blogcafeai.com",
      "pokiigame.com",
      "img.gamemonetize.com",
      "blogcafeai.s3.eu-north-1.amazonaws.com",
      "blogcafeai.s3.amazonaws.com"
    ],
  },
  async headers() {
    return [
      {
        // Apply to all routes: grant iframe features for smoother gameplay
        source: "/:path*",
        headers: [
          {
            key: "Permissions-Policy",
            value: "gamepad=*; fullscreen=*; autoplay=*; accelerometer=*; gyroscope=*; clipboard-read=*; clipboard-write=*; encrypted-media=*; picture-in-picture=*; xr-spatial-tracking=*",
          },
        ],
      },
      {
        // Apply to all image assets in the public directory
        source: "/(.*)\\.(png|jpg|jpeg|webp|svg|gif|ico)$",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // 1 year
          },
          {
            key: "Expires",
            value: new Date(Date.now() + 31536000000).toUTCString(), // 1 year from now
          },
        ],
      },
    ];
  },
};

export default nextConfig;
