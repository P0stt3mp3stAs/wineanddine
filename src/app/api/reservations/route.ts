// app/api/reservations/route.ts
import { NextResponse } from 'next/server';
import { Pool, QueryResult } from 'pg';

// Define interfaces for better type safety
interface ReservationData {
  userId: string;
  selectedSeat: string;
  date: string;
  startTime: string;
  endTime: string;
  guestCount: string;
  reservationType: string;
}

interface DatabaseError {
  message: string;
  code?: string;
}

export async function POST(request: Request) {
  const pool = new Pool({
    user: 'elghali',
    host: 'database-instance.cposom22eqj3.us-east-1.rds.amazonaws.com',
    database: 'database_name',
    password: 'SecurePass123!',
    port: 5432,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    const body = await request.json() as ReservationData;
    console.log('Received data:', body);

    const {
      userId,
      selectedSeat,
      date,
      startTime,
      endTime,
      guestCount,
      reservationType
    } = body;

    const reservation_group_id = crypto.randomUUID();

    const result = await pool.query(
      `INSERT INTO seat_reservations (
        user_id,
        seat_id,
        reservation_date,
        start_time,
        end_time,
        guest_count,
        reservation_type,
        is_primary,
        reservation_group_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        userId,
        selectedSeat,
        date,
        startTime,
        endTime,
        parseInt(guestCount),
        reservationType,
        true,
        reservation_group_id
      ]
    );

    return NextResponse.json({ 
      success: true, 
      data: result.rows[0] 
    });

  } catch (error: unknown) {
    console.error('Error:', error);
    
    // Type guard for error handling
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = (error as DatabaseError).message;
    }

    return NextResponse.json({ 
      success: false, 
      error: errorMessage
    }, { status: 500 });
  } finally {
    await pool.end();
  }
}
