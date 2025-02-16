import { Card } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useMouse } from "@uidotdev/usehooks";
import { useCountry } from "@/components/country-context";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CircleFlag } from "react-circle-flags";
import { GenerationMixGeneral } from "@/components/Charts/GenerationPie";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { GenerationMixchartConfigSmall } from "@/utilities/GenerationMixChartConfig";
import { Label, Pie, PieChart } from "recharts";
import { GenerationMixglobe } from "./GenerationPie";

interface DrawerData {
  electricityPrice2050: number;
  investmentPerCO2: number;
  electricityPrice2021: number;
  generationMix: any;
}

const ElectricityPriceComponent = ({
  hoveredCountry,
}: {
  hoveredCountry: string;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DrawerData>({
    electricityPrice2050: 0,
    investmentPerCO2: 0,
    electricityPrice2021: 0,
    generationMix: [],
  });

  const [mouse, ref] = useMouse();

  useEffect(() => {
    if (!contentRef.current) return;

    const { x, y } = mouse;
    gsap.to(contentRef.current, {
      delay: 0.08,
      x: x,
      y: y * 0.5,
    });
  }, [mouse]);

  const fetchData = useCallback(async () => {
    if (!hoveredCountry && hoveredCountry !== "null") {
      setData({
        electricityPrice2050: 0,
        investmentPerCO2: 0,
        electricityPrice2021: 0,
        generationMix: [],
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const responses = await Promise.all([
        fetch(`/api/electricity_prices/${hoveredCountry}/2050`),
        fetch(`/api/investment_per_co2_reduced/${hoveredCountry}/2050`),
        fetch(`/api/electricity_prices/${hoveredCountry}/2021`),
        fetch(`/api/generation_mix/${hoveredCountry}/2050`),
      ]);

      const failedResponses = responses.filter((r) => !r.ok);
      if (failedResponses.length > 0) {
        throw new Error("One or more API calls failed");
      }

      const [
        electricityPricesData2050,
        investmentPerCO2Data,
        electricityPriceData2021,
        generationMixData2050,
      ] = await Promise.all(responses.map((r) => r.json()));

      const processedData: DrawerData = {
        electricityPrice2050:
          parseFloat(electricityPricesData2050.data?.[0]?.electricity_price) ||
          0,
        investmentPerCO2:
          parseFloat(
            investmentPerCO2Data.data?.[0]?.investment_per_co2_reduced
          ) || 0,
        electricityPrice2021:
          parseFloat(electricityPriceData2021.data?.[0]?.electricity_price) ||
          0,
        generationMix: generationMixData2050.data,
      };

      setData(processedData);
    } catch (error) {
      setData({
        electricityPrice2050: 0,
        investmentPerCO2: 0,
        electricityPrice2021: 0,
        generationMix: [],
      });
    } finally {
      setLoading(false);
    }
  }, [hoveredCountry]);

  useEffect(() => {
    if (hoveredCountry === "null") {
      console.log('hoveredCountry === "null"');
      gsap.to(contentRef.current, {
        width: 0,
        height: 0,
        opacity: 0,
        duration: 0.4,
        delay: 0.08,
      });
    } else {
      console.log(hoveredCountry);
      if (window.innerWidth <= 768) {
        gsap.to(contentRef.current, {
          width: "12rem",
          height: "16rem",
          opacity: 1,
          duration: 0.3,
          delay: 0.08,
        });
      } else {
        gsap.to(contentRef.current, {
          width: "25rem",
          height: "28rem",
          opacity: 1,
          duration: 0.3,
          delay: 0.08,
        });
      }
    }
  }, [hoveredCountry]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Card
      className={`fixed top-0 left-0  h-0 w-0 z-40  mx-auto text-accent-foreground bg-background text-center opacity-1 overflow-hidden border-border border-2 m-2`}
      ref={contentRef}
    >
      {!loading && (
        <div className="w-full h-full grid grid-cols-11">
          <CircleFlag
            countryCode={hoveredCountry.toLowerCase()}
            height={50}
            className="pt-1 w-full aspect-square col-span-11 h-20 mx-auto md:h-auto  md:col-span-2 "
          />
          <div className="col-span-11 md:col-span-3">
            <p>2021</p>
            {data.electricityPrice2021.toFixed(2)} €/MWh{" "}
          </div>
          <div className="col-span-11 md:col-span-3">
            <p>Investment Required</p>
            {data.investmentPerCO2.toFixed(2)} €/tCO
          </div>
          <div className="col-span-11 md:col-span-3">
            <p>2050</p>
            {data.electricityPrice2050.toFixed(2)} €/MWh{" "}
          </div>
          <div className="hidden md:block md:col-span-11">
            <GenerationMixglobe data={data.generationMix} />
          </div>
        </div>
      )}
      {loading && <p>Loading...</p>}
    </Card>
  );
};

export default ElectricityPriceComponent;
