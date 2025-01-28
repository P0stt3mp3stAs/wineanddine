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
  menu_items: string;
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
  const [cancellingReservationId, setCancellingReservationId] = useState<number | null>(null);

  useEffect(() => {
    if (userInfo?.user_id) {
      getUserReservations(userInfo.user_id)
        .then(data => setReservations(data));
    }
  }, [userInfo?.user_id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-c7">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-c9" />
      </div>
    );
  }

  // ... (keep all existing imports and hooks)

return (
  <div className="min-h-screen bg-c7 py-12 px-4 sm:px-6 lg:px-8 text-c9">
    <div className="max-w-3xl mx-auto space-y-6 mt-12">
      {/* Profile Section */}
      <div className="bg-c6 rounded-2xl shadow-xl border-2 border-c9">
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-c9">Profile</h1>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-c9">Username</label>
              <div className="mt-1 p-2 sm:p-3 bg-c7 rounded-2xl text-c5 border border-c9 text-sm sm:text-base">
                @{userInfo.username}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-c9">Email</label>
              <div className="mt-1 p-2 sm:p-3 bg-c7 rounded-2xl text-c5 border border-c9 text-sm sm:text-base">
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
              className="w-full bg-c9 text-c6 px-4 py-2 rounded-2xl border border-black hover:bg-c7 hover:border hover:border-c9 text-sm sm:text-base"
            >
              Sign Out
            </button>
            
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-c75 text-c6 px-4 py-2 rounded-2xl hover:bg-red-700 border border-c9 text-sm sm:text-base"
              >
                Delete Account
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-center text-red-600 font-medium">
                  Are you sure? This action cannot be undone.
                </p>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="w-full sm:w-1/2 bg-c9 text-c6 px-4 py-2 rounded-2xl border border-black hover:bg-c7 hover:border hover:border-c9 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="w-full sm:w-1/2 bg-c75 text-c6 px-4 py-2 rounded-2xl hover:bg-red-700 border border-c9 text-sm sm:text-base"
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
      <div className="bg-c6 rounded-2xl shadow-xl border-2 border-c9 p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-c9">Your Reservations</h2>
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div 
              key={reservation.id} 
              className="p-3 sm:p-4 bg-c7 rounded-2xl hover:bg-c8 transition-colors border border-c9"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="grid grid-cols-2 sm:flex sm:space-x-4 mb-2 sm:mb-0">
                  <div className="mb-2 sm:mb-0">
                    <span className="text-xs sm:text-sm text-c5">Date</span>
                    <p className="font-medium text-c5 text-sm sm:text-base">
                      {new Date(reservation.reservation_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mb-2 sm:mb-0">
                    <span className="text-xs sm:text-sm text-c5">Time</span>
                    <p className="font-medium text-c5 text-sm sm:text-base">
                      {reservation.start_time} - {reservation.end_time}
                    </p>
                  </div>
                  <div className="mb-2 sm:mb-0">
                    <span className="text-xs sm:text-sm text-c5">Guests</span>
                    <p className="font-medium text-c5 text-sm sm:text-base">{reservation.guest_count}</p>
                  </div>
                  <div className="mb-2 sm:mb-0">
                    <span className="text-xs sm:text-sm text-c5">Type</span>
                    <p className="font-medium text-c5 text-sm sm:text-base">{reservation.reservation_type}</p>
                  </div>
                </div>
                
                {cancellingReservationId === reservation.id ? (
                  <div className="flex space-x-2 mt-2 sm:mt-0">
                    <button 
                      onClick={() => setCancellingReservationId(null)}
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-c9 rounded-2xl border border-c9 bg-c5 hover:bg-c7 transition-colors text-sm sm:text-base"
                    >
                      Keep It
                    </button>
                    <button 
                      onClick={async () => {
                        const result = await cancelReservation(reservation.id);
                        if (result.success) {
                          setReservations(prevReservations => 
                            prevReservations.filter(res => res.id !== reservation.id)
                          );
                        }
                        setCancellingReservationId(null);
                      }}
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-c5 rounded-2xl border border-c9 bg-c75 hover:bg-red-700 transition-colors text-sm sm:text-base"
                    >
                      Cancel It
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setCancellingReservationId(reservation.id)}
                    className="w-full sm:w-auto mt-2 sm:mt-0 px-3 sm:px-4 py-2 text-red-600 rounded-2xl border border-c9 bg-c5 hover:bg-c75 hover:text-c5 hover:border-c7 transition-colors text-sm sm:text-base"
                  >
                    Cancel Reservation
                  </button>
                )}
              </div>

              {/* Menu Items Section */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-c5">Order Summary</h3>
                <div className="bg-c6 p-3 sm:p-4 rounded-xl shadow-sm border border-c9 overflow-x-auto">
                  {reservation.menu_items ? (
                    <div>
                      <table className="w-full text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-c9">
                            <th className="text-left py-2 text-c9">Item</th>
                            <th className="text-center py-2 text-c9">Qty</th>
                            <th className="text-right py-2 text-c9">Price</th>
                            <th className="text-right py-2 text-c9">Total</th>
                          </tr>
                        </thead>   
                        <tbody>
                          {Array.isArray(reservation.menu_items) ? (
                            reservation.menu_items.map((item: any, index: number) => (
                              <tr key={index} className="border-b border-c9 last:border-b-0">
                                <td className="py-2 text-c9">{item.name || 'Unknown Item'}</td>
                                <td className="text-center py-2 text-c9">{item.quantity || 1}</td>
                                <td className="text-right py-2 text-c9">${item.price?.toFixed(2) || 'N/A'}</td>
                                <td className="text-right py-2 text-c9">
                                  ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr className="border-b border-c9">
                              <td colSpan={4} className="py-2 text-center text-c9 italic">
                                Unable to display order details
                              </td>
                            </tr>
                          )}
                        </tbody>
                        <tfoot>
                          <tr className="font-semibold">
                            <td colSpan={3} className="py-2 text-c9">Total</td>
                            <td className="text-right py-2 text-c9">
                              ${Array.isArray(reservation.menu_items) 
                                ? reservation.menu_items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0).toFixed(2)
                                : 'N/A'}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center text-c9 italic">No items in this order</p>
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