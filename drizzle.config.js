import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: "postgresql",
  schema: './drizzle/schema.js',
  out: './drizzle',
  dbCredentials: {
    connectionString: process.env.NEON_DB_URL,
  },
});