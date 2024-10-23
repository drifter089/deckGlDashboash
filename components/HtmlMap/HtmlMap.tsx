"use client";

// fix load error later using
// https://github.com/visgl/deck.gl/discussions/6103

import React, { useEffect, useState, useRef } from "react";
import Map, {
  Marker,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { getGeoJsonData } from "./Links";
import type { MapViewState } from "@deck.gl/core";
import SimplePie from "./SimplePie";
import "mapbox-gl/dist/mapbox-gl.css";
// import { MapContext, MapController } from "react-map-gl";
// const mapController = new MapController();

const TOKEN =
  "pk.eyJ1IjoiYWtzaGF0bWl0dGFsMDAwNyIsImEiOiJjbTFoemJiaHAwa3BoMmpxMWVyYjY1MTM3In0.4XAyidtzk9SRyiyfonIvdw";

// Source data GeoJSON
const DATA_URL =
  "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/geojson/vancouver-blocks.json"; // eslint-disable-line

const INITIAL_VIEW_STATE: MapViewState = {
  latitude: 37.0902,
  longitude: -95.7129,
  zoom: 3,
  minZoom: 2,
  maxZoom: 20,
  pitch: 0,
  bearing: 0,
};

const MAP_STYLE_LIGHT = "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";
const MAP_STYLE_DARK = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

export default function HtmlMap({
  mapStyle = MAP_STYLE_DARK,
}: {
  mapStyle?: string;
}) {
  const [data, setData] = useState<any>(null);
  const initialized = useRef(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const fetchData = async () => {
      initialized.current = true;
      try {
        const { buses } = getGeoJsonData("US");
        const response = await fetch(buses);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result);
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (!initialized.current) {
      fetchData();
    }
  }, []);

  function makemarkers() {
    if (!data || !data.features) return null;
    return data.features.map((element: any) => (
      <Marker
        longitude={element.geometry.coordinates[0]}
        latitude={element.geometry.coordinates[1]}
        anchor="center"
        style={{
          width: "60px",
          height: "60px",
          zIndex: 100,
        }}
        scale={3}
        rotationAlignment={"map"}
        pitchAlignment="map"
        onClick={() => {
          console.log("i clicked");
        }}
        key={element.geometry.coordinates[0] - element.geometry.coordinates[1]}
      >
        <SimplePie />
      </Marker>
    ));
  }

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
    >
      <Map
        reuseMaps
        mapStyle={theme === "light" ? MAP_STYLE_LIGHT : MAP_STYLE_DARK}
      >
        <NavigationControl position="top-left" />
        <FullscreenControl position="top-left" />
        <ScaleControl position="bottom-right" />
        <GeolocateControl position="top-left" />
        {data ? makemarkers() : null}
      </Map>
    </DeckGL>
  );
}
