import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const selectedSeat = searchParams.get('selectedSeat');
  const date = searchParams.get('date');
  const startTime = searchParams.get('startTime');
  const endTime = searchParams.get('endTime');
  const guestCount = searchParams.get('guestCount');
  const reservationType = searchParams.get('reservationType');

  if (!selectedSeat || !date || !startTime || !endTime || !guestCount || !reservationType) {
    return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    const result = await pool.query(
      `SELECT id FROM seat_reservations 
       WHERE seat_id = $1 AND reservation_date = $2::date 
       AND start_time = $3 AND end_time = $4 AND guest_count = $5 AND reservation_type = $6`,
      [selectedSeat, date, startTime, endTime, guestCount, reservationType]
    );

    if (result.rows.length > 0) {
      return NextResponse.json({ success: true, reservationId: result.rows[0].id });
    } else {
      return NextResponse.json({ success: false, error: 'Reservation not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching reservation ID:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  } finally {
    await pool.end();
  }
}