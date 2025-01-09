// const { Pool } = require('pg');
// const fs = require('fs');

// // PostgreSQL connection configuration
// const pool = new Pool({
//   user: 'elghali',
//   host: 'database-instance.cposom22eqj3.us-east-1.rds.amazonaws.com',
//   database: 'database_name',
//   password: 'SecurePass123!',
//   port: 5432,
//   ssl: {
//     rejectUnauthorized: false, // This disables certificate verification
//   },
// });

// // Load the JSON file
// const data = JSON.parse(fs.readFileSync('menu.json', 'utf8'));

// // Function to insert data into a table
// async function importData(tableName, items, columns) {
//     const client = await pool.connect();
//     try {
//         await client.query('BEGIN'); // Start transaction
//         for (const item of items) {
//             const values = columns.map(column => item[column] || null);
//             const placeholders = values.map((_, idx) => `$${idx + 1}`).join(', ');
//             await client.query(
//                 `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`,
//                 values
//             );
//         }
//         await client.query('COMMIT'); // Commit transaction
//         console.log(`${tableName} imported successfully!`);
//     } catch (error) {
//         await client.query('ROLLBACK'); // Rollback on error
//         console.error(`Error importing ${tableName}:`, error.message);
//     } finally {
//         client.release();
//     }
// }

// // Mapping of tables to data and columns
// const tables = {
//     specialties: { data: data.specialties, columns: ['name', 'description', 'price'] },
//     salads: { data: data.salads, columns: ['name', 'description', 'prices'] },
//     steaks: { data: data.steaks, columns: ['name', 'price', 'unit'] },
//     snacks_and_starters: { data: data.snacks_and_starters, columns: ['name', 'description', 'price'] },
//     mains: { data: data.mains, columns: ['name', 'description', 'price'] },
//     sides: { data: data.sides, columns: ['name', 'description', 'price'] },
//     desserts: { data: data.desserts, columns: ['name', 'description', 'price'] },
//     gin_and_tonics: { data: data.gin_and_tonic, columns: ['name', 'description', 'price'] },
//     spritzes: { data: data.spritz, columns: ['name', 'description', 'price'] },
//     champagnes: { data: data.champagne, columns: ['name', 'description', 'price'] },
// };

// // Run the import for all tables
// async function runImport() {
//     for (const [table, { data, columns }] of Object.entries(tables)) {
//         await importData(table, data, columns);
//     }
//     pool.end();
// }

// runImport().catch(error => {
//     console.error('Unexpected error:', error.message);
//     pool.end();
// });