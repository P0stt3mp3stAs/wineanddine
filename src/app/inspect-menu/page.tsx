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

  const renderSpecialties = (items: MenuItem[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {items.map((item) => (
        <div key={item.id} className="bg-c7 border-2 border-c8 text-c9 rounded-lg shadow-lg flex flex-col h-96 transform hover:scale-105 transition-transform duration-200">
          {item.image ? (
            <div className="relative h-1/2">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
          ) : (
            <div className="h-1/2 bg-amber-100 rounded-t-lg flex items-center justify-center">
              <span className="text-4xl">🍽️</span>
            </div>
          )}
          <div className="p-4 flex flex-col justify-between h-1/2">
            <div>
              <h3 className="text-xl font-bold mb-2 truncate">{item.name}</h3>
              <p className="text-sm mb-2 line-clamp-3">{item.description}</p>
            </div>
            <p className="text-lg font-semibold">{formatPrice(item.price)}</p>
          </div>
        </div>
      ))}
    </div>
  );
  
  const renderSalads = (items: MenuItem[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {items.map((item) => (
        <div key={item.id} className="bg-c7 border-2 border-c8 text-c9 rounded-lg shadow-lg flex flex-col h-96 transform hover:scale-105 transition-transform duration-200">
          {item.image ? (
            <div className="relative h-1/2">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
          ) : (
            <div className="h-1/2 bg-green-100 rounded-t-lg flex items-center justify-center">
              <span className="text-4xl">🥗</span>
            </div>
          )}
          <div className="p-4 flex flex-col justify-between h-1/2">
            <div>
              <h3 className="text-lg font-semibold mb-2 truncate">{item.name}</h3>
              <p className="text-sm mb-2 line-clamp-3">{item.description}</p>
            </div>
            <p className="font-bold">{formatPrice(item.price)}</p>
          </div>
        </div>
      ))}
    </div>
  );
  
  const renderMains = (items: MenuItem[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {items.map((item) => (
        <div key={item.id} className="bg-c7 border-2 border-c8 text-c9 rounded-lg shadow-lg flex flex-col h-96 transform hover:scale-105 transition-transform duration-200">
          {item.image ? (
            <div className="relative h-1/2">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
          ) : (
            <div className="h-1/2 bg-blue-100 rounded-t-lg flex items-center justify-center">
              <span className="text-4xl">🍖</span>
            </div>
          )}
          <div className="p-4 flex flex-col justify-between h-1/2">
            <div>
              <h3 className="text-xl font-bold mb-2 truncate">{item.name}</h3>
              <p className="text-sm mb-2 line-clamp-3">{item.description}</p>
            </div>
            <p className="text-lg font-semibold">{formatPrice(item.price)}</p>
          </div>
        </div>
      ))}
    </div>
  );
  
  const renderSteaks = (items: MenuItem[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {items.map((item) => (
        <div key={item.id} className="bg-c7 border-2 border-c8 text-c9 rounded-lg shadow-lg flex flex-col h-96 transform hover:scale-105 transition-transform duration-200">
          {item.image ? (
            <div className="relative h-1/2">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
          ) : (
            <div className="h-1/2 bg-red-100 rounded-t-lg flex items-center justify-center">
              <span className="text-4xl">🥩</span>
            </div>
          )}
          <div className="p-4 flex flex-col justify-between h-1/2">
            <div>
              <h3 className="text-lg font-bold mb-2 truncate">{item.name}</h3>
              <p className="text-xs mb-2 line-clamp-3">{item.description}</p>
            </div>
            <p className="text-base font-semibold">{formatPrice(item.price)}</p>
          </div>
        </div>
      ))}
    </div>
  );
  
  const renderDesserts = (items: MenuItem[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {items.map((item) => (
        <div key={item.id} className="bg-c7 border-2 border-c8 text-c9 rounded-lg shadow-lg flex flex-col h-96 transform hover:scale-105 transition-transform duration-200">
          {item.image ? (
            <div className="relative h-1/2">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
          ) : (
            <div className="h-1/2 bg-pink-100 rounded-t-lg flex items-center justify-center">
              <span className="text-4xl">🍰</span>
            </div>
          )}
          <div className="p-4 flex flex-col justify-between h-1/2">
            <div>
              <h3 className="text-base font-semibold mb-2 truncate">{item.name}</h3>
              <p className="text-xs mb-2 line-clamp-3">{item.description}</p>
            </div>
            <p className="text-sm font-bold">{formatPrice(item.price)}</p>
          </div>
        </div>
      ))}
    </div>
  );
  
  const renderDrinks = (items: MenuItem[], bgColor: string, textColor: string, emoji: string) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <div key={item.id} className="bg-c7 border-2 border-c8 text-c9 rounded-lg shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold truncate flex-grow">{item.name}</h3>
              <span className="text-2xl">{emoji}</span>
            </div>
            <p className="text-sm mb-4 line-clamp-2">{item.description}</p>
          </div>
          <p className="text-base font-bold self-end">{formatPrice(item.price)}</p>
        </div>
      ))}
    </div>
  );
  
  const renderSides = (items: MenuItem[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <div key={item.id} className="bg-c7 border-2 border-c8 text-c9 rounded-lg shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold truncate flex-grow">{item.name}</h3>
              <span className="text-2xl">🍟</span>
            </div>
            <p className="text-sm mb-4 line-clamp-2">{item.description}</p>
          </div>
          <p className="text-base font-bold self-end">{formatPrice(item.price)}</p>
        </div>
      ))}
    </div>
  );
  
  const renderSelectedSection = () => {
    switch (selectedSection) {
      case 'specialties':
        return renderSpecialties(menuData.specialties);
      case 'salads':
        return renderSalads(menuData.salads);
      case 'mains':
        return renderMains(menuData.mains);
      case 'steaks':
        return renderSteaks(menuData.steaks);
      case 'desserts':
        return renderDesserts(menuData.desserts);
      case 'sides':
        return renderSides(menuData.sides);
      case 'snacks_and_starters':
        return renderDrinks(menuData.snacks_and_starters, 'bg-purple-50', 'text-purple-800', '🍤');
      case 'champagnes':
        return renderDrinks(menuData.champagnes, 'bg-indigo-50', 'text-indigo-800', '🍾');
        case 'spritzes':
          return renderDrinks(menuData.spritzes, 'bg-yellow-50', 'text-yellow-800', '🍹');
      case 'gin_and_tonics':
        return renderDrinks(menuData.gin_and_tonics, 'bg-cyan-50', 'text-cyan-800', '🍸');
      default:
        return <div>Section not found</div>;
    }
  };

  const menuSections: { [key in keyof MenuData]: string } = {
    specialties: "Our Specialties",
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

  return (
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

        <div className="bg-c6 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-c8">
            {menuSections[selectedSection]}
          </h2>
          {renderSelectedSection()}
        </div>
      </div>
    </div>
  );
}