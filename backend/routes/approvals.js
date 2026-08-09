import express from 'express';
import crypto from 'crypto';
import db from '../db.js';

const router = express.Router();

// GET /api/approvals — Fetch all pending registration requests
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM "PendingApproval" ORDER BY "createdAt" DESC;');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching pending approvals from Supabase:', err.message);
    res.status(500).json({ error: 'Failed to fetch pending approvals' });
  }
});

// POST /api/approvals — Create a new pending registration request
router.post('/', async (req, res) => {
  try {
    const { name, email, department, desiredRole } = req.body;
    const id = crypto.randomUUID();

    const insertQuery = `
      INSERT INTO "PendingApproval" ("id", "name", "email", "department", "desiredRole", "createdAt")
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *;
    `;

    const result = await db.query(insertQuery, [
      id,
      name,
      email,
      department,
      desiredRole || 'student'
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating pending approval in Supabase:', err.message);
    res.status(400).json({ error: 'Failed to submit registration request' });
  }
});

// POST /api/approvals/:id/approve — Approve request and assign user role
router.post('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedRole } = req.body;

    const reqRes = await db.query('SELECT * FROM "PendingApproval" WHERE "id" = $1;', [id]);
    if (reqRes.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const reqItem = reqRes.rows[0];
    const roleToAssign = assignedRole || reqItem.desiredRole || 'student';

    // Assign / update role in UserRole table
    await db.query(
      'INSERT INTO "UserRole" ("id", "email", "role", "createdAt") VALUES ($1, $2, $3, NOW()) ON CONFLICT ("email") DO UPDATE SET "role" = EXCLUDED."role";',
      [crypto.randomUUID(), reqItem.email.toLowerCase(), roleToAssign]
    );

    // If assigned role is student, check if student record exists or create default
    if (roleToAssign === 'student') {
      const existingStudentRes = await db.query('SELECT * FROM "Student" WHERE LOWER("email") = LOWER($1);', [reqItem.email]);
      if (existingStudentRes.rows.length === 0) {
        const studentId = crypto.randomUUID();
        const genRoll = `${reqItem.department.substring(0, 2).toUpperCase()}2025${Math.floor(100 + Math.random() * 900)}`;

        await db.query(
          'INSERT INTO "Student" ("id", "name", "rollNumber", "email", "department", "year", "semester", "cgpa", "feeStatus", "feeAmount", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, 1, 1, 8.0, \'Pending\', 45000, NOW(), NOW());',
          [studentId, reqItem.name, genRoll, reqItem.email, reqItem.department]
        );

        await db.query('INSERT INTO "StudentCourse" ("id", "studentId", "courseName") VALUES ($1, $2, $3);', [crypto.randomUUID(), studentId, 'Calculus I']);
        await db.query('INSERT INTO "StudentCourse" ("id", "studentId", "courseName") VALUES ($1, $2, $3);', [crypto.randomUUID(), studentId, 'Intro to Programming']);

        await db.query('INSERT INTO "StudentDocument" ("id", "studentId", "name", "status") VALUES ($1, $2, $3, $4);', [crypto.randomUUID(), studentId, 'High School Marksheet', 'Submitted']);
        await db.query('INSERT INTO "StudentDocument" ("id", "studentId", "name", "status") VALUES ($1, $2, $3, $4);', [crypto.randomUUID(), studentId, 'ID Proof / Passport', 'Submitted']);
      }
    }

    // Remove from pending list
    await db.query('DELETE FROM "PendingApproval" WHERE "id" = $1;', [id]);

    res.json({ message: 'Approved successfully', email: reqItem.email, assignedRole: roleToAssign });
  } catch (err) {
    console.error('Error approving request in Supabase:', err.message);
    res.status(400).json({ error: 'Failed to approve request' });
  }
});

// POST /api/approvals/:id/reject — Dismiss pending request
router.post('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM "PendingApproval" WHERE "id" = $1;', [id]);
    res.json({ message: 'Request rejected successfully', id });
  } catch (err) {
    console.error('Error rejecting request in Supabase:', err.message);
    res.status(400).json({ error: 'Failed to reject request' });
  }
});

export default router;
