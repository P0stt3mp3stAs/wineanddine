import { Pool } from 'pg';

let pool: Pool;

function createPool() {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    max: 10,
    idleTimeoutMillis: 30000
  });
}

export async function query(text: string, params?: Array<string | number>) {
  if (!pool) {
    pool = createPool();
  }

  try {
    const client = await pool.connect();
    try {
      const res = await client.query(text, params);
      return res.rows;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}