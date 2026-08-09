import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || 'https://d171a9fcaab906e953f5118b50e0fcf2@o4511878507069440.ingest.us.sentry.io/4511878525419520',
  tracesSampleRate: 1.0,
  debug: false,
});
