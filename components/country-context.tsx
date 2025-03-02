"use client";
import React, { createContext, useState, useContext } from "react";

import { COUNTRY_COORDINATES } from "@/utilities/CountryConfig/Link";

export type CountryKey = keyof typeof COUNTRY_COORDINATES;

type CountryContextType = {
  selectedCountry: CountryKey;
  setSelectedCountry: React.Dispatch<React.SetStateAction<CountryKey>>;
};

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export const CountryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryKey>("US");

  return (
    <CountryContext.Provider value={{ selectedCountry, setSelectedCountry }}>
      {children}
    </CountryContext.Provider>
  );
};

export const useCountry = () => {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error("useCountry must be used within a CountryProvider");
  }
  return context;
};
