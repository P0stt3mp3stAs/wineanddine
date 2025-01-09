// app/api/availability/route.ts

import { NextResponse } from 'next/server';
import { getCurrentUser } from 'aws-amplify/auth';
import { checkSeatAvailability } from '@/lib/db';
import { headers } from 'next/headers';

interface SeatConfig {
  capacity: number;
  type: 'drinks-only' | 'both';
}

const SEATS_CONFIG: Record<string, SeatConfig> = {
  stool: { capacity: 1, type: 'drinks-only' },
  stool1: { capacity: 1, type: 'drinks-only' },
  stool2: { capacity: 1, type: 'drinks-only' },
  stool3: { capacity: 1, type: 'drinks-only' },
  '2table': { capacity: 2, type: 'both' },
  '2table1': { capacity: 2, type: 'both' },
  '4table': { capacity: 4, type: 'both' },
  '4table1': { capacity: 4, type: 'both' },
  couch: { capacity: 8, type: 'both' },
};

export async function POST(request: Request) {
  try {
    // Skip auth for availability check as it's just checking what's available
    // if we needed auth we'd do it here

    // Parse request body
    const body = await request.json();
    const { 
      date, 
      startTime, 
      endTime, 
      guestCount, 
      reservationType,
      selectedSeats = [] // Previously selected seats to exclude
    } = body;

    // Validate required fields
    if (!date || !startTime || !endTime || !guestCount || !reservationType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get reserved seats from database
    const reservedSeats = await checkSeatAvailability(
      date,
      startTime,
      endTime,
      reservationType
    );

    // Create set of reserved seat IDs
    const reservedSeatIds = new Set(reservedSeats.map(seat => seat.seat_id));

    // Add currently selected seats to reserved set
    selectedSeats.forEach((seatId: string) => reservedSeatIds.add(seatId));

    // Filter available seats based on criteria
    const availableSeats = Object.entries(SEATS_CONFIG)
      .filter(([seatId, config]) => {
        // Check if seat is not reserved
        if (reservedSeatIds.has(seatId)) return false;

        // Check capacity
        if (config.capacity < parseInt(guestCount)) return false;

        // Check reservation type compatibility
        if (reservationType === 'dine-and-eat' && config.type === 'drinks-only') {
          return false;
        }

        return true;
      })
      .map(([seatId]) => seatId);

    return NextResponse.json({ 
      success: true,
      availableSeats 
    });

  } catch (error) {
    console.error('Availability check error:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}