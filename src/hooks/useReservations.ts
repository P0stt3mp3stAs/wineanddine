// hooks/useReservations.ts
import { fetchWithAuth } from '@/utils/auth';

export const useReservations = () => {
  const fetchUserReservations = async () => {
    try {
      const response = await fetchWithAuth('/api/reservations/user');
      
      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  return { fetchUserReservations };
};
