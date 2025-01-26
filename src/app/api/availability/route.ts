// app/api/availability/route.ts

import { NextResponse } from 'next/server';
import { checkSeatAvailability } from '@/lib/db';

interface SeatConfig {
  capacity: number;
  type: 'drinks-only' | 'both';
}

const SEATS_CONFIG: Record<string, SeatConfig> = {
  stool: { capacity: 2, type: 'drinks-only' },
  stool1: { capacity: 2, type: 'drinks-only' },
  stool2: { capacity: 2, type: 'drinks-only' },
  stool3: { capacity: 2, type: 'drinks-only' },
  '2table': { capacity: 2, type: 'both' },
  '2table1': { capacity: 2, type: 'both' },
  '2table2': { capacity: 2, type: 'both' },
  '2table3': { capacity: 2, type: 'both' },
  '4table': { capacity: 4, type: 'both' },
  '4table1': { capacity: 4, type: 'both' },
  couch: { capacity: 8, type: 'both' },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);

    const { 
      date, 
      startTime, 
      endTime, 
      guestCount, 
      reservationType,
      selectedSeats = []
    } = body;

    // Validate input types and formats
    // console.log('Inputs:', {
    //   date: typeof date, 
    //   startTime: typeof startTime, 
    //   endTime: typeof endTime, 
    //   guestCount: typeof guestCount, 
    //   reservationType: typeof reservationType
    // });

    // Validate input types and formats
    if (!date || !startTime || !endTime || !guestCount || !reservationType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Parse guestCount to ensure it's a number
    const parsedGuestCount = parseInt(guestCount, 10);
    if (isNaN(parsedGuestCount)) {
      return NextResponse.json(
        { success: false, error: 'Invalid guest count' },
        { status: 400 }
      );
    }

    // Validate reservationType
    if (reservationType !== 'drink-only' && reservationType !== 'dine-and-eat') {
      return NextResponse.json(
        { success: false, error: 'Invalid reservation type' },
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
    console.error('Full Availability Check Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to check availability', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}