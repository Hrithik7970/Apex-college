import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import db from './db.js';
import studentsRouter from './routes/students.js';
import approvalsRouter from './routes/approvals.js';
import announcementsRouter from './routes/announcements.js';
import complaintsRouter from './routes/complaints.js';
import rolesRouter from './routes/roles.js';
import seedRouter from './routes/seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/students', studentsRouter);
app.use('/api/approvals', approvalsRouter);
app.use('/api/announcements', announcementsRouter);
app.use('/api/complaints', complaintsRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/seed', seedRouter);

// Root landing route
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: '🚀 Apex College Student Management System API is running live!',
    database: 'PostgreSQL (Supabase)',
    endpoints: {
      health: '/api/health',
      testDb: '/api/test-db',
      students: '/api/students',
      announcements: '/api/announcements',
      approvals: '/api/approvals',
      complaints: '/api/complaints',
      roles: '/api/roles'
    },
    timestamp: new Date().toISOString()
  });
});

// Diagnostic endpoint to inspect live DB connection errors
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM "Student" LIMIT 1;');
    res.json({ success: true, count: result.rows.length, sample: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, stack: err.stack });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Apex College Student Management System API',
    database: 'PostgreSQL (Supabase)',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Apex College Express backend server running on http://localhost:${PORT}`);
});
