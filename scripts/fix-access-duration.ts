import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';

config({ path: '.env.local' });

const connectionString = process.env.POSTGRES_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

async function fixAccessDurationColumn() {
  try {
    console.log('Dropping old access_duration_months column...');
    await db.execute(sql`ALTER TABLE courses DROP COLUMN IF EXISTS access_duration_months`);
    
    console.log('Creating new access_duration_months column as INTEGER...');
    await db.execute(sql`ALTER TABLE courses ADD COLUMN access_duration_months INTEGER`);
    
    console.log('✅ Column fixed successfully!');
  } catch (error) {
    console.error('❌ Error fixing column:', error);
  } finally {
    await client.end();
  }
}

fixAccessDurationColumn();
