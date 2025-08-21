// src/db/index.ts
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { config } from 'dotenv';
import { certification } from './schemas/certification';
import { courses } from './schemas/courses';
import { certificateTracking } from './schemas/certificateTracking';
import { examBookings } from './schemas/examBookings';
import { user } from './schemas/user';
import * as relations from './schemas/relations';

// Load environment variables
config({ path: '.env.local' });

const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error('POSTGRES_URL or DATABASE_URL is not defined in the environment variables');
}

// Validate the connection string format
if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
  throw new Error('Invalid database URL format. Must start with postgresql:// or postgres://');
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
      examBookings,
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