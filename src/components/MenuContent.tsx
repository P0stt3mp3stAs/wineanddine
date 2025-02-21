'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import MenuSection from '@/components/menu/MenuSection';
import CartSummary from '@/components/menu/CartSummary';
import { CartProvider } from '@/components/menu/CartContext';

interface MenuItem {
  id: number;  // Keep the original ID as a number
  name: string;
  description: string;
  price: number;
  image?: string;
  unit?: string;
  category?: string;
}

interface MenuData {
  champagnes: MenuItem[];
  desserts: MenuItem[];
  gin_and_tonics: MenuItem[];
  mains: MenuItem[];
  salads: MenuItem[];
  sides: MenuItem[];
  snacks_and_starters: MenuItem[];
  specialties: MenuItem[];
  spritzes: MenuItem[];
  steaks: MenuItem[];
}

export default function Menu() {
  const searchParams = useSearchParams();
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [menuData, setMenuData] = useState<MenuData>({
    champagnes: [],
    desserts: [],
    gin_and_tonics: [],
    mains: [],
    salads: [],
    sides: [],
    snacks_and_starters: [],
    specialties: [],
    spritzes: [],
    steaks: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<keyof MenuData>('specialties');

  useEffect(() => {
    console.log('Received query string:', searchParams.toString());
    
    const fetchReservationId = async () => {
      const queryString = searchParams.toString();
      console.log('Received query string:', queryString);
    
      try {
        const response = await fetch(`/api/reservations/get-id?${queryString}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error}`);
        }
        const data = await response.json();
        if (data.success && data.reservationId) {
          setReservationId(data.reservationId);
          console.log('Reservation ID:', data.reservationId);
        } else {
          console.error('Failed to fetch reservation ID:', data.error);
        }
      } catch (error) {
        console.error('Error fetching reservation ID:', error);
      }
    };
    
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/menu');
        const data = await response.json();
        
        if (data.success) {
          setMenuData(data.data);
        } else {
          setError('Failed to load menu items');
        }
      } catch (error) {
        setError('Failed to load menu items');
        // console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReservationId();
    fetchMenuItems();
  }, [searchParams]);

  const menuSections: { [key in keyof MenuData]: string } = {
    specialties: "Specialties",
    salads: "Salads",
    mains: "Main Courses",
    steaks: "Steaks",
    desserts: "Desserts",
    sides: "Sides",
    snacks_and_starters: "Snacks & Starters",
    champagnes: "Champagnes",
    spritzes: "Spritzes",
    gin_and_tonics: "Gin & Tonics"
  };

  const sectionLayouts: { [key in keyof MenuData]: { columns: { sm: number; md: number; lg: number } } } = {
    specialties: { columns: { sm: 1, md: 2, lg: 3 } },
    salads: { columns: { sm: 1, md: 2, lg: 2 } },
    mains: { columns: { sm: 1, md: 2, lg: 3 } },
    steaks: { columns: { sm: 1, md: 2, lg: 2 } },
    desserts: { columns: { sm: 1, md: 2, lg: 3 } },
    sides: { columns: { sm: 1, md: 2, lg: 4 } },
    snacks_and_starters: { columns: { sm: 1, md: 2, lg: 3 } },
    champagnes: { columns: { sm: 1, md: 2, lg: 4 } },
    spritzes: { columns: { sm: 1, md: 2, lg: 3 } },
    gin_and_tonics: { columns: { sm: 1, md: 2, lg: 3 } }
  };

  const renderSelectedSection = () => {
    const items = menuData[selectedSection];
    return (
      <MenuSection
        title={menuSections[selectedSection]}
        items={items}
        sectionKey={selectedSection}  // Pass the section key to MenuSection
        theme={{
          backgroundColor: 'bg-[#ffefe6] bg-opacity-50 backdrop-filter backdrop-blur-lg',
          titleColor: 'text-[#05004f]'
        }}
      />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="min-h-screen text-[#05004f]">

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
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-c8">Our Menu</h1>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {Object.keys(menuSections).map((section) => (
              <button
                key={section}
                onClick={() => setSelectedSection(section as keyof MenuData)}
                className={`
                  px-3 py-1 sm:px-4 sm:py-2 rounded-full relative font-bold text-xs sm:text-sm
                overflow-hidden transition-all duration-700
                ${selectedSection === section
                  ? 'bg-[#ffdb3d] text-[#05004f] [text-shadow:2px_2px_2px_#ffc4a2]'
                  : 'bg-[#7c0323] text-white hover:text-[#05004f] [text-shadow:0.5px_0.5px_0.5px_#ffdb3d] hover:[text-shadow:1px_1px_1px_#ffffff]'
                }
                after:absolute after:h-1 after:w-1 after:bg-[#FFDB3D] after:left-5 after:bottom-0
                after:translate-y-full after:rounded-md after:transition-all after:duration-700
                hover:after:scale-[300] hover:after:duration-700
                after:-z-20 z-30
              `}
              >
                {menuSections[section as keyof MenuData]}
              </button>
            ))}
          </div>

          {renderSelectedSection()}
        </div>
      </div>
      
      <CartSummary reservationId={reservationId} />
    </CartProvider>
  );
}