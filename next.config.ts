import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ebayimg.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Handle remaining modules
    config.externals = config.externals || [];

    if (isServer) {
      // Exclude problematic modules from server-side bundling
      config.externals.push({
        sharp: "commonjs sharp",
      });
    }

    // Ignore problematic files
    config.module.rules.push({
      test: /\.html$/,
      loader: "ignore-loader",
    });

    return config;
  },
  // Exclude problematic packages from server-side rendering
  serverExternalPackages: ["sharp"],
};

export default nextConfig;
