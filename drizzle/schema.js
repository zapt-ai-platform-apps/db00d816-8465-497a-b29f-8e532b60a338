import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const favoriteNames = pgTable('favorite_names', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  gender: text('gender').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});