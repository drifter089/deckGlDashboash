"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
  ChartTooltip,
  ChartLegendContent,
  ChartTooltipContent,
  ChartLegend,
} from "@/components/ui/chart";

interface Props {
  data: React.MutableRefObject<any>;
}

type ChartDataType = {
  model: string;
  biomass: number;
  fossilFuels: number;
  hydro: number;
  nuclear: number;
  solar: number;
  wind: number;
  phs: number;
}[];

const carrierMap = {
  Biomass: "biomass",
  "Fossil fuels": "fossilFuels",
  Hydro: "hydro",
  Nuclear: "nuclear",
  Solar: "solar",
  Wind: "wind",
  PHS: "phs",
} as const;

type CarrierKey = (typeof carrierMap)[keyof typeof carrierMap];

const chartConfig = {
  biomass: {
    label: "Biomass",
    color: "hsl(var(--chart-biomass))",
  },
  fossilFuels: {
    label: "Fossil Fuels",
    color: "hsl(var(--chart-coal))",
  },
  hydro: {
    label: "Hydro",
    color: "hsl(var(--chart-ror))",
  },
  nuclear: {
    label: "Nuclear",
    color: "hsl(var(--chart-nuclear))",
  },
  solar: {
    label: "Solar",
    color: "hsl(var(--chart-solar))",
  },
  wind: {
    label: "Wind",
    color: "hsl(var(--chart-onwind))",
  },
  phs: {
    label: "PHS",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function InstalledCapacityBarChartStacked({ data }: Props) {
  const [chartData, setChartData] = useState<ChartDataType>([]);

  useEffect(() => {
    if (data?.current?.data) {
      let dataArray = Array.isArray(data.current.data) ? data.current.data : [];

      dataArray = dataArray.filter(
        (item: any) =>
          item &&
          item.carrier &&
          item.carrier !== "Total capacity" &&
          item.carrier !== "Geothermal"
      );

      const transformedData: ChartDataType = [
        {
          model: "EMBER",
          biomass: 0,
          fossilFuels: 0,
          hydro: 0,
          nuclear: 0,
          solar: 0,
          wind: 0,
          phs: 0,
        },
        {
          model: "PyPSA",
          biomass: 0,
          fossilFuels: 0,
          hydro: 0,
          nuclear: 0,
          solar: 0,
          wind: 0,
          phs: 0,
        },
        {
          model: "EIA",
          biomass: 0,
          fossilFuels: 0,
          hydro: 0,
          nuclear: 0,
          solar: 0,
          wind: 0,
          phs: 0,
        },
      ];
      for (let i = 0; i < dataArray.length; i++) {
        const item = dataArray[i];
        const carrierName = carrierMap[item.carrier as keyof typeof carrierMap];

        // Skip if the carrier is not in the carrierMap
        if (!carrierName) {
          console.warn(`Unknown carrier: ${item.carrier}`);
          continue;
        }

        // Update the transformedData for each model
        transformedData.forEach((modelObj) => {
          if (modelObj.model === "EMBER") {
            modelObj[carrierName as CarrierKey] = Math.floor(item.ember);
          } else if (modelObj.model === "PyPSA") {
            modelObj[carrierName as CarrierKey] = Math.floor(item.pypsa_model);
          } else if (modelObj.model === "EIA") {
            modelObj[carrierName as CarrierKey] = Math.floor(item.eia);
          }
        });
      }

      setChartData(transformedData);
    }
  }, [data?.current]);

  if (!data?.current?.data) {
    return (
      <>
        <CardHeader>
          <CardTitle>Installed Capacity Comparison</CardTitle>
          <CardDescription>Waiting for data...</CardDescription>
        </CardHeader>
      </>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <>
        <CardHeader>
          <CardTitle>Installed Capacity Comparison</CardTitle>
          <CardDescription>No data available to display</CardDescription>
        </CardHeader>
      </>
    );
  }

  return (
    <>
      <Card className="w-[95%] md:w-[80%] xl:w-[68%] flex flex-col justify-between align-middle">
        <CardHeader>
          <CardTitle>Installed Capacity Comparison</CardTitle>
          <CardDescription>EMBER vs PyPSA vs EIA (GW)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[42vh] w-full" config={chartConfig}>
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    // indicator="dot"
                    className="w-auto"
                    // hideLabel={true}
                    labelFormatter={(label, item) => {
                      let t = 0;
                      for (let i = 0; i < item.length; i++) {
                        t += Number(item[i]?.value || 0);
                      }

                      return `Model: ${label} ${t} GW`;
                    }}
                    formatter={(value, name, item, index) => {
                      return (
                        <>
                          {Number(value) > 0 && (
                            <>
                              <div
                                className="h-10 w-3 shrink-0 rounded-[2px]"
                                style={
                                  {
                                    backgroundColor: item.color,
                                  } as React.CSSProperties
                                }
                              ></div>
                              <div className="flex flex-col gap-1">
                                <div className="flex gap-2">
                                  <span className="font-bold">
                                    {chartConfig[
                                      name as keyof typeof chartConfig
                                    ]?.label || name}
                                  </span>
                                  <span>{`${value} GW`}</span>
                                </div>
                                <div className="flex gap-2">
                                  <span>
                                    {(
                                      (item.payload[
                                        name as keyof typeof item.payload
                                      ] /
                                        Object.values(item.payload).reduce(
                                          (acc: number, val) =>
                                            typeof val === "number"
                                              ? acc + val
                                              : acc,
                                          0
                                        )) *
                                      100
                                    ).toFixed(2)}
                                    %
                                  </span>
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      );
                    }}
                  />
                }
              />
              <XAxis
                dataKey="model"
                tickLine={true}
                tickMargin={10}
                axisLine={false}
                scale="band"
              />
              <YAxis
                tickLine={false}
                tickMargin={5}
                axisLine={false}
                type="number"
                domain={[0, "dataMax"]}
                unit={" GW"}
                scale="linear"
              />

              <ChartLegend
                content={<ChartLegendContent className="pb-0 pt-0 mb-0" />}
                className="flex-wrap pb-0"
              />
              {Object.keys(chartConfig).map((key) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={chartConfig[key as keyof typeof chartConfig].color}
                />
              ))}
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
