'use client';
import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { getUserReservations, cancelReservation } from '@/actions/reservations';

interface Reservation {
  id: number;
  user_id: string;
  seat_id: number;
  reservation_date: Date;
  start_time: string;
  end_time: string;
  guest_count: number;
  reservation_type: string;
  is_primary: boolean;
  reservation_group_id: string;
  menu_items: string; // Added menu_items
}

export default function Profile() {
  const { 
    userInfo,
    isLoading, 
    error,
    handleSignOut, 
    handleDeleteAccount 
  } = useProfile();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    if (userInfo?.user_id) {
      getUserReservations(userInfo.user_id)
        .then(data => setReservations(data));
    }
  }, [userInfo?.user_id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8  text-black">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  @{userInfo.username}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  {userInfo.email}
                </div>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={handleSignOut}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Sign Out
              </button>
              
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Delete Account
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-center text-red-600 font-medium">
                    Are you sure? This action cannot be undone.
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    >
                      Yes, Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

       {/* Reservations Section */}
       <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Your Reservations</h2>
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div 
                key={reservation.id} 
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-8">
                    <div>
                      <span className="text-sm text-gray-500">Date</span>
                      <p className="font-medium">
                        {new Date(reservation.reservation_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Time</span>
                      <p className="font-medium">
                        {reservation.start_time} - {reservation.end_time}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Guests</span>
                      <p className="font-medium">{reservation.guest_count}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Type</span>
                      <p className="font-medium">{reservation.reservation_type}</p>
                    </div>
                  </div>
                  <button 
                    onClick={async () => {
                      const result = await cancelReservation(reservation.id);
                      if (result.success) {
                        setReservations(prevReservations => 
                          prevReservations.filter(res => res.id !== reservation.id)
                        );
                      }
                    }}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Cancel Reservation
                  </button>
                </div>

                {/* Menu Items Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    {reservation.menu_items ? (
                      <div>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Item</th>
                              <th className="text-center py-2">Qty</th>
                              <th className="text-right py-2">Price</th>
                              <th className="text-right py-2">Total</th>
                            </tr>
                          </thead>   
                          <tbody>
                            {Array.isArray(reservation.menu_items) ? (
                              reservation.menu_items.map((item: any, index: number) => (
                                <tr key={index} className="border-b last:border-b-0">
                                  <td className="py-2">{item.name || 'Unknown Item'}</td>
                                  <td className="text-center py-2">{item.quantity || 1}</td>
                                  <td className="text-right py-2">${item.price?.toFixed(2) || 'N/A'}</td>
                                  <td className="text-right py-2">
                                    ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr className="border-b">
                                <td colSpan={4} className="py-2 text-center text-gray-500 italic">
                                  Unable to display order details
                                </td>
                              </tr>
                            )}
                          </tbody>
                          <tfoot>
                            <tr className="font-semibold">
                              <td colSpan={3} className="py-2">Total</td>
                              <td className="text-right py-2">
                                ${Array.isArray(reservation.menu_items) 
                                  ? reservation.menu_items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0).toFixed(2)
                                  : 'N/A'}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 italic">No items in this order</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}