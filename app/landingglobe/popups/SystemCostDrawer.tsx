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

  const { data: investmentCostsData2021 } = useSWR(
    `/api/investment_costs_by_techs/${selectedCountry}/2021`,
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

  const [totalCostsState2021, setTotalCostsState2021] =
    React.useState<typeof totalCostsData2021>(null);

  const [investmentCostsState2021, setInvestmentCostsState2021] =
    React.useState<typeof investmentCostsData2021>(null);

  const [totalCostsState2050, setTotalCostsState2050] =
    React.useState<typeof totalCostsData2050>(null);

  const [investmentsNeededState2050, setInvestmentsNeededState2050] =
    React.useState<typeof investmentsNeededData2050>(null);

  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (totalCostsData2021?.data) {
      setTotalCostsState2021(totalCostsData2021.data);
    }
  }, [totalCostsData2021]);

  useEffect(() => {
    if (investmentCostsData2021?.data) {
      setInvestmentCostsState2021(investmentCostsData2021.data);
    }
  }, [investmentCostsData2021]);

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
          System Cost for {selectedCountry}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="top-0">
        <ScrollArea className="w-full overflow-y-auto flex flex-wrap justify-center mt-3">
          <DrawerHeader className="w-full pb-2">
            <DrawerTitle className="text-4xl">System Cost Analysis</DrawerTitle>
            <DrawerDescription className="text-base">
              Comparing system costs and investments between current state and
              net-zero target for {selectedCountry}
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-wrap gap-8 justify-center align-middle w-[100%] lg:w-[50%] p-8 border-t-2 mt-4 border-r-2 mx-auto">
            <h2 className="w-full text-4xl font-semibold text-card-foreground text-center ">
              Current System Costs (2021)
            </h2>
            <p className="text-muted-foreground text-center  w-full">
              Distribution of total operational and investment costs across
              technologies
            </p>
            <CarrierCostGeneral
              heading="Total Operational Costs"
              data={totalCostsState2021}
              costField="total_costs"
              description="Total operational costs for 2021"
            />
            <CarrierCostGeneral
              heading="Current Investment Costs"
              data={investmentCostsState2021}
              costField="investment_cost"
              description="Investment costs for 2021"
            />
          </div>
          <div className="flex flex-wrap gap-8 justify-center align-middle w-[100%] lg:w-[50%] p-8 border-t-2 mt-4 mx-auto">
            <h2 className="w-full text-4xl font-semibold text-card-foreground text-center ">
              Net-Zero Target Costs (2050)
            </h2>
            <p className="text-muted-foreground text-center  w-full">
              Projected costs and investments needed to achieve carbon
              neutrality
            </p>
            <CarrierCostGeneral
              heading="Total System Costs"
              data={totalCostsState2050}
              costField="total_costs"
              description="Total System cost 2050"
            />
            <CarrierCostGeneral
              heading="Investments Needed"
              data={investmentsNeededState2050}
              costField="investment_needed"
              description="Investments needed 2050"
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
