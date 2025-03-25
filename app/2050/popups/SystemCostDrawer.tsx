"use client";
import React, { useEffect, useRef } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { GenerationMixGeneral } from "@/components/Charts/GenerationPie";
import useSWR from "swr";
import { CarrierCostGeneral } from "@/components/Charts/CarrierCostPie";
import { TotalSystemCost_info } from "@/utilities/TooltipInfo/ExplainerText/TotalSystemCost";
import ChartInfoTooltip from "@/utilities/TooltipInfo/HoverComponents/ChartInfoTooltip";
import { CircleFlag } from "react-circle-flags";
import { ElectricityPrice_info } from "@/utilities/TooltipInfo/ExplainerText/ElectricityPrice";

type Props = {
  selectedCountry: string;
  isParentOpen: boolean;
  setIsParentOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const SystemCostDrawer = ({
  selectedCountry,
  isParentOpen,
  setIsParentOpen,
}: Props) => {
  const { data: totalCostsData2021 } = useSWR(
    `/api/total_costs_by_techs/${selectedCountry}/2021`,
    fetcher,
    { suspense: false }
  );

  const { data: totalCostsData2050 } = useSWR(
    `/api/total_costs_by_techs/${selectedCountry}/2050`,
    fetcher,
    { suspense: false }
  );

  const { data: investmentsNeededData2050 } = useSWR(
    `/api/investments_needed/${selectedCountry}/2050`,
    fetcher,
    { suspense: false }
  );

  const { data: electricityPrice2021 } = useSWR(
    `/api/electricity_prices/${selectedCountry}/2021`,
    fetcher,
    { suspense: false }
  );

  const { data: electricityPrice2050 } = useSWR(
    `/api/electricity_prices/${selectedCountry}/2050`,
    fetcher,
    { suspense: false }
  );

  const [totalCostsState2021, setTotalCostsState2021] =
    React.useState<typeof totalCostsData2021>(null);

  const [totalCostsState2050, setTotalCostsState2050] =
    React.useState<typeof totalCostsData2050>(null);

  const [investmentsNeededState2050, setInvestmentsNeededState2050] =
    React.useState<typeof investmentsNeededData2050>(null);

  const [electricityPriceState2021, setElectricityPriceState2021] =
    React.useState<typeof electricityPrice2021>(null);

  const [electricityPriceState2050, setElectricityPriceState2050] =
    React.useState<typeof electricityPrice2050>(null);

  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (totalCostsData2021?.data) {
      setTotalCostsState2021(totalCostsData2021.data);
    }
  }, [totalCostsData2021]);

  useEffect(() => {
    if (totalCostsData2050?.data) {
      setTotalCostsState2050(totalCostsData2050.data);
    }
  }, [totalCostsData2050]);

  useEffect(() => {
    if (investmentsNeededData2050?.data) {
      setInvestmentsNeededState2050(investmentsNeededData2050.data);
    }
  }, [investmentsNeededData2050]);

  useEffect(() => {
    if (electricityPrice2021?.data) {
      setElectricityPriceState2021(electricityPrice2021.data);
    }
  }, [electricityPrice2021]);

  useEffect(() => {
    if (electricityPrice2050?.data) {
      setElectricityPriceState2050(electricityPrice2050.data);
    }
    console.log("electricityPrice2050", electricityPrice2050);
  }, [electricityPrice2050]);

  useEffect(() => {
    if (open) {
      setIsParentOpen(false);
    } else {
      setIsParentOpen(true);
    }
  }, [open]);

  return (
    <Drawer modal={false} open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="w-full" onClick={() => setOpen(!open)}>
          {TotalSystemCost_info.full_name}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="top-0">
        <ScrollArea className="w-full overflow-y-auto flex flex-wrap justify-center mt-3">
          <DrawerHeader className="w-full flex gap-2 align-middle">
            <CircleFlag
              countryCode={selectedCountry.toLowerCase()}
              height={30}
              className="aspect-square h-20 mr-2"
            />
            <div>
              <DrawerTitle className="text-4xl">
                {TotalSystemCost_info.full_name} comparison
                <ChartInfoTooltip
                  tooltipInfo={TotalSystemCost_info}
                  className="w-6 h-6 ml-2"
                />
              </DrawerTitle>
              <DrawerDescription className="text-base">
                {TotalSystemCost_info.comparison} {selectedCountry}
              </DrawerDescription>
            </div>
          </DrawerHeader>
          <div className="flex flex-col flex-wrap gap-8 justify-center align-middle items-center w-[100%] lg:w-[50%] p-8 border-t-2 mt-4 border-r-2 mx-auto">
            <h2 className="w-full text-3xl font-semibold text-card-foreground text-center">
              Current (2021)
            </h2>
            {electricityPriceState2021 &&
            Array.isArray(electricityPriceState2021) &&
            electricityPriceState2021.length > 0 ? (
              <p className="w-full text-2xl font-semibold text-card-foreground text-center">
                Electricity Price{" "}
                <ChartInfoTooltip
                  tooltipInfo={ElectricityPrice_info}
                  className="h-5 w-5"
                />{" "}
                {electricityPriceState2021[0]?.electricity_price ?? "N/A"} €/MWh
              </p>
            ) : (
              <p className="w-full text-2xl font-semibold text-card-foreground text-center">
                Loading electricity price...
              </p>
            )}
            <CarrierCostGeneral
              heading="Total System Costs"
              data={totalCostsState2021}
              costField="total_costs"
            />
          </div>
          <div className="flex flex-wrap gap-8 justify-center align-middle w-[100%] lg:w-[50%] p-8 border-t-2 mt-4 mx-auto">
            <h2 className="w-full text-3xl font-semibold text-card-foreground text-center">
              Net-Zero Target (2050)
            </h2>
            {electricityPriceState2050 &&
            Array.isArray(electricityPriceState2050) &&
            electricityPriceState2050.length > 0 ? (
              <p className="w-full text-2xl font-semibold text-card-foreground text-center">
                Electricity Price{" "}
                <ChartInfoTooltip
                  tooltipInfo={ElectricityPrice_info}
                  className="h-5 w-5"
                />{" "}
                {electricityPriceState2050[0]?.electricity_price ?? "N/A"} €/MWh
              </p>
            ) : (
              <p className="w-full text-2xl font-semibold text-card-foreground text-center">
                Loading electricity price...
              </p>
            )}
            <CarrierCostGeneral
              heading="Total System Costs"
              data={totalCostsState2050}
              costField="total_costs"
            />
            <CarrierCostGeneral
              heading="Required Investments"
              data={investmentsNeededState2050}
              costField="investment_needed"
            />
          </div>
          <DrawerFooter className="w-full border-t">
            <DrawerClose>
              <Button className="w-[80%]">Close Analysis</Button>
            </DrawerClose>
          </DrawerFooter>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default SystemCostDrawer;
