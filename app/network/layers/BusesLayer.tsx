"use client";
import {
  COUNTRY_BUS_CONFIGS,
  getGeoJsonData,
} from "@/utilities/CountryConfig/Link";
import { FlyToInterpolator, GeoJsonLayer } from "deck.gl";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import type { RenderPassParameters } from "@luma.gl/core";
import { useCountry } from "@/components/country-context";

interface CustomRenderParameters extends RenderPassParameters {
  depthTest?: boolean;
}

interface BusesLayerProps {
  setHoverPointID: Dispatch<SetStateAction<string | null>>;
  position: React.MutableRefObject<{ x: number; y: number }>;
  zoomLevel: number;
}

const BusesLayer = ({
  setHoverPointID,
  position,
  zoomLevel,
}: BusesLayerProps) => {
  const { selectedCountry, setSelectedCountry } = useCountry();
  const [busCapacities, setBusCapacities] = useState<Record<string, number>>(
    {}
  );

  const [isLoading, setIsLoading] = useState(true);

  const loadBusCapacities = useCallback(async (country: string) => {
    if (!country) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/bustotal/${country}`);
      const data = await response.json();

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error("Invalid API response format");
      }

      const capacities = data.data.reduce(
        (acc: Record<string, number>, item: any) => {
          if (item.bus && typeof item.total_capacity === "number") {
            acc[item.bus] = item.total_capacity / 1000000;
          }
          return acc;
        },
        {}
      );

      setBusCapacities(capacities);
    } catch (error) {
      setBusCapacities({});
    } finally {
      setIsLoading(false);
    }
  }, []);

  const links = getGeoJsonData(selectedCountry);

  const calculateBusRadius = (busId: string, zoom: number) => {
    if (isLoading || !busCapacities[busId]) {
      return COUNTRY_BUS_CONFIGS[selectedCountry].minRadius;
    }

    const capacity = busCapacities[busId];
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

    const zoomFactor = Math.pow(zoomBase, zoom - 5);

    const numBuses = capacityValues.length;
    const densityFactor = Math.max(0.6, 1 - numBuses / 200);

    return baseRadius * zoomFactor * densityFactor;
  };

  useEffect(() => {
    loadBusCapacities(selectedCountry);
  }, [selectedCountry]);

  return new GeoJsonLayer({
    id: `Buses${2}`,
    data: links.buses,
    opacity: 1,
    stroked: false,
    filled: true,
    pointType: "circle",
    wireframe: true,
    pointRadiusScale: 2.0,
    getPointRadius: (d) => {
      const baseRadius = calculateBusRadius(d.properties.Bus, zoomLevel);

      return baseRadius;
    },
    onHover: (info) => {
      position.current = { x: info.x || 0, y: info.y || 0 };
      setHoverPointID(info.object ? info.object.properties.Bus : null);
    },
    getLineColor: [124, 152, 133],
    getFillColor: [124, 152, 133],
    pickable: true,
    updateTriggers: {
      getPointRadius: [zoomLevel, busCapacities, isLoading],
    },
    transitions: {
      getPointRadius: 200,
    },
    autoHighlight: true,
    parameters: {
      depthTest: false,
    } as CustomRenderParameters,
  });
};

export default BusesLayer;
