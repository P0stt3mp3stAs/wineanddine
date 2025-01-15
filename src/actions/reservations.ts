'use server';

import { pool } from '@/lib/db.server';

interface Reservation {
  id: number;
  user_id: string;
  seat_id: number;
  reservation_date: Date;
  start_time: string;
  end_time: string;
  guest_count: number;
  reservation_type: string;
  is_primary: boolean;
  reservation_group_id: string;
  reservation_state: boolean;
}

// Get user's active reservations
export async function getUserReservations(userId: string) {
  try {
    const result = await pool.query<Reservation>(
      'SELECT * FROM seat_reservations WHERE user_id = $1 AND reservation_state = true',
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return [];
  }
}

// Cancel a specific reservation
export async function cancelReservation(reservationId: number) {
  try {
    const result = await pool.query(
      'UPDATE seat_reservations SET reservation_state = false WHERE id = $1 RETURNING *',
      [reservationId]
    );

    if (result.rowCount === 0) {
      return { 
        success: false, 
        error: 'Reservation not found' 
      };
    }

    return { 
      success: true, 
      message: 'Reservation cancelled successfully' 
    };
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    return { 
      success: false, 
      error: 'Failed to cancel reservation' 
    };
  }
}

// Get a specific reservation by ID
export async function getReservationById(reservationId: number) {
  try {
    const result = await pool.query<Reservation>(
      'SELECT * FROM seat_reservations WHERE id = $1',
      [reservationId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching reservation:', error);
    return null;
  }
}

// Get all reservations (including cancelled ones) - useful for admin purposes
export async function getAllReservations(userId: string) {
  try {
    const result = await pool.query<Reservation>(
      'SELECT * FROM seat_reservations WHERE user_id = $1 ORDER BY reservation_date DESC',
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching all reservations:', error);
    return [];
  }
}
