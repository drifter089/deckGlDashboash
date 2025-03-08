"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import MainPageNav from "./popups/LandingGlobeNav";
import GlobeLegend from "./popups/GlobeLegend";

const Globe = dynamic(() => import("./R3fGlobeScene"), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-background" />,
});

interface DrawerProps {
  open: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LandingGlobe() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative w-full h-screen">
      <Globe />
      <MainPageNav open={isOpen} setIsOpen={setIsOpen} />
      <GlobeLegend />
    </div>
  );
}
