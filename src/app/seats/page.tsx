'use client';

import ModelViewer from '@/components/ModelViewer';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface AvailabilityData {
  availableSeats: string[];
  success: boolean;
}

export default function SeatsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [availableSeats, setAvailableSeats] = useState<string[]>([]);
  const [modelLoading, setModelLoading] = useState(true);

  // Get reservation details once
  const reservationType = searchParams.get('reservationType');
  const date = searchParams.get('date');
  const startTime = searchParams.get('startTime');
  const endTime = searchParams.get('endTime');
  const guestCount = searchParams.get('guestCount');

  // Memoize the availability check
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const currentlySelectedSeats = searchParams.get('selectedSeats')?.split(',') || [];
        const response = await fetch('/api/availability', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date,
            startTime,
            endTime,
            guestCount,
            reservationType,
            selectedSeats: currentlySelectedSeats
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: AvailabilityData = await response.json();
        
        if (data.success) {
          setAvailableSeats(data.availableSeats);
        } else {
          throw new Error('Failed to get availability data');
        }
      } catch (error) {
        console.error('Error checking availability:', error);
        alert('Failed to load available seats. Please try again.');
      }
    };

    checkAvailability();
  }, [date, startTime, endTime, guestCount, reservationType]);

  const handleSeatSelect = (seatId: string) => {
    const params = new URLSearchParams();
    params.set('reservationType', reservationType || '');
    params.set('date', date || '');
    params.set('startTime', startTime || '');
    params.set('endTime', endTime || '');
    params.set('guestCount', guestCount || '');
    params.set('selectedSeat', seatId);

    router.push(`/seats/confirm?${params.toString()}`);
  };

  // Loading screen with animation
  // if (modelLoading) {
  //   return (
  //     <div className="fixed inset-0 bg-black flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="w-32 h-32 border-t-4 border-b-4 border-green-500 rounded-full animate-spin mb-4"></div>
  //         <h2 className="text-white text-xl font-semibold">
  //           Loading 3D environment...
  //         </h2>
  //         <p className="text-gray-400 mt-2">Please wait a moment</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <main className="h-screen flex flex-col relative">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 text-center mt-20">
        <h1 className="text-3xl font-black">Wine and Dine Seats</h1>
      </div>

      {/* Info Panel */}
      <div className="absolute top-28 left-4 z-10 bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-2">Available Seats</h2>
        <p className="text-sm text-gray-600">Green seats are available for selection</p>
        <p className="text-sm text-gray-600">Red seats are already reserved</p>
        <div className="mt-4 text-sm">
          <p><strong>Date:</strong> {date}</p>
          <p><strong>Time:</strong> {startTime} - {endTime}</p>
          <p><strong>Guests:</strong> {guestCount}</p>
          <p><strong>Type:</strong> {reservationType}</p>
        </div>
      </div>

      {/* Controls Instructions */}
      <div className="absolute bottom-4 left-4 z-10 bg-black bg-opacity-75 text-white p-4 rounded-lg">
        <h3 className="font-bold mb-2">Controls:</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-gray-700 rounded">W</kbd>
              Move Forward
            </p>
            <p className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-gray-700 rounded">S</kbd>
              Move Backward
            </p>
          </div>
          <div>
            <p className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-gray-700 rounded">A</kbd>
              Move Left
            </p>
            <p className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-gray-700 rounded">D</kbd>
              Move Right
            </p>
          </div>
        </div>
        <p className="mt-2">
          <kbd className="px-2 py-1 bg-gray-700 rounded">Mouse</kbd>
          Look Around
        </p>
      </div>

      {/* 3D Viewer */}
      <div className="flex-1">
        <ModelViewer 
          availableSeats={availableSeats} 
          onSeatSelect={handleSeatSelect}
          onLoadingChange={setModelLoading}
        />
      </div>
    </main>
  );
}
