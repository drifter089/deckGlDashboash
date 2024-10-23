import { Layer } from '@deck.gl/core';
import { GeoJsonLayer } from "@deck.gl/layers";
import { COUNTRY_S_NOM_RANGES } from './Links';
import { Feature, Geometry, Properties } from '@turf/helpers';
import { AccessorFunction } from '@deck.gl/core';

type CountryCode = keyof typeof COUNTRY_S_NOM_RANGES;

const brightenColor = (color: number[], factor: number = 1.5): number[] => {
  return color.map(c => Math.min(255, Math.round(c * factor)));
};

export function MyCustomLayers(
  busesData: any,
  linesData: any,
  id: string,
  zoom: number,
  hoveredObject: any,
  clickedObject: any
): Layer[] {
  console.log('Creating layers with:', { busesData, linesData, id, zoom });

  const layers = [];

  if (linesData && linesData.features && linesData.features.length > 0) {
    const normalizeLineWidth = (s_nom: number) => {
      const minWidth = 5; 
      const maxWidth = 30;
      const { min: minSNom, max: maxSNom } = COUNTRY_S_NOM_RANGES[id.toUpperCase() as CountryCode];
      const baseWidth = minWidth + ((s_nom - minSNom) / (maxSNom - minSNom)) * (maxWidth - minWidth);
      
      const zoomFactor = Math.max(0.35, (zoom - 2) / 18);
      
      return baseWidth * zoomFactor;
    };

    const lineColor = [227, 26, 28, 200] as [number, number, number, number];
    const lineHighlightColor = [255, 165, 0, 255] as [number, number, number, number];

    const getLineWidth: AccessorFunction<Feature<Geometry, Properties>, number> = (d) => {
      return normalizeLineWidth(d.properties?.s_nom || 0);
    };

    const getLineColor: AccessorFunction<Feature<Geometry, Properties>, [number, number, number, number]> = (d) => {
      const isHighlighted = d === hoveredObject || d === clickedObject;
      return isHighlighted ? lineHighlightColor : lineColor;
    };

    layers.push(
      new GeoJsonLayer({
        id: `lines-${id}`,
        data: linesData,
        opacity: 1,
        stroked: true,
        filled: false,
        lineWidthUnits: 'pixels',
        getLineWidth,
        getLineColor,
        pickable: true,
        autoHighlight: false,
        updateTriggers: {
          getLineWidth: zoom,
          getLineColor: [hoveredObject, clickedObject]
        },
        zIndex: 1,
      })
    );
  }

  if (busesData && busesData.features && busesData.features.length > 0) {
    const minZoom = 1;
    const maxZoom = 15;
    const maxSize = 50000;
    const minSize = 150;
    
    const getBusSize = () => {
      const zoomFactor = Math.pow(1 - (zoom - minZoom) / (maxZoom - minZoom), 3);
      return minSize + zoomFactor * (maxSize - minSize);
    };

    const busSize = getBusSize();
    const busFillColor = [72, 123, 182, 200] as [number, number, number, number];
    const busHighlightColor = brightenColor(busFillColor.slice(0, 3)).concat([230]) as [number, number, number, number];

    layers.push(
      new GeoJsonLayer({
        id: `buses-${id}`,
        data: busesData,
        opacity: 0.8,
        stroked: true,
        filled: true,
        pointType: "circle",
        getPointRadius: busSize,
        getFillColor: busFillColor,
        getLineColor: [50, 87, 128, 200] as [number, number, number, number],
        lineWidthMinPixels: 3,
        pickable: true,
        autoHighlight: false,
        updateTriggers: {
          getPointRadius: zoom
        },
        sizeScale: 1,
        sizeMinPixels: 100,
        sizeMaxPixels: 300,
        zIndex: 3,
      })
    );

    if (hoveredObject || clickedObject) {
      const highlightedObject = hoveredObject || clickedObject;
      const highlightSize = clickedObject ? busSize * 3 : busSize * 2;

      layers.push(
        new GeoJsonLayer({
          id: `highlighted-bus-${id}`,
          data: [highlightedObject],
          opacity: 1,
          stroked: true,
          filled: true,
          pointType: "circle",
          getPointRadius: highlightSize,
          getFillColor: busHighlightColor,
          getLineColor: [255, 255, 255, 255] as [number, number, number, number],
          lineWidthMinPixels: 4,
          pickable: false,
          sizeScale: 1,
          sizeMinPixels: 150,
          sizeMaxPixels: 600,
          zIndex: 4,
        })
      );
    }
  }

  console.log('Returning layers:', layers);
  return layers;
}
