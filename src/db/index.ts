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
  console.error('Environment variables:', {
    POSTGRES_URL: process.env.POSTGRES_URL ? 'SET' : 'NOT SET',
    DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV
  });
  throw new Error('POSTGRES_URL or DATABASE_URL is not defined in the environment variables');
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
  console.error('Invalid database URL format. Received:', dbUrl.substring(0, 50) + '...');
  throw new Error(`Invalid database URL format. Must start with postgresql:// or postgres://. Received: ${dbUrl.substring(0, 50)}...`);
}

let db;
try {
  // Initialize the PostgreSQL pool with additional options for production
  const pool = new Pool({
    connectionString: dbUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
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

  // Test the connection only in development
  if (process.env.NODE_ENV !== 'production') {
    pool.query('SELECT 1', (err, res) => {
      if (err) {
        console.error('Database connection test failed:', err);
      }
    });
  }
} catch (error) {
  console.error('Database initialization error:', error);
  throw new Error(`Error initializing the database connection: ${error.message}`);
}

export { db };