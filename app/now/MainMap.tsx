"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import dynamic from 'next/dynamic';
import DeckGL from "@deck.gl/react";

import type { MapViewState } from "@deck.gl/core";
import { FlyToInterpolator } from "deck.gl";
import {
  COUNTRY_COORDINATES,
  getGeoJsonData,
  COUNTRY_VIEW_CONFIG,
} from "@/utilities/CountryConfig/Link";
import { useTheme } from "next-themes";
import { WebMercatorViewport } from "@deck.gl/core";

import { useCountry } from "@/components/country-context";
import BusesTooltip from "./popups/BusesTooltip";
import BusesLayer from "./layers/BusesLayer";
import LinesLayer from "./layers/LinesLayer";
import CountryLayer from "./layers/CountryLayer";
import RegionLayer from "./layers/RegionLayer";
import NetworkNav from "./popups/NetworkNav";
import { regionalGeneratorTypes } from "@/utilities/GenerationMixChartConfig";

// Dynamically import the Map component with specific settings
const Map = dynamic(
  () => import('react-map-gl/maplibre').then((mod) => mod.Map),
  { ssr: false, loading: () => <div>Loading map...</div> }
);

const INITIAL_VIEW_STATE: MapViewState = {
  latitude: 49.254,
  longitude: -123.13,
  zoom: 4,
  minZoom: 3,
  maxZoom: 20,
  pitch: 0,
  bearing: 0,
};

const MAP_STYLE_LIGHT =
  "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";

const MAP_STYLE_DARK =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

interface MainMapProps {
  networkView: boolean;
  regionGeneratorValue: keyof typeof regionalGeneratorTypes;
  regionParamValue: string;
}

function MainMapComponent({
  networkView,
  regionGeneratorValue,
  regionParamValue,
}: MainMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { theme: currentTheme } = useTheme();
  const DeckRef = useRef(null);
  const { selectedCountry, setSelectedCountry } = useCountry();

  const [hoverPointID, setHoverPointID] = useState<string | null>(null);
  const [busCapacities, setBusCapacities] = useState<Record<string, number>>({});
  const [busBreaks, setBusBreaks] = useState<Array<{group: number, min: number, max: number}>>([]);
  const [isLoadingBuses, setIsLoadingBuses] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(4);
  const [deckLayers, setdeckLayers] = useState<any[]>([]);

  const position = useRef({ x: 0, y: 0 });
  const [initialViewState, setInitialViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const loadBusCapacities = useCallback(async (country: string) => {
    if (!country) return;
    
    setIsLoadingBuses(true);
    try {
      const response = await fetch(`/api/bustotal/${country}`);
      if (!response.ok) {
        throw new Error('Failed to fetch bus capacities');
      }
      const data = await response.json();
      
      const capacities: Record<string, number> = {};
      data.data.forEach((row: any) => {
        capacities[row.bus] = row.total_capacity;
      });
      
      setBusCapacities(capacities);
      setBusBreaks(data.meta.breaks);
    } catch (error) {
      console.error('Error loading bus capacities:', error);
      setBusCapacities({});
      setBusBreaks([]);
    } finally {
      setIsLoadingBuses(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      loadBusCapacities(selectedCountry);
    }
  }, [selectedCountry, loadBusCapacities]);

  useEffect(() => {
    const links = getGeoJsonData(selectedCountry);

    if (networkView) {
      setdeckLayers([
        CountryLayer({ links }),
        LinesLayer({ zoomLevel, links, selectedCountry }),
      ]);
    } else {
      setdeckLayers([
        CountryLayer({ links }),
        LinesLayer({ zoomLevel, links, selectedCountry }),
      ]);
    }
  }, [
    selectedCountry,
    zoomLevel,
    networkView,
    regionGeneratorValue,
    regionParamValue,
  ]);

  useEffect(() => {
    const countryCoordinates = COUNTRY_COORDINATES[selectedCountry];
    const viewConfig = COUNTRY_VIEW_CONFIG[selectedCountry];

    const viewport = new WebMercatorViewport({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    setInitialViewState({
      ...viewport,
      latitude: countryCoordinates[0],
      longitude: countryCoordinates[1],
      zoom: viewConfig.zoom,
      minZoom: 3,
      maxZoom: 20,
      pitch: 0,
      bearing: 0,
      transitionInterpolator: new FlyToInterpolator({ speed: 1.5 }),
      transitionDuration: 1500,
    });
  }, [selectedCountry]);

  const layers = useMemo(() => {
    if (!networkView) return [];

    return [
      ...deckLayers,
      BusesLayer({
        setHoverPointID,
        position: position.current,
        zoomLevel,
        busCapacities,
        isLoading: isLoadingBuses,
        selectedCountry,
        breaks: busBreaks,
      }),
    ];
  }, [networkView, setHoverPointID, position, zoomLevel, busCapacities, isLoadingBuses, selectedCountry, deckLayers, busBreaks]);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <div onContextMenu={(evt) => evt.preventDefault()}>
        <DeckGL
          layers={layers}
          initialViewState={initialViewState}
          controller={true}
          ref={DeckRef}
          onViewStateChange={(params) => {
            if (params.viewState && "latitude" in params.viewState) {
              setZoomLevel(params.viewState.zoom);
            }
          }}
        >
          <Map
            reuseMaps
            mapStyle={
              currentTheme === "light" ? MAP_STYLE_LIGHT : MAP_STYLE_DARK
            }
            styleDiffing={false}
          />
          <div
            style={{
              position: "fixed",
              zIndex: 100,
              pointerEvents: "none",
              left: position.current.x,
              top: position.current.y * 0.5,
            }}
          >
            <BusesTooltip hoveredBus={hoverPointID} />
          </div>
        </DeckGL>
      </div>
    </>
  );
}

export default dynamic(() => Promise.resolve(MainMapComponent), {
  ssr: false
});

