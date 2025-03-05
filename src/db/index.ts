// src/db/index.ts
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { config } from 'dotenv';
import { certification } from './schemas/certification';
import { courses } from './schemas/courses';
import { certificateTracking } from './schemas/certificateTracking';

// Load environment variables
config({ path: '.env' });

const dbUrl = process.env.POSTGRES_URL;
if (!dbUrl) {
  console.error('POSTGRES_URL is not defined in the environment variables');
  throw new Error('POSTGRES_URL is not defined in the environment variables');
}

// Use a global variable to cache the pool instance in a serverless environment
declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

const pool = global.__pgPool || new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
});

// Cache the pool instance if it's not already cached
if (!global.__pgPool) {
  global.__pgPool = pool;
}

// Initialize the drizzle ORM with your schemas
const db = drizzle(pool, {
  schema: {
    certification,
    courses,
    certificateTracking,
  },
});

// Optionally run a connection test in non-production environments only
if (process.env.NODE_ENV !== 'production') {
  pool.query('SELECT 1', (err, res) => {
    if (err) {
      console.error('Database connection test failed', err);
      // Depending on your needs, you might want to throw or handle this gracefully.
    } else {
      console.log('Database connected successfully');
    }
  });
}

export { db };


// // src/db/index.ts
// import { Pool } from 'pg';
// import { drizzle } from 'drizzle-orm/node-postgres';
// import { config } from 'dotenv';
// import { certification } from './schemas/certification';
// import { courses } from './schemas/courses';
// import { certificateTracking } from './schemas/certificateTracking';

// // Load environment variables
// config({ path: '.env' });

// const dbUrl = process.env.POSTGRES_URL;
// if (!dbUrl) {
//   console.error('POSTGRES_URL is not defined in the environment variables');
//   throw new Error('POSTGRES_URL is not defined in the environment variables');
// }

// let db;
// try {
//   // Initialize the PostgreSQL pool
//   const pool = new Pool({
//     connectionString: dbUrl,
//     ssl: { rejectUnauthorized: false }, // ✅ Ensure SSL is enabled
//     connectionTimeoutMillis: 30000, // ✅ Increase connection timeout
//     idleTimeoutMillis: 30000, // ✅ Keep idle connections
//   });

//   // Initialize the drizzle ORM with schemas
//   db = drizzle(pool, {
//     schema: {
//       certification,
//       courses,
//       certificateTracking
//     }
//   });

//   // Test the connection
//   pool.query('SELECT 1', (err, res) => {
//     if (err) {
//       console.error('Database connection test failed', err);
//       throw err;
//     } else {
//       console.log('Database connected successfully');
//     }
//   });
// } catch (error) {
//   console.error('Error initializing the database connection', error);
//   throw new Error('Error initializing the database connection');
// }

// export { db };