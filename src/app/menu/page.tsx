'use client';

import { useEffect, useState } from 'react';
import MenuSection from '@/components/menu/MenuSection';
import CartSummary from '@/components/menu/CartSummary';
import { CartProvider } from '@/components/menu/CartContext';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  unit?: string;
  category?: string;
}

// Updated to match exact database table names
interface MenuData {
  champagnes: MenuItem[];
  desserts: MenuItem[];
  gin_and_tonics: MenuItem[];  // Updated to match database table name
  mains: MenuItem[];           // Updated to match database table name
  salads: MenuItem[];
  sides: MenuItem[];
  snacks_and_starters: MenuItem[];  // Updated to match database table name
  specialties: MenuItem[];
  spritzes: MenuItem[];
  steaks: MenuItem[];
}

export default function Menu() {
  const [menuData, setMenuData] = useState<MenuData>({
    champagnes: [],
    desserts: [],
    gin_and_tonics: [],    // Updated to match database table name
    mains: [],             // Updated to match database table name
    salads: [],
    sides: [],
    snacks_and_starters: [], // Updated to match database table name
    specialties: [],
    spritzes: [],
    steaks: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Our Menu</h1>
        
        <MenuSection
          title="Our Specialties"
          items={menuData.specialties}
          theme={{ 
            backgroundColor: 'bg-amber-50', 
            titleColor: 'text-amber-800', 
            textColor: 'text-amber-700' 
          }}
        />
        
        <MenuSection
          title="Snacks & Starters"
          items={menuData.snacks_and_starters}  // Updated to match database table name
          theme={{ 
            backgroundColor: 'bg-purple-50', 
            titleColor: 'text-purple-800', 
            textColor: 'text-purple-700' 
          }}
        />
        
        <MenuSection
          title="Fresh Salads"
          items={menuData.salads}
          theme={{ 
            backgroundColor: 'bg-green-50', 
            titleColor: 'text-green-800', 
            textColor: 'text-green-700' 
          }}
        />
        
        <MenuSection
          title="Main Courses"
          items={menuData.mains}  // Updated to match database table name
          theme={{ 
            backgroundColor: 'bg-blue-50', 
            titleColor: 'text-blue-800', 
            textColor: 'text-blue-700' 
          }}
        />
        
        <MenuSection
          title="Premium Steaks"
          items={menuData.steaks}
          theme={{ 
            backgroundColor: 'bg-red-50', 
            titleColor: 'text-red-800', 
            textColor: 'text-red-700' 
          }}
        />
        
        <MenuSection
          title="Side Dishes"
          items={menuData.sides}
          theme={{ 
            backgroundColor: 'bg-orange-50', 
            titleColor: 'text-orange-800', 
            textColor: 'text-orange-700' 
          }}
        />
        
        <MenuSection
          title="Desserts"
          items={menuData.desserts}
          theme={{ 
            backgroundColor: 'bg-pink-50', 
            titleColor: 'text-pink-800', 
            textColor: 'text-pink-700' 
          }}
        />
        
        <MenuSection
          title="Champagnes"
          items={menuData.champagnes}
          theme={{ 
            backgroundColor: 'bg-yellow-50', 
            titleColor: 'text-yellow-800', 
            textColor: 'text-yellow-700' 
          }}
        />
        
        <MenuSection
          title="Spritzes"
          items={menuData.spritzes}
          theme={{ 
            backgroundColor: 'bg-indigo-50', 
            titleColor: 'text-indigo-800', 
            textColor: 'text-indigo-700' 
          }}
        />
        
        <MenuSection
          title="Gin & Tonics"
          items={menuData.gin_and_tonics}  // Updated to match database table name
          theme={{ 
            backgroundColor: 'bg-cyan-50', 
            titleColor: 'text-cyan-800', 
            textColor: 'text-cyan-700' 
          }}
        />
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
        <CartSummary />
      </div>
    </CartProvider>
  );
}
