import express from 'express';
import crypto from 'crypto';
import db from '../db.js';

const router = express.Router();

// GET /api/roles/:email — Get role by email
router.get('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const result = await db.query('SELECT * FROM "UserRole" WHERE LOWER("email") = LOWER($1);', [email]);
    if (result.rows.length === 0) {
      return res.json({ email, role: 'pending' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching user role from Supabase:', err.message);
    res.status(500).json({ error: 'Failed to fetch user role' });
  }
});

// POST /api/roles — Upsert user role
router.post('/', async (req, res) => {
  try {
    const { email, role } = req.body;

    const queryText = `
      INSERT INTO "UserRole" ("id", "email", "role", "createdAt")
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT ("email") DO UPDATE SET "role" = EXCLUDED."role"
      RETURNING *;
    `;

    const result = await db.query(queryText, [crypto.randomUUID(), email.toLowerCase(), role]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error setting user role in Supabase:', err.message);
    res.status(400).json({ error: 'Failed to update user role' });
  }
});

export default router;
