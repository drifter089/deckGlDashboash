import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

export async function GET() {
  const client = await pool.connect();
  try {
    const query = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND (
        table_name LIKE 'buses_%' OR 
        table_name LIKE 'lines_%' OR 
        table_name LIKE '%_country_view' OR
        table_name LIKE 'regions_%'
      )
      ORDER BY table_name;
    `;

    const result = await client.query(query);
    
    return NextResponse.json({
      tables: result.rows.map(row => row.table_name)
    });
  } catch (error) {
    console.error('Error fetching tables:', error);
    return NextResponse.json(
      { error: 'Error fetching tables' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
} 