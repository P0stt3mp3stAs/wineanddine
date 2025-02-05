'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const ReservationSection = () => {
  const router = useRouter();
  const [reservationType, setReservationType] = useState<'drink-only' | 'dine-and-eat'>('dine-and-eat');
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

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-c7 to-c8 flex items-center justify-center p-2 sm:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-4xl bg-c6 rounded-3xl shadow-2xl p-4 sm:p-10 ${
          isScrolled ? 'sticky top-4' : ''
        }`}
      >
        <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8 text-c9 text-center">Reserve Your Experience</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-c9">Reservation Type</label>
              <select 
                value={reservationType}
                onChange={(e) => setReservationType(e.target.value as 'drink-only' | 'dine-and-eat')}
                className="w-full p-2 sm:p-3 border border-c8 rounded-xl text-c9 bg-c7 focus:ring-2 focus:ring-c8 transition-all text-sm sm:text-base"
              >
                <option value="dine-and-eat">Dine and Eat</option>
                <option value="drink-only">Drink Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-c9">Date</label>
              <input
                type="date"
                className="w-full p-2 sm:p-3 border border-c8 rounded-xl text-c9 bg-c7 focus:ring-2 focus:ring-c8 transition-all text-sm sm:text-base"
                min={today}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-c9">Start Time</label>
              <input
                type="time"
                className="w-full p-2 sm:p-3 border border-c8 rounded-xl text-c9 bg-c7 focus:ring-2 focus:ring-c8 transition-all text-sm sm:text-base"
                value={startTime}
                onChange={handleStartTimeChange}
                required
                disabled={!selectedDate}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-c9">End Time</label>
              <input
                type="time"
                className="w-full p-2 sm:p-3 border border-c8 rounded-xl text-c9 bg-c7 focus:ring-2 focus:ring-c8 transition-all text-sm sm:text-base"
                value={endTime}
                onChange={handleEndTimeChange}
                required
                disabled={!startTime}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-c9">Number of Guests</label>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {['2', '4', '8'].map((count) => (
                <motion.button
                  key={count}
                  type="button"
                  onClick={() => setGuestCount(count)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 px-2 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-base font-medium transition-all ${
                    guestCount === count 
                      ? 'bg-c8 text-white shadow-lg' 
                      : 'bg-c7 text-c9 hover:bg-c8 hover:text-white'
                  }`}
                >
                  {count} or less
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button 
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-c9 text-white py-3 sm:py-4 rounded-xl font-medium text-sm sm:text-lg hover:bg-c8 transition-colors shadow-lg"
          >
            Confirm Reservation
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ReservationSection;