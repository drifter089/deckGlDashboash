import { ChartConfig } from "@/components/ui/chart";
import { off } from "process";

export const GenerationMixchartConfig = {
  Biomass: {
    label: "Biomass",
    color: "hsl(var(--chart-biomass))",
  },
  Coal: {
    label: "Coal",
    color: "hsl(var(--chart-coal))",
  },
  Hydro: {
    label: "Hydro",
    color: "hsl(var(--chart-ror))",
  },
  "Natural gas": {
    label: "Natural gas",
    color: "hsl(var(--chart-CCGT))",
  },
  Nuclear: {
    label: "Nuclear",
    color: "hsl(var(--chart-nuclear))",
  },
  "Other Fossil": {
    label: "Other Fossil",
    color: "hsl(var(--chart-oil))",
  },
  Solar: {
    label: "Solar",
    color: "hsl(var(--chart-solar))",
  },
  Wind: {
    label: "Wind",
    color: "hsl(var(--chart-onwind))",
  },
  PHS: {
    label: "PHS",
    color: "hsl(var(--chart-4))",
  },
  Oil: {
    label: "Oil",
    color: "hsl(var(--chart-oil))",
  },
  Geothermal: {
    label: "Geothermal",
    color: "hsl(var(--chart-geothermal))",
  },
  "Load shedding": {
    label: "Load shedding",
    color: "hsl(var(--chart-load-shedding))",
  },
  Csp: {
    label: "CSP",
    color: "hsl(var(--chart-csp))",
  },
  CCGT: {
    label: "CCGT",
    color: "hsl(var(--chart-CCGT))",
  },
  "Offshore wind": {
    label: "Offshore Wind",
    color: "hsl(var(--chart-offwind-dc))",
  },
  "Onshore wind": {
    label: "Onshore Wind",
    color: "hsl(var(--chart-offwind-ac))",
  },
  "Solar PV": {
    label: "Solar PV",
    color: "hsl(var(--chart-solar))",
  },
  "Transmission lines": {
    label: "Transmission Lines",
    color: "hsl(var(--chart-tl))",
  },
  Hydroelectricity: {
    label: "Hydroelectricity",
    color: "hsl(var(--chart-onwind))",
  },
  "Battery storage": {
    label: "Battery Storage",
    color: "hsl(var(--chart-bs))",
  },
} satisfies ChartConfig;

export const GenerationMixchartConfigSmall = {
  biomass: {
    label: "Biomass",
    color: "hsl(var(--chart-biomass))",
  },
  coal: {
    label: "Coal",
    color: "hsl(var(--chart-coal))",
  },
  hydro: {
    label: "Hydro",
    color: "hsl(var(--chart-ror))",
  },
  CCGT: {
    label: "Natural Gas",
    color: "hsl(var(--chart-CCGT))",
  },
  nuclear: {
    label: "Nuclear",
    color: "hsl(var(--chart-nuclear))",
  },
  "other fossil": {
    label: "Other Fossil",
    color: "hsl(var(--chart-oil))",
  },
  solar: {
    label: "Solar",
    color: "hsl(var(--chart-solar))",
  },
  onwind: {
    label: "Wind",
    color: "hsl(var(--chart-onwind))",
  },
  offwind: {
    label: "Offshore Wind",
    color: "hsl(var(--chart-4))",
  },
  oil: {
    label: "Oil",
    color: "hsl(var(--chart-oil))",
  },
  geothermal: {
    label: "Geothermal",
    color: "hsl(var(--chart-geothermal))",
  },
  "load shedding": {
    label: "Load Shedding",
    color: "hsl(var(--chart-1))",
  },
  csp: {
    label: "CSP",
    color: "hsl(var(--chart-csp))",
  },
  lignite: {
    label: "Lignite",
    color: "hsl(var(--chart-lignite))",
  },
  ror: {
    label: "Run of River",
    color: "hsl(var(--chart-ror))",
  },
  "offwind-ac": {
    label: "off wind ac",
    color: "hsl(var(--chart-offwind-ac))",
  },
  "offwind-dc": {
    label: "off wind dc",
    color: "hsl(var(--chart-offwind-dc))",
  },
} satisfies ChartConfig;
