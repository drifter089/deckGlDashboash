"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCountry } from "@/components/country-context";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { Card } from "@/components/ui/card";
import useSWR from "swr";
import { Co2EmmisionsPie } from "@/components/Charts/Co2EmmisionsPie";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface DataItem {
  carrier: string;
  value: number;
}

interface DrawerData {
  electricityPrice: number;
}

const GlobeNav = () => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { selectedCountry } = useCountry();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DrawerData>({
    electricityPrice: 0,
  });

  const fetchData = useCallback(async () => {
    if (!selectedCountry) {
      setData({
        electricityPrice: 0,
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const responses = await Promise.all([
        fetch(`/api/electricity_prices/${selectedCountry}/2021`),
      ]);

      responses.forEach((res, index) => {});

      const [electricityPricesData] = await Promise.all(
        responses.map((r) => r.json())
      );

      setData({
        electricityPrice:
          parseFloat(electricityPricesData.data?.[0]?.electricity_price) || 0,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setData({
        electricityPrice: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [selectedCountry]);

  const { data: co2EmissionsData } = useSWR(
    `/api/co2_emissions/${selectedCountry}/2021`,
    fetcher,
    { suspense: false }
  );

  const [co2Emissions, setCo2Emissions] = useState<DataItem[]>([]);

  useEffect(() => {
    if (co2EmissionsData?.data) {
      setCo2Emissions(co2EmissionsData.data);
    }
  }, [co2EmissionsData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Sheet modal={false} open={true}>
      <SheetContent
        side="left"
        className="w-96 h-screen flex flex-col overflow-y-auto no-scrollbar p-4 bg-background border-r z-50"
      >
        <SheetHeader>
          <SheetTitle>2021 Scenario</SheetTitle>
          <SheetDescription>
            {selectedCountry
              ? `Analyzing data for ${selectedCountry}`
              : "Select a country to view data"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 flex-1">
          <CountryDropdown defaultValue={selectedCountry} />
          <Co2EmmisionsPie data={co2Emissions} costField="co2_emission" />
          <Card className="p-4 min-h-[150px] section-electricity-prices">
            <h3 className="text-2xl font-semibold mb-4">Electricity Prices</h3>
            <p className="text-2xl font-semibold mb-4">
              {data.electricityPrice.toFixed(2)} €/MWh
            </p>
          </Card>
          <div className="flex items-center space-x-2 pt-4 border-t border-border mt-auto">
            <Switch
              id="theme"
              checked={theme === "light"}
              onCheckedChange={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
            />
            <Label htmlFor="theme">
              {theme === "light" ? <Moon /> : <Sun />}
            </Label>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default GlobeNav;
