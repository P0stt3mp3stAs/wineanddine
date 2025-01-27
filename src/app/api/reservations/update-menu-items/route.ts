import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function POST(request: Request) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Received request');
    const { reservationId, menuItems } = await request.json();
    console.log('Request body:', { reservationId, menuItems });

    if (!reservationId || !menuItems) {
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        'UPDATE seat_reservations SET menu_items = $1 WHERE id = $2',
        [menuItems, reservationId]
      );

      if (result.rowCount === 0) {
        return NextResponse.json({ success: false, error: 'Reservation not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, message: 'Menu items updated successfully' });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Detailed error:', error);
    const err = error as Error;
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error', 
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }, { status: 500 });
  } finally {
    await pool.end();
  }
}