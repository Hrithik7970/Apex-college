import express from 'express';
import supabase from '../db.js';

const router = express.Router();

// GET /api/students — Fetch all students with relations
router.get('/', async (req, res) => {
  try {
    const { data: students, error } = await supabase
      .from('students')
      .select('*, courses:student_courses(*), documents:student_documents(*), attendanceLogs:attendance_logs(*)');

    if (error) throw error;

    const formatted = (students || []).map(s => ({
      _id: s.id,
      name: s.name,
      rollNumber: s.roll_number || s.rollNumber || '',
      email: s.email,
      department: s.department,
      year: s.year,
      semester: s.semester,
      cgpa: s.cgpa,
      attendance: s.attendance,
      feeStatus: s.fee_status || s.feeStatus || 'Pending',
      feeAmount: s.fee_amount !== undefined ? s.fee_amount : (s.feeAmount || 0),
      courses: (s.courses || []).map(c => c.course_name || c.courseName),
      documents: (s.documents || []).map(d => ({ name: d.name, status: d.status })),
      attendanceLogs: (s.attendanceLogs || []).map(l => ({ date: l.date, course: l.course, status: l.status }))
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching students from Supabase:', err.message);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// POST /api/students — Create new student
router.post('/', async (req, res) => {
  try {
    const { name, rollNumber, email, department, year, semester, cgpa, feeStatus, feeAmount, courses } = req.body;

    const studentRecord = {
      name,
      roll_number: rollNumber,
      email,
      department,
      year: parseInt(year) || 1,
      semester: parseInt(semester) || 1,
      cgpa: parseFloat(cgpa) || 0.0,
      fee_status: feeStatus || 'Pending',
      fee_amount: parseInt(feeAmount) || 0
    };

    const { data: student, error } = await supabase
      .from('students')
      .insert([studentRecord])
      .select()
      .single();

    if (error) throw error;

    // Add courses if provided
    let courseList = [];
    if (courses && courses.length > 0) {
      const courseInserts = courses.map(c => ({
        student_id: student.id,
        course_name: typeof c === 'string' ? c : c.courseName
      }));
      const { data: addedCourses } = await supabase.from('student_courses').insert(courseInserts).select();
      courseList = (addedCourses || []).map(c => c.course_name);
    }

    // Add initial documents
    const docInserts = [
      { student_id: student.id, name: 'High School Marksheet', status: 'Pending' },
      { student_id: student.id, name: 'ID Proof / Passport', status: 'Pending' },
      { student_id: student.id, name: 'Admissions Letter', status: 'Pending' }
    ];
    const { data: addedDocs } = await supabase.from('student_documents').insert(docInserts).select();
    const docList = (addedDocs || []).map(d => ({ name: d.name, status: d.status }));

    // Register user role
    try {
      await supabase.from('user_roles').upsert({ email: email.toLowerCase(), role: 'student' }, { onConflict: 'email' });
    } catch (rErr) {
      console.warn('Role registration warning:', rErr.message);
    }

    const formatted = {
      _id: student.id,
      name: student.name,
      rollNumber: student.roll_number || rollNumber,
      email: student.email,
      department: student.department,
      year: student.year,
      semester: student.semester,
      cgpa: student.cgpa,
      attendance: student.attendance || 0,
      feeStatus: student.fee_status || feeStatus,
      feeAmount: student.fee_amount || feeAmount,
      courses: courseList.length > 0 ? courseList : (courses || []),
      documents: docList,
      attendanceLogs: []
    };

    res.status(201).json(formatted);
  } catch (err) {
    console.error('Error creating student in Supabase:', err.message);
    res.status(400).json({ error: err.message || 'Failed to create student' });
  }
});

// PUT /api/students/:id — Update student profile
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rollNumber, email, department, year, semester, cgpa, feeStatus, feeAmount, courses, documents } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (rollNumber) updates.roll_number = rollNumber;
    if (email) updates.email = email;
    if (department) updates.department = department;
    if (year !== undefined) updates.year = parseInt(year);
    if (semester !== undefined) updates.semester = parseInt(semester);
    if (cgpa !== undefined) updates.cgpa = parseFloat(cgpa);
    if (feeStatus) updates.fee_status = feeStatus;
    if (feeAmount !== undefined) updates.fee_amount = parseInt(feeAmount);

    const { data: updated, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Handle courses update
    if (courses) {
      await supabase.from('student_courses').delete().eq('student_id', id);
      const courseInserts = courses.map(c => ({
        student_id: id,
        course_name: typeof c === 'string' ? c : c.courseName
      }));
      await supabase.from('student_courses').insert(courseInserts);
    }

    // Handle documents update
    if (documents) {
      await supabase.from('student_documents').delete().eq('student_id', id);
      const docInserts = documents.map(d => ({
        student_id: id,
        name: d.name,
        status: d.status
      }));
      await supabase.from('student_documents').insert(docInserts);
    }

    // Fetch updated relations
    const { data: cData } = await supabase.from('student_courses').select('*').eq('student_id', id);
    const { data: dData } = await supabase.from('student_documents').select('*').eq('student_id', id);
    const { data: aData } = await supabase.from('attendance_logs').select('*').eq('student_id', id);

    const formatted = {
      _id: updated.id,
      name: updated.name,
      rollNumber: updated.roll_number || updated.rollNumber || '',
      email: updated.email,
      department: updated.department,
      year: updated.year,
      semester: updated.semester,
      cgpa: updated.cgpa,
      attendance: updated.attendance,
      feeStatus: updated.fee_status || updated.feeStatus,
      feeAmount: updated.fee_amount !== undefined ? updated.fee_amount : updated.feeAmount,
      courses: (cData || []).map(c => c.course_name),
      documents: (dData || []).map(d => ({ name: d.name, status: d.status })),
      attendanceLogs: (aData || []).map(l => ({ date: l.date, course: l.course, status: l.status }))
    };

    res.json(formatted);
  } catch (err) {
    console.error('Error updating student in Supabase:', err.message);
    res.status(400).json({ error: 'Failed to update student' });
  }
});

// DELETE /api/students/:id — Delete student
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Student deleted successfully', id });
  } catch (err) {
    console.error('Error deleting student in Supabase:', err.message);
    res.status(400).json({ error: 'Failed to delete student' });
  }
});

// POST /api/students/:id/attendance — Log attendance for student
router.post('/:id/attendance', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, course, status } = req.body;

    const { error: logErr } = await supabase
      .from('attendance_logs')
      .insert([{ student_id: id, date, course, status }]);

    if (logErr) throw logErr;

    // Recalculate attendance %
    const { data: logs } = await supabase.from('attendance_logs').select('*').eq('student_id', id);
    const presentCount = (logs || []).filter(l => l.status === 'Present' || l.status === 'Late').length;
    const newAttPct = logs && logs.length > 0 ? Math.round((presentCount / logs.length) * 100) : 100;

    await supabase.from('students').update({ attendance: newAttPct }).eq('id', id);

    res.json({
      _id: id,
      attendance: newAttPct,
      attendanceLogs: (logs || []).map(l => ({ date: l.date, course: l.course, status: l.status }))
    });
  } catch (err) {
    console.error('Error logging attendance in Supabase:', err.message);
    res.status(400).json({ error: 'Failed to log attendance' });
  }
});

export default router;
