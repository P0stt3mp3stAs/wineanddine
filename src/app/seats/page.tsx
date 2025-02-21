'use client';

import ModelViewer from '@/components/ModelViewer';
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface AvailabilityData {
  availableSeats: string[];
  success: boolean;
}

// Loading messages that will cycle during the loading process
const LOADING_MESSAGES = [
  "Preparing the virtual environment...",
  "Loading 3D models...",
  "Setting up lighting...",
  "Arranging furniture...",
  "Almost ready to show you around...",
  "Final touches..."
];

// Enhanced loading component with dynamic messages
function LoadingScreen({ message }: { message: string }) {
  const [currentMessage, setCurrentMessage] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 3000); // Change message every 3 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <div className="w-32 h-32 border-t-4 border-b-4 border-green-500 rounded-full animate-spin mb-4 mx-auto"></div>
        <h2 className="text-white text-xl font-semibold mb-4">
          {message || LOADING_MESSAGES[currentMessage]}
        </h2>
        <div className="flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="w-3 h-3 rounded-full bg-green-500 animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            ></div>
          ))}
        </div>
        <p className="text-gray-400 mt-4 text-sm">
          This might take a few moments depending on your connection speed
        </p>
      </div>
    </div>
  );
}

function SeatsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [availableSeats, setAvailableSeats] = useState<string[]>([]);
  const [modelLoading, setModelLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Initializing...");
  const [is3DReady, setIs3DReady] = useState(false);

  // Get reservation details once
  const reservationType = searchParams.get('reservationType');
  const date = searchParams.get('date');
  const startTime = searchParams.get('startTime');
  const endTime = searchParams.get('endTime');
  const guestCount = searchParams.get('guestCount');

  useEffect(() => {
    const checkAvailability = async () => {
      try {
        setLoadingMessage("Checking seat availability...");
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
          setLoadingMessage("Loading 3D environment...");
        } else {
          throw new Error('Failed to get availability data');
        }
      } catch (error) {
        console.error('Error checking availability:', error);
        alert('Failed to load available seats. Please try again.');
      }
    };

    checkAvailability();
  }, [date, startTime, endTime, guestCount, reservationType, searchParams]);

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

  return (
    <main className="h-screen flex flex-col relative">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 text-center mt-20">
        <h1 className="text-3xl text-[#05004f] font-black">Wine and Dine Seats</h1>
      </div>

      {/* Info Panel */}
      <div className="absolute top-28 left-4 z-10 bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-2">Available Seats</h2>
        <p className="text-sm text-[#05004f]">Green seats are available for selection</p>
        <p className="text-sm text-[#05004f]">Red seats are already reserved</p>
        <div className="mt-4 text-[#05004f] text-sm">
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
          // onLoadingChange={handleModelLoadingChange}
        />
      </div>
    </main>
  );
}

// Main page component with Suspense boundary
export default function SeatsPage() {
  return (
    <Suspense fallback={<LoadingScreen message="Initializing..." />}>
      <SeatsContent />
    </Suspense>
  );
}