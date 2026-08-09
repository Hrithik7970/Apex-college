import express from 'express';
import crypto from 'crypto';
import db from '../db.js';

const router = express.Router();

const MASTER_ADMINS = ['hraj22634@gmail.com', 'admin@college.edu'];

// GET /api/roles — Fetch all roles OR fetch by query param ?email=xyz
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;

    if (email) {
      const cleanEmail = email.toLowerCase().trim();
      if (MASTER_ADMINS.includes(cleanEmail)) {
        return res.json({ email: cleanEmail, role: 'admin' });
      }

      const result = await db.query('SELECT * FROM "UserRole" WHERE LOWER("email") = LOWER($1);', [cleanEmail]);
      if (result.rows.length === 0) {
        return res.json({ email: cleanEmail, role: 'pending' });
      }
      return res.json(result.rows[0]);
    }

    // Return all user roles if no query email
    const allRoles = await db.query('SELECT * FROM "UserRole" ORDER BY "createdAt" DESC;');
    res.json(allRoles.rows);
  } catch (err) {
    console.error('Error fetching roles from Supabase:', err.message);
    res.status(500).json({ error: 'Failed to fetch user roles' });
  }
});

// GET /api/roles/:email — Get role by email parameter
router.get('/:email', async (req, res) => {
  try {
    const rawEmail = req.params.email || '';
    const cleanEmail = decodeURIComponent(rawEmail).toLowerCase().trim();

    if (!cleanEmail) {
      return res.json({ email: '', role: 'pending' });
    }

    if (MASTER_ADMINS.includes(cleanEmail)) {
      return res.json({ email: cleanEmail, role: 'admin' });
    }

    const result = await db.query('SELECT * FROM "UserRole" WHERE LOWER("email") = LOWER($1);', [cleanEmail]);
    if (result.rows.length === 0) {
      return res.json({ email: cleanEmail, role: 'pending' });
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
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const assignedRole = role || 'student';

    const queryText = `
      INSERT INTO "UserRole" ("id", "email", "role", "createdAt")
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT ("email") DO UPDATE SET "role" = EXCLUDED."role"
      RETURNING *;
    `;

    const result = await db.query(queryText, [crypto.randomUUID(), cleanEmail, assignedRole]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error setting user role in Supabase:', err.message);
    res.status(400).json({ error: 'Failed to update user role' });
  }
});

export default router;
