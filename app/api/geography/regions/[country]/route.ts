import { NextResponse } from 'next/server';
import { 
  validateCountry, 
  withDbClient,
  formatGeoJsonResponse, 
  createErrorResponse 
} from '../../config';

export const dynamic = 'force-dynamic';

const DEFAULT_PAGE_SIZE = 1000;
const GEOMETRY_SIMPLIFICATION = 0.01;

export async function GET(
  request: Request,
  { params }: { params: { country: string } }
) {
  try {
    const country = params.country.toLowerCase();
    const url = new URL(request.url);
    const year = url.searchParams.get('year') || '2021';
    
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || String(DEFAULT_PAGE_SIZE));
    const offset = (page - 1) * pageSize;

    const generator_type = url.searchParams.get("generatorType");
    console.log("generator_type:", generator_type);

    const simplification = parseFloat(
      url.searchParams.get("simplification") || String(GEOMETRY_SIMPLIFICATION)
    );

    if (!validateCountry(country)) {
      return createErrorResponse(`Invalid country code: ${country}`, 400);
    }

    return await withDbClient(async (client) => {
      let viewName = `regions_${country}_${year}_materialized`;

      const viewCheck = await client.query(
        `
        SELECT EXISTS (
          SELECT FROM pg_matviews 
          WHERE schemaname = 'public' 
          AND matviewname = $1
        );
      `,
        [viewName]
      );

      if (!viewCheck.rows[0].exists) {
        const regularViewName = `regions_${country}_${year}`;
        const regularViewCheck = await client.query(
          `
          SELECT EXISTS (
            SELECT FROM information_schema.views 
            WHERE table_schema = 'public' 
            AND table_name = $1
          );
        `,
          [regularViewName]
        );

        if (!regularViewCheck.rows[0].exists) {
          return createErrorResponse(
            `View ${regularViewName} does not exist`,
            404
          );
        }

        viewName = regularViewName;
      }

      const countQuery = `
        SELECT COUNT(*) 
        FROM ${viewName}
        WHERE geometry IS NOT NULL;
      `;
      const countResult = await client.query(countQuery);
      const totalCount = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(totalCount / pageSize);

      const query = `
        WITH base_data AS (
          SELECT 
        id,
        name,
        country,
        country_code,
        "Generator",
        cf,
        crt,
        usdpt,
        horizon,
        scenario_id,
        -- Simplify geometry based on parameter
        ST_SimplifyPreserveTopology(
          geometry,
          $1
        ) as geometry
          FROM ${viewName}
          WHERE SPLIT_PART("Generator", ' ', -1) = '${generator_type}' 
          AND geometry IS NOT NULL
          ORDER BY id
          LIMIT $2 OFFSET $3
        )
        SELECT jsonb_build_object(
          'type', 'FeatureCollection',
          'features', COALESCE(
        jsonb_agg(
          jsonb_build_object(
            'type', 'Feature',
            'id', CONCAT('${country}', '_', id),
            'geometry', ST_AsGeoJSON(geometry)::jsonb,
            'properties', jsonb_build_object(
          'id', id,
          'name', name,
          'country', country,
          'country_code', country_code,
          'Generator', "Generator",
          'cf', cf,
          'crt', crt,
          'usdpt', usdpt,
          'horizon', horizon,
          'scenario_id', scenario_id
            )
          )
        ) FILTER (WHERE id IS NOT NULL),
        '[]'::jsonb
          ),
          'metadata', jsonb_build_object(
        'page', ${page},
        'pageSize', ${pageSize},
        'totalPages', ${totalPages},
        'totalCount', ${totalCount}
          )
        ) as geojson
        FROM base_data;
      `;

      const result = await client.query(query, [
        simplification,
        pageSize,
        offset,
      ]);

      if (!result.rows[0]?.geojson) {
        return formatGeoJsonResponse({
          type: "FeatureCollection",
          features: [],
          metadata: {
            page,
            pageSize,
            totalPages,
            totalCount,
          },
        });
      }

      const headers = new Headers();
      headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      headers.set("Pragma", "no-cache");
      headers.set("Expires", "0");

      return formatGeoJsonResponse(result.rows[0].geojson, headers);
    });

  } catch (error) {
    console.error('Regions API Error:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Unknown error',
      500
    );
  }
} 
