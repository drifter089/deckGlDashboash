"use client";

import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  use,
  useCallback,
  useMemo,
} from "react";
import EarthLightUrl from "../../public/earth-night-light.jpg";
import {
  getGeoJsonData,
  COUNTRY_COORDINATES,
  COUNTRY_NAMES,
  COUNTRY_COLORS,
} from "@/utilities/CountryConfig/Link";
import useSWR from "swr";
import { useTheme } from "next-themes";
import { GlobeMethods } from "r3f-globe";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Box,
  CameraControls,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Sparkles,
  Stars,
} from "@react-three/drei";
import { Color, Vector3 } from "three";
import GlobeOnly from "../../app/landingglobe/JustGlobe";

// const R3fGlobe = dynamic(() => import("r3f-globe"), { ssr: false });

interface GeoFeature {
  id: string;
  properties: {
    ADMIN?: string;
    name?: string;
    country_name?: string;
    country_code?: string;
  };
  geometry?: any;
}

interface FetcherResponse {
  features?: GeoFeature[];
  [key: string]: any;
}

const fetcher = (url: string): Promise<FetcherResponse> =>
  fetch(url).then((res) => res.json());

const HeroGlobeScene = () => {
  const { theme } = useTheme();
  const globeRef = useRef<GlobeMethods>(null);
  const cameraRef = useRef<any>(null);

  const [globeReady, setGlobeReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const endpoints = useMemo(
    () =>
      Object.keys(COUNTRY_COORDINATES).map(
        (country) => getGeoJsonData(country).countryView
      ),
    []
  );

  const { data, error } = useSWR(endpoints, async (urls) => {
    setIsLoading(true);
    try {
      const responses = await Promise.all(
        urls.map((url) =>
          fetch(url)
            .then((res) => {
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
              return res.json();
            })
            .catch((error) => {
              console.error(`Error fetching ${url}:`, error);
              return { features: [] };
            })
        )
      );
      const result = responses.reduce((acc, curr) => {
        if (curr.features) {
          acc.features = [...(acc.features || []), ...curr.features];
        }
        return acc;
      }, {} as FetcherResponse);
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  });

  const getPolygonColor = (d: any) => {
    return "#E41E3C";
  };
  const getPolygonAltitude = (d: any) => {
    return 0.02;
  };
  const getPolygonSideColor = (d: any) => {
    return "#E41E3C";
  };

  return (
    <>
      <React.Suspense
        fallback={
          <div className="w-full h-[50vh] lg:h[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        }
      >
        <div className={`relative w-full h-[50vh] lg:h[60vh]`}>
          <div
            className={`w-full h-full transition-opacity duration-200 ease-in-out ${
              !isLoading && globeReady ? "opacity-100" : "opacity-1"
            }`}
          >
            <Canvas
              camera={{ position: [0, 0, 210] }}
              className="w-full h-full"
              gl={{ alpha: true, antialias: true }}
              dpr={[1, 2]}
            >
              <OrbitControls
                minDistance={101}
                maxDistance={1e4}
                dampingFactor={0.1}
                rotateSpeed={0.3}
                enableZoom={false}
                enablePan={false}
                autoRotate={true}
                autoRotateSpeed={0.5}
              />
              {/* <color attach="background" args={[0, 0, 0]} /> */}
              <ambientLight intensity={Math.PI} />
              <directionalLight intensity={0.6 * Math.PI} />
              <GlobeOnly
                ref={globeRef}
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                globeImageUrl={
                  theme === "dark"
                    ? "//unpkg.com/three-globe/example/img/earth-dark.jpg"
                    : EarthLightUrl.src
                }
                polygonsData={data?.features || []}
                polygonCapColor={getPolygonColor}
                polygonSideColor={getPolygonSideColor}
                polygonStrokeColor={getPolygonColor}
                polygonAltitude={getPolygonAltitude}
                polygonsTransitionDuration={300}
                //   onClick={handleClick}
                //   onHover={handleHover}
                onGlobeReady={() => setGlobeReady(true)}
              />
              <Stars
                radius={42}
                depth={42}
                count={600}
                factor={2}
                saturation={0}
                fade
                speed={1}
              />
            </Canvas>
          </div>
        </div>
      </React.Suspense>
    </>
  );
};

export default HeroGlobeScene;
