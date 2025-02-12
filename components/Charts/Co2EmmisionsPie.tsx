"use client";

import { useEffect, useState } from "react";
import { Pie, PieChart, ResponsiveContainer, Legend, Label } from "recharts";


import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { GenerationMixchartConfigSmall } from "@/utilities/GenerationMixChartConfig";

interface Props {
  data: any;
  costField: string;
}

interface DataItem {
  carrier: string;
  pypsa_model: number;
  total_costs: number;
}

type ChartDataType = {
  carrier: string;
  value: number;
  percentage: number;
  fill: string;
}[];

interface ChartItem {
  carrier: string;
  value: number;
  percentage: number;
  fill: string;
}

export function Co2EmmisionsPie({ data, costField }: Props) {
  const [chartData, setChartData] = useState<ChartDataType>([]);
  const [totalGeneration, setTotalGeneration] = useState<number>(0);

  useEffect(() => {
    if (data) {
      const dataArray = Array.isArray(data) ? data : [];
      const total = dataArray.reduce((acc: number, item: DataItem) => {
        return acc + (Number(item[costField as keyof DataItem]) || 0);
      }, 0);
      setTotalGeneration(Number(total.toFixed(2)));

      const transformedData = dataArray
        .filter(
          (item: DataItem) =>
            item &&
            item.carrier &&
            Number(item[costField as keyof DataItem]) > 0
        )
        .map((item: DataItem) => {
          const value = Number(
            (Number(item[costField as keyof DataItem]) || 0).toFixed(2)
          );
          const percentage = total > 0 ? (value / total) * 100 : 0;
          return {
            carrier: item.carrier,
            value: value,
            percentage: Number(percentage.toFixed(1)),
            fill:
              GenerationMixchartConfigSmall[
                item.carrier as keyof typeof GenerationMixchartConfigSmall
              ]?.color || "hsl(var(--chart-1))",
          };
        });

      setChartData(transformedData);
    }
  }, [data, costField]);

  return (
    <>
      <ChartContainer
        config={GenerationMixchartConfigSmall}
        className="w-full h-72 mx-0 px-0"
      >
        <PieChart>
          <ChartTooltip
            content={
              <ChartTooltipContent
                indicator="dot"
                className="w-auto"
                formatter={(value, name, item, index) => (
                  <>
                    <div
                      className="h-10 w-2.5 shrink-0 rounded-[2px]"
                      style={{
                        backgroundColor: item.payload.payload.fill,
                      }}
                    />
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-2">
                        <span className="font-bold">
                          {GenerationMixchartConfigSmall[
                            name as keyof typeof GenerationMixchartConfigSmall
                          ]?.label || name}
                        </span>
                        <span>{`${
                          typeof value === "number"
                            ? value.toFixed(2)
                            : Number(value).toFixed(2)
                        } tCo2`}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-bold">percentage</span>
                        <span>{`${item.payload.percentage.toFixed(1)}%`}</span>
                      </div>
                    </div>
                  </>
                )}
              />
            }
          />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="carrier"
            innerRadius={0}
            outerRadius={110}
            className="aspect-square px-0 mx-0"
          ></Pie>

          <ChartLegend
            type="diamond"
            content={<ChartLegendContent />}
            className="flex-wrap mt-5"
          />
        </PieChart>
      </ChartContainer>
    </>
  );
}
