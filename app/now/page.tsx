"use client";
import React, { useEffect } from "react";
import MainMap from "./MainMap";
import NetworkNav from "./popups/NetworkNav";
import BusLegend from "./popups/BusLegend";
import { regionalGeneratorTypes } from "@/utilities/GenerationMixChartConfig";

const Page = () => {
  const [networkView, setNetworkView] = React.useState<boolean>(true);
  const [regionGeneratorValue, setRegionGeneratorValue] =
    React.useState<keyof typeof regionalGeneratorTypes>("ror");
  const [regionParamValue, setRegionParamValue] = React.useState<string>("cf");


  return (
    <div>
      <div className="absolute w-full h-full z-0 left-0 top-0 overflow-hidden ">
        <MainMap
          networkView={networkView}
          regionGeneratorValue={regionGeneratorValue}
          regionParamValue={regionParamValue}
        />
        <NetworkNav
          networkView={networkView}
          setNetworkView={setNetworkView}
          regionGeneratorValue={regionGeneratorValue}
          setRegionGeneratorValue={setRegionGeneratorValue}
          regionParamValue={regionParamValue}
          setRegionParamValue={setRegionParamValue}
        />
        <BusLegend />
      </div>
    </div>
  );
};

export default Page;
