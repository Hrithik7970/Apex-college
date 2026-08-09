import express from 'express';
import crypto from 'crypto';
import db from '../db.js';

const router = express.Router();

// GET /api/announcements — Fetch all announcements
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM "Announcement" ORDER BY "createdAt" DESC;');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching announcements from Supabase:', err.message);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// POST /api/announcements — Create new announcement
router.post('/', async (req, res) => {
  try {
    const { title, content, priority, author, date } = req.body;
    const id = crypto.randomUUID();
    const formattedDate = date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const insertQuery = `
      INSERT INTO "Announcement" ("id", "title", "content", "priority", "author", "date", "createdAt")
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *;
    `;

    const result = await db.query(insertQuery, [
      id,
      title,
      content,
      priority || 'Normal',
      author || 'College Administration',
      formattedDate
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error publishing announcement in Supabase:', err.message);
    res.status(400).json({ error: 'Failed to publish announcement' });
  }
});

// DELETE /api/announcements/:id — Delete announcement
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM "Announcement" WHERE "id" = $1;', [id]);
    res.json({ message: 'Announcement deleted successfully', id });
  } catch (err) {
    console.error('Error deleting announcement in Supabase:', err.message);
    res.status(400).json({ error: 'Failed to delete announcement' });
  }
});

export default router;
