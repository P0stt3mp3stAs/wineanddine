import React, { useEffect, useState } from 'react';

// Type for reservation from the database
type Reservation = {
  id: string;
  user_id: string;
  seat_id: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  guest_count: number;
  reservation_type: 'drink-only' | 'dine-and-eat';
  is_primary: boolean;
  reservation_group_id: string;
};

// ReservationCard component
interface ReservationCardProps {
  reservation: Reservation;
  onCancel: (id: string) => Promise<void>;
}

const ReservationCard: React.FC<ReservationCardProps> = ({ reservation, onCancel }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold">Table {reservation.seat_id}</p>
            <p className="text-sm text-gray-600">{reservation.reservation_type}</p>
          </div>
          <button
            onClick={() => onCancel(reservation.id)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Cancel
          </button>
        </div>
        <div className="text-sm text-gray-600">
          <p>Date: {new Date(reservation.reservation_date).toLocaleDateString()}</p>
          <p>Time: {reservation.start_time} - {reservation.end_time}</p>
          <p>Guests: {reservation.guest_count}</p>
        </div>
      </div>
    </div>
  );
};

// Main UserReservations component
const UserReservations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/reservations/user', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to fetch reservations');
      
      const data = await response.json();
      const sortedReservations = data.sort((a: Reservation, b: Reservation) => {
        const dateA = new Date(`${a.reservation_date} ${a.start_time}`);
        const dateB = new Date(`${b.reservation_date} ${b.start_time}`);
        return dateA.getTime() - dateB.getTime();
      });
      
      setReservations(sortedReservations);
    } catch (err) {
      setError('Could not load your reservations');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to cancel reservation');

      setReservations(prev => prev.filter(res => res.id !== reservationId));
    } catch (err) {
      console.error('Cancel error:', err);
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">My Reservations</h2>
      
      {reservations.length === 0 ? (
        <p className="text-center text-gray-500 py-4">
          You don't have any reservations yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {reservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onCancel={handleCancelReservation}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReservations;
