"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Map } from "react-map-gl/maplibre";
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
  regionalDataParams: any;
}

export default function MainMap({
  networkView,
  regionalDataParams,
}: MainMapProps) {
  const { theme: currentTheme } = useTheme();
  const DeckRef = useRef(null);
  const { selectedCountry, setSelectedCountry } = useCountry();

  const [hoverPointID, setHoverPointID] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [initialViewState, setInitialViewState] =
    useState<MapViewState>(INITIAL_VIEW_STATE);

  const [zoomLevel, setZoomLevel] = useState(4);

  const makeLayers = useCallback(() => {
    if (networkView) {
      return [CountryLayer(), LinesLayer({ zoomLevel })];
    } else {
      return [CountryLayer(), RegionLayer({ regionalDataParams })];
    }
  }, [selectedCountry, zoomLevel, networkView, regionalDataParams]);

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

  const onViewStateChange = useCallback(
    (params: { viewState: MapViewState }) => {
      setZoomLevel(params.viewState.zoom);
    },
    []
  );

  return (
    <>
      <div onContextMenu={(evt) => evt.preventDefault()}>
        <DeckGL
          layers={[
            ...makeLayers(),
            BusesLayer({
              hoverPointID,
              setHoverPointID,
              position,
              setPosition,
              zoomLevel,
            }),
          ]}
          initialViewState={initialViewState}
          controller={true}
          ref={DeckRef}
          onViewStateChange={onViewStateChange as any}
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
              left: position.x,
              top: position.y * 0.5,
            }}
          >
            <BusesTooltip hoveredBus={hoverPointID} />
          </div>
        </DeckGL>
      </div>
    </>
  );
}
