import { GeoJsonLayer } from "deck.gl";
import type { RenderPassParameters } from "@luma.gl/core";

interface CustomRenderParameters extends RenderPassParameters {
  depthTest?: boolean;
}

const CountryLayer = ({ links }: any) => {
  return new GeoJsonLayer({
    id: `Country${1}`,
    data: links.countryView,
    opacity: 1,
    stroked: true,
    filled: true,
    pickable: false,

    getLineColor: [215, 229, 190],
    getFillColor: [215, 229, 190],

    getLineWidth: 1,
    getRadius: 100,
    lineWidthScale: 20,
    parameters: {
      depthTest: false,
    } as CustomRenderParameters,
  });
};

export default CountryLayer;
