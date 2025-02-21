'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { getCurrentUser, fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';

function ReservationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string>('');
  const [shortUserId, setShortUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [preferredUsername, setPreferredUsername] = useState<string>('');

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
        const currentUser = await getCurrentUser();
        if (currentUser) {
          const fullUserId = currentUser.userId || '';
          setUserId(fullUserId);
          
          const shortId = fullUserId.slice(-6);
          setShortUserId(shortId);

          const attributes = await fetchUserAttributes();
          setPreferredUsername(attributes.preferred_username || '');
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
          'Content-Type': 'application/json'
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

      const reservationDetails = {
        selectedSeat,
        date: date || '',
        startTime: startTime || '',
        endTime: endTime || '',
        guestCount: guestCount || '',
        reservationType: reservationType || ''
      };
      
      const data = await response.json();
      const queryString = new URLSearchParams(reservationDetails).toString();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create reservation');
      }

      router.push(`/menu?${queryString}`);
      router.refresh();

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert('Failed to create reservation: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:py-16 sm:px-6 lg:px-8 text-[#05004f]">
      <div className="max-w-2xl mx-auto space-y-8 mt-12 sm:mt-16">
        <div className="bg-[#ffefe6] bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-10 space-y-8 sm:space-y-10">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#05004f]"> Reservation Details</h2>
            </div>
  
            <div className="space-y-8 bg-[#ffc4a2] p-8 rounded-3xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg">
                <div className="flex justify-between sm:block">
                  <span className="font-semibold text-[#05004f]"> Username: </span>
                  <span className="text-[#05004f] font-bold">{preferredUsername || 'Loading...'}</span>
                </div>
  
                <div className="flex justify-between sm:block">
                  <span className="font-semibold text-[#05004f]"> User ID: </span>
                  <span className="text-[#05004f] font-bold">{shortUserId || 'Loading...'}</span>
                </div>
  
                <div className="flex justify-between sm:block">
                  <span className="font-semibold text-[#05004f]"> Seat ID: </span>
                  <span className="text-[#05004f] font-bold">{selectedSeat || 'Not selected'}</span>
                </div>
  
                <div className="flex justify-between sm:block">
                  <span className="font-semibold text-[#05004f]"> Date: </span>
                  <span className="text-[#05004f] font-bold">{date || 'Not set'}</span>
                </div>
  
                <div className="flex justify-between sm:block">
                  <span className="font-semibold text-[#05004f]"> Start Time: </span>
                  <span className="text-[#05004f] font-bold">{startTime || 'Not set'}</span>
                </div>
  
                <div className="flex justify-between sm:block">
                  <span className="font-semibold text-[#05004f]"> End Time: </span>
                  <span className="text-[#05004f] font-bold">{endTime || 'Not set'}</span>
                </div>
  
                <div className="flex justify-between sm:block">
                  <span className="font-semibold text-[#05004f]"> Guest Count: </span>
                  <span className="text-[#05004f] font-bold">{guestCount || '0'}</span>
                </div>
  
                <div className="flex justify-between sm:block">
                  <span className="font-semibold text-[#05004f]"> Type: </span>
                  <span className="text-[#05004f] font-bold">{reservationType || 'Not set'}</span>
                </div>
              </div>
            </div>
  
            <div className="mt-10">
              <button 
                className={`w-full bg-[#7c0323] text-[#ffefe6] font-bold px-8 py-5 text-xl rounded-full hover:bg-[#742f37] transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleProceedToMenu}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Confirm Reservation'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-c7 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8"> 
        <div className="bg-c6 rounded-2xl shadow-xl border-2 border-c9 p-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-c7 rounded w-3/4 mx-auto"></div>
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-6 bg-c7 rounded"></div> 
              ))}
            </div>
            <div className="h-12 bg-c7 rounded"></div> 
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ReservationContent />
    </Suspense>
  );
}