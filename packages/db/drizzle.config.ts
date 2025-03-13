import type { Config } from 'drizzle-kit';
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  if (!process.env.DATABASE_URL || !process.env.DATABASE_AUTH_TOKEN) {
    throw new Error('DATABASE_URL or DATABASE_AUTH_TOKEN is not set');
  }
} else {
  if (!process.env.SQLITE_URL) {
    throw new Error('SQLITE_URL is not set');
  }
}

export default {
  dbCredentials: isProduction
    ? {
        url: process.env.DATABASE_URL!,
        authToken: process.env.DATABASE_AUTH_TOKEN!,
      }
    : {
        url: process.env.SQLITE_URL!,
      },
  dialect: 'turso',
  schema: './src/schema.ts',
  out: './migrations',
} satisfies Config;
