"use client";
import React, { useEffect } from "react";
import MainMap from "./MainMap";
import NetworkNav from "./popups/NetworkNav";
import { regionalGeneratorTypes } from "@/utilities/GenerationMixChartConfig";

const Page = () => {
  const [networkView, setNetworkView] = React.useState<boolean>(true);
  const [RegionalDataParams, setRegionalDataParams] = React.useState<any>({
    generatorType: "ror",
    param: "crt",
  });

  return (
    <div>
      <div className="absolute w-full h-full z-0 left-0 top-0 overflow-hidden ">
        <MainMap
          networkView={networkView}
          regionalDataParams={RegionalDataParams}
        />
        <NetworkNav
          networkView={networkView}
          setNetworkView={setNetworkView}
          RegionalDataParams={RegionalDataParams}
          setRegionalDataParams={setRegionalDataParams}
        />
      </div>
    </div>
  );
};

export default Page;
