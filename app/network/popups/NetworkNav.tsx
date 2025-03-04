"use client";

import { Moon, Sun, X, ChevronRight, ChevronLeft } from "lucide-react";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { useCountry } from "@/components/country-context";
import BottomDrawer from "@/app/network/popups/BottomDrawer";
import MapLegend from "@/app/network/popups/MapLegend";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { regionalGeneratorTypes } from "@/utilities/GenerationMixChartConfig";

interface NetworkNavProps {
  networkView: boolean;
  setNetworkView: React.Dispatch<React.SetStateAction<boolean>>;
  regionGeneratorValue: keyof typeof regionalGeneratorTypes;
  setRegionGeneratorValue: React.Dispatch<
    React.SetStateAction<keyof typeof regionalGeneratorTypes>
  >;
  regionParamValue: string;
  setRegionParamValue: React.Dispatch<React.SetStateAction<string>>;
}

const NetworkNav = ({
  networkView,
  setNetworkView,
  regionGeneratorValue,
  setRegionGeneratorValue,
  regionParamValue,
  setRegionParamValue,
}: NetworkNavProps) => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { selectedCountry } = useCountry();
  const [open, setOpen] = useState(true);

  useEffect(() => {}, [pathname]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-background shadow-md hover:bg-accent hover:text-accent-foreground transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-1/2"
        }`}
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
      <Sheet modal={false} open={true} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className={`w-96 h-screen flex flex-col overflow-y-auto no-scrollbar p-4 bg-background border-r z-50 ${
            open ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-200`}
        >
          <SheetHeader>
            <SheetTitle>Network Statistics</SheetTitle>
            <SheetDescription>
              select a country and view all country level charts
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-4 flex-1">
            <CountryDropdown defaultValue={selectedCountry} />

            <BottomDrawer
              selectedCountry={selectedCountry}
              isParentOpen={open}
              setIsParentOpen={setOpen}
            />

{/*             <div className="flex items-center justify-between space-x-2 flex-wrap">
              <p>Regional view</p>
              <Switch
                id="theme"
                checked={networkView}
                onClick={(e) => {
                  setNetworkView(!networkView);
                }}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={regionGeneratorValue}
                onValueChange={(e) =>
                  setRegionGeneratorValue(
                    e as keyof typeof regionalGeneratorTypes
                  )
                }
                disabled={networkView}
              >
                <SelectTrigger className="w-[50%]">
                  <SelectValue placeholder="Generator Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Generator Types</SelectLabel>
                    {Object.keys(regionalGeneratorTypes).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select
                value={regionParamValue}
                onValueChange={(e) => setRegionParamValue(e)}
                disabled={networkView}
              >
                <SelectTrigger className="w-[50%]">
                  <SelectValue placeholder="Select a parameter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Data</SelectLabel>
                    <SelectItem value="cf">capacity factor</SelectItem>
                    <SelectItem value="crt">curtailment</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div> */}
            <div className="mt-auto">
              <div className="text-lg font-semibold mb-2">Network Legend</div>
              <div className="grid grid-cols-2 gap-2 bg-primary rounded-lg p-2">
                <div className="flex flex-col items-start p-2">
                  <div className="text-sm font-medium mb-1">
                    Transmission Lines
                  </div>
                  <MapLegend
                    country={selectedCountry}
                    theme={theme || "light"}
                    type="lines"
                  />
                </div>
                <div className="flex flex-col items-start border-l border-border p-2">
                  <div className="text-sm font-medium mb-1">Buses</div>
                  <MapLegend
                    country={selectedCountry}
                    theme={theme || "light"}
                    type="buses"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-4 border-t border-border">
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

export default NetworkNav;
