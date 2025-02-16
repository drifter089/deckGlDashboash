import React from "react";
import { COUNTRY_BUS_CONFIGS } from "../MainMap";
import { COUNTRY_S_NOM_RANGES } from "@/utilities/CountryConfig/Link";

interface MapLegendProps {
  country: string;
  theme: string;
  type?: "lines" | "buses";
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

export default function MapLegend({
  country,
  theme,
  type = "lines",
}: MapLegendProps) {
  const validCountries = COUNTRY_S_NOM_RANGES
    ? Object.keys(COUNTRY_S_NOM_RANGES)
    : [];
  const isValidCountry = country && validCountries.includes(country);

  const countryRanges = isValidCountry
    ? COUNTRY_S_NOM_RANGES[country as keyof typeof COUNTRY_S_NOM_RANGES]
    : DEFAULT_RANGES;

  const busConfig = isValidCountry
    ? COUNTRY_BUS_CONFIGS[country as keyof typeof COUNTRY_BUS_CONFIGS]
    : DEFAULT_BUS_CONFIG;

  const calculateLegendBusSizes = (busConfig: typeof DEFAULT_BUS_CONFIG) => {
    const scaleFactor = (16 / busConfig.maxRadius) * 1000;

    return {
      LARGE: Math.max(6, Math.min(20, busConfig.maxRadius * scaleFactor)),
      MEDIUM: Math.max(
        4,
        Math.min(
          16,
          ((busConfig.maxRadius + busConfig.minRadius) / 2) * scaleFactor
        )
      ),
      SMALL: Math.max(3, Math.min(12, busConfig.minRadius * scaleFactor)),
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

  const busCategories = [
    {
      label: `> ${formatPowerValue(
        roundToNiceNumber(countryRanges.max * 0.7)
      )}`,
      size: legendBusSizes.LARGE,
      color: BUS_COLOR,
    },
    {
      label: `${formatPowerValue(
        roundToNiceNumber(countryRanges.max * 0.3)
      )}-${formatPowerValue(roundToNiceNumber(countryRanges.max * 0.7))}`,
      size: legendBusSizes.MEDIUM,
      color: BUS_COLOR,
    },
    {
      label: `< ${formatPowerValue(
        roundToNiceNumber(countryRanges.max * 0.3)
      )}`,
      size: legendBusSizes.SMALL,
      color: BUS_COLOR,
    },
  ];

  // Renderizar solo las líneas de transmisión
  const renderTransmissionLines = () => {
    return (
      <div className="w-full">
        {lineCategories.map((cat, idx) => (
          <div key={idx} className="flex items-center mb-1 py-0.5">
            <div
              className="w-8 h-0 mr-2"
              style={{
                borderTop: `${Math.max(
                  1,
                  cat.width * 6
                )}px solid rgba(${LINE_COLOR.join(",")}, 0.8)`,
              }}
            />
            <span className="text-xs">{cat.label}</span>
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
          <div key={idx} className="flex items-center mb-1 py-0.5">
            <div
              className="mr-2 rounded-full flex-shrink-0"
              style={{
                width: Math.max(4, bus.size * 0.75),
                height: Math.max(4, bus.size * 0.75),
                backgroundColor: `rgba(${bus.color.join(",")}, 1)`,
              }}
            />
            <span className="text-xs">{bus.label}</span>
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
