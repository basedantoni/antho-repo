import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import db from '@antho/db/client';
import { createClient as createClientNode } from '@libsql/client/node';
import { drizzle } from '@antho/db';
import * as schema from '@antho/db/schema';

export async function GET(request: NextRequest) {
  try {
    // First, try using the configured client
    try {
      const users = await db.query.users.findMany();
      console.log('Users from configured client:', users);
      return NextResponse.json(users);
    } catch (error) {
      console.error('Error using configured client:', error);

      // If that fails, try a direct connection to the known database location
      const dbPath = '/Users/antho/dev/antho-repo/packages/db/storage/local.db';
      const directClient = createClientNode({
        url: `file:${dbPath}`,
      });

      const directDb = drizzle(directClient, { schema });
      const users = await directDb.query.users.findMany();
      console.log('Users from direct connection:', users);

      return NextResponse.json(users);
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Database error', details: (error as Error).message },
      { status: 500 }
    );
  }
}
