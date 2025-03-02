"use client";
import { GeoJsonLayer } from "deck.gl";
import { regionalGeneratorTypes } from "@/utilities/GenerationMixChartConfig";
interface RegionLayerProps {
  regionalDataParams: {
    generatorType: keyof typeof regionalGeneratorTypes;
    param: string;
  };
  links: any;
}

const RegionLayer = ({ regionalDataParams, links }: RegionLayerProps) => {
  const polygon = `${links.regions_2021}&simplification=0.01&pageSize=10000&generatorType=${regionalDataParams.generatorType}`;

  const generatorKey = regionalDataParams.generatorType;
  const paramKey = regionalDataParams.param;

  return new GeoJsonLayer({
    id: `Country_regions${1}`,
    data: polygon,
    opacity: 1,
    stroked: true,
    filled: true,
    pickable: true,
    getLineColor: [228, 30, 60],
    getFillColor: (d) => {
      const [r, g, b] = regionalGeneratorTypes[generatorKey];
      return [r, g, b, 2.5 * d.properties[paramKey]];
    },
    getLineWidth: 100,
    getRadius: 100,
    lineWidthScale: 20,
  });
};

export default RegionLayer;
