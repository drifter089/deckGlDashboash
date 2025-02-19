import { Card } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useMouse } from "@uidotdev/usehooks";
import { useCountry } from "@/components/country-context";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CircleFlag } from "react-circle-flags";

interface DrawerData {
  electricityPrice2050: number;
  investmentPerCO2: number;
  electricityPrice2021: number;
}

const ElectricityPriceComponent = ({
  hoveredCountry,
}: {
  hoveredCountry: string;
}) => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DrawerData>({
    electricityPrice2050: 0,
    investmentPerCO2: 0,
    electricityPrice2021: 0,
  });

  const [mouse, ref] = useMouse();

  useEffect(() => {
    if (!contentRef.current) return;

    const { x, y } = mouse;
    gsap.to(contentRef.current, {
      delay: 0.08,
      x: x * 0.5,
      y: y * 0.5,
    });
  }, [mouse]);

  const fetchData = useCallback(async () => {
    if (!hoveredCountry || hoveredCountry === "null") {
      setData({
        electricityPrice2050: 0,
        investmentPerCO2: 0,
        electricityPrice2021: 0,
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
      ]);

      const failedResponses = responses.filter((r) => !r.ok);
      if (failedResponses.length > 0) {
        throw new Error("One or more API calls failed");
      }

      const [
        electricityPricesData2050,
        investmentPerCO2Data,
        electricityPriceData2021,
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
      };

      setData(processedData);
    } catch (error) {
      setData({
        electricityPrice2050: 0,
        investmentPerCO2: 0,
        electricityPrice2021: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [hoveredCountry]);

  useEffect(() => {
    if (!hoveredCountry || hoveredCountry === "null") {
      gsap.to(contentRef.current, {
        width: 0,
        height: 0,
        opacity: 0,
        duration: 0.4,
        delay: 0.08,
      });
    } else if (contentRef.current) {
      gsap.to(contentRef.current, {
        width: "35vw",
        height: "15vh",
        opacity: 1,
        duration: 0.3,
        delay: 0.08,
      });
    }
  }, [hoveredCountry]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Card
      className={`fixed top-0 left-0  h-0 w-0 z-40  mx-auto text-accent-foreground bg-background text-center opacity-1 overflow-hidden`}
      ref={contentRef}
    >
      {!loading && hoveredCountry && hoveredCountry !== "null" && (
        <div className="w-full h-full grid grid-cols-12">
          <div className="col-span-2 flex flex-col justify-center my-5 pl-3">
            <CircleFlag
              countryCode={hoveredCountry.toLowerCase()}
              height={50}
              className="h-18 w-18"
            />
          </div>
          <div className="col-span-3 px-2 flex flex-col justify-center my-5">
            <p className="text-2xl  font-bold tracking-tight">
              {data.electricityPrice2021.toFixed(2)}{" "}
              <span className="text-lg font-normal ml-2">€/MWh</span>
            </p>
            <h1 className="text-2xl font-bold">2021</h1>
          </div>
          <div className="col-span-4 border-x-2 px-3 flex flex-col justify-center my-5">
            <p className="text-2xl font-bold tracking-tight">
              {data.investmentPerCO2.toFixed(2)}{" "}
              <span className="text-lg font-normal ml-2">€/tCO2</span>
            </p>
            <h1 className="text-2xl font-bold">Investment Required</h1>
          </div>
          <div className="col-span-3 px-2 flex flex-col justify-center my-5">
            <p className="text-2xl font-bold tracking-tight">
              {data.electricityPrice2050.toFixed(2)}{" "}
              <span className="text-lg font-normal ml-2">€/MWh</span>
            </p>
            <h1 className="text-2xl font-bold">2050</h1>
          </div>
        </div>
      )}
      {loading && <p>Loading...</p>}
    </Card>
  );
};

export default ElectricityPriceComponent;
