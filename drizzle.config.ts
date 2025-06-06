import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });

export default defineConfig({
  schema: ['./src/db/schemas/*.ts'],
  out: './drizzle/migrations',
  dialect: 'postgresql',  // Keep this as it was working
  dbCredentials: {
    url: process.env.POSTGRES_URL!,  // Keep this as it was working
  },
});