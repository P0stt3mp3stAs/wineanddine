// lib/db.ts

import { Pool } from 'pg';

let pool: Pool;

function createPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }

  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000, // Add connection timeout
    keepAlive: true // Enable keepalive
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
    console.error('Database query error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      query: text,
      params: params
    });
    
    // Check for specific connection errors
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        console.error('Unable to connect to database. Please check:');
        console.error('1. Database URL is correct');
        console.error('2. RDS security group allows inbound from your IP');
        console.error('3. Database instance is running');
      }
      if (error.message.includes('password authentication failed')) {
        console.error('Authentication failed. Check database credentials.');
      }
    }
    
    throw error;
  }
}

// New functions for seat reservations
export async function checkSeatAvailability(
  date: string,
  startTime: string,
  endTime: string,
  reservationType: 'drink-only' | 'dine-and-eat'
) {
  const text = `
    SELECT seat_id 
    FROM seat_reservations 
    WHERE 
      reservation_date = $1 
      AND (
        (start_time, end_time) OVERLAPS ($2::time, $3::time)
      )
  `;

  return await query(text, [date, startTime, endTime]);
}

export async function createReservation(
  userId: string,
  seatIds: string[],
  date: string,
  startTime: string,
  endTime: string,
  guestCount: number,
  reservationType: 'drink-only' | 'dine-and-eat'
) {
  if (!pool) {
    pool = createPool();
  }

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const groupId = crypto.randomUUID();
    
    for (let i = 0; i < seatIds.length; i++) {
      const text = `
        INSERT INTO seat_reservations (
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
      `;

      await client.query(text, [
        userId,
        seatIds[i],
        date,
        startTime,
        endTime,
        guestCount,
        reservationType,
        i === 0,
        groupId
      ]);
    }
    
    await client.query('COMMIT');
    return groupId;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

// Function to get all reservations for a specific date
export async function getReservationsForDate(date: string) {
  const text = `
    SELECT * 
    FROM seat_reservations 
    WHERE reservation_date = $1
    ORDER BY start_time
  `;

  return await query(text, [date]);
}

// Function to get user's reservations
export async function getUserReservations(userId: string) {
  const text = `
    SELECT * 
    FROM seat_reservations 
    WHERE user_id = $1
    ORDER BY reservation_date, start_time
  `;

  return await query(text, [userId]);
}

// Function to cancel a reservation
export async function cancelReservation(reservationGroupId: string, userId: string) {
  const text = `
    DELETE FROM seat_reservations 
    WHERE reservation_group_id = $1 
    AND user_id = $2
  `;

  return await query(text, [reservationGroupId, userId]);
}