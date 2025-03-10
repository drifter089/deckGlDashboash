"use client";
import { GeoJsonLayer } from "deck.gl";
import { regionalGeneratorTypes } from "@/utilities/GenerationMixChartConfig";
import { Feature, Geometry, GeoJsonProperties } from 'geojson';

interface RegionLayerProps {
  regionGeneratorValue: keyof typeof regionalGeneratorTypes;
  regionParamValue: string;
  links: any;
  selectedCountry: string;
}

interface GeoJsonFeature {
  properties: {
    carrier: string;
    [key: string]: any;
  };
}

// regions colors
const metricColorScales = {
  cf: {
    low: [255, 235, 200],    
    high: [255, 140, 0]      
  },
  crt: {
    low: [200, 255, 200],    
    high: [255, 50, 50]      
  },
  usdpt: {
    low: [200, 200, 255],    
    high: [0, 0, 255]        
  }
} as const;

const RegionLayer = ({
  regionGeneratorValue,
  regionParamValue,
  links,
  selectedCountry,
}: RegionLayerProps): GeoJsonLayer => {
  const timestamp = Date.now() + Math.random();
  
  // Construct URL with proper query parameters
  const baseUrl = links.regions_2021;
  const fullUrl = new URL(baseUrl, window.location.origin);
  fullUrl.searchParams.set('generatorType', regionGeneratorValue);
  fullUrl.searchParams.set('simplification', '0.01');
  fullUrl.searchParams.set('pageSize', '10000');
  fullUrl.searchParams.set('year', '2021');

  // Function to calculate statistics of the data
  const calculateDataStats = (features: Feature<Geometry>[]) => {
    if (!features || features.length === 0) return { min: 0, max: 1, mean: 0.5 };

    const values = features
      .map(f => f.properties?.[regionParamValue])
      .filter((v): v is number => v !== undefined && v !== null && !isNaN(v));

    if (values.length === 0) return { min: 0, max: 1, mean: 0.5 };

    const min = Math.min(...values);
    const max = Math.max(...values);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;

    return { min, max, mean };
  };

  const getFillColor = (d: Feature<Geometry>, { data }: { data: { features: Feature<Geometry>[] } }): [number, number, number, number] => {
    if (!d.properties) return [0, 0, 0, 0];

    // color for empty data
    if (d.properties.is_empty_data) {
      return [200, 200, 200, 100];
    }

    const value = d.properties[regionParamValue];
    if (value === undefined || value === null) return [0, 0, 0, 0];

    const stats = calculateDataStats(data.features);
    
    let normalizedValue;
    switch (regionParamValue) {
      case 'cf':
        // CF: normalize considering the real range of the data
        normalizedValue = (value - stats.min) / (stats.max - stats.min);
        break;
      case 'crt':
        // Curtailment: use logarithmic scale to highlight low values
        normalizedValue = Math.log1p(value) / Math.log1p(stats.max);
        break;
      case 'usdpt':
        // Used potential: normalize focusing on the mean
        const relativeToMean = (value - stats.mean) / (stats.max - stats.mean);
        normalizedValue = relativeToMean > 0 
          ? 0.5 + (relativeToMean * 0.5)  
          : 0.5 * (value / stats.mean);    
      default:
        normalizedValue = (value - stats.min) / (stats.max - stats.min);
    }

    // Ensure the normalized value is between 0 and 1
    normalizedValue = Math.min(Math.max(normalizedValue, 0), 1);

    const colorScale = metricColorScales[regionParamValue as keyof typeof metricColorScales];

    // Interpolate between the low and high colors according to the normalized value
    const r = Math.round(colorScale.low[0] + (colorScale.high[0] - colorScale.low[0]) * normalizedValue);
    const g = Math.round(colorScale.low[1] + (colorScale.high[1] - colorScale.low[1]) * normalizedValue);
    const b = Math.round(colorScale.low[2] + (colorScale.high[2] - colorScale.low[2]) * normalizedValue);
    
    // Adjust the opacity according to the normalized value
    const alpha = 100 + Math.round(normalizedValue * 155); // Range of 100-255 for better visibility

    return [r, g, b, alpha];
  };

  return new GeoJsonLayer({
    id: `${selectedCountry}_${regionGeneratorValue}_${regionParamValue}_${timestamp}`,
    data: fullUrl.toString(),
    opacity: 1,
    stroked: true,
    filled: true,
    pickable: true,
    getLineColor: [50, 50, 50, 200] as [number, number, number, number],
    getFillColor: getFillColor as unknown as [number, number, number, number],
    getLineWidth: 2,
    lineWidthMinPixels: 1,
    lineWidthScale: 1,
    updateTriggers: {
      getFillColor: [
        regionGeneratorValue,
        regionParamValue,
        links,
        selectedCountry,
      ],
    },
    getRadius: 100,
    parameters: {
      depthTest: false
    }
  });
};

export default RegionLayer;
