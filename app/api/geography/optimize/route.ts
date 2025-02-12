import { NextResponse } from 'next/server';
import { withDbClient, createErrorResponse, VALID_COUNTRIES } from '../config';

const LAYER_CONFIGS = {
  buses: {
    columns: ['Bus', 'v_nom', 'country', 'carrier', 'type', 'generator', 'country_code', 'geometry'],
    idColumn: 'Bus'
  },
  lines: {
    columns: ['Line', 'bus0', 'bus1', 'carrier', 'type', 's_nom', 'v_nom', 'country_code', 'length', 'geometry'],
    idColumn: 'Line'
  },
  countryView: {
    columns: ['country_name', 'geometry'],
    idColumn: 'country_name'
  },
  regions: {
    columns: ['id', 'name', 'country', 'country_code', 'Generator', 'cf', 'crt', 'usdpt', 'horizon', 'scenario_id', 'geometry'],
    idColumn: 'id'
  }
};

export async function POST(request: Request) {
  try {
    return await withDbClient(async (client) => {
      const results = [];

      for (const country of VALID_COUNTRIES) {
        try {
          const busesTable = `buses_${country}`;
          const busesMaterializedView = `${busesTable}_materialized`;
          
          await client.query(`
            CREATE MATERIALIZED VIEW IF NOT EXISTS ${busesMaterializedView} AS
            SELECT ${LAYER_CONFIGS.buses.columns.join(', ')}
            FROM ${busesTable}
            WHERE geometry IS NOT NULL;
          `);
          results.push(`Created materialized view ${busesMaterializedView}`);

          await client.query(`
            CREATE INDEX IF NOT EXISTS idx_${busesMaterializedView}_geometry 
            ON ${busesMaterializedView} 
            USING GIST (geometry);
          `);
          results.push(`Created spatial index on ${busesMaterializedView}`);
        } catch (error) {
          results.push(`Error processing buses for ${country}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        try {
          const linesTable = `lines_${country}`;
          const linesMaterializedView = `${linesTable}_materialized`;
          
          await client.query(`
            CREATE MATERIALIZED VIEW IF NOT EXISTS ${linesMaterializedView} AS
            SELECT ${LAYER_CONFIGS.lines.columns.join(', ')}
            FROM ${linesTable}
            WHERE geometry IS NOT NULL;
          `);
          results.push(`Created materialized view ${linesMaterializedView}`);

          await client.query(`
            CREATE INDEX IF NOT EXISTS idx_${linesMaterializedView}_geometry 
            ON ${linesMaterializedView} 
            USING GIST (geometry);
          `);
          results.push(`Created spatial index on ${linesMaterializedView}`);
        } catch (error) {
          results.push(`Error processing lines for ${country}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        try {
          const countryViewTable = `${country}_country_view`;
          const countryViewMaterializedView = `${countryViewTable}_materialized`;
          
          await client.query(`
            CREATE MATERIALIZED VIEW IF NOT EXISTS ${countryViewMaterializedView} AS
            SELECT ${LAYER_CONFIGS.countryView.columns.join(', ')}
            FROM ${countryViewTable}
            WHERE geometry IS NOT NULL;
          `);
          results.push(`Created materialized view ${countryViewMaterializedView}`);

          await client.query(`
            CREATE INDEX IF NOT EXISTS idx_${countryViewMaterializedView}_geometry 
            ON ${countryViewMaterializedView} 
            USING GIST (geometry);
          `);
          results.push(`Created spatial index on ${countryViewMaterializedView}`);
        } catch (error) {
          results.push(`Error processing countryView for ${country}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        const years = ['2021', '2050'];
        for (const year of years) {
          try {
            const viewName = `regions_${country}_${year}`;
            const materializedViewName = `${viewName}_materialized`;

            const viewCheck = await client.query(`
              SELECT EXISTS (
                SELECT FROM information_schema.views 
                WHERE table_schema = 'public' 
                AND table_name = $1
              );
            `, [viewName]);

            if (!viewCheck.rows[0].exists) {
              results.push(`View ${viewName} does not exist, skipping...`);
              continue;
            }

            await client.query(`
              CREATE MATERIALIZED VIEW IF NOT EXISTS ${materializedViewName} AS
              SELECT ${LAYER_CONFIGS.regions.columns.join(', ')}
              FROM ${viewName}
              WHERE geometry IS NOT NULL;
            `);
            results.push(`Created materialized view ${materializedViewName}`);

            await client.query(`
              CREATE INDEX IF NOT EXISTS idx_${materializedViewName}_geometry 
              ON ${materializedViewName} 
              USING GIST (geometry);
            `);
            results.push(`Created spatial index on ${materializedViewName}`);
          } catch (error) {
            results.push(`Error processing regions for ${country}_${year}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      }

      return NextResponse.json({ 
        message: 'Optimization completed',
        details: results 
      });
    });
  } catch (error) {
    console.error('Optimization Error:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Unknown error',
      500
    );
  }
}

export async function PUT(request: Request) {
  try {
    return await withDbClient(async (client) => {
      const results = [];

      for (const country of VALID_COUNTRIES) {
        try {
          const busesMaterializedView = `buses_${country}_materialized`;
          await client.query(`REFRESH MATERIALIZED VIEW CONCURRENTLY ${busesMaterializedView};`);
          results.push(`Refreshed ${busesMaterializedView}`);
        } catch (error) {
          results.push(`Error refreshing buses for ${country}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        try {
          const linesMaterializedView = `lines_${country}_materialized`;
          await client.query(`REFRESH MATERIALIZED VIEW CONCURRENTLY ${linesMaterializedView};`);
          results.push(`Refreshed ${linesMaterializedView}`);
        } catch (error) {
          results.push(`Error refreshing lines for ${country}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        try {
          const countryViewMaterializedView = `${country}_country_view_materialized`;
          await client.query(`REFRESH MATERIALIZED VIEW CONCURRENTLY ${countryViewMaterializedView};`);
          results.push(`Refreshed ${countryViewMaterializedView}`);
        } catch (error) {
          results.push(`Error refreshing countryView for ${country}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        const years = ['2021', '2050'];
        for (const year of years) {
          try {
            const materializedViewName = `regions_${country}_${year}_materialized`;
            await client.query(`REFRESH MATERIALIZED VIEW CONCURRENTLY ${materializedViewName};`);
            results.push(`Refreshed ${materializedViewName}`);
          } catch (error) {
            results.push(`Error refreshing regions for ${country}_${year}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      }

      return NextResponse.json({ 
        message: 'Refresh completed',
        details: results 
      });
    });
  } catch (error) {
    console.error('Refresh Error:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Unknown error',
      500
    );
  }
} 