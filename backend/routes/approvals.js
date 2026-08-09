import express from 'express';
import prisma from '../db.js';

const router = express.Router();

// GET /api/approvals — Fetch all pending registration requests
router.get('/', async (req, res) => {
  try {
    const requests = await prisma.pendingApproval.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(requests);
  } catch (err) {
    console.error('Error fetching pending approvals:', err);
    res.status(500).json({ error: 'Failed to fetch pending approvals' });
  }
});

// POST /api/approvals — Create a new pending registration request
router.post('/', async (req, res) => {
  try {
    const { name, email, department, desiredRole } = req.body;

    const request = await prisma.pendingApproval.create({
      data: {
        name,
        email,
        department,
        desiredRole: desiredRole || 'student'
      }
    });

    res.status(201).json(request);
  } catch (err) {
    console.error('Error creating pending approval:', err);
    res.status(400).json({ error: 'Failed to submit registration request' });
  }
});

// POST /api/approvals/:id/approve — Approve request and assign user role
router.post('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedRole } = req.body;

    const reqItem = await prisma.pendingApproval.findUnique({ where: { id } });
    if (!reqItem) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const roleToAssign = assignedRole || reqItem.desiredRole || 'student';

    // Assign / update role in UserRole table
    await prisma.userRole.upsert({
      where: { email: reqItem.email },
      update: { role: roleToAssign },
      create: { email: reqItem.email, role: roleToAssign }
    });

    // If assigned role is student, check if student record exists or create default
    if (roleToAssign === 'student') {
      const existingStudent = await prisma.student.findUnique({ where: { email: reqItem.email } });
      if (!existingStudent) {
        const genRoll = `${reqItem.department.substring(0, 2).toUpperCase()}2025${Math.floor(100 + Math.random() * 900)}`;
        await prisma.student.create({
          data: {
            name: reqItem.name,
            rollNumber: genRoll,
            email: reqItem.email,
            department: reqItem.department,
            year: 1,
            semester: 1,
            cgpa: 8.0,
            feeStatus: 'Pending',
            feeAmount: 45000,
            courses: {
              create: [{ courseName: 'Calculus I' }, { courseName: 'Intro to Programming' }]
            },
            documents: {
              create: [
                { name: 'High School Marksheet', status: 'Submitted' },
                { name: 'ID Proof / Passport', status: 'Submitted' }
              ]
            }
          }
        });
      }
    }

    // Remove from pending list
    await prisma.pendingApproval.delete({ where: { id } });

    res.json({ message: 'Approved successfully', email: reqItem.email, assignedRole: roleToAssign });
  } catch (err) {
    console.error('Error approving request:', err);
    res.status(400).json({ error: 'Failed to approve request' });
  }
});

// POST /api/approvals/:id/reject — Dismiss pending request
router.post('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.pendingApproval.delete({ where: { id } });
    res.json({ message: 'Request rejected successfully', id });
  } catch (err) {
    console.error('Error rejecting request:', err);
    res.status(400).json({ error: 'Failed to reject request' });
  }
});

export default router;
