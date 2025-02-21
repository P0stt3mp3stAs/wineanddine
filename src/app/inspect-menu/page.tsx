'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number | string;
  image?: string;
}

interface MenuData {
  specialties: MenuItem[];
  salads: MenuItem[];
  mains: MenuItem[];
  steaks: MenuItem[];
  desserts: MenuItem[];
  spritzes: MenuItem[];
  sides: MenuItem[];
  snacks_and_starters: MenuItem[];
  champagnes: MenuItem[];
  gin_and_tonics: MenuItem[];
}

export default function InspectMenu() {
  const [menuData, setMenuData] = useState<MenuData>({
    specialties: [],
    salads: [],
    mains: [],
    steaks: [],
    desserts: [],
    spritzes: [],
    sides: [],
    snacks_and_starters: [],
    champagnes: [],
    gin_and_tonics: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<keyof MenuData>('salads');

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const formatPrice = (price: number | string) => {
    if (typeof price === 'number') {
      return `$${price.toFixed(2)}`;
    }
    return price;
  };

  

  const renderCompactItems = (items: MenuItem[], emoji: string) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {items.map((item) => (
        <div key={item.id} className="bg-[#ffc4a2] bg-opacity-50 backdrop-filter backdrop-blur-lg border-4 border-[#ffc4a2] border-opacity-10 text-[#05004f] rounded-lg shadow-lg p-3 sm:p-4 flex flex-col justify-between hover:scale-105 hover:shadow-md transition-transform duration-200">
          <div>
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <h3 className="text-base sm:text-lg font-semibold truncate flex-grow pr-2">{item.name}</h3>
              <span className="text-xl sm:text-2xl">{emoji}</span>
            </div>
            <p className="text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2">{item.description}</p>
          </div>
          <p className="text-sm sm:text-base font-bold self-end">{formatPrice(item.price)}</p>
        </div>
      ))}
    </div>
  );
  
  const renderMenuItems = (items: MenuItem[], sectionName: string) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {items.map((item) => (
        <div key={item.id} className="bg-[#ffc4a2] bg-opacity-50 backdrop-filter backdrop-blur-lg border-4 border-[#ffc4a2] border-opacity-10 text-[#05004f] rounded-lg shadow-lg flex flex-col h-80 sm:h-96 transform hover:scale-105 hover:shadow-md transition-transform duration-200">
          {item.image ? (
            <div className="relative h-1/2">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded-t-lg"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
          ) : (
            <div className="h-1/2 bg-[#ffd9c4] rounded-t-lg"></div>
          )}
          <div className="p-3 sm:p-4 flex flex-col justify-between h-1/2">
            <div>
              <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2 truncate">{item.name}</h3>
              <p className="text-xs sm:text-sm mb-2 line-clamp-2 sm:line-clamp-3">{item.description}</p>
            </div>
            <p className="text-sm sm:text-lg font-semibold">{formatPrice(item.price)}</p>
          </div>
        </div>
      ))}
    </div>
  );
  
  const renderSelectedSection = () => {
    switch (selectedSection) {
      case 'salads':
        return renderMenuItems(menuData.salads, 'Salads');
      case 'mains':
        return renderMenuItems(menuData.mains, 'Mains');
      case 'steaks':
        return renderMenuItems(menuData.steaks, 'Steaks');
      case 'desserts':
        return renderMenuItems(menuData.desserts, 'Desserts');
        case 'specialties':
          return renderMenuItems(menuData.specialties, 'Specialties');
        case 'sides':
          return renderCompactItems(menuData.sides, '🍟');
        case 'snacks_and_starters':
          return renderCompactItems(menuData.snacks_and_starters, '🍤');
        case 'champagnes':
          return renderCompactItems(menuData.champagnes, '🍾');
        case 'spritzes':
          return renderCompactItems(menuData.spritzes, '🍹');
        case 'gin_and_tonics':
          return renderCompactItems(menuData.gin_and_tonics, '🍸');
      default:
        return <div>Section not found</div>;
    }
  };

  const menuSections: { [key in keyof MenuData]: string } = {
    salads: "Salads",
    mains: "Main Courses",
    steaks: "Steaks",
    desserts: "Desserts",
    specialties: "Our Specialties",
    sides: "Sides",
    snacks_and_starters: "Snacks & Starters",
    champagnes: "Champagnes",
    spritzes: "Spritzes",
    gin_and_tonics: "Gin & Tonics"
  };

  return (
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
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 text-[#7c0323]">Our Menu</h1>
        
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
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
  
        <div className="bg-[#ffefe6] bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-[#05004f]">
            {menuSections[selectedSection]}
          </h2>
          {renderSelectedSection()}
        </div>
      </div>
    </div>
  );
  }