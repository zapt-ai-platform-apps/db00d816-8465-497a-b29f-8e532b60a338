import { favoriteNames } from '../drizzle/schema.js';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    const result = await db
      .insert(favoriteNames)
      .values({ name })
      .returning();

    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Error saving favorite name:', error);
    res.status(500).json({ error: 'Error saving favorite name' });
  }
}