import express from 'express';
import prisma from '../db.js';

const router = express.Router();

// GET /api/students — Fetch all students with relations
router.get('/', async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        courses: true,
        documents: true,
        attendanceLogs: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Format output to match frontend expectations
    const formatted = students.map(s => ({
      _id: s.id,
      name: s.name,
      rollNumber: s.rollNumber,
      email: s.email,
      department: s.department,
      year: s.year,
      semester: s.semester,
      cgpa: s.cgpa,
      attendance: s.attendance,
      feeStatus: s.feeStatus,
      feeAmount: s.feeAmount,
      courses: s.courses.map(c => c.courseName),
      documents: s.documents.map(d => ({ name: d.name, status: d.status })),
      attendanceLogs: s.attendanceLogs.map(l => ({ date: l.date, course: l.course, status: l.status }))
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// POST /api/students — Create new student
router.post('/', async (req, res) => {
  try {
    const { name, rollNumber, email, department, year, semester, cgpa, feeStatus, feeAmount, courses } = req.body;

    const student = await prisma.student.create({
      data: {
        name,
        rollNumber,
        email,
        department,
        year: parseInt(year) || 1,
        semester: parseInt(semester) || 1,
        cgpa: parseFloat(cgpa) || 0.0,
        feeStatus: feeStatus || 'Pending',
        feeAmount: parseInt(feeAmount) || 0,
        courses: {
          create: (courses || []).map(c => ({ courseName: c }))
        },
        documents: {
          create: [
            { name: 'High School Marksheet', status: 'Pending' },
            { name: 'ID Proof / Passport', status: 'Pending' },
            { name: 'Admissions Letter', status: 'Pending' }
          ]
        }
      },
      include: {
        courses: true,
        documents: true,
        attendanceLogs: true
      }
    });

    // Register student email in UserRole database for authentication lookup
    try {
      await prisma.userRole.upsert({
        where: { email: email.toLowerCase() },
        update: { role: 'student' },
        create: { email: email.toLowerCase(), role: 'student' }
      });
    } catch (roleErr) {
      console.warn('Could not register UserRole entry:', roleErr.message);
    }

    const formatted = {
      _id: student.id,
      name: student.name,
      rollNumber: student.rollNumber,
      email: student.email,
      department: student.department,
      year: student.year,
      semester: student.semester,
      cgpa: student.cgpa,
      attendance: student.attendance,
      feeStatus: student.feeStatus,
      feeAmount: student.feeAmount,
      courses: student.courses.map(c => c.courseName),
      documents: student.documents.map(d => ({ name: d.name, status: d.status })),
      attendanceLogs: []
    };

    res.status(201).json(formatted);
  } catch (err) {
    console.error('Error creating student:', err);
    res.status(400).json({ error: err.message || 'Failed to create student' });
  }
});

// PUT /api/students/:id — Update student profile
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rollNumber, email, department, year, semester, cgpa, feeStatus, feeAmount, courses, documents, attendanceLogs } = req.body;

    // Delete existing courses & docs if provided to replace
    if (courses) {
      await prisma.studentCourse.deleteMany({ where: { studentId: id } });
    }
    if (documents) {
      await prisma.studentDocument.deleteMany({ where: { studentId: id } });
    }

    const updated = await prisma.student.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(rollNumber && { rollNumber }),
        ...(email && { email }),
        ...(department && { department }),
        ...(year !== undefined && { year: parseInt(year) }),
        ...(semester !== undefined && { semester: parseInt(semester) }),
        ...(cgpa !== undefined && { cgpa: parseFloat(cgpa) }),
        ...(feeStatus && { feeStatus }),
        ...(feeAmount !== undefined && { feeAmount: parseInt(feeAmount) }),
        ...(courses && {
          courses: {
            create: courses.map(c => ({ courseName: typeof c === 'string' ? c : c.courseName }))
          }
        }),
        ...(documents && {
          documents: {
            create: documents.map(d => ({ name: d.name, status: d.status }))
          }
        })
      },
      include: {
        courses: true,
        documents: true,
        attendanceLogs: true
      }
    });

    const formatted = {
      _id: updated.id,
      name: updated.name,
      rollNumber: updated.rollNumber,
      email: updated.email,
      department: updated.department,
      year: updated.year,
      semester: updated.semester,
      cgpa: updated.cgpa,
      attendance: updated.attendance,
      feeStatus: updated.feeStatus,
      feeAmount: updated.feeAmount,
      courses: updated.courses.map(c => c.courseName),
      documents: updated.documents.map(d => ({ name: d.name, status: d.status })),
      attendanceLogs: updated.attendanceLogs.map(l => ({ date: l.date, course: l.course, status: l.status }))
    };

    res.json(formatted);
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(400).json({ error: 'Failed to update student' });
  }
});

// DELETE /api/students/:id — Delete student
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.student.delete({ where: { id } });
    res.json({ message: 'Student deleted successfully', id });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(400).json({ error: 'Failed to delete student' });
  }
});

// POST /api/students/:id/attendance — Log attendance for student
router.post('/:id/attendance', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, course, status } = req.body;

    await prisma.attendanceLog.create({
      data: {
        studentId: id,
        date,
        course,
        status
      }
    });

    // Recalculate attendance %
    const logs = await prisma.attendanceLog.findMany({ where: { studentId: id } });
    const presentCount = logs.filter(l => l.status === 'Present' || l.status === 'Late').length;
    const newAttPct = logs.length > 0 ? Math.round((presentCount / logs.length) * 100) : 100;

    await prisma.student.update({
      where: { id },
      data: { attendance: newAttPct }
    });

    const updatedStudent = await prisma.student.findUnique({
      where: { id },
      include: { courses: true, documents: true, attendanceLogs: true }
    });

    res.json({
      _id: updatedStudent.id,
      name: updatedStudent.name,
      rollNumber: updatedStudent.rollNumber,
      attendance: updatedStudent.attendance,
      attendanceLogs: updatedStudent.attendanceLogs.map(l => ({ date: l.date, course: l.course, status: l.status }))
    });
  } catch (err) {
    console.error('Error logging attendance:', err);
    res.status(400).json({ error: 'Failed to log attendance' });
  }
});

export default router;
