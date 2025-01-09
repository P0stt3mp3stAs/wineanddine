// lib/db.server.ts
import { Pool } from 'pg';

export const pool = new Pool({
  user: 'elghali',
  host: 'database-instance.cposom22eqj3.us-east-1.rds.amazonaws.com',
  database: 'database_name',
  password: 'SecurePass123!',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});
