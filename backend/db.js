import pg from 'pg';
import dns from 'dns';
import dotenv from 'dotenv';

dotenv.config();

// Force IPv4 DNS resolution first
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

let connectionString = process.env.DATABASE_URL;

if (!connectionString || connectionString.includes('host:5432') || connectionString.includes('user:password')) {
  connectionString = "postgresql://postgres.ynspfbneyigoxowxuyox:Hrithik%4032919@aws-1-ap-south-1.pooler.supabase.com:6543/postgres";
}

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle pg client:', err);
});

export const db = {
  query: (text, params) => pool.query(text, params)
};

export default db;
