'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/components/menu/CartContext';
import { useRouter } from 'next/navigation';

interface CartSummaryProps {
  reservationId: string | null;
}

const CartSummary: React.FC<CartSummaryProps> = ({ reservationId }) => {
  const { items } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    console.log('Reservation ID in CartSummary:', reservationId);
  }, [reservationId]);

  if (items.length === 0) return null;

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleFinishReservation = async () => {
    console.log('Finishing reservation with ID:', reservationId);
    if (!reservationId) {
      console.error('No reservation ID found');
      return;
    }
  
    try {
      const menuItemsJson = JSON.stringify(items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })));
  
      const requestBody = {
        reservationId,
        menuItems: menuItemsJson,
      };
      console.log('Sending request with body:', requestBody);
  
      const response = await fetch('/api/reservations/update-menu-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      console.log('Response status:', response.status);
      const data = await response.json();
  
      if (data.success) {
        console.log('Reservation updated successfully');
        // Handle successful update (e.g., show success message, redirect)
        router.push('/profile');
      } else {
        console.error('Failed to update reservation:', data.error);
        // Handle error (e.g., show error message)
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-[#ffc4a2] bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-4 max-w-md w-full md:w-96">
      {/* Cart Header / Toggle */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center mb-2 text-[#05004f] hover:text-black transition-colors"
      >
        <span className="font-bold">Your Order ({items.length} items)</span>
        <span className="text-xl">
          {isExpanded ? '▼' : '▲'}
        </span>
      </button>

      {/* Collapsible Items List */}
      {isExpanded && (
        <div className="max-h-60 overflow-y-auto mb-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b border-[#05004f]">
              <div className="flex items-center space-x-2">
                <span className="text-[#05004f]">{item.quantity}×</span>
                <span className="font-medium text-[#05004f]">{item.name}</span>
              </div>
              <span className="text-[#05004f]">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Total and Button - Always Visible */}
      <div className="mt-2 pt-2 border-t border-black">
        <div className="flex justify-between items-center font-bold text-[#05004f] mb-4">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button
          onClick={handleFinishReservation}
          className="w-full bg-[#ffdb3d] text-[#05004f] py-3 rounded-full font-semibold hover:bg-[#fdce00] active:bg-[#7c0323] active:text-[#ffffff] transition-colors duration-200 transform hover:scale-[1.05] active:scale-[0.98]"
        >
          Finish Reservation
        </button>
      </div>
    </div>
  );
};

export default CartSummary;