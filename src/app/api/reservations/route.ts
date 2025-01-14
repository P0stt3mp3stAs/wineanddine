// app/api/reservations/route.ts
import { NextResponse } from 'next/server';
import { Pool, QueryResult } from 'pg';

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
  // Create pool with connection string
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Validate request content-type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Content-type must be application/json' 
      }, { status: 400 });
    }

    const body = await request.json() as ReservationData;
    
    // Validate required fields
    const requiredFields = ['userId', 'selectedSeat', 'date', 'startTime', 'endTime', 'guestCount', 'reservationType'];
    const missingFields = requiredFields.filter(field => !body[field as keyof ReservationData]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

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