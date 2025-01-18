// lib/seatConfig.ts

export interface Seat {
    id: string;
    capacity: number;
    type: 'drinks-only' | 'both';
  }
  
  export const SEATS: Record<string, Seat> = {
    stool: { id: 'stool', capacity: 1, type: 'drinks-only' },
    stool1: { id: 'stool1', capacity: 1, type: 'drinks-only' },
    stool2: { id: 'stool2', capacity: 1, type: 'drinks-only' },
    stool3: { id: 'stool3', capacity: 1, type: 'drinks-only' },
    '2table': { id: '2table', capacity: 2, type: 'both' },
    '2table1': { id: '2table1', capacity: 2, type: 'both' },
    '4table': { id: '4table', capacity: 4, type: 'both' },
    '4table1': { id: '4table1', capacity: 4, type: 'both' },
    couch: { id: 'couch', capacity: 8, type: 'both' },
  };
  
  export function getAvailableSeats(
    guestCount: number,
    reservationType: 'drink-only' | 'dine-and-eat',
    reservedSeatIds: string[]
  ): Seat[] {
    return Object.values(SEATS).filter(seat => {
      // Check if seat is already reserved
      if (reservedSeatIds.includes(seat.id)) return false;
  
      // Check capacity
      if (seat.capacity < guestCount) return false;
  
      // Check reservation type compatibility
      if (reservationType === 'dine-and-eat' && seat.type === 'drinks-only') return false;
  
      return true;
    });
  }