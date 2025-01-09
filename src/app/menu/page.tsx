import { query } from '@/lib/db';
import MenuSection from '@/components/menu/MenuSection';
import CartWrapper from '@/components/menu/CartWrapper';
import CartSummary from '@/components/menu/CartSummary';

// Helper function to add category prefix to IDs and image paths
function addCategoryPrefix(items: any[], prefix: string, imagePrefix: string) {
  return items.map((item, index) => ({
    ...item,
    id: `${prefix}_${item.id}`,
    imagePath: imagePrefix ? `${imagePrefix}-${(index + 1).toString().padStart(3, '0')}.${getImageExtension(imagePrefix, index + 1)}` : undefined
  }));
}

// Helper function to get the correct image extension
function getImageExtension(prefix: string, index: number): string {
  if (prefix === 'sal' && index === 1) return 'webp';
  if (prefix === 'sal' && index === 3) return 'png';
  if (prefix === 'mns' && index === 7) return 'avif';
  return 'jpg';
}

export default async function Menu() {
  // Fetch all menu items
  const [
    champagnes,
    desserts,
    mains,
    sides,
    starters,
    spritzes,
    steaks,
    specialties,
    salads,
    ginTonics
  ] = await Promise.all([
    query('SELECT * FROM champagnes'),
    query('SELECT * FROM desserts'),
    query('SELECT * FROM mains'),
    query('SELECT * FROM sides'),
    query('SELECT * FROM snacks_and_starters'),
    query('SELECT * FROM spritzes'),
    query('SELECT * FROM steaks'),
    query('SELECT * FROM specialties'),
    query('SELECT * FROM salads'),
    query('SELECT * FROM gin_and_tonics')
  ]);

  // Add category prefixes and image paths
  const processedChampagnes = addCategoryPrefix(champagnes, 'champ', '');
  const processedDesserts = addCategoryPrefix(desserts, 'dess', 'des');
  const processedMains = addCategoryPrefix(mains, 'main', 'mns');
  const processedSides = addCategoryPrefix(sides, 'side', '');
  const processedStarters = addCategoryPrefix(starters, 'start', '');
  const processedSpritzes = addCategoryPrefix(spritzes, 'spritz', '');
  const processedSteaks = addCategoryPrefix(steaks, 'steak', 'stk');
  const processedSpecialties = addCategoryPrefix(specialties, 'spec', 'spc');
  const processedSalads = addCategoryPrefix(salads, 'salad', 'sal');
  const processedGinTonics = addCategoryPrefix(ginTonics, 'gin', '');

  // Define themes for different sections
  const themes = {
    specialty: {
      backgroundColor: 'bg-amber-50',
      titleColor: 'text-amber-900',
      textColor: 'text-amber-800',
      priceColor: 'text-amber-900'
    },
    champagne: {
      backgroundColor: 'bg-yellow-50',
      titleColor: 'text-yellow-800',
      textColor: 'text-yellow-700',
      priceColor: 'text-yellow-900'
    },
    dessert: {
      backgroundColor: 'bg-pink-50',
      titleColor: 'text-pink-800',
      textColor: 'text-pink-700',
      priceColor: 'text-pink-900'
    },
    main: {
      backgroundColor: 'bg-blue-50',
      titleColor: 'text-blue-800',
      textColor: 'text-blue-700',
      priceColor: 'text-blue-900'
    },
    steak: {
      backgroundColor: 'bg-red-50',
      titleColor: 'text-red-800',
      textColor: 'text-red-700',
      priceColor: 'text-red-900'
    },
    salad: {
      backgroundColor: 'bg-green-50',
      titleColor: 'text-green-800',
      textColor: 'text-green-700',
      priceColor: 'text-green-900'
    }
  };

  return (
    <CartWrapper>
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gray-900 text-white p-6 rounded-lg text-center mb-12 shadow-xl">
          <h1 className="text-4xl font-black tracking-tight">Our Menu</h1>
        </div>

        {/* Menu Sections */}
        <div className="space-y-16">
          {/* 1. House Specialties */}
          {processedSpecialties.length > 0 && (
            <div className="mb-20">
              <MenuSection 
                title="House Specialties" 
                items={processedSpecialties}
                theme={themes.specialty}
              />
            </div>
          )}

          {/* 2. Salads */}
          <MenuSection 
            title="Salads" 
            items={processedSalads}
            theme={themes.salad}
          />

          {/* 3. Main Courses */}
          <MenuSection 
            title="Main Courses" 
            items={processedMains} 
            theme={themes.main}
          />

          {/* 4. Steaks */}
          <MenuSection 
            title="Steaks" 
            items={processedSteaks} 
            theme={themes.steak}
          />

          {/* 5. Desserts */}
          <MenuSection 
            title="Desserts" 
            items={processedDesserts} 
            theme={themes.dessert}
          />

          {/* 6. Gin & Tonics */}
          <MenuSection 
            title="Gin & Tonics" 
            items={processedGinTonics}
          />

          {/* 7. Champagnes */}
          <MenuSection 
            title="Champagnes & Sparkling" 
            items={processedChampagnes} 
            theme={themes.champagne} 
          />

          {/* 8. Spritzes */}
          <MenuSection 
            title="Spritzes & Cocktails" 
            items={processedSpritzes}
          />

          {/* 10. Starters */}
          <MenuSection 
            title="Starters & Small Plates" 
            items={processedStarters}
          />

          {/* 9. Side Dishes */}
          <MenuSection 
            title="Side Dishes" 
            items={processedSides}
          />
        </div>
      </main>
      <CartSummary />
    </CartWrapper>
  );
}