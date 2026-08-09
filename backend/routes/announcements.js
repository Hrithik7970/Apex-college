import express from 'express';
import prisma from '../db.js';

const router = express.Router();

// GET /api/announcements — Fetch all announcements
router.get('/', async (req, res) => {
  try {
    const items = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(items);
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// POST /api/announcements — Create new announcement
router.post('/', async (req, res) => {
  try {
    const { title, content, priority, author, date } = req.body;

    const newAnnouncement = await prisma.announcement.create({
      data: {
        title,
        content,
        priority: priority || 'Normal',
        author: author || 'College Administration',
        date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }
    });

    res.status(201).json(newAnnouncement);
  } catch (err) {
    console.error('Error creating announcement:', err);
    res.status(400).json({ error: 'Failed to publish announcement' });
  }
});

// DELETE /api/announcements/:id — Delete announcement
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.announcement.delete({ where: { id } });
    res.json({ message: 'Announcement deleted successfully', id });
  } catch (err) {
    console.error('Error deleting announcement:', err);
    res.status(400).json({ error: 'Failed to delete announcement' });
  }
});

export default router;
