import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@plated/ui', '@plated/db'],
  reactStrictMode: true,
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG || 'bershmern',
  project: process.env.SENTRY_PROJECT || 'react-native',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
