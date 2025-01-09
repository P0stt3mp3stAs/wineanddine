// src/app/api/menu/route.ts
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// Helper function to get image path
function getImagePath(category: string, id: number): string | undefined {
  const imageMap: { [key: string]: { prefix: string, maxId: number } } = {
    specialties: { prefix: 'spc', maxId: 1 },
    steaks: { prefix: 'stk', maxId: 5 },
    salads: { prefix: 'sal', maxId: 4 },
    desserts: { prefix: 'des', maxId: 4 },
    mains: { prefix: 'mns', maxId: 11 }
  };

  const categoryInfo = imageMap[category];
  if (!categoryInfo) return undefined;

  // Create the image path
  const imagePath = `/menu/${categoryInfo.prefix}-${id.toString().padStart(3, '0')}.jpg`;
  console.log(`Generated image path for ${category} id ${id}: ${imagePath}`);
  return imagePath;
}

// Helper function to add images to items
function addImagesToItems(items: any[], category: string) {
  console.log(`Processing ${category} items:`, items); // Debug log
  return items.map(item => {
    const withImage = {
      ...item,
      image: getImagePath(category, item.id)
    };
    console.log(`Item after adding image:`, withImage); // Debug log
    return withImage;
  });
}

export async function GET() {
  try {
    const [
      specialtiesItems,
      saladsItems,
      mainsItems,
      steaksItems,
      dessertsItems,
      spritzsItems,
      sidesItems,
      snacksItems,
      champagnesItems,
      ginTonicItems
    ] = await Promise.all([
      query('SELECT * FROM specialties'),
      query('SELECT * FROM salads'),
      query('SELECT * FROM mains'),
      query('SELECT * FROM steaks'),
      query('SELECT * FROM desserts'),
      query('SELECT * FROM spritzes'),
      query('SELECT * FROM sides'),
      query('SELECT * FROM snacks_and_starters'),
      query('SELECT * FROM champagnes'),
      query('SELECT * FROM gin_and_tonics')
    ]);

    // Add images to items based on their category
    const menuData = {
      specialties: addImagesToItems(specialtiesItems, 'specialties'),
      salads: addImagesToItems(saladsItems, 'salads'),
      mains: addImagesToItems(mainsItems, 'mains'),
      steaks: addImagesToItems(steaksItems, 'steaks'),
      desserts: addImagesToItems(dessertsItems, 'desserts'),
      spritzes: spritzsItems,
      sides: sidesItems,
      snacks_and_starters: snacksItems,
      champagnes: champagnesItems,
      gin_and_tonics: ginTonicItems
    };

    console.log('Final menuData:', menuData); // Debug log

    return NextResponse.json({
      success: true,
      data: menuData
    });

  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch menu items',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
