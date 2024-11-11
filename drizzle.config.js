import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  driver: 'pg',
  schema: './drizzle/schema.js',
  out: './drizzle',
  dbCredentials: {
    connectionString: process.env.NEON_DB_URL,
  },
});