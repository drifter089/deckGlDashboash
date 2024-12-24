import { GeoJsonLayer, PolygonLayer, ScatterplotLayer } from "@deck.gl/layers";
import { useCallback } from "react";
import { MapViewState } from "deck.gl";
import { FlyToInterpolator } from "deck.gl";
import { COUNTRY_COORDINATES } from "../components/Links";
import { getGeoJsonData } from "../components/Links";

export type BlockProperties = {
  data: string;
};

type Props = {
  // selected country should have type rect state
  selectedCountry: keyof typeof COUNTRY_COORDINATES;
  setSelectedCountry: any;
  selectedPointID: string | null;
  setSelectedPointID: React.Dispatch<React.SetStateAction<string | null>>;
  hoverPointID: string | null;
  setHoverPointID: React.Dispatch<React.SetStateAction<string | null>>;
  selectedLineID: string | null;
  setSelectedLineID: React.Dispatch<React.SetStateAction<string | null>>;
  hoverLineID: string | null;
  setHoverLineID: React.Dispatch<React.SetStateAction<string | null>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLineOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setInitialViewState: React.Dispatch<React.SetStateAction<MapViewState>>;
};

export function MyCustomLayers({
  selectedCountry,
  selectedLineID,
  setSelectedLineID,
  hoverLineID,
  setHoverLineID,
  selectedPointID,
  setSelectedPointID,
  hoverPointID,
  setHoverPointID,
  setOpen,
  setLineOpen,
  setInitialViewState,
}: Props): GeoJsonLayer[] {
  const flyToGeometry = useCallback((info: any) => {
    const cords = info;
    // console.log(cords);
    setInitialViewState({
      latitude: cords[1],
      longitude: cords[0],
      zoom: 5,
      minZoom: 3,
      maxZoom: 20,
      pitch: 0,
      bearing: 0,
      transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
      transitionDuration: 500,
    });
  }, []);

  const MakeLayers = useCallback(() => {
    const links = getGeoJsonData(selectedCountry);

    const temp = [
      new GeoJsonLayer({
        id: `Linesus`,
        data: links.lines,
        opacity: 0.8,
        stroked: true,
        filled: true,
        pickable: true,
        lineWidthScale: 22,
        getLineColor: [227, 26, 28],
        getFillColor: [227, 26, 28],
        getLineWidth: (d) => {
          if (selectedLineID === d.id) {
            return 2300;
          } else if (hoverLineID === d.id) {
            return 1600;
          } else {
            return 700;
          }
        },
        onClick: (info, e) => {
          e.stopPropagation();
          const id = info.object.id;
          if (selectedLineID === id) {
            setSelectedLineID(null);
            setLineOpen(false);
          } else {
            setSelectedLineID(id);
            flyToGeometry(info.coordinate);
            setLineOpen(true);
          }
        },
        onHover: (info, e) => {
          if (info.object) {
            const id = info.object.id;
            setHoverLineID(id);
          } else {
            setHoverLineID(null);
          }
        },
        updateTriggers: {
          getLineWidth: [selectedLineID, hoverLineID],
        },
        transitions: {
          getLineWidth: 100,
        },
        autoHighlight: true,
        parameters: {
          depthTest: false,
          blend: true
        } as any,
      }),
      new GeoJsonLayer<BlockProperties>({
        id: `Buses${2}`,
        data: links.buses,
        opacity: 1,
        stroked: false,
        filled: true,
        pointType: "circle",
        wireframe: true,
        getPointRadius: (d) => {
          if (selectedPointID === d.id) {
            return 1100;
          } else if (hoverPointID === d.id) {
            return 750;
          } else {
            return 500;
          }
        },
        pointRadiusScale: 70,
        onClick: (info, e) => {
          e.stopPropagation();
          const id = info.object.id;
          if (selectedPointID === id) {
            setSelectedPointID(null);
            setOpen(false);
          } else {
            setSelectedPointID(id);
            flyToGeometry(info.object.geometry.coordinates);
            setOpen(true);
          }
        },
        onHover: (info, e) => {
          if (info.object) {
            const id = info.object.id;
            setHoverPointID(id);
          } else {
            setHoverPointID(null);
          }
        },
        getFillColor: [72, 123, 182],
        pickable: true,
        updateTriggers: {
          getPointRadius: [selectedPointID, hoverPointID],
        },
        transitions: {
          getPointRadius: 80,
        },
        autoHighlight: true,
        parameters: {
          depthTest: false
        } as any,
      }),
    ];

    return temp;
  }, [selectedCountry]);

  return MakeLayers();
}
