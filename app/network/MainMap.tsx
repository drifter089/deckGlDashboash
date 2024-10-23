"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Map } from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import type { MapViewState, ViewStateChangeParameters } from "@deck.gl/core";
import { FlyToInterpolator } from "deck.gl";
import { MyCustomLayers } from "./components/Layer";
import { getGeoJsonData, COUNTRY_COORDINATES } from "./components/Links";
import BottomDrawer from "./popups/BottomDrawer";
import MySideDrawer from "./popups/SideDrawer";
import { useTheme } from "next-themes";
import CountrySelect from "./components/CountrySelect";
import { GeoJsonLayer } from "@deck.gl/layers";
import { FeatureCollection, Geometry, Point } from '@turf/helpers';
import { Layer } from '@deck.gl/core';
import { WebMercatorViewport } from '@deck.gl/core';
import { bbox } from '@turf/turf';

// Define the type based on COUNTRY_COORDINATES keys
type CountryCode = keyof typeof COUNTRY_COORDINATES;

const INITIAL_VIEW_STATE: MapViewState = {
  latitude: 0,
  longitude: 0,
  zoom: 2,
  minZoom: 2,
  maxZoom: 20,
  pitch: 0,
  bearing: 0,
};

const MAP_STYLE_LIGHT =
  "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";
const MAP_STYLE_DARK =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

export default function MainMap() {
  const { theme } = useTheme();
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("US");
  const [busesData, setBusesData] = useState<FeatureCollection<Point> | null>(null);
  const [linesData, setLinesData] = useState<FeatureCollection<Geometry> | null>(null);
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);
  const [open, setOpen] = useState(false);
  const [lineOpen, setLineOpen] = useState(false);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [zoom, setZoom] = useState(INITIAL_VIEW_STATE.zoom);
  const [hoveredObject, setHoveredObject] = useState(null);
  const [clickedObject, setClickedObject] = useState(null);

  useEffect(() => {
    const { buses, lines } = getGeoJsonData(selectedCountry);
    console.log('Fetching data for country:', selectedCountry);
    console.log('Buses URL:', buses);
    console.log('Lines URL:', lines);

    const fetchData = async (url: string, dataType: string) => {
      try {
        console.log(`Fetching ${dataType} data from:`, url);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get("content-type");
        console.log(`Content-Type for ${dataType}:`, contentType);
        const data = await response.json();
        console.log(`${dataType} data:`, data);
        if (data.features && data.features.length > 0) {
          console.log(`First feature of ${dataType}:`, data.features[0]);
        } else {
          console.log(`No features found in ${dataType} data`);
        }
        return data;
      } catch (error) {
        console.error(`Error fetching ${dataType} data:`, error);
        return null;
      }
    };

    Promise.all([
      fetchData(buses, 'Buses'),
      fetchData(lines, 'Lines')
    ]).then(([busesData, linesData]) => {
      console.log('Setting buses data:', busesData ? 'Data received' : 'No data');
      console.log('Setting lines data:', linesData ? 'Data received' : 'No data');
      setBusesData(busesData);
      setLinesData(linesData);
      setDataLoaded(true);
    });
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && COUNTRY_COORDINATES[selectedCountry]) {
      const [latitude, longitude] = COUNTRY_COORDINATES[selectedCountry];
      setViewState({
        ...viewState,
        latitude,
        longitude,
        zoom: 4,
        transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
        transitionDuration: 1000,
      });
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (dataLoaded) {
      const newLayers = MyCustomLayers(busesData, linesData, selectedCountry, viewState.zoom, hoveredObject, clickedObject);
      setLayers(newLayers);
      console.log('Updated layers:', newLayers);
    }
  }, [busesData, linesData, selectedCountry, dataLoaded, viewState.zoom, hoveredObject, clickedObject]);

  useEffect(() => {
    if (dataLoaded && busesData && linesData) {
      const allFeatures = [
        ...(busesData.features || []),
        ...(linesData.features || [])
      ];

      if (allFeatures.length > 0) {
        const [minLng, minLat, maxLng, maxLat] = bbox({
          type: 'FeatureCollection',
          features: allFeatures
        });

        const viewport = new WebMercatorViewport({
          width: window.innerWidth,
          height: window.innerHeight
        });

        const { longitude, latitude, zoom } = viewport.fitBounds(
          [[minLng, minLat], [maxLng, maxLat]],
          {
            padding: 40
          }
        );

        setViewState({
          ...viewState,
          longitude,
          latitude,
          zoom,
          transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
          transitionDuration: 1000,
        });
      }
    }
  }, [dataLoaded, busesData, linesData]);

  const onSelectCountry = useCallback((country: CountryCode) => {
    setSelectedCountry(country);
  }, []);

  const onViewStateChange = useCallback((params: ViewStateChangeParameters<MapViewState>) => {
    setViewState(params.viewState);
    setZoom(params.viewState.zoom);
  }, []);

  const onHover = useCallback((info: any) => {
    setHoveredObject(info.object);
  }, []);

  const onClick = useCallback((info: any) => {
    setClickedObject(info.object === clickedObject ? null : info.object);
  }, [clickedObject]);

  const getTooltip = useCallback((info: any) => {
    const { object } = info;
    if (!object) return null;
    
    if (object.properties) {
      if (object.properties.Bus) {
        return `Bus: ${object.properties.Bus}`;
      } else if (object.properties.Line) {
        return `Line: ${object.properties.Line}`;
      }
    }
    
    return `ID: ${object.id || 'Unknown'}`;
  }, []);

  return (
    <>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
        <CountrySelect onSelectCountry={onSelectCountry} />
      </div>
      <div onContextMenu={(evt) => evt.preventDefault()}>
        <DeckGL
          layers={layers}
          initialViewState={viewState}
          onViewStateChange={onViewStateChange}
          controller={true}
          getTooltip={getTooltip}
          onHover={onHover}
          onClick={onClick}
        >
          <Map
            reuseMaps
            mapStyle={theme === "light" ? MAP_STYLE_LIGHT : MAP_STYLE_DARK}
          />
        </DeckGL>
      </div>
      <BottomDrawer />
      <MySideDrawer open={open} setOpen={setOpen} side={"right"} data={"Bus"} />
      <MySideDrawer
        open={lineOpen}
        setOpen={setLineOpen}
        side={"left"}
        data={"Line"}
      />
    </>
  );
}
