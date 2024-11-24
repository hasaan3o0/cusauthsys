/** @type {import('next').NextConfig} */
const withNextIntl = require("next-intl/plugin")("./app/i18n/config.ts");

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = withNextIntl(nextConfig);
