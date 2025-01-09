'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const ReservationSection = () => {
  const [reservationType, setReservationType] = useState<'drink-only' | 'dine-and-eat'>('dine-and-eat');
  const [currentImage, setCurrentImage] = useState(0);
  const [guestCount, setGuestCount] = useState('2');
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const images = [
    '/firstPic.jpeg',
    '/firstPic1.jpeg',
    '/firstPic2.jpeg'
  ];

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

    // End time should be after start time and within operating hours
    if (endHours >= 23 || endHours < 9) return false;
    if (endDateTime <= startDateTime) return false;

    // Minimum 1 hour, maximum 4 hours duration
    const durationHours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
    return durationHours >= 1 && durationHours <= 4;
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    if (validateStartTime(time)) {
      setStartTime(time);
      setEndTime(''); // Reset end time when start time changes
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

  const handleSubmit = async () => {
    if (!selectedDate || !startTime || !endTime || !guestCount) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate,
          start_time: startTime,
          end_time: endTime,
          guest_count: parseInt(guestCount),
          reservation_type: reservationType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create reservation');
      }

      alert('Reservation created successfully!');
      // Reset form or redirect
    } catch (error) {
      alert('Error creating reservation. Please try again.');
      console.error(error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-screen bg-green-500 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Reserve Your Table</h2>
        
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          <div className="flex-1 relative h-[400px] w-full max-w-xl">
            <Image
              src={images[currentImage]}
              alt="Restaurant View"
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>

          <div className="flex-1 bg-white p-6 rounded-lg max-w-xl">
            <h3 className="text-xl font-semibold mb-6 text-black">Reservation Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-black">Reservation Type</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setReservationType('drink-only')}
                    className={`px-4 py-2 rounded ${
                      reservationType === 'drink-only' 
                        ? 'bg-black text-white' 
                        : 'bg-gray-200 text-black'
                    }`}
                  >
                    Drinks Only
                  </button>
                  <button
                    onClick={() => setReservationType('dine-and-eat')}
                    className={`px-4 py-2 rounded ${
                      reservationType === 'dine-and-eat' 
                        ? 'bg-black text-white' 
                        : 'bg-gray-200 text-black'
                    }`}
                  >
                    Dine & Drink
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-black">Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded text-black"
                  min={today}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-black">Start Time</label>
                <input
                  type="time"
                  className="w-full p-2 border rounded text-black"
                  value={startTime}
                  onChange={handleStartTimeChange}
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
                  disabled={!startTime}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-black">Number of Guests</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setGuestCount('2')}
                    className={`flex-1 px-4 py-2 rounded ${
                      guestCount === '2' 
                        ? 'bg-black text-white' 
                        : 'bg-gray-200 text-black'
                    }`}
                  >
                    2 or less
                  </button>
                  <button
                    onClick={() => setGuestCount('4')}
                    className={`flex-1 px-4 py-2 rounded ${
                      guestCount === '4' 
                        ? 'bg-black text-white' 
                        : 'bg-gray-200 text-black'
                    }`}
                  >
                    4 or less
                  </button>
                  <button
                    onClick={() => setGuestCount('8')}
                    className={`flex-1 px-4 py-2 rounded ${
                      guestCount === '8' 
                        ? 'bg-black text-white' 
                        : 'bg-gray-200 text-black'
                    }`}
                  >
                    8 or less
                  </button>
                </div>
              </div>

              <button 
                onClick={handleSubmit}
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors mt-6"
              >
                Confirm Reservation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationSection;