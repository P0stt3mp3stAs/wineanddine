// app/api/test/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    const result = await pool.query('SELECT NOW()');
    return NextResponse.json({ success: true, time: result.rows[0].now });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await pool.end();
  }
}