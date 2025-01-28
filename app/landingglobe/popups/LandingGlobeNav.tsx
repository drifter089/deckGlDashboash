"use client";

import { Moon, Sun, X, ChevronRight, ChevronLeft } from "lucide-react";
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
  SheetClose,
} from "@/components/ui/sheet";
import { useCountry } from "@/components/country-context";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { Co2EmmisionsPie } from "@/components/Charts/Co2EmmisionsPie";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface DataItem {
  carrier: string;
  co2_emission: string;
}

interface DrawerData {
  electricityPrice: number;
}

type Props = {
  open: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const MainPageNav = ({ open, setIsOpen }: Props) => {
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
    <>
      <Button
        variant="ghost"
        size="icon"
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-background shadow-md hover:bg-accent hover:text-accent-foreground transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-1/2"
        }`}
        onClick={() => setIsOpen(!open)}
      >
        {open ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
      <Sheet modal={false} open={true}>
        <SheetContent
          side="left"
          className={`w-96 h-screen flex flex-col overflow-y-auto no-scrollbar p-4 bg-background border-r z-50 ${
            open ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-200`}
        >
          <SheetHeader className="relative">
            <SheetClose
              className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </SheetClose>
            <SheetTitle>2021 Scenario</SheetTitle>
            <SheetDescription>
              {selectedCountry
                ? `Analyzing data for ${selectedCountry}`
                : "Select a country to view data"}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-4 flex-1">
            <CountryDropdown defaultValue={selectedCountry} />
            <Card className="p-6 space-y-6">
              <div>
                <h3 className="text-2xl font-semibold">CO2 Emissions (2021)</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Current emissions by energy carrier
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Emissions</p>
                  <p className="text-3xl font-bold tracking-tight">
                    {(co2Emissions?.reduce((acc, curr) => acc + (Number(curr.co2_emission) || 0), 0))
                      .toLocaleString('en-US', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                      })}
                    <span className="text-lg font-normal ml-2">tCO2</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Distribution by Carrier</p>
                  <div className="pt-2">
                    <Co2EmmisionsPie 
                      data={co2Emissions} 
                      costField="co2_emission" 
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-6">
              <div>
                <h3 className="text-2xl font-semibold">Electricity Prices (2021)</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Current electricity price for {selectedCountry}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Average Price</p>
                <p className="text-3xl font-bold tracking-tight">
                  {data.electricityPrice.toFixed(2)} <span className="text-lg font-normal ml-2">€/MWh</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Based on current market conditions
                </p>
              </div>
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
    </>
  );
};

export default MainPageNav;
