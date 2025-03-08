import { Card } from "@/components/ui/card";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useMouse } from "@uidotdev/usehooks";
import gsap from "gsap";
import { CircleFlag } from "react-circle-flags";
import { InvestmentPie } from "./InvestementsPie";
interface InvestmentData {
  carrier: string;
  investment_needed: number;
}

interface DrawerData {
  investmentsNeeded: InvestmentData[];
  totalInvestmentNeeded: number;
}

const ElectricityPriceComponent = ({
  hoveredCountry,
}: {
  hoveredCountry: string;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DrawerData>({
    investmentsNeeded: [],
    totalInvestmentNeeded: 0,
  });

  const [mouse, ref] = useMouse();

  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const { x, y } = mouse;
    gsap.to(contentRef.current, {
      delay: 0.08,
      x: x,
      y: y * 0.5,
    });
    gsap.to(textRef.current, {
      delay: 0.08,
      x: x + 12 * 34,
      y: y * 0.5,
    });
  }, [mouse]);

  const fetchData = useCallback(async () => {
    if (!hoveredCountry && hoveredCountry !== "null") {
      setData({
        investmentsNeeded: [],
        totalInvestmentNeeded: 0,
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const responses = await Promise.all([
        fetch(`/api/investments_needed/${hoveredCountry}/2050`),
      ]);

      const failedResponses = responses.filter((r) => !r.ok);
      if (failedResponses.length > 0) {
        throw new Error("One or more API calls failed");
      }

      const [investmentsNeededData] = await Promise.all(
        responses.map((r) => r.json())
      );

      const investmentsNeeded = investmentsNeededData.data as InvestmentData[];
      const totalInvestmentNeeded = investmentsNeeded.reduce(
        (sum, item) => sum + item.investment_needed,
        0
      );

      const processedData: DrawerData = {
        investmentsNeeded,
        totalInvestmentNeeded,
      };

      setData(processedData);
    } catch (error) {
      setData({
        investmentsNeeded: [],
        totalInvestmentNeeded: 0,
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
      // if (window.innerWidth <= 768) {
      //   gsap.to(contentRef.current, {
      //     width: "12rem",
      //     height: "16rem",
      //     opacity: 1,
      //     duration: 0.3,
      //     delay: 0.08,
      //   });
      // } else {
      gsap.to(contentRef.current, {
        width: "19rem",
        height: "21rem",
        opacity: 1,
        duration: 0.3,
        delay: 0.08,
      });
      // }
    }
  }, [hoveredCountry]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <Card
        className={`fixed top-0 left-0  h-0 w-0 z-40  mx-auto text-accent-foreground bg-background text-center opacity-1 overflow-hidden border-border border-2 m-2 pointer-events-none`}
        ref={contentRef}
      >
        {!loading && (
          <div className="w-full h-full grid grid-cols-11">
            <CircleFlag
              countryCode={hoveredCountry.toLowerCase()}
              height={50}
              className="pt-2 w-full aspect-square col-span-11 h-28 mx-auto md:h-auto md:col-span-2 translate-x-3 translate-y-3"
            />
            <div className="col-span-11 md:col-span-9 flex flex-col justify-center pt-3">
              <p className="text-muted-foreground w-full  h-[10%] flex justify-center items-center">
                Investment Required
              </p>
              <p className="text-3xl font-bold mb-1">
                €{data.totalInvestmentNeeded.toFixed(2)}{" "}
                <span className="hidden md:inline">Billion</span>
                <span className="md:hidden">B</span>
              </p>
            </div>
            <div className="hidden md:block md:col-span-11 -mt-12">
              <InvestmentPie
                data={data.investmentsNeeded}
                costField="investment_needed"
              />
            </div>
          </div>
        )}
        {loading && <p>Loading...</p>}
      </Card>
    </>
  );
};

export default ElectricityPriceComponent;
