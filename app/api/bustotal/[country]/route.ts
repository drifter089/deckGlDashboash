import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { country: string } }
) {
  const country = params.country;

  try {
    const result = await pool.query(
      `
        SELECT bus, SUM(p_nom) as total_capacity
        FROM public.generators
        WHERE country_code = $1
        AND carrier != 'load'
        GROUP BY bus
        HAVING SUM(p_nom) > 0
        ORDER BY total_capacity DESC;
      `,
      [country]
    );

    return NextResponse.json({
      data: result.rows,
      meta: {
        count: result.rows.length,
        country: country
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: "Error fetching data"
    }, { status: 500 });
  }
} 