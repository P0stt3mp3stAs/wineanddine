'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ReservationSection = () => {
  const router = useRouter();
  const [reservationType, setReservationType] = useState<'drink-only' | 'dine-and-eat'>('dine-and-eat');
  const [currentImage, setCurrentImage] = useState(0);
  const [guestCount, setGuestCount] = useState('2');
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const validateStartTime = (time: string) => {
    if (!time || !selectedDate) return false;

    const [hours, minutes] = time.split(':').map(Number);
    const currentDate = new Date();
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(hours, minutes);

    if (hours >= 23 || hours < 9) return false;

    if (selectedDate === today) {
      const sixHoursFromNow = new Date();
      sixHoursFromNow.setHours(sixHoursFromNow.getHours() + 6);
      return selectedDateTime >= sixHoursFromNow;
    }

    return true;
  };

  const validateEndTime = (endTime: string, startTime: string) => {
    if (!endTime || !startTime) return false;

    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startDateTime = new Date(selectedDate);
    startDateTime.setHours(startHours, startMinutes);
    
    const endDateTime = new Date(selectedDate);
    endDateTime.setHours(endHours, endMinutes);

    if (endHours >= 23 || endHours < 9) return false;
    if (endDateTime <= startDateTime) return false;

    const durationHours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
    return durationHours >= 1 && durationHours <= 4;
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    if (validateStartTime(time)) {
      setStartTime(time);
      setEndTime('');
    } else {
      alert('Please select a valid start time:\n• At least 6 hours from now\n• Between 9 AM and 11 PM');
      setStartTime('');
    }
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    if (validateEndTime(time, startTime)) {
      setEndTime(time);
    } else {
      alert('Please select a valid end time:\n• Must be after start time\n• Between 1 and 4 hours duration\n• Between 9 AM and 11 PM');
      setEndTime('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Submitting values:", {
      reservationType,
      selectedDate,
      startTime,
      endTime,
      guestCount
    });
  
    const params = new URLSearchParams();
    params.set('reservationType', reservationType);
    params.set('date', selectedDate);
    params.set('startTime', startTime);
    params.set('endTime', endTime);
    params.set('guestCount', guestCount.toString());
  
    console.log("Navigation URL:", `/seats?${params.toString()}`);
  
    router.push(`/seats?${params.toString()}`);
  };

  return (
    <div className="w-full min-h-screen bg-green-500 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-black">Make a Reservation</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-black">Reservation Type</label>
            <select 
              value={reservationType}
              onChange={(e) => setReservationType(e.target.value as 'drink-only' | 'dine-and-eat')}
              className="w-full p-2 border rounded text-black"
            >
              <option value="dine-and-eat">Dine and Eat</option>
              <option value="drink-only">Drink Only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black">Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded text-black"
              min={today}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black">Start Time</label>
            <input
              type="time"
              className="w-full p-2 border rounded text-black"
              value={startTime}
              onChange={handleStartTimeChange}
              required
              disabled={!selectedDate}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black">End Time</label>
            <input
              type="time"
              className="w-full p-2 border rounded text-black"
              value={endTime}
              onChange={handleEndTimeChange}
              required
              disabled={!startTime}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black">Number of Guests</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setGuestCount('2')}
                className={`flex-1 px-4 py-2 rounded ${
                  guestCount === '2' ? 'bg-black text-white' : 'bg-gray-200 text-black'
                }`}
              >
                2 or less
              </button>
              <button
                type="button"
                onClick={() => setGuestCount('4')}
                className={`flex-1 px-4 py-2 rounded ${
                  guestCount === '4' ? 'bg-black text-white' : 'bg-gray-200 text-black'
                }`}
              >
                4 or less
              </button>
              <button
                type="button"
                onClick={() => setGuestCount('8')}
                className={`flex-1 px-4 py-2 rounded ${
                  guestCount === '8' ? 'bg-black text-white' : 'bg-gray-200 text-black'
                }`}
              >
                8 or less
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Submit Reservation
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationSection;