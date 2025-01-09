import { Pool } from 'pg';
import fs from 'fs/promises';
import path from 'path';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

async function importData() {
  try {
    // Read all JSON files
    const categories = {
      desserts: JSON.parse(await fs.readFile(path.join(process.cwd(), 'src/app/data/Desserts.json'), 'utf-8')),
      drinks: JSON.parse(await fs.readFile(path.join(process.cwd(), 'src/app/data/Drinks.json'), 'utf-8')),
      entrees: JSON.parse(await fs.readFile(path.join(process.cwd(), 'src/app/data/Entrees.json'), 'utf-8')),
      meals: JSON.parse(await fs.readFile(path.join(process.cwd(), 'src/app/data/Meals.json'), 'utf-8')),
      salads: JSON.parse(await fs.readFile(path.join(process.cwd(), 'src/app/data/Salads.json'), 'utf-8'))
    };

    // Import each category's items
    for (const [categoryName, data] of Object.entries(categories)) {
      // Get category ID
      const categoryResult = await pool.query(
        'SELECT id FROM categories WHERE slug = $1',
        [categoryName]
      );
      const categoryId = categoryResult.rows[0].id;

      // Import items
      const items = data[categoryName]; // Access the array using category name
      for (const item of items) {
        await pool.query(
          'INSERT INTO menu_items (category_id, name, description, price) VALUES ($1, $2, $3, $4)',
          [categoryId, item.name, item.description, item.price]
        );
      }
    }

    console.log('Data import completed successfully');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await pool.end();
  }
}

importData();