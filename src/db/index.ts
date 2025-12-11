// src/db/index.ts
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { config } from 'dotenv';
import { certification } from './schemas/certification';
import { courses } from './schemas/courses';
import { certificateTracking } from './schemas/certificateTracking';
import { user } from './schemas/user';
import * as relations from './schemas/relations';

// Load environment variables only in development
if (process.env.NODE_ENV !== 'production') {
  config({ path: '.env.local' });
}

let dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error('Database URL not configured');
}

// Clean the URL if it contains psql command prefix
if (dbUrl.includes("psql '") && dbUrl.includes("'")) {
  const match = dbUrl.match(/psql '([^']+)'/);
  if (match) {
    dbUrl = match[1];
  }
}

// Remove any quotes or extra characters
dbUrl = dbUrl.trim().replace(/^['"]|['"]$/g, '');

// Validate the connection string format
if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
  throw new Error('Invalid database URL format');
}

let db;
try {
  // Initialize the PostgreSQL pool with Neon-optimized settings
  const pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 60000,
    connectionTimeoutMillis: 10000,
    allowExitOnIdle: true,
  });

  // Initialize the drizzle ORM with schemas
  db = drizzle(pool, {
    schema: {
      certification,
      courses,
      certificateTracking,
      user,
      ...relations
    }
  });

  // Connection will be tested when first query is made
} catch (error) {
  throw new Error('Database connection failed');
}

export { db };