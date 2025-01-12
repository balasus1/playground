/** @type {import('next').NextConfig} */

import path from 'path';

const __dirname = new URL('.', import.meta.url).pathname;
const nextConfig = {
  // Disable React running twice as it messes up with iframes
  reactStrictMode: false,
  experimental: {
    typedRoutes: true,
    webpackBuildWorker: true,
  },
  images: {
    domains: ['picsum.photos', 'fakeimg.pl'],
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    )

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
};

export default nextConfig;
