import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Optimized database pool configuration
export const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection could not be established
  statement_timeout: 30000, // Cancel queries that take more than 30 seconds
  query_timeout: 30000, // Same as above but at query level
  application_name: 'geography-api', // For better monitoring
});

// Valid country codes
export const VALID_COUNTRIES = ['au', 'br', 'co', 'de', 'in', 'it', 'mx', 'ng', 'us', 'za'];

// Types for better type safety
export type CountryCode = typeof VALID_COUNTRIES[number];
export type LayerType = 'buses' | 'lines' | 'countryView' | 'regions';

// Optimized query configurations
export const QUERY_CONFIGS = {
  buses: {
    tableName: (country: string) => `buses_${country.toLowerCase()}`,
    query: (tableName: string) => `
      SELECT jsonb_build_object(
        'type', 'FeatureCollection',
        'features', COALESCE(jsonb_agg(feature), '[]'::jsonb),
        'totalFeatures', COUNT(*) OVER()
      )
      FROM (
        SELECT jsonb_build_object(
          'type', 'Feature',
          'id', "Bus",
          'geometry', ST_AsGeoJSON(geometry)::jsonb,
          'properties', jsonb_build_object(
            'Bus', "Bus",
            'v_nom', v_nom,
            'country', country,
            'carrier', carrier,
            'type', type,
            'generator', generator,
            'country_code', country_code
          )
        ) AS feature
        FROM ${tableName}
        WHERE geometry IS NOT NULL
      ) features;
    `
  },
  lines: {
    tableName: (country: string) => `lines_${country.toLowerCase()}`,
    query: (tableName: string) => `
      SELECT jsonb_build_object(
        'type', 'FeatureCollection',
        'features', COALESCE(jsonb_agg(feature), '[]'::jsonb),
        'totalFeatures', COUNT(*) OVER()
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
        FROM ${tableName}
        WHERE geometry IS NOT NULL
      ) features;
    `
  },
  countryView: {
    tableName: (country: string) => `${country.toLowerCase()}_country_view`,
    query: (tableName: string) => `
      SELECT jsonb_build_object(
        'type', 'FeatureCollection',
        'features', COALESCE(jsonb_agg(feature), '[]'::jsonb),
        'totalFeatures', COUNT(*) OVER()
      )
      FROM (
        SELECT jsonb_build_object(
          'type', 'Feature',
          'id', country_name,
          'geometry', ST_AsGeoJSON(geometry)::jsonb,
          'properties', jsonb_build_object(
            'country_name', country_name
          )
        ) AS feature
        FROM ${tableName}
        WHERE geometry IS NOT NULL
      ) features;
    `
  },
  regions: {
    tableName: (country: string) => `regions_${country.toLowerCase()}_2021`,
    query: (tableName: string) => `
      SELECT jsonb_build_object(
        'type', 'FeatureCollection',
        'features', COALESCE(jsonb_agg(feature), '[]'::jsonb),
        'totalFeatures', COUNT(*) OVER()
      )
      FROM (
        SELECT jsonb_build_object(
          'type', 'Feature',
          'id', id,
          'geometry', ST_AsGeoJSON(geometry)::jsonb,
          'properties', jsonb_build_object(
            'id', id,
            'name', name,
            'country', country,
            'country_code', country_code,
            'horizon', horizon,
            'scenario_id', scenario_id,
            'Generator', "Generator",
            'cf', cf,
            'crt', crt,
            'usdpt', usdpt
          )
        ) AS feature
        FROM ${tableName}
        WHERE geometry IS NOT NULL
      ) features;
    `
  }
};

// Utility function to validate country code
export function validateCountry(country: string): boolean {
  return VALID_COUNTRIES.includes(country.toLowerCase());
}

// Optimized GeoJSON response formatter
export function formatGeoJsonResponse(result: any, headers?: Headers) {
  const response = (result.features) 
    ? NextResponse.json(result)
    : result.rows?.[0]?.jsonb_build_object
      ? NextResponse.json(result.rows[0].jsonb_build_object)
      : Array.isArray(result)
        ? NextResponse.json({
            type: 'FeatureCollection',
            features: result
          })
        : NextResponse.json({
            type: 'FeatureCollection',
            features: []
          });

  // Add headers if provided
  if (headers) {
    for (const [key, value] of headers.entries()) {
      response.headers.set(key, value);
    }
  }

  return response;
}

// Error response utility
export function createErrorResponse(message: string, status: number = 500) {
  return NextResponse.json(
    { error: message },
    { status }
  );
}

// Optimized database query executor
export async function executeQuery(layer: LayerType, country: string) {
  const config = QUERY_CONFIGS[layer];
  if (!config) {
    throw new Error(`Invalid layer type: ${layer}`);
  }

  const tableName = config.tableName(country);
  const query = config.query(tableName);

  const client = await pool.connect();
  try {
    const result = await client.query(query);
    return formatGeoJsonResponse(result);
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

// Utility function to get table name
export function getTableName(layer: LayerType, country: string): string {
  const config = QUERY_CONFIGS[layer];
  if (!config) {
    throw new Error(`Invalid layer type: ${layer}`);
  }
  return config.tableName(country);
}

// Database client wrapper utility
export async function withDbClient<T>(callback: (client: any) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    return await callback(client);
  } finally {
    client.release();
  }
} 