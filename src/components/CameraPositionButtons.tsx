import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cameraPositions } from './CameraPositions';
import { FixedSizeList as List } from 'react-window';

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

  const checkAvailability = useCallback(async () => {
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
        // ... (rest of the availability logic)
        const drinkSeats = drinkData.availableSeats || [];//+
        const dineSeats = dineData.availableSeats || [];//+
        const finalAvailableSeats = currentReservationType === 'drink-only' ? drinkSeats : dineSeats;
        setAvailableSeats(finalAvailableSeats);
      }
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  }, [searchParams]);

  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  const handleSeatSelect = useCallback((seatId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('selectedSeat', seatId);
    onSeatSelect(seatId);
    router.push(`/seats/confirm?${params.toString()}`);
  }, [onSeatSelect, router, searchParams]);

  const ButtonItem = useMemo(() => ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const position = cameraPositions[index];
    const isAvailable = availableSeats.includes(position.seatId);
    const isCurrent = index === currentPositionIndex;
    const buttonClass = `
      px-1 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-2 
      border border-c9
      rounded-md sm:rounded-lg md:rounded-xl 
      text-2xs sm:text-xs md:text-sm
      whitespace-nowrap
      ${isAvailable ? 'bg-c4' : 'bg-c75'}
      text-white
      ${isAvailable ? 'hover:opacity-80' : ''} 
      transition-opacity
      h-auto
      flex items-center justify-center
    `;

    return (
      <button
        style={style}
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
  }, [availableSeats, currentPositionIndex, handleSeatSelect, onPositionChange]);

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center m-5">
      <div className="bg-c7 border border-c9 rounded-2xl bg-opacity-75 p-2 overflow-y-auto max-h-40 md:max-h-24">
        <List
          height={60}
          itemCount={cameraPositions.length}
          itemSize={80}
          layout="horizontal"
          width={window.innerWidth - 20} // Adjust based on screen size
          className="flex items-center"
        >
          {ButtonItem}
        </List>
      </div>
    </div>
  );
};

export default React.memo(CameraPositionButtons);