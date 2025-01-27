'use client';

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
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

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
          backgroundColor: 'bg-c6',
          titleColor: 'text-c8',
          textColor: 'text-c9'
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
      <div className="min-h-screen bg-c7 text-c9">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-c8">Our Menu</h1>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {Object.keys(menuSections).map((section) => (
              <button
                key={section}
                onClick={() => setSelectedSection(section as keyof MenuData)}
                className={`
                  px-4 py-2 rounded-full relative font-bold text-sm
                  overflow-hidden transition-all duration-700
                  ${selectedSection === section
                    ? 'bg-c8 text-c6 [text-shadow:3px_3px_3px_#B47659]'
                    : 'bg-c6 text-c9 hover:text-c6 [text-shadow:0px_0px_0px_#643B2B] hover:[text-shadow:2px_2px_2px_#B47659]'
                  }
                  after:absolute after:h-1 after:w-1 after:bg-c9 after:left-5 after:bottom-0
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
      
      <CartSummary />
    </CartProvider>
  );
}