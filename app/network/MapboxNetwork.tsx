"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTheme } from 'next-themes';
import { useCountry } from '@/components/country-context';
import { COUNTRY_COORDINATES, COUNTRY_VIEW_CONFIG, getGeoJsonData, COUNTRY_S_NOM_RANGES, COUNTRY_BUS_RANGES } from '@/utilities/CountryConfig/Link';
import MySideDrawer from './popups/SideDrawer';

// Constants for layer IDs
const LAYER_IDS = {
  COUNTRY: 'country-layer',
  LINES: 'transmission-lines',
  BUSES: 'bus-stations',
  LABELS: 'country-labels'
};

export const COUNTRY_BUS_CONFIGS = {
  US: { minRadius: 1000, maxRadius: 40000, zoomBase: 1.2 },
  MX: { minRadius: 5000, maxRadius: 25000, zoomBase: 1.2 },
  BR: { minRadius: 15000, maxRadius: 35000, zoomBase: 1.2 },
  DE: { minRadius: 4000, maxRadius: 15000, zoomBase: 1.2 },
  CO: { minRadius: 5000, maxRadius: 10000, zoomBase: 1.2 },
  AU: { minRadius: 3000, maxRadius: 10000, zoomBase: 1.1 },
  IN: { minRadius: 2500, maxRadius: 20000, zoomBase: 1.2 },
  ZA: { minRadius: 5000, maxRadius: 20000, zoomBase: 1.2 },
  IT: { minRadius: 3000, maxRadius: 5000, zoomBase: 1.2 },
  NG: { minRadius: 3000, maxRadius: 5000, zoomBase: 1.2 },
} as const;

    
const BUS_SIZE_RANGES = {
  VERY_SMALL: { max: 1, radius: 4 },      // 0-1 GVA
  SMALL: { max: 5, radius: 6 },           // 1-5 GVA
  MEDIUM: { max: 20, radius: 8 },         // 5-20 GVA
  LARGE: { max: 50, radius: 12 },         // 20-50 GVA
  VERY_LARGE: { radius: 16 }              // >50 GVA
};

const STATE_MULTIPLIERS = {
  BASE: 1,
  HOVER: 1.3,
  SELECTED: 1.5
};

const ANIMATION_DURATION = {
  FLY_TO: 800,
  TRANSITION: 200
};

const MapboxNetwork = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const eventListenersRef = useRef<{ [key: string]: any }>({});
  const { theme } = useTheme();
  const { selectedCountry } = useCountry();
  const [mapStyle, setMapStyle] = useState<string>(
    theme === 'light' ? 'mapbox://styles/mapbox/light-v11' : 'mapbox://styles/mapbox/dark-v11'
  );
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [hoveredBus, setHoveredBus] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [busCapacities, setBusCapacities] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(4);
  const initializeStartedRef = useRef(false);
  const [isMounted, setIsMounted] = useState(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  // Set initial mounted state
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Update map style when theme changes
  useEffect(() => {
    setMapStyle(theme === 'light' ? 'mapbox://styles/mapbox/light-v11' : 'mapbox://styles/mapbox/dark-v11');
  }, [theme]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || !isMounted || !mapStyle || !selectedCountry) {
      return;
    }
    
    if (mapRef.current) {
      return;
    }

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: [COUNTRY_COORDINATES[selectedCountry][1], COUNTRY_COORDINATES[selectedCountry][0]],
      zoom: COUNTRY_VIEW_CONFIG[selectedCountry].zoom,
      minZoom: 3,
      maxZoom: 20
    });

    map.addControl(
      new mapboxgl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: true
      }),
      'bottom-right'
    );

    map.addControl(
      new mapboxgl.ScaleControl({ maxWidth: 200, unit: 'metric' }),
      'bottom-left'
    );

    const loadHandler = () => {
      setMapLoaded(true);
    };

    const zoomHandler = () => {
      setZoomLevel(map.getZoom());
    };

    map.on('load', loadHandler);
    map.on('zoom', zoomHandler);
    
    eventListenersRef.current = {
      load: loadHandler,
      zoom: zoomHandler
    };

    mapRef.current = map;

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      removeEventListeners();
      if (map) {
        map.remove();
      }
      mapRef.current = null;
      setMapLoaded(false);
    };
  }, [mapStyle, isMounted, selectedCountry]);

  const loadBusCapacities = useCallback(async (country: string) => {
    if (!country) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/bustotal/${country}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error("Invalid API response format");
      }

      const capacities = data.data.reduce(
        (acc: Record<string, number>, item: any) => {
          if (item.bus && typeof item.total_capacity === "number") {
            acc[item.bus] = item.total_capacity;
          }
          return acc;
        },
        {}
      );

      if (Object.keys(capacities).length === 0) {
        throw new Error("No valid bus capacities found in response");
      }

      setBusCapacities(capacities);
    } catch (error) {
      setBusCapacities({});
    } finally {
      setIsLoading(false);
    }
  }, []);

  const calculateBusRadius = useCallback((busId: string, capacity: number) => {
    if (!capacity) return COUNTRY_BUS_CONFIGS[selectedCountry].minRadius / 100;

    const config = COUNTRY_BUS_CONFIGS[selectedCountry];
    const { minRadius, maxRadius, zoomBase } = config;

    const capacityValues = Object.values(busCapacities);
    const minCapacity = Math.min(...capacityValues);
    const maxCapacity = Math.max(...capacityValues);

    const logBase = 2;
    const logMin = Math.log(minCapacity + 1) / Math.log(logBase);
    const logMax = Math.log(maxCapacity + 1) / Math.log(logBase);
    const logCurrent = Math.log(capacity + 1) / Math.log(logBase);

    const normalizedSize = (logCurrent - logMin) / (logMax - logMin);
    const dispersedSize = Math.pow(normalizedSize, 0.4);

    const baseRadius = minRadius + (maxRadius - minRadius) * dispersedSize;

    const zoomFactor = Math.pow(zoomBase, zoomLevel - 5);

    const numBuses = capacityValues.length;
    const densityFactor = Math.max(0.6, 1 - numBuses / 200);

    return (baseRadius * zoomFactor * densityFactor) / 100;
  }, [selectedCountry, busCapacities, zoomLevel]);

  const removeEventListeners = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.entries(eventListenersRef.current).forEach(([event, listener]) => {
      map.off(event, listener);
    });
    eventListenersRef.current = {};
  }, []);

  const updateMapData = useCallback(async (map: mapboxgl.Map) => {
    if (!map.loaded()) {
      return;
    }
    if (!map.isStyleLoaded()) {
      return;
    }

    try {
      const geoData = getGeoJsonData(selectedCountry);
      
      [LAYER_IDS.BUSES, LAYER_IDS.LINES, LAYER_IDS.COUNTRY].forEach(layerId => {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
      });

      ['country-data', 'lines-data', 'buses-data'].forEach(sourceId => {
        if (map.getSource(sourceId)) {
          map.removeSource(sourceId);
        }
      });
      
      map.addSource('country-data', {
        type: 'geojson',
        data: geoData.countryView
      });

      map.addSource('lines-data', {
        type: 'geojson',
        data: geoData.lines
      });

      map.addSource('buses-data', {
        type: 'geojson',
        data: geoData.buses
      });

      map.addLayer({
        id: LAYER_IDS.COUNTRY,
        type: 'fill',
        source: 'country-data',
        paint: {
          'fill-color': '#d7e5be',
          'fill-opacity': 0.4
        }
      });

      map.addLayer({
        id: LAYER_IDS.LINES,
        type: 'line',
        source: 'lines-data',
        paint: {
          'line-color': 'rgba(228, 30, 60, 0.6)',
          'line-width': [
            'interpolate',
            ['linear'],
            ['get', 's_nom'],
            500, 1.5,
            5000, 3,
            15000, 4.5,
            30000, 6
          ]
        }
      });

      map.addLayer({
        id: LAYER_IDS.BUSES,
        type: 'circle',
        source: 'buses-data',
        paint: {
          'circle-color': [
            'case',
            ['boolean', ['feature-state', 'selected'], false], '#ff9e3d',
            ['boolean', ['feature-state', 'hover'], false], '#8fb3a3',
            '#7c9885'
          ],
          'circle-radius': [
            'let',
            'busId',
            ['get', 'Bus'],
            [
              'let',
              'capacity',
              ['case',
                ['has', ['to-string', ['var', 'busId']], ['literal', busCapacities]],
                ['number', ['get', ['to-string', ['var', 'busId']], ['literal', busCapacities]]],
                0
              ],
              [
                'interpolate',
                ['linear'],
                ['zoom'],
                3, [
                  '*',
                  [
                    'match',
                    ['get', 'country'],
                    'US', [
                      'case',
                      ['<=', ['var', 'capacity'], 20000], 4,      // 0-20 GW
                      ['<=', ['var', 'capacity'], 50000], 8,      // 20-50 GW
                      ['<=', ['var', 'capacity'], 100000], 12,    // 50-100 GW
                      ['<=', ['var', 'capacity'], 150000], 16,    // 100-150 GW
                      20                                           // >150 GW
                    ],
                    'IN', [
                      'case',
                      ['<=', ['var', 'capacity'], 15000], 4,      // 0-15 GW
                      ['<=', ['var', 'capacity'], 35000], 8,      // 15-35 GW
                      ['<=', ['var', 'capacity'], 60000], 12,     // 35-60 GW
                      ['<=', ['var', 'capacity'], 90000], 16,     // 60-90 GW
                      20                                           // >90 GW
                    ],
                    'BR', [
                      'case',
                      ['<=', ['var', 'capacity'], 5000], 4,       // 0-5 GW
                      ['<=', ['var', 'capacity'], 15000], 8,      // 5-15 GW
                      ['<=', ['var', 'capacity'], 30000], 12,     // 15-30 GW
                      ['<=', ['var', 'capacity'], 45000], 16,     // 30-45 GW
                      20                                           // >45 GW
                    ],
                    'DE', [
                      'case',
                      ['<=', ['var', 'capacity'], 10000], 4,      // 0-10 GW
                      ['<=', ['var', 'capacity'], 25000], 8,      // 10-25 GW
                      ['<=', ['var', 'capacity'], 45000], 12,     // 25-45 GW
                      ['<=', ['var', 'capacity'], 65000], 16,     // 45-65 GW
                      20                                           // >65 GW
                    ],
                    'AU', [
                      'case',
                      ['<=', ['var', 'capacity'], 2500], 4,      // 0-2.5 GW
                      ['<=', ['var', 'capacity'], 7500], 8,      // 2.5-7.5 GW
                      ['<=', ['var', 'capacity'], 12500], 12,     // 7.5-12.5 GW
                      ['<=', ['var', 'capacity'], 17500], 16,     // 12.5-17.5 GW
                      20                                           // >17.5 GW
                    ],
                    'CO', [
                      'case',
                      ['<=', ['var', 'capacity'], 500], 4,       // 0-0.5 GW
                      ['<=', ['var', 'capacity'], 1500], 8,       // 0.5-1.5 GW
                      ['<=', ['var', 'capacity'], 3000], 12,        // 1.5-3 GW
                      ['<=', ['var', 'capacity'], 5000], 16,        // 3-5 GW
                      20                                           // >5 GW
                    ],
                    'MX', [
                      'case',
                      ['<=', ['var', 'capacity'], 3000], 4,       // 0-3 GW
                      ['<=', ['var', 'capacity'], 8000], 8,       // 3-8 GW
                      ['<=', ['var', 'capacity'], 15000], 12,       // 8-15 GW
                      ['<=', ['var', 'capacity'], 20000], 16,       // 15-20 GW
                      20                                           // >20 GW
                    ],
                    'NG', [
                      'case',
                      ['<=', ['var', 'capacity'], 500], 4,       // 0-0.5 GW
                      ['<=', ['var', 'capacity'], 1500], 8,        // 0.5-2 GW
                      ['<=', ['var', 'capacity'], 3000], 12,         // 2-5 GW
                      ['<=', ['var', 'capacity'], 5000], 16,         // 5-8 GW
                      20                                           // >8 GW
                    ],
                    'IT', [
                      'case',
                      ['<=', ['var', 'capacity'], 5000], 4,       // 0-5 GW
                      ['<=', ['var', 'capacity'], 15000], 8,      // 5-15 GW
                      ['<=', ['var', 'capacity'], 25000], 12,     // 15-25 GW
                      ['<=', ['var', 'capacity'], 40000], 16,     // 25-40 GW
                      20                                           // >40 GW
                    ],
                    'ZA', [
                      'case',
                      ['<=', ['var', 'capacity'], 2500], 4,       // 0-2.5 GW
                      ['<=', ['var', 'capacity'], 10000], 8,       // 2.5-10 GW
                      ['<=', ['var', 'capacity'], 20000], 12,       // 10-20 GW
                      ['<=', ['var', 'capacity'], 35000], 16,       // 20-35 GW
                      20                                           // >35 GW
                    ],
                    [
                      'case',
                      ['<=', ['var', 'capacity'], 1000], 4,       // 0-1 GW
                      ['<=', ['var', 'capacity'], 5000], 8,       // 1-5 GW
                      ['<=', ['var', 'capacity'], 10000], 12,       // 5-10 GW
                      ['<=', ['var', 'capacity'], 15000], 16,       // 10-15 GW
                      20                                           // >15 GW
                    ]
                  ],
                  [
                    'case',
                    ['boolean', ['feature-state', 'selected'], false], STATE_MULTIPLIERS.SELECTED,
                    ['boolean', ['feature-state', 'hover'], false], STATE_MULTIPLIERS.HOVER,
                    STATE_MULTIPLIERS.BASE
                  ]
                ]
              ]
            ]
          ],
          'circle-opacity': 0.8,
          'circle-stroke-width': [
            'case',
            ['boolean', ['feature-state', 'selected'], false], 2,
            ['boolean', ['feature-state', 'hover'], false], 1,
            0
          ],
          'circle-stroke-color': '#ffffff'
        }
      });

      const mousemoveHandler = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
        if (e.features && e.features[0]) {
          const feature = e.features[0];
          const busId = feature.properties?.Bus;
          
          if (busId && busId !== selectedBus) {
            map.getCanvas().style.cursor = 'pointer';
            
            if (hoveredBus) {
              map.setFeatureState(
                { source: 'buses-data', id: busId },
                { hover: false }
              );
            }
            
            map.setFeatureState(
              { source: 'buses-data', id: busId },
              { hover: true }
            );
            
            setHoveredBus(busId);
          }
        } else {
          map.getCanvas().style.cursor = '';
          if (hoveredBus) {
            map.setFeatureState(
              { source: 'buses-data', id: hoveredBus },
              { hover: false }
            );
            setHoveredBus(null);
          }
        }
      };

      const mouseleaveHandler = () => {
        map.getCanvas().style.cursor = '';
        if (hoveredBus) {
          map.setFeatureState(
            { source: 'buses-data', id: hoveredBus },
            { hover: false }
          );
          setHoveredBus(null);
        }
      };

      const clickHandler = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
        if (e.features && e.features[0]) {
          const feature = e.features[0];
          const busId = feature.properties?.Bus;
          
          if (busId) {
            if (selectedBus === busId) {
              map.setFeatureState(
                { source: 'buses-data', id: busId },
                { selected: false }
              );
              setSelectedBus(null);
              setDrawerOpen(false);
            } else {
              if (selectedBus) {
                map.setFeatureState(
                  { source: 'buses-data', id: selectedBus },
                  { selected: false }
                );
              }
              
              map.setFeatureState(
                { source: 'buses-data', id: busId },
                { selected: true }
              );
              
              setSelectedBus(busId);
              setHoveredBus(null);
              setDrawerOpen(true);
              
              if (e.lngLat) {
                map.flyTo({
                  center: [e.lngLat.lng - 0.1, e.lngLat.lat],
                  zoom: Math.max(map.getZoom(), 6),
                  duration: ANIMATION_DURATION.FLY_TO
                });
              }
            }
          }
        }
      };

      map.on('mousemove', LAYER_IDS.BUSES, mousemoveHandler);
      map.on('mouseleave', LAYER_IDS.BUSES, mouseleaveHandler);
      map.on('click', LAYER_IDS.BUSES, clickHandler);

      eventListenersRef.current = {
        ...eventListenersRef.current,
        [`mousemove.${LAYER_IDS.BUSES}`]: mousemoveHandler,
        [`mouseleave.${LAYER_IDS.BUSES}`]: mouseleaveHandler,
        [`click.${LAYER_IDS.BUSES}`]: clickHandler
      };

      const labelLayers = map.getStyle().layers.filter(layer => 
        layer.type === 'symbol' && 
        (layer.layout?.['text-field'] || layer.id.includes('label'))
      );

      labelLayers.forEach(layer => {
        if (map.getLayer(layer.id)) {
          map.moveLayer(layer.id);
        }
      });

    } catch (error) {
      console.error('Error updating map data:', error);
    }
  }, [selectedCountry, busCapacities]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !isMounted) {
      return;
    }

    if (Object.keys(busCapacities).length > 0) {
      const styleLoadHandler = () => {
        updateMapData(map);
      };

      if (map.isStyleLoaded()) {
        styleLoadHandler();
      } else {
        map.once('style.load', styleLoadHandler);
      }
    }

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [selectedCountry, mapLoaded, isMounted, busCapacities, updateMapData]);

  useEffect(() => {
    if (selectedCountry && mapLoaded) {
      loadBusCapacities(selectedCountry);
    }
  }, [selectedCountry, mapLoaded]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <div 
        ref={mapContainerRef} 
        style={{ width: '100%', height: '100%' }} 
        className="absolute inset-0"
      />
      <MySideDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        side="right"
        data={selectedBus ? {
          busId: selectedBus,
          countryCode: selectedCountry
        } : null}
      />
    </>
  );
};

export default MapboxNetwork; 