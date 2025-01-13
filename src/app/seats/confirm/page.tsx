// app/seats/confirm/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/utils/auth';

interface ApiError {
  message: string;
}

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Get all params from URL
  const selectedSeat = searchParams.get('selectedSeat') || '1';
  const date = searchParams.get('date');
  const startTime = searchParams.get('startTime');
  const endTime = searchParams.get('endTime');
  const guestCount = searchParams.get('guestCount');
  const reservationType = searchParams.get('reservationType');

  useEffect(() => {
    const getUserData = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setUsername(user.username || '');
          setUserId(user.id || '1');
        }
      } catch (error) {
        console.error('Error getting user data:', error);
      }
    };

    getUserData();
  }, []);

  const handleProceedToMenu = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          selectedSeat,
          date,
          startTime,
          endTime,
          guestCount,
          reservationType
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create reservation');
      }

      // router.push('/menu');
      // router.refresh();
       // Or alternatively:
       window.location.href = '/menu';

    } catch (error) {
      console.error('Error:', error);
      // Type guard to handle the error properly
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert('Failed to create reservation: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto mt-10 text-black">
      <h2 className="text-2xl font-bold mb-6">Reservation Details</h2>
      
      <div className="space-y-4 bg-gray-50 p-6 rounded-lg shadow">
        <div className="grid grid-cols-2 gap-2">
          <span className="font-semibold">Username:</span>
          <span>{username || 'Loading...'}</span>

          <span className="font-semibold">User ID:</span>
          <span>{userId || 'Loading...'}</span>

          <span className="font-semibold">Seat ID:</span>
          <span>{selectedSeat || 'Not selected'}</span>

          <span className="font-semibold">Date:</span>
          <span>{date || 'Not set'}</span>

          <span className="font-semibold">Start Time:</span>
          <span>{startTime || 'Not set'}</span>

          <span className="font-semibold">End Time:</span>
          <span>{endTime || 'Not set'}</span>

          <span className="font-semibold">Guest Count:</span>
          <span>{guestCount || '0'}</span>

          <span className="font-semibold">Type:</span>
          <span>{reservationType || 'Not set'}</span>
        </div>
      </div>

      <div className="mt-6">
      <button 
          className={`bg-blue-500 text-white px-4 py-2 rounded 
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
          onClick={handleProceedToMenu}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Confirm Reservation'}
        </button>
      </div>
    </div>
  );
}
