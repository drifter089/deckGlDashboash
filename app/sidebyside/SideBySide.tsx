"use client";
import * as React from "react";
import { useState, useCallback, useMemo } from "react";
import Map, {
  useControl,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from "react-map-gl";
import { GeoJsonLayer } from "@deck.gl/layers";
import {
  US_2021_DATA,
  US_2050_DATA,
} from "../../components/SolarSection/Links";
import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import MyDropdown from "./MyDropdown";
import ModePannel, { Mode } from "./Mode";

function DeckGLOverlay(props: MapboxOverlayProps) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

const TOKEN =
  "pk.eyJ1IjoiYWtzaGF0bWl0dGFsMDAwNyIsImEiOiJjbTFoemJiaHAwa3BoMmpxMWVyYjY1MTM3In0.4XAyidtzk9SRyiyfonIvdw"; // Set your mapbox token here

const LeftMapStyle: React.CSSProperties = {
  position: "absolute",
  width: "50%",
  height: "100%",
};
const RightMapStyle: React.CSSProperties = {
  position: "absolute",
  left: "50%",
  width: "50%",
  height: "100%",
};

export default function SideBySide() {
  const [viewState, setViewState] = useState({
    latitude: 49.254,
    longitude: -123.13,
    zoom: 4,
    minZoom: 3,
    maxZoom: 20,
    pitch: 30,
    bearing: 0,
  });

  const [mode, setMode] = useState<Mode>("split-screen");

  const [activeMap, setActiveMap] = useState<"left" | "right">("left");

  const onLeftMoveStart = useCallback(() => setActiveMap("left"), []);
  const onRightMoveStart = useCallback(() => setActiveMap("right"), []);
  const onMove = useCallback((evt) => setViewState(evt.viewState), []);

  const width = typeof window === "undefined" ? 100 : window.innerWidth;
  const leftMapPadding = useMemo(() => {
    return {
      left: mode === "split-screen" ? width / 2 : 0,
      top: 0,
      right: 0,
      bottom: 0,
    };
  }, [width, mode]);
  const rightMapPadding = useMemo(() => {
    return {
      right: mode === "split-screen" ? width / 2 : 0,
      top: 0,
      left: 0,
      bottom: 0,
    };
  }, [width, mode]);

  const layers = [
    new GeoJsonLayer({
      id: `polygon-layer${US_2021_DATA.id}`,
      data: US_2050_DATA.polygon,
      stroked: true,
      opacity: 0.25,
      filled: true,
      extruded: false,
      wireframe: false,
      getElevation: 0,
      getLineColor: [75, 75, 75],
      getFillColor: [225, 75, 75, 20],
      lineWidthMinPixels: 2,
      // lineWidthScale: 20,
      dashArray: [10, 5],
      getLineWidth: 10,
      pickable: true,
    }),
  ];

  return (
    <>
      <div className="relative h-screen overflow-hidden">
        <Map
          id="left-map"
          {...viewState}
          padding={leftMapPadding}
          onMoveStart={onLeftMoveStart}
          onMove={activeMap === "left" && onMove}
          style={LeftMapStyle}
          mapStyle="mapbox://styles/mapbox/light-v9"
          mapboxAccessToken={TOKEN}
        >
          <GeolocateControl position="top-right" />
          <FullscreenControl position="top-right" />
          <NavigationControl position="top-right" />
          <ScaleControl />
        </Map>
        <Map
          id="right-map"
          {...viewState}
          padding={rightMapPadding}
          onMoveStart={onRightMoveStart}
          onMove={activeMap === "right" && onMove}
          style={RightMapStyle}
          mapStyle="mapbox://styles/mapbox/dark-v9"
          mapboxAccessToken={TOKEN}
        >
          <DeckGLOverlay layers={layers} />
          <FullscreenControl position="top-left" />
        </Map>
      </div>
      <ModePannel mode={mode} onModeChange={setMode} />
      <MyDropdown
        className="absolute top-0 left-0 w-3/10  overflow-hidden z-50 m-3"
        year={2021}
      />
      <MyDropdown
        className="absolute top-0 right-0 w-3/10 overflow-hidden z-50 m-3"
        year={2050}
      />
    </>
  );
}
