import express from 'express';
import prisma from '../db.js';

const router = express.Router();

// GET /api/roles/:email — Get role by email
router.get('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const userRole = await prisma.userRole.findUnique({ where: { email } });
    if (!userRole) {
      return res.json({ email, role: 'pending' });
    }
    res.json(userRole);
  } catch (err) {
    console.error('Error fetching role:', err);
    res.status(500).json({ error: 'Failed to fetch user role' });
  }
});

// POST /api/roles — Upsert user role
router.post('/', async (req, res) => {
  try {
    const { email, role } = req.body;

    const updated = await prisma.userRole.upsert({
      where: { email },
      update: { role },
      create: { email, role }
    });

    res.json(updated);
  } catch (err) {
    console.error('Error setting role:', err);
    res.status(400).json({ error: 'Failed to update user role' });
  }
});

export default router;
