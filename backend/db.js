import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:Hrithik%4032919@db.ynspfbneyigoxowxuyox.supabase.co:5432/postgres";

const pool = new pg.Pool({
  connectionString,
  ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
});

export const db = {
  query: (text, params) => pool.query(text, params)
};

export default db;
