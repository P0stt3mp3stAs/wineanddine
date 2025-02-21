'use client';
import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { getUserReservations, cancelReservation } from '@/actions/reservations';
import { FaUser, FaEnvelope, FaCalendar, FaClock, FaUsers, FaWineGlass, FaChair } from 'react-icons/fa';

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
  const [confirmingCancellation, setConfirmingCancellation] = useState<number | null>(null);

  useEffect(() => {
    if (userInfo?.user_id) {
      getUserReservations(userInfo.user_id)
        .then(data => setReservations(data));
    }
  }, [userInfo?.user_id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500" />
      </div>
    );
  }

  const handleCancelReservation = async (reservationId: number) => {
    setCancellingReservationId(reservationId);
    try {
      await cancelReservation(reservationId);
      setReservations(reservations.filter(res => res.id !== reservationId));
    } catch (error) {
      console.error('Failed to cancel reservation:', error);
    } finally {
      setCancellingReservationId(null);
    }
  };
  

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden ">
      <svg
        className="fixed inset-0 w-[100%] h-[105%] scale-[1.2] opacity-40"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#7c0323"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ zIndex: -1 }}
      >
        <path 
          d="M14.792 17.063c0 .337 .057 .618 .057 .9c0 1.8 -1.238 3.037 -2.982 3.037c-1.8 0 -2.98 -1.238 -2.98 -3.206v-.731c-.957 .675 -1.576 .9 -2.42 .9c-1.518 0 -2.925 -1.463 -2.925 -3.094c0 -1.181 .844 -2.194 2.082 -2.756l.28 -.113c-1.574 -.787 -2.362 -1.688 -2.362 -2.925c0 -1.687 1.294 -3.094 2.925 -3.094c.675 0 1.52 .338 2.138 .788l.281 .112c0 -.337 -.056 -.619 -.056 -.844c0 -1.8 1.237 -3.037 2.98 -3.037c1.8 0 2.981 1.237 2.981 3.206v.394l-.056 .281c.956 -.675 1.575 -.9 2.419 -.9c1.519 0 2.925 1.463 2.925 3.094c0 1.181 -.844 2.194 -2.081 2.756l-.282 .169c1.575 .787 2.363 1.688 2.363 2.925c0 1.688 -1.294 3.094 -2.925 3.094c-.675 0 -1.575 -.281 -2.138 -.788l-.225 -.169z" 
        />
      </svg>
      <svg
        className="fixed top-[10%] left-[10%] w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] md:w-[200px] md:h-[200px] lg:w-[250px] lg:h-[250px]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ba000e"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ 
          zIndex: 0,
          transform: 'rotate(45deg)',
          transformOrigin: 'top left'
        }}
      >
        <path d="M14.792 17.063c0 .337 .057 .618 .057 .9c0 1.8 -1.238 3.037 -2.982 3.037c-1.8 0 -2.98 -1.238 -2.98 -3.206v-.731c-.957 .675 -1.576 .9 -2.42 .9c-1.518 0 -2.925 -1.463 -2.925 -3.094c0 -1.181 .844 -2.194 2.082 -2.756l.28 -.113c-1.574 -.787 -2.362 -1.688 -2.362 -2.925c0 -1.687 1.294 -3.094 2.925 -3.094c.675 0 1.52 .338 2.138 .788l.281 .112c0 -.337 -.056 -.619 -.056 -.844c0 -1.8 1.237 -3.037 2.98 -3.037c1.8 0 2.981 1.237 2.981 3.206v.394l-.056 .281c.956 -.675 1.575 -.9 2.419 -.9c1.519 0 2.925 1.463 2.925 3.094c0 1.181 -.844 2.194 -2.081 2.756l-.282 .169c1.575 .787 2.363 1.688 2.363 2.925c0 1.688 -1.294 3.094 -2.925 3.094c-.675 0 -1.575 -.281 -2.138 -.788l-.225 -.169z" />
      </svg>
      
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Profile Header */}
        <div className="bg-[#ffd9c4] bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden mt-10">
          <div className="p-8 sm:p-10 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="w-32 h-32 bg-[#ffdb3d] rounded-full flex items-center justify-center text-[#05004f] text-5xl font-bold shadow-lg">
              {userInfo.username?.[0].toUpperCase()}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-[#05004f] mb-2">@{userInfo.username}</h1>
              <p className="text-[#05004f] text-lg mb-4">{userInfo.email}</p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleSignOut}
                  className="bg-[#ffdb3d] text-[#05004f] px-6 py-2 rounded-full hover:bg-[#fdce00] transition duration-300 ease-in-out shadow-md"
                >
                  Sign Out
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-[#7c0323] text-[#ffefe6] px-6 py-2 rounded-full hover:bg-[#742f37] transition duration-300 ease-in-out shadow-md"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
  
        {/* Delete Account Confirmation */}
        {showDeleteConfirm && (
          <div className="bg-[#ffd9c4] bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-3xl shadow-xl p-8 text-center ">
            <h2 className="text-2xl font-bold text-[#05004f] mb-4">Are you sure you want to delete your account?</h2>
            <p className="text-[#05004f] mb-6">This action cannot be undone.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-[#ffdb3d] text-[#05004f] px-6 py-2 rounded-full hover:bg-[#fdce00] hover:text-[#05004f ] transition duration-300 ease-in-out shadow-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="bg-[#E60012] text-[#ffefe6] px-6 py-2 rounded-full hover:bg-[#fb0013] transition duration-300 ease-in-out shadow-md"
              >
                Yes, Delete Account
              </button>
            </div>
          </div>
        )}
  
        {/* Reservations */}
        <div className="bg-[#ffefe6] bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-[#05004f] mb-6">Your Reservations</h2>
            <div className="space-y-6">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="bg-[#ffc4a2] bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-2xl p-6 hover:shadow-lg transition duration-300 ease-in-out">
                  <div className="flex flex-wrap justify-between items-center mb-4">
                    <div className="flex items-center space-x-2 text-[#05004f] mb-2 sm:mb-0">
                      <FaCalendar className="text-[#05004f]" />
                      <span>{new Date(reservation.reservation_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[#05004f] mb-2 sm:mb-0">
                      <FaClock className="text-[#05004f]" />
                      <span>{reservation.start_time} - {reservation.end_time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[#05004f] mb-2 sm:mb-0">
                      <FaUsers className="text-[#05004f]" />
                      <span>{reservation.guest_count} guests</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[#05004f] mb-2 sm:mb-0">
                      <FaWineGlass className="text-[#05004f]" />
                      <span>{reservation.reservation_type}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[#05004f] mb-2 sm:mb-0">
                      <FaChair className="text-[#05004f]" />
                      <span>Seat {reservation.seat_id}</span>
                    </div>
                  </div>
  
                  {/* Menu Items Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-[#05004f]">Order Summary</h3>
                        <div className="bg-[#ffe8e8] p-3 sm:p-4 rounded-xl shadow-sm overflow-x-auto">
                      {reservation.menu_items ? (
                        <div>
                          <table className="w-full text-xs sm:text-sm">
                            <thead>
                              <tr >
                                <th className="text-left py-2 text-[#05004f]">Item</th>
                                <th className="text-center py-2 text-[#05004f]">Qty</th>
                                <th className="text-right py-2 text-[#05004f]">Price</th>
                                <th className="text-right py-2 text-[#05004f]">Total</th>
                              </tr>
                            </thead>   
                            <tbody>
                              {Array.isArray(reservation.menu_items) ? (
                                reservation.menu_items.map((item: any, index: number) => (
                                  <tr key={index} className="border-b border-c9 last:border-b-0">
                                    <td className="py-2 text-[#05004f]">{item.name || 'Unknown Item'}</td>
                                    <td className="text-center py-2 text-[#05004f]">{item.quantity || 1}</td>
                                    <td className="text-right py-2 text-[#05004f]">${item.price?.toFixed(2) || 'N/A'}</td>
                                    <td className="text-right py-2 text-[#05004f]">
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
  
                  {/* Cancel Reservation Button */}
                  <div className="mt-4 text-right">
                    {confirmingCancellation === reservation.id ? (
                      <div className="flex justify-end items-center space-x-2">
                        <span className="text-[#05004f]">Are you sure?</span>
                        <button
                          onClick={() => handleCancelReservation(reservation.id)}
                          className="bg-[#E60012] text-[#ffefe6] px-4 py-2 rounded-full hover:bg-[#fb0013] transition duration-300 ease-in-out"
                          disabled={cancellingReservationId === reservation.id}
                        >
                          {cancellingReservationId === reservation.id ? 'Cancelling...' : 'Yes, Cancel'}
                        </button>
                        <button
                          onClick={() => setConfirmingCancellation(null)}
                          className="bg-[#ffdb3d] text-[#05004f] px-4 py-2 rounded-full hover:bg-[#fdce00] transition duration-300 ease-in-out"
                        >
                          No, Keep
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmingCancellation(reservation.id)}
                        className="bg-[#7c0323] text-white px-4 py-2 rounded-full hover:bg-[#742f37] transition duration-300 ease-in-out"
                      >
                        Cancel Reservation
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}