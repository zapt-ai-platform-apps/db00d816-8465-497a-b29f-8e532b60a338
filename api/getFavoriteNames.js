import { favoriteNames } from '../drizzle/schema.js';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    const names = await db.select().from(favoriteNames).orderBy(favoriteNames.createdAt.desc());

    res.status(200).json(names);
  } catch (error) {
    console.error('Error fetching favorite names:', error);
    res.status(500).json({ error: 'Error fetching favorite names' });
  }
}