"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";

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
  ChartTooltipContent,
  ChartLegendContent,
  ChartLegend,
} from "@/components/ui/chart";

interface Props {
  data: React.MutableRefObject<any>;
}

type ChartDataType = {
  name: string;
  EMBER: number;
  PyPSA: number;
  EIA: number;
}[];

const chartConfig = {
  EMBER: {
    label: "EMBER",
    color: "hsl(var(--chart-1))",
  },
  PyPSA: {
    label: "PyPSA",
    color: "hsl(var(--chart-2))",
  },
  EIA: {
    label: "EIA",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function TotalDemandBarChart({ data }: Props) {
  const [chartData, setChartData] = useState<ChartDataType>([]);

  useEffect(() => {
    if (data?.current?.data?.[0]) {
      const item = data.current.data[0];
      const transformedData = [
        {
          name: "Total Demand",
          EMBER: Number(item.ember?.toFixed(2) || 0),
          PyPSA: Number(item.pypsa_model?.toFixed(2) || 0),
          EIA: Number(item.eia?.toFixed(2) || 0),
        },
      ];

      setChartData(transformedData);
    }
  }, [data?.current]);

  if (!data?.current?.data) {
    return (
      <>
        <CardHeader>
          <CardTitle>Total Demand Comparison</CardTitle>
          <CardDescription>Waiting for data...</CardDescription>
        </CardHeader>
      </>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <>
        <CardHeader>
          <CardTitle>Total Demand Comparison</CardTitle>
          <CardDescription>No data available to display</CardDescription>
        </CardHeader>
      </>
    );
  }

  return (
    <Card className="w-[90%] md:w-[60%] lg:w-[40%] xl:w-[30%] 2xl:w-[25%]">
      <CardHeader>
        <CardTitle>Total Demand Comparison</CardTitle>
        <CardDescription>Demand Validation (TWh)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              scale="band"
            />
            <YAxis
              tickLine={false}
              tickMargin={5}
              axisLine={false}
              scale="linear"
              label={{
                value: "Demand (TWh)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="EMBER"
              fill="hsl(var(--chart-1))"
              radius={[4, 4, 0, 0]}
              name="EMBER"
            />
            <Bar
              dataKey="PyPSA"
              fill="hsl(var(--chart-2))"
              radius={[4, 4, 0, 0]}
              name="PyPSA"
            />
            <Bar
              dataKey="EIA"
              fill="hsl(var(--chart-3))"
              radius={[4, 4, 0, 0]}
              name="EIA"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
