import { NextResponse } from 'next/server';
import { withDbClient, validateCountry, formatGeoJsonResponse, createErrorResponse } from '../../config';

export const revalidate = 3600;

const DEFAULT_PAGE_SIZE = 1000;
const GEOMETRY_SIMPLIFICATION = 0.01;

export async function GET(
  request: Request,
  { params }: { params: { country: string } }
) {
  try {
    const { country } = params;
    const url = new URL(request.url);
    
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || String(DEFAULT_PAGE_SIZE));
    const offset = (page - 1) * pageSize;

    const simplification = parseFloat(url.searchParams.get('simplification') || String(GEOMETRY_SIMPLIFICATION));
    
    if (!validateCountry(country)) {
      return createErrorResponse('Invalid country code', 400);
    }

    return await withDbClient(async (client) => {
      const materializedViewName = `lines_${country}_materialized`;
      
      const viewCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM pg_matviews 
          WHERE schemaname = 'public' 
          AND matviewname = $1
        );
      `, [materializedViewName]);

      const tableName = viewCheck.rows[0].exists ? materializedViewName : `lines_${country}`;

      const countQuery = `
        SELECT COUNT(*) 
        FROM ${tableName}
        WHERE geometry IS NOT NULL;
      `;
      const countResult = await client.query(countQuery);
      const totalCount = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(totalCount / pageSize);

      const query = `
        WITH base_data AS (
          SELECT 
            "Line",
            bus0,
            bus1,
            carrier,
            type,
            s_nom,
            v_nom,
            country_code,
            length,
            ST_SimplifyPreserveTopology(geometry, $1) as geometry
          FROM ${tableName}
          WHERE geometry IS NOT NULL
          ORDER BY "Line"
          LIMIT $2 OFFSET $3
        )
        SELECT jsonb_build_object(
          'type', 'FeatureCollection',
          'features', COALESCE(jsonb_agg(feature), '[]'::jsonb),
          'totalFeatures', ${totalCount},
          'metadata', jsonb_build_object(
            'page', ${page},
            'pageSize', ${pageSize},
            'totalPages', ${totalPages},
            'totalCount', ${totalCount}
          )
        )
        FROM (
          SELECT jsonb_build_object(
            'type', 'Feature',
            'id', "Line",
            'geometry', ST_AsGeoJSON(geometry)::jsonb,
            'properties', jsonb_build_object(
              'Line', "Line",
              'bus0', bus0,
              'bus1', bus1,
              'carrier', carrier,
              'type', type,
              's_nom', s_nom,
              'v_nom', v_nom,
              'country_code', country_code,
              'length', length
            )
          ) AS feature
          FROM base_data
        ) features;
      `;
      
      const result = await client.query(query, [simplification, pageSize, offset]);

      const headers = new Headers();
      headers.set('Cache-Control', 'public, s-maxage=3600');
      
      return formatGeoJsonResponse(result, headers);
    });
  } catch (error) {
    console.error('Lines API Error:', error);
    return createErrorResponse('Internal Server Error', 500);
  }
} 