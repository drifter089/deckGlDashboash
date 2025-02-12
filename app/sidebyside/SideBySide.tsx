"use client";
import * as React from "react";
import { useState, useCallback, useMemo, useEffect } from "react";
import Map, {
  useControl,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  ViewStateChangeEvent,
} from "react-map-gl";
import { GeoJsonLayer } from "@deck.gl/layers";
import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useCountry } from "@/components/country-context";
import {
  getGeoJsonData,
  COUNTRY_COORDINATES,
  COUNTRY_VIEW_CONFIG,
} from "@/utilities/CountryConfig/Link";
import { useVisualization } from "@/components/visualization-context";
import { Mode } from "./popups/Mode";

function DeckGLOverlay(props: MapboxOverlayProps) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

const TOKEN =
  "pk.eyJ1IjoiYWtzaGF0bWl0dGFsMDAwNyIsImEiOiJjbTFoemJiaHAwa3BoMmpxMWVyYjY1MTM3In0.4XAyidtzk9SRyiyfonIvdw";

const LeftMapStyle: React.CSSProperties = {
  position: "absolute",
  width: "50%",
  height: "100%",
  left: 0,
};

const RightMapStyle: React.CSSProperties = {
  position: "absolute",
  width: "50%",
  height: "100%",
  left: "50%",
};

interface SideBySideProps {
  mode: Mode;
}

export default function SideBySide({ mode }: SideBySideProps) {
  const { selectedCountry } = useCountry();
  const [activeMap, setActiveMap] = useState<"left" | "right">("left");
  const { selectedRenewableType, selectedParameter } = useVisualization();

  const [viewState, setViewState] = useState({
    latitude: COUNTRY_COORDINATES[selectedCountry][0],
    longitude: COUNTRY_COORDINATES[selectedCountry][1],
    zoom: COUNTRY_VIEW_CONFIG[selectedCountry].zoom,
    minZoom: 2,
    maxZoom: 20,
    pitch: 0,
    bearing: 0,
  });

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

  const onLeftMoveStart = useCallback(() => setActiveMap("left"), []);
  const onRightMoveStart = useCallback(() => setActiveMap("right"), []);
  const onMove = useCallback(
    (evt: ViewStateChangeEvent) =>
      setViewState({
        ...evt.viewState,
        minZoom: 2,
        maxZoom: 20,
      }),
    []
  );

  const [layer2021, setLayer2021] = useState<GeoJsonLayer[]>([]);
  const [layer2050, setLayer2050] = useState<GeoJsonLayer[]>([]);

  const getColorForParameter = useCallback((value: number, parameter: string) => {
    type ColorScale = Array<[number, [number, number, number, number]]>;

    const scales: Record<string, ColorScale> = {
      cf: [
        [0, [65, 182, 196, 180]],
        [10, [160, 170, 120, 180]],
        [25, [254, 153, 41, 180]],
        [40, [245, 110, 40, 180]],
        [60, [239, 59, 44, 180]],
      ],
      crt: [
        [0, [65, 171, 93, 180]],
        [5, [160, 170, 90, 180]],
        [15, [254, 153, 41, 180]],
        [30, [245, 110, 40, 180]],
        [50, [239, 59, 44, 180]],
      ],
      usdpt: [
        [0, [239, 59, 44, 180]],
        [20, [254, 153, 41, 180]],
        [40, [160, 170, 90, 180]],
        [60, [65, 171, 93, 180]],
        [80, [65, 182, 196, 180]],
      ],
    };

    const scale = scales[parameter as keyof typeof scales] || scales.cf;

    for (let i = 1; i < scale.length; i++) {
      if (value <= scale[i][0]) {
        const t = (value - scale[i - 1][0]) / (scale[i][0] - scale[i - 1][0]);
        const startColor = scale[i - 1][1];
        const endColor = scale[i][1];
        return startColor.map((start, j) =>
          Math.round(start + t * (endColor[j] - start))
        ) as [number, number, number, number];
      }
    }
    return scale[scale.length - 1][1];
  }, []);

  const filterAndColorFeatures = useCallback(
    (feature: any): [number, number, number, number] => {
      const generator = feature.properties.Generator?.toLowerCase() || "";
      const type = generator.split(" ").slice(-1)[0];

      if (type !== selectedRenewableType) {
        return [0, 0, 0, 0];
      }

      const paramValue = feature.properties[selectedParameter];
      return getColorForParameter(paramValue || 0, selectedParameter);
    },
    [selectedRenewableType, selectedParameter, getColorForParameter]
  );

  useEffect(() => {
    const commonProps = {
      stroked: true,
      filled: true,
      getFillColor: filterAndColorFeatures as any,
      getLineColor: [255, 255, 255] as [number, number, number],
      getLineWidth: 1,
      lineWidthMinPixels: 1,
      pickable: true,
      parameters: {
        depthTest: false,
        blend: true,
        blendFunc: [770, 771],
      },
      updateTriggers: {
        getFillColor: [selectedRenewableType, selectedParameter],
      },
    };

    const urls = getGeoJsonData(selectedCountry);

    const fetchData = async () => {
      try {
        // Fetch 2021 data with optimizations
        const response2021 = await fetch(`${urls.regions_2021}&simplification=0.01&pageSize=10000`);
        if (!response2021.ok) {
          throw new Error(`HTTP error! status: ${response2021.status}`);
        }
        const data2021 = await response2021.json();
        setLayer2021([
          new GeoJsonLayer({
            id: 'regions-2021',
            data: data2021,
            ...commonProps,
          }),
        ]);

        // Fetch 2050 data with optimizations
        const response2050 = await fetch(`${urls.regions_2050}&simplification=0.01&pageSize=10000`);
        if (!response2050.ok) {
          throw new Error(`HTTP error! status: ${response2050.status}`);
        }
        const data2050 = await response2050.json();
        setLayer2050([
          new GeoJsonLayer({
            id: 'regions-2050',
            data: data2050,
            ...commonProps,
          }),
        ]);
      } catch (error) {
        // Set empty layers on error to avoid UI breaking
        setLayer2021([]);
        setLayer2050([]);
      }
    };

    fetchData();
  }, [selectedCountry, selectedRenewableType, selectedParameter, filterAndColorFeatures]);

  useEffect(() => {
    setViewState({
      ...viewState,
      latitude: COUNTRY_COORDINATES[selectedCountry][0],
      longitude: COUNTRY_COORDINATES[selectedCountry][1],
      zoom: COUNTRY_VIEW_CONFIG[selectedCountry].zoom,
      bearing: 0,
      pitch: 0,
    });
  }, [selectedCountry]);

  return (
    <div className="absolute top-0 right-0 w-screen h-screen">
      <Map
        id="left-map"
        {...viewState}
        padding={leftMapPadding}
        onMoveStart={onLeftMoveStart}
        onMove={activeMap === "left" ? onMove : undefined}
        style={LeftMapStyle}
        mapStyle="mapbox://styles/mapbox/light-v9"
        mapboxAccessToken={TOKEN}
      >
        <FullscreenControl position="bottom-right" />
        <DeckGLOverlay layers={layer2021} />
      </Map>

      <Map
        id="right-map"
        {...viewState}
        padding={rightMapPadding}
        onMoveStart={onRightMoveStart}
        onMove={activeMap === "right" ? onMove : undefined}
        style={RightMapStyle}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxAccessToken={TOKEN}
      >
        <NavigationControl position="bottom-right" showCompass={true} />
        <FullscreenControl position="bottom-right" />
        <ScaleControl position="bottom-right" />
        <DeckGLOverlay layers={layer2050} />
      </Map>
    </div>
  );
}
