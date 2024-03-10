const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      node = {
        net: 'empty'
      };
      config.resolve.fallback.dns = false;
      config.resolve.fallback.fs = false;
      config.resolve.fallback.child_process = false;
    }

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/api/:path*", // Adjust this path as needed
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-Requested-With, Content-Type, Authorization" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }, // Add this line for cache control
        ]
      }
    ];
  },
};

module.exports = nextConfig;
