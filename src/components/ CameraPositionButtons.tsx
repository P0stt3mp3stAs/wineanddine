import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cameraPositions } from './CameraPositions';

interface CameraPositionButtonsProps {
  onPositionChange: (index: number) => void;
  availableSeats: string[];
  onSeatSelect: (seatId: string) => void;
  currentPositionIndex: number;
}

const CameraPositionButtons: React.FC<CameraPositionButtonsProps> = ({
  onPositionChange,
  onSeatSelect,
  currentPositionIndex
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [availableSeats, setAvailableSeats] = useState<string[]>([]);

  useEffect(() => {
    const checkAvailability = async () => {
      const currentReservationType = searchParams.get('reservationType');
      const date = searchParams.get('date');
      const startTime = searchParams.get('startTime');
      const endTime = searchParams.get('endTime');
      const guestCount = searchParams.get('guestCount');

      try {
        // Check both reservation types
        const [drinkResponse, dineResponse] = await Promise.all([
          fetch('/api/availability', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              date, startTime, endTime, guestCount,
              reservationType: 'drink-only'
            }),
          }),
          fetch('/api/availability', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              date, startTime, endTime, guestCount,
              reservationType: 'dine-and-eat'
            }),
          })
        ]);

        const [drinkData, dineData] = await Promise.all([
          drinkResponse.json(),
          dineResponse.json()
        ]);

        if (drinkData.success && dineData.success) {
          // Get all seats that are not reserved in either type
          const drinkReservedSeats = cameraPositions
            .map(pos => pos.seatId)
            .filter(id => !drinkData.availableSeats.includes(id));
          
          const dineReservedSeats = cameraPositions
            .map(pos => pos.seatId)
            .filter(id => !dineData.availableSeats.includes(id));

          // Consider a seat reserved if it appears in either reserved set
          const reservedSeats = new Set([...drinkReservedSeats, ...dineReservedSeats]);

          // Get available seats based on current reservation type
          const currentTypeData = currentReservationType === 'drink-only' ? drinkData : dineData;
          const finalAvailableSeats = currentTypeData.availableSeats.filter(
            (seatId: string) => !reservedSeats.has(seatId)
          );

          setAvailableSeats(finalAvailableSeats);
        }
      } catch (error) {
        console.error('Error checking availability:', error);
      }
    };

    checkAvailability();
  }, [searchParams]);

  const handleSeatSelect = (seatId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('selectedSeat', seatId);
    onSeatSelect(seatId);
    router.push(`/seats/confirm?${params.toString()}`);
  };

  return (
    <div className="absolute bottom-4 left-4 flex flex-col space-y-2">
      {cameraPositions.map((position, index) => {
        const isAvailable = availableSeats.includes(position.seatId);
        const isCurrent = index === currentPositionIndex;
        const buttonClass = `px-4 py-2 rounded ${
          isCurrent
            ? isAvailable
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
            : 'bg-gray-300 text-black'
        }`;

        return (
          <button
            key={position.name}
            onClick={() => {
              onPositionChange(index);
              if (isAvailable && isCurrent) {
                handleSeatSelect(position.seatId);
              }
            }}
            className={buttonClass}
            disabled={!isAvailable && isCurrent}
          >
            {isCurrent ? (isAvailable ? 'Select' : 'Unavailable') : position.name}
          </button>
        );
      })}
    </div>
  );
};

export default CameraPositionButtons;