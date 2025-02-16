"use client";

import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { PolarGrid, RadialBar, RadialBarChart, ResponsiveContainer, Legend } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { GeneratorData } from "@/app/types";

type CarrierType =
  | "CCGT"
  | "OCGT"
  | "biomass"
  | "coal"
  | "geothermal"
  | "lignite"
  | "nuclear"
  | "offwind-ac"
  | "offwind-dc"
  | "oil"
  | "onwind"
  | "ror"
  | "solar"
  | "load";

interface ProcessedDataItem {
  carrier: string;
  value: string;
  percentage: string;
  fill: string;
}

const chartConfig = {
  CCGT: {
    label: "Combined Cycle Gas Turbine",
    color: "hsl(var(--chart-CCGT))",
  },
  OCGT: {
    label: "Open Cycle Gas Turbine",
    color: "hsl(var(--chart-OCGT))",
  },
  biomass: {
    label: "Biomass",
    color: "hsl(var(--chart-biomass))",
  },
  coal: {
    label: "Coal",
    color: "hsl(var(--chart-coal))",
  },
  geothermal: {
    label: "Geothermal",
    color: "hsl(var(--chart-geothermal))",
  },
  lignite: {
    label: "Lignite",
    color: "hsl(var(--chart-lignite))",
  },
  nuclear: {
    label: "Nuclear",
    color: "hsl(var(--chart-nuclear))",
  },
  "offwind-ac": {
    label: "Offshore Wind AC",
    color: "hsl(var(--chart-offwind-ac))",
  },
  "offwind-dc": {
    label: "Offshore Wind DC",
    color: "hsl(var(--chart-offwind-dc))",
  },
  oil: {
    label: "Oil",
    color: "hsl(var(--chart-oil))",
  },
  onwind: {
    label: "Onshore Wind",
    color: "hsl(var(--chart-onwind))",
  },
  ror: {
    label: "Run of River",
    color: "hsl(var(--chart-ror))",
  },
  solar: {
    label: "Solar",
    color: "hsl(var(--chart-solar))",
  },
  load: {
    label: "Load",
    color: "hsl(var(--chart-load))",
  },
} as ChartConfig;

interface ChartRadialProps {
  data: GeneratorData[];
  valueKey: "p_nom" | "p_nom_opt";
  title: string;
}

export function ChartRadial({ data, valueKey, title }: ChartRadialProps) {
  const processedData = useMemo(() => {
    const groupedData = data
      .filter((item) => item.carrier !== "load")
      .reduce((acc: { [key: string]: number }, item) => {
        const value = Number(item[valueKey]);
        if (!isNaN(value)) {
          if (!acc[item.carrier]) {
            acc[item.carrier] = 0;
          }
          acc[item.carrier] += value;
        }
        return acc;
      }, {});

    const totalValue = Object.values(groupedData).reduce(
      (sum, value) => sum + value,
      0
    );

    return Object.entries(groupedData)
      .map(([carrier, value]) => {
        const carrierKey = carrier.toLowerCase() as CarrierType;
        const percentage = (value / totalValue) * 100;

        return {
          carrier,
          value: value.toFixed(2),
          actualValue: value,
          percentage: percentage.toFixed(1),
          displayValue: percentage,
          fill: chartConfig[carrierKey]?.color || "hsl(var(--chart-1))",
        };
      })
      .sort((a, b) => b.actualValue - a.actualValue);
  }, [data, valueKey]);

  const totalValue = useMemo(() => {
    return processedData.reduce(
      (sum: number, item: ProcessedDataItem) => sum + Number(item.value),
      0
    );
  }, [processedData]);

  const totalPercentage = useMemo(() => {
    return processedData.reduce(
      (sum: number, item: ProcessedDataItem) => sum + Number(item.percentage),
      0
    );
  }, [processedData]);

  return (
    <>
      <ChartContainer config={chartConfig} className="w-full aspect-square">
        <RadialBarChart
          data={processedData}
          innerRadius="20%"
          outerRadius="100%"
          startAngle={180}
          endAngle={-180}
          barSize={15}
        >
          {/* <ChartTooltip
              content={({ payload }) => {
                if (payload && payload[0]) {
                  const data = payload[0].payload as ProcessedDataItem;
                  const carrierKey = data.carrier.toLowerCase() as CarrierType;
                  return (
                    <div className="bg-black bg-opacity-90 p-3 rounded shadow text-white">
                      <p className="font-bold text-sm">
                        {chartConfig[carrierKey]?.label || data.carrier}
                      </p>
                      <p className="text-sm">{data.value} MW</p>
                      <p className="text-sm">{data.percentage}%</p>
                    </div>
                  );
                }
                return null;
              }}
            /> */}
          <PolarGrid gridType="circle" />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelKey="carrier"
                formatter={(value, name, item, index) => {
                  return (
                    <>
                      <div
                        className="h-10 w-2.5 shrink-0 rounded-[2px]"
                        style={{
                          backgroundColor: item.payload.fill,
                        }}
                      />
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-2">
                          <span>{`${
                            typeof item.payload.actualValue === "number"
                              ? item.payload.actualValue.toFixed(2)
                              : Number(value).toFixed(2)
                          } MW`}</span>
                        </div>
                        <span>{`${item.payload.percentage}%`}</span>
                      </div>
                    </>
                  );
                }}
              />
            }
          />
          <RadialBar
            dataKey="displayValue"
            background
            cornerRadius={5}
            label={{
              position: "insideStart",
              fill: "#fff",
              fontSize: 10,
              formatter: (value: number, entry: any) => {
                if (!entry?.payload?.percentage) return "";
                const percentage = Number(entry.payload.percentage);
                return percentage > 5 ? `${percentage.toFixed(1)}%` : "";
              },
            }}
          />

          <ChartLegend
            wrapperStyle={{ paddingBottom: 0, marginBottom: 0 }}
            content={
              <ChartLegendContent
                className="flex-wrap translate-y-10"
                nameKey="carrier"
              ></ChartLegendContent>
            }
          />
        </RadialBarChart>
      </ChartContainer>
    </>
  );
}
