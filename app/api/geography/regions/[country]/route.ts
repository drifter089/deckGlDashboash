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
      // Check if the view exists for the given country and year
      const viewName = `regions_${country}_${year}`;
      const viewCheck = await client.query(
        `
        SELECT EXISTS (
          SELECT FROM information_schema.views 
          WHERE table_schema = 'public' 
          AND table_name = $1
        );
        `,
        [viewName]
      );

      if (!viewCheck.rows[0].exists) {
        return createErrorResponse(
          `View ${viewName} does not exist`,
          404
        );
      }

      // Check if generator metrics table exists
      const metricsTableName = `generator_metrics_${country}`;
      const metricsCheck = await client.query(
        `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        );
        `,
        [metricsTableName]
      );

      if (!metricsCheck.rows[0].exists) {
        return createErrorResponse(
          `Generator metrics table ${metricsTableName} does not exist`,
          404
        );
      }

      const countQuery = `
        SELECT COUNT(*) 
        FROM ${viewName} r
        WHERE r.geometry IS NOT NULL
      `;
      const countResult = await client.query(countQuery);
      const totalCount = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(totalCount / pageSize);

      const query = `
        WITH base_data AS (
          SELECT 
            r.id,
            r.name,
            r.country_code,
            COALESCE(gm.carrier, $2) as carrier,
            COALESCE(AVG(gm.cf), 0) as cf,
            COALESCE(AVG(gm.crt), 0) as crt,
            COALESCE(AVG(gm.usdpt), 0) as usdpt,
            '${year}' as horizon,
            1 as scenario_id,
            ST_SimplifyPreserveTopology(r.geometry, $1) as geometry,
            CASE 
              WHEN gm.carrier IS NULL THEN true
              ELSE false
            END as is_empty_data
          FROM ${viewName} r
          LEFT JOIN public.${metricsTableName} gm ON r.name = gm.bus
            AND gm.carrier = $2
            AND gm.carrier NOT IN ('csp', 'load')
          WHERE r.geometry IS NOT NULL
          GROUP BY r.id, r.name, r.country_code, gm.carrier, r.geometry
          ORDER BY r.id
          LIMIT $3 OFFSET $4
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
                  'country_code', country_code,
                  'carrier', carrier,
                  'cf', cf,
                  'crt', crt,
                  'usdpt', usdpt,
                  'horizon', horizon,
                  'scenario_id', scenario_id,
                  'is_empty_data', is_empty_data
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
        generator_type,
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
