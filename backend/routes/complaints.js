import express from 'express';
import prisma from '../db.js';

const router = express.Router();

// GET /api/complaints — Fetch complaints
router.get('/', async (req, res) => {
  try {
    const { department, studentId } = req.query;

    const where = {};
    if (department) where.department = department;
    if (studentId) where.studentId = studentId;

    const complaints = await prisma.complaint.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json(complaints);
  } catch (err) {
    console.error('Error fetching complaints:', err);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// POST /api/complaints — File a new complaint
router.post('/', async (req, res) => {
  try {
    const { studentId, studentName, studentRoll, department, subject, description, date } = req.body;

    const newComplaint = await prisma.complaint.create({
      data: {
        studentId,
        studentName,
        studentRoll,
        department,
        subject,
        description,
        status: 'Pending',
        date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }
    });

    res.status(201).json(newComplaint);
  } catch (err) {
    console.error('Error filing complaint:', err);
    res.status(400).json({ error: 'Failed to file complaint' });
  }
});

// PUT /api/complaints/:id/resolve — Resolve complaint
router.put('/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;

    const updated = await prisma.complaint.update({
      where: { id },
      data: {
        status: 'Resolved',
        resolution: resolution || 'Issue addressed by department professor.'
      }
    });

    res.json(updated);
  } catch (err) {
    console.error('Error resolving complaint:', err);
    res.status(400).json({ error: 'Failed to resolve complaint' });
  }
});

export default router;
