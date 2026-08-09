import express from 'express';
import crypto from 'crypto';
import db from '../db.js';

const router = express.Router();

// GET /api/complaints — Fetch complaints
router.get('/', async (req, res) => {
  try {
    const { department, studentId } = req.query;

    let queryText = 'SELECT * FROM "Complaint" WHERE 1=1';
    const params = [];

    if (department) {
      params.push(department);
      queryText += ` AND "department" = $${params.length}`;
    }
    if (studentId) {
      params.push(studentId);
      queryText += ` AND "studentId" = $${params.length}`;
    }

    queryText += ' ORDER BY "createdAt" DESC;';

    const result = await db.query(queryText, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching complaints from Supabase:', err.message);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// POST /api/complaints — File a new complaint
router.post('/', async (req, res) => {
  try {
    const { studentId, studentName, studentRoll, department, subject, description, date } = req.body;
    const id = crypto.randomUUID();
    const formattedDate = date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const insertQuery = `
      INSERT INTO "Complaint" ("id", "studentId", "studentName", "studentRoll", "department", "subject", "description", "status", "date", "createdAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'Pending', $8, NOW())
      RETURNING *;
    `;

    const result = await db.query(insertQuery, [
      id,
      studentId,
      studentName,
      studentRoll,
      department,
      subject,
      description,
      formattedDate
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error filing complaint in Supabase:', err.message);
    res.status(400).json({ error: 'Failed to file complaint' });
  }
});

// PUT /api/complaints/:id/resolve — Resolve complaint
router.put('/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;

    const updateQuery = `
      UPDATE "Complaint"
      SET "status" = 'Resolved', "resolution" = $1
      WHERE "id" = $2
      RETURNING *;
    `;

    const result = await db.query(updateQuery, [
      resolution || 'Issue addressed by department professor.',
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error resolving complaint in Supabase:', err.message);
    res.status(400).json({ error: 'Failed to resolve complaint' });
  }
});

export default router;
