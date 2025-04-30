// src/db/index.ts
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { config } from 'dotenv';
import { certification } from './schemas/certification';
import { courses } from './schemas/courses';
import { certificateTracking } from './schemas/certificateTracking';

// Load environment variables
config({ path: '.env.local' });

const dbUrl = process.env.POSTGRES_URL;
if (!dbUrl) {
  throw new Error('POSTGRES_URL is not defined in the environment variables');
}

let db;
try {
  // Initialize the PostgreSQL pool
  const pool = new Pool({
    connectionString: dbUrl,
  });

  // Initialize the drizzle ORM with schemas
  db = drizzle(pool, {
    schema: {
      certification,
      courses,
      certificateTracking
    }
  });

  // Test the connection
  pool.query('SELECT 1', (err, res) => {
    if (err) {
      throw err;
    } else {
    }
  });
} catch (error) {
  throw new Error('Error initializing the database connection');
}

export { db };