"use client";

import { useEffect, useState } from "react";
import { Pie, PieChart, ResponsiveContainer, Legend, Label } from "recharts";

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

import {
  GenerationMixchartConfig,
  GenerationMixchartConfigSmall,
} from "@/utilities/GenerationMixChartConfig";

interface Props {
  data: any;
  costField: string;
}

interface DataItem {
  carrier: string;
  pypsa_model: number;
  generation: number;
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

export function InvestmentPie({ data, costField }: Props) {
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
            item && item.carrier && item.carrier !== `Total ${costField}`
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
              GenerationMixchartConfig[
                item.carrier as keyof typeof GenerationMixchartConfig
              ]?.color || "hsl(var(--chart-1))",
          };
        });

      setChartData(transformedData);
    }
  }, [data, costField]);

  return (
    <ChartContainer
      config={GenerationMixchartConfig}
      className="w-full md:aspect-square translate-y-3"
    >
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="carrier"
          innerRadius={0}
          outerRadius={110}
        ></Pie>
      </PieChart>
    </ChartContainer>
  );
}
