import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';
import type { D1Database } from '@cloudflare/workers-types';


export { eq, and, or, desc, asc, sql, inArray, gte, lt, ne } from 'drizzle-orm';

// Helper to init DB with schema
export function createDb(d1: D1Database) {
  return drizzle(d1, { schema });
}


export * from './schema';