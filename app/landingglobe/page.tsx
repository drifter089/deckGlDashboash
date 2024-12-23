"use client";

import React, { useState, useEffect, use } from "react";
import EarthNightUrl from "../../public/earth-night-light.jpg";
import NightSkyUrl from "../../public/night-sky-light.png";
import Globe from "react-globe.gl";
import {
  getGeoJsonData,
  COUNTRY_COORDINATES,
} from "../network/components/Links";
import useSWR from "swr";

interface FetcherResponse {
  [key: string]: any; // Generic response type since we don't know the exact structure
}

const fetcher = (url: string): Promise<FetcherResponse> =>
  fetch(url).then((res) => res.json());

const Page = () => {
  const [arcs, setArcs] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoverD, setHoverD] = useState();

  const endpoints = Object.keys(COUNTRY_COORDINATES).map(
    (country) => getGeoJsonData(country).countryView
  );

  const { data, error, isLoading } = useSWR(endpoints, async (urls) => {
    const responses = await Promise.all(urls.map((url) => fetcher(url)));
    return responses.reduce((acc, curr) => {
      if (curr.features) {
        acc.features = [...(acc.features || []), ...curr.features];
      }
      return acc;
    }, {});
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

   useEffect(() => {
     if (typeof window !== "undefined") {
       const handleResize = () => {
         setDimensions({
           width: window.innerWidth,
           height: window.innerHeight,
         });
       };
       handleResize();

       window.addEventListener("resize", handleResize);

       return () => {
         window.removeEventListener("resize", handleResize);
       };
     }
   }, []);

  return (
    <Globe
      width={dimensions.width}
      height={dimensions.height}
      globeImageUrl={EarthNightUrl.src}
      backgroundImageUrl={NightSkyUrl.src}
      polygonsData={data?.features}
      polygonCapColor={() => `rgb(227, 26, 28)`}
      polygonSideColor={() => "rgba(0, 100, 0, 0.15)"}
      //   polygonStrokeColor={() => "#111"}
    />
  );
};

export default Page;
