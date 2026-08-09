import express from 'express';
import supabase from '../db.js';

const router = express.Router();

// GET /api/complaints — Fetch complaints
router.get('/', async (req, res) => {
  try {
    const { department, studentId } = req.query;

    let query = supabase.from('complaints').select('*').order('created_at', { ascending: false });

    if (department) query = query.eq('department', department);
    if (studentId) query = query.eq('student_id', studentId);

    const { data: complaints, error } = await query;
    if (error) throw error;

    const formatted = (complaints || []).map(c => ({
      id: c.id,
      studentId: c.student_id || c.studentId,
      studentName: c.student_name || c.studentName,
      studentRoll: c.student_roll || c.studentRoll,
      department: c.department,
      subject: c.subject,
      description: c.description,
      status: c.status,
      resolution: c.resolution || '',
      date: c.date
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching complaints from Supabase:', err.message);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// POST /api/complaints — File a new complaint
router.post('/', async (req, res) => {
  try {
    const { studentId, studentName, studentRoll, department, subject, description, date } = req.body;

    const { data: newComplaint, error } = await supabase
      .from('complaints')
      .insert([{
        student_id: studentId,
        student_name: studentName,
        student_roll: studentRoll,
        department,
        subject,
        description,
        status: 'Pending',
        date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      id: newComplaint.id,
      studentId: newComplaint.student_id || studentId,
      studentName: newComplaint.student_name || studentName,
      studentRoll: newComplaint.student_roll || studentRoll,
      department: newComplaint.department,
      subject: newComplaint.subject,
      description: newComplaint.description,
      status: newComplaint.status,
      resolution: newComplaint.resolution || '',
      date: newComplaint.date
    });
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

    const { data: updated, error } = await supabase
      .from('complaints')
      .update({
        status: 'Resolved',
        resolution: resolution || 'Issue addressed by department professor.'
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      id: updated.id,
      studentId: updated.student_id || updated.studentId,
      studentName: updated.student_name || updated.studentName,
      studentRoll: updated.student_roll || updated.studentRoll,
      department: updated.department,
      subject: updated.subject,
      description: updated.description,
      status: updated.status,
      resolution: updated.resolution,
      date: updated.date
    });
  } catch (err) {
    console.error('Error resolving complaint in Supabase:', err.message);
    res.status(400).json({ error: 'Failed to resolve complaint' });
  }
});

export default router;
