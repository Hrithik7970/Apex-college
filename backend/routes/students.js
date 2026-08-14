import express from 'express';
import crypto from 'crypto';
import db from '../db.js';

const router = express.Router();

// GET /api/students — Fetch all students with relations
router.get('/', async (req, res) => {
  try {
    const studentsRes = await db.query('SELECT * FROM "Student" ORDER BY "createdAt" DESC;');
    const coursesRes = await db.query('SELECT * FROM "StudentCourse";');
    const docsRes = await db.query('SELECT * FROM "StudentDocument";');
    const logsRes = await db.query('SELECT * FROM "AttendanceLog";');

    const coursesMap = {};
    coursesRes.rows.forEach(c => {
      if (!coursesMap[c.studentId]) coursesMap[c.studentId] = [];
      coursesMap[c.studentId].push(c.courseName);
    });

    const docsMap = {};
    docsRes.rows.forEach(d => {
      if (!docsMap[d.studentId]) docsMap[d.studentId] = [];
      docsMap[d.studentId].push({ name: d.name, status: d.status });
    });

    const logsMap = {};
    logsRes.rows.forEach(l => {
      if (!logsMap[l.studentId]) logsMap[l.studentId] = [];
      logsMap[l.studentId].push({ date: l.date, course: l.course, status: l.status });
    });

    const formatted = studentsRes.rows.map(s => ({
      _id: s.id,
      name: s.name,
      rollNumber: s.rollNumber,
      email: s.email,
      department: s.department,
      year: s.year,
      semester: s.semester,
      cgpa: Math.max(6.0, parseFloat(s.cgpa) || 6.0),
      attendance: s.attendance || 0,
      feeStatus: s.feeStatus,
      feeAmount: s.feeAmount,
      courses: coursesMap[s.id] || [],
      documents: docsMap[s.id] || [],
      attendanceLogs: logsMap[s.id] || []
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
    const studentId = crypto.randomUUID();

    const insertStudentQuery = `
      INSERT INTO "Student" ("id", "name", "rollNumber", "email", "department", "year", "semester", "cgpa", "feeStatus", "feeAmount", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      RETURNING *;
    `;
    const studentRes = await db.query(insertStudentQuery, [
      studentId,
      name,
      rollNumber,
      email,
      department,
      parseInt(year) || 1,
      parseInt(semester) || 1,
      Math.max(6.0, parseFloat(cgpa) || 6.0),
      feeStatus || 'Pending',
      parseInt(feeAmount) || 0
    ]);

    const createdStudent = studentRes.rows[0];

    // Add courses
    const courseList = [];
    if (courses && courses.length > 0) {
      for (const c of courses) {
        const courseName = typeof c === 'string' ? c : c.courseName;
        await db.query(
          'INSERT INTO "StudentCourse" ("id", "studentId", "courseName") VALUES ($1, $2, $3);',
          [crypto.randomUUID(), studentId, courseName]
        );
        courseList.push(courseName);
      }
    }

    // Add initial documents
    const initialDocs = [
      { name: 'High School Marksheet', status: 'Pending' },
      { name: 'ID Proof / Passport', status: 'Pending' },
      { name: 'Admissions Letter', status: 'Pending' }
    ];
    for (const d of initialDocs) {
      await db.query(
        'INSERT INTO "StudentDocument" ("id", "studentId", "name", "status") VALUES ($1, $2, $3, $4);',
        [crypto.randomUUID(), studentId, d.name, d.status]
      );
    }

    // Register user role
    try {
      await db.query(
        'INSERT INTO "UserRole" ("id", "email", "role", "createdAt") VALUES ($1, $2, $3, NOW()) ON CONFLICT ("email") DO UPDATE SET "role" = EXCLUDED."role";',
        [crypto.randomUUID(), email.toLowerCase(), 'student']
      );
    } catch (rErr) {
      console.warn('Role registration warning:', rErr.message);
    }

    res.status(201).json({
      _id: createdStudent.id,
      name: createdStudent.name,
      rollNumber: createdStudent.rollNumber,
      email: createdStudent.email,
      department: createdStudent.department,
      year: createdStudent.year,
      semester: createdStudent.semester,
      cgpa: parseFloat(createdStudent.cgpa),
      attendance: createdStudent.attendance || 0,
      feeStatus: createdStudent.feeStatus,
      feeAmount: createdStudent.feeAmount,
      courses: courseList,
      documents: initialDocs,
      attendanceLogs: []
    });
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

    const updateQuery = `
      UPDATE "Student"
      SET 
        "name" = COALESCE($1, "name"),
        "rollNumber" = COALESCE($2, "rollNumber"),
        "email" = COALESCE($3, "email"),
        "department" = COALESCE($4, "department"),
        "year" = COALESCE($5, "year"),
        "semester" = COALESCE($6, "semester"),
        "cgpa" = COALESCE($7, "cgpa"),
        "feeStatus" = COALESCE($8, "feeStatus"),
        "feeAmount" = COALESCE($9, "feeAmount"),
        "updatedAt" = NOW()
      WHERE "id" = $10
      RETURNING *;
    `;

    const studentRes = await db.query(updateQuery, [
      name || null,
      rollNumber || null,
      email || null,
      department || null,
      year !== undefined ? parseInt(year) : null,
      semester !== undefined ? parseInt(semester) : null,
      cgpa !== undefined ? parseFloat(cgpa) : null,
      feeStatus || null,
      feeAmount !== undefined ? parseInt(feeAmount) : null,
      id
    ]);

    const updated = studentRes.rows[0];

    if (courses) {
      await db.query('DELETE FROM "StudentCourse" WHERE "studentId" = $1;', [id]);
      for (const c of courses) {
        const courseName = typeof c === 'string' ? c : c.courseName;
        await db.query(
          'INSERT INTO "StudentCourse" ("id", "studentId", "courseName") VALUES ($1, $2, $3);',
          [crypto.randomUUID(), id, courseName]
        );
      }
    }

    if (documents) {
      await db.query('DELETE FROM "StudentDocument" WHERE "studentId" = $1;', [id]);
      for (const d of documents) {
        await db.query(
          'INSERT INTO "StudentDocument" ("id", "studentId", "name", "status") VALUES ($1, $2, $3, $4);',
          [crypto.randomUUID(), id, d.name, d.status]
        );
      }
    }

    const cRes = await db.query('SELECT * FROM "StudentCourse" WHERE "studentId" = $1;', [id]);
    const dRes = await db.query('SELECT * FROM "StudentDocument" WHERE "studentId" = $1;', [id]);
    const lRes = await db.query('SELECT * FROM "AttendanceLog" WHERE "studentId" = $1;', [id]);

    res.json({
      _id: updated.id,
      name: updated.name,
      rollNumber: updated.rollNumber,
      email: updated.email,
      department: updated.department,
      year: updated.year,
      semester: updated.semester,
      cgpa: parseFloat(updated.cgpa),
      attendance: updated.attendance,
      feeStatus: updated.feeStatus,
      feeAmount: updated.feeAmount,
      courses: cRes.rows.map(c => c.courseName),
      documents: dRes.rows.map(d => ({ name: d.name, status: d.status })),
      attendanceLogs: lRes.rows.map(l => ({ date: l.date, course: l.course, status: l.status }))
    });
  } catch (err) {
    console.error('Error updating student in Supabase:', err.message);
    res.status(400).json({ error: 'Failed to update student' });
  }
});

// DELETE /api/students/:id — Delete student
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM "Student" WHERE "id" = $1;', [id]);
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

    await db.query(
      'INSERT INTO "AttendanceLog" ("id", "studentId", "date", "course", "status") VALUES ($1, $2, $3, $4, $5);',
      [crypto.randomUUID(), id, date, course, status]
    );

    const logsRes = await db.query('SELECT * FROM "AttendanceLog" WHERE "studentId" = $1;', [id]);
    const logs = logsRes.rows;
    const presentCount = logs.filter(l => l.status === 'Present' || l.status === 'Late').length;
    const newAttPct = logs.length > 0 ? Math.round((presentCount / logs.length) * 100) : 100;

    await db.query('UPDATE "Student" SET "attendance" = $1 WHERE "id" = $2;', [newAttPct, id]);

    res.json({
      _id: id,
      attendance: newAttPct,
      attendanceLogs: logs.map(l => ({ date: l.date, course: l.course, status: l.status }))
    });
  } catch (err) {
    console.error('Error logging attendance in Supabase:', err.message);
    res.status(400).json({ error: 'Failed to log attendance' });
  }
});

export default router;
