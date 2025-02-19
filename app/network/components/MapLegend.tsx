import React from "react";
import { COUNTRY_BUS_CONFIGS } from "../MapboxNetwork";
import { COUNTRY_S_NOM_RANGES, COUNTRY_BUS_RANGES } from "@/utilities/CountryConfig/Link";

interface MapLegendProps {
  country: keyof typeof COUNTRY_BUS_RANGES;
  theme: string;
  type?: "lines" | "buses";
}

interface BusCategory {
  label: string;
  size: number;
  color: number[];
}

const LINE_COLOR = [227, 26, 28];
const BUS_COLOR = [124, 152, 133];

const DEFAULT_RANGES = {
  min: 500,
  max: 20000,
  bussize: 20,
};

const DEFAULT_BUS_CONFIG = {
  minRadius: 3000,
  maxRadius: 10000,
  zoomBase: 1.2,
};

const formatPowerValue = (value: number): string => {
  const gva = value / 1000;

  if (gva >= 10) {
    return `${Math.round(gva)} GVA`;
  } else if (gva >= 1) {
    return `${Number(gva.toFixed(1))} GVA`;
  } else {
    return `${Math.round(value)} MW`;
  }
};

const roundToNiceNumber = (value: number): number => {
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const normalized = value / magnitude;

  if (normalized >= 7.5) return Math.round(normalized) * magnitude;
  if (normalized >= 2.5) return (Math.round(normalized * 2) * magnitude) / 2;
  return (Math.round(normalized * 5) * magnitude) / 5;
};

const getBusCategories = (country: keyof typeof COUNTRY_BUS_RANGES): BusCategory[] => {
  const ranges = COUNTRY_BUS_RANGES[country]?.ranges || [];
  return ranges.map((range, index) => ({
    label: index === ranges.length - 1 
      ? `> ${range.min / 1000} GW`
      : `${range.min / 1000}-${range.max / 1000} GW`,
    size: range.radius * 2,
    color: BUS_COLOR
  })).reverse();
};

export default function MapLegend({
  country,
  theme,
  type = "lines",
}: MapLegendProps) {
  const validCountries = COUNTRY_S_NOM_RANGES
    ? Object.keys(COUNTRY_S_NOM_RANGES)
    : [];
  const isValidCountry = country && validCountries.includes(country.toUpperCase());

  const countryRanges = isValidCountry
    ? COUNTRY_S_NOM_RANGES[country.toUpperCase() as keyof typeof COUNTRY_S_NOM_RANGES]
    : DEFAULT_RANGES;

  const busConfig = isValidCountry && COUNTRY_BUS_CONFIGS[country.toUpperCase() as keyof typeof COUNTRY_BUS_CONFIGS]
    ? COUNTRY_BUS_CONFIGS[country.toUpperCase() as keyof typeof COUNTRY_BUS_CONFIGS]
    : DEFAULT_BUS_CONFIG;

  const calculateLegendBusSizes = (busConfig: typeof DEFAULT_BUS_CONFIG) => {
    return {
      VERY_LARGE: 12,
      LARGE: 10,
      MEDIUM: 8,
      SMALL: 6,
      VERY_SMALL: 4
    };
  };

  const legendBusSizes = calculateLegendBusSizes(busConfig);

  const lineCategories = [
    {
      label: `< ${formatPowerValue(roundToNiceNumber(countryRanges.min))}`,
      width: 0.2,
    },
    {
      label: `${formatPowerValue(
        roundToNiceNumber(countryRanges.min)
      )}-${formatPowerValue(roundToNiceNumber(countryRanges.max / 4))}`,
      width: 0.4,
    },
    {
      label: `${formatPowerValue(
        roundToNiceNumber(countryRanges.max / 4)
      )}-${formatPowerValue(roundToNiceNumber(countryRanges.max / 2))}`,
      width: 0.6,
    },
    {
      label: `${formatPowerValue(
        roundToNiceNumber(countryRanges.max / 2)
      )}-${formatPowerValue(roundToNiceNumber(countryRanges.max * 0.75))}`,
      width: 0.8,
    },
    {
      label: `> ${formatPowerValue(
        roundToNiceNumber(countryRanges.max * 0.75)
      )}`,
      width: 1.0,
    },
  ];

  const busCategories = getBusCategories(country);

  // Renderizar solo las líneas de transmisión
  const renderTransmissionLines = () => {
    return (
      <div className="w-full">
        {lineCategories.map((cat, idx) => (
          <div key={idx} className="flex items-center mb-1 py-0">
            <div
              className="w-8 h-0 mr-3"
              style={{
                borderTop: `${Math.max(
                  1,
                  cat.width * 6
                )}px solid rgba(${LINE_COLOR.join(",")}, 0.8)`,
              }}
            />
            <span className="text-sm">{cat.label}</span>
          </div>
        ))}
      </div>
    );
  };

  // Renderizar solo los buses
  const renderBuses = () => {
    return (
      <div className="w-full">
        {busCategories.map((bus, idx) => (
          <div key={idx} className="flex items-center mb-1 py-0">
            <div
              className="mr-3 rounded-full flex-shrink-0"
              style={{
                width: bus.size,
                height: bus.size,
                backgroundColor: `rgba(${bus.color.join(",")}, 1)`,
              }}
            />
            <span className="text-sm">{bus.label}</span>
          </div>
        ))}
      </div>
    );
  };

  // Renderizar según el tipo especificado
  if (type === "lines") return renderTransmissionLines();
  if (type === "buses") return renderBuses();

  // Si no se especifica tipo, renderizar todo
  return (
    <div>
      {renderTransmissionLines()}
      {renderBuses()}
    </div>
  );
}
