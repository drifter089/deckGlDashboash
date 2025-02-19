"use client";
import React from "react";
import MapboxNetwork from "./MapboxNetwork";
import NetworkNav from "./popups/NetworkNav";

const Page = () => {
  return (
    <div>
      <div className="absolute w-full h-full z-0 left-0 top-0 overflow-hidden">
        <MapboxNetwork />
        <NetworkNav />
      </div>
    </div>
  );
};

export default Page;
