import express from 'express';
import supabase from '../db.js';

const router = express.Router();

// GET /api/announcements — Fetch all announcements
router.get('/', async (req, res) => {
  try {
    const { data: items, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(items || []);
  } catch (err) {
    console.error('Error fetching announcements from Supabase:', err.message);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// POST /api/announcements — Create new announcement
router.post('/', async (req, res) => {
  try {
    const { title, content, priority, author, date } = req.body;

    const { data: newAnnouncement, error } = await supabase
      .from('announcements')
      .insert([{
        title,
        content,
        priority: priority || 'Normal',
        author: author || 'College Administration',
        date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(newAnnouncement);
  } catch (err) {
    console.error('Error creating announcement in Supabase:', err.message);
    res.status(400).json({ error: 'Failed to publish announcement' });
  }
});

// DELETE /api/announcements/:id — Delete announcement
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Announcement deleted successfully', id });
  } catch (err) {
    console.error('Error deleting announcement in Supabase:', err.message);
    res.status(400).json({ error: 'Failed to delete announcement' });
  }
});

export default router;
