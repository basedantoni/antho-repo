import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql/node';

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

// Set up client based on environment
const client = isProduction
  ? createClient({
      url: process.env.DATABASE_URL!,
      authToken: process.env.DATABASE_AUTH_TOKEN!,
    })
  : createClient({
      url: process.env.SQLITE_URL!,
    });

export default drizzle(client);
