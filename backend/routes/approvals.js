import express from 'express';
import supabase from '../db.js';

const router = express.Router();

// GET /api/approvals — Fetch all pending registration requests
router.get('/', async (req, res) => {
  try {
    const { data: requests, error } = await supabase
      .from('pending_approvals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formatted = (requests || []).map(r => ({
      id: r.id,
      name: r.name,
      email: r.email,
      department: r.department,
      desiredRole: r.desired_role || r.desiredRole || 'student'
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching pending approvals from Supabase:', err.message);
    res.status(500).json({ error: 'Failed to fetch pending approvals' });
  }
});

// POST /api/approvals — Create a new pending registration request
router.post('/', async (req, res) => {
  try {
    const { name, email, department, desiredRole } = req.body;

    const { data: request, error } = await supabase
      .from('pending_approvals')
      .insert([{
        name,
        email,
        department,
        desired_role: desiredRole || 'student'
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      id: request.id,
      name: request.name,
      email: request.email,
      department: request.department,
      desiredRole: request.desired_role || desiredRole
    });
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

    const { data: reqItem, error: fetchErr } = await supabase
      .from('pending_approvals')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !reqItem) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const roleToAssign = assignedRole || reqItem.desired_role || reqItem.desiredRole || 'student';

    // Assign / update role in user_roles table
    await supabase.from('user_roles').upsert(
      { email: reqItem.email, role: roleToAssign },
      { onConflict: 'email' }
    );

    // If assigned role is student, check if student record exists or create default
    if (roleToAssign === 'student') {
      const { data: existingStudent } = await supabase
        .from('students')
        .select('id')
        .eq('email', reqItem.email)
        .maybeSingle();

      if (!existingStudent) {
        const genRoll = `${reqItem.department.substring(0, 2).toUpperCase()}2025${Math.floor(100 + Math.random() * 900)}`;
        const { data: newStudent } = await supabase
          .from('students')
          .insert([{
            name: reqItem.name,
            roll_number: genRoll,
            email: reqItem.email,
            department: reqItem.department,
            year: 1,
            semester: 1,
            cgpa: 8.0,
            fee_status: 'Pending',
            fee_amount: 45000
          }])
          .select()
          .single();

        if (newStudent) {
          await supabase.from('student_courses').insert([
            { student_id: newStudent.id, course_name: 'Calculus I' },
            { student_id: newStudent.id, course_name: 'Intro to Programming' }
          ]);
          await supabase.from('student_documents').insert([
            { student_id: newStudent.id, name: 'High School Marksheet', status: 'Submitted' },
            { student_id: newStudent.id, name: 'ID Proof / Passport', status: 'Submitted' }
          ]);
        }
      }
    }

    // Remove from pending list
    await supabase.from('pending_approvals').delete().eq('id', id);

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
    const { error } = await supabase.from('pending_approvals').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Request rejected successfully', id });
  } catch (err) {
    console.error('Error rejecting request in Supabase:', err.message);
    res.status(400).json({ error: 'Failed to reject request' });
  }
});

export default router;
