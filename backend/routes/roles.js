import express from 'express';
import supabase from '../db.js';

const router = express.Router();

// GET /api/roles/:email — Get role by email
router.get('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { data: userRole, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (error || !userRole) {
      return res.json({ email, role: 'pending' });
    }
    res.json(userRole);
  } catch (err) {
    console.error('Error fetching role from Supabase:', err.message);
    res.status(500).json({ error: 'Failed to fetch user role' });
  }
});

// POST /api/roles — Upsert user role
router.post('/', async (req, res) => {
  try {
    const { email, role } = req.body;

    const { data: updated, error } = await supabase
      .from('user_roles')
      .upsert(
        { email: email.toLowerCase(), role },
        { onConflict: 'email' }
      )
      .select()
      .single();

    if (error) throw error;
    res.json(updated);
  } catch (err) {
    console.error('Error setting role in Supabase:', err.message);
    res.status(400).json({ error: 'Failed to update user role' });
  }
});

export default router;
