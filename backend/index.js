import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Apex College Student Management System API',
    database: 'PostgreSQL (Prisma ORM)',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Apex College Express backend server running on http://localhost:${PORT}`);
});
