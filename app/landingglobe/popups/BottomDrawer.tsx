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
import { GenerationMixPieChart } from "@/components/Charts/GenerationMixPieChart";
import { InstalledCapacityPieChart } from "@/components/Charts/InstalledCapacityPieChart";
import useSWR from "swr";
import { useTheme } from "next-themes";
import { InstalledCapacityBarChartStacked } from "@/components/Charts/InstalledCapacityBarChartstacked";
import { GenerationMixBarChartStacked } from "@/components/Charts/GenerationMixBarChartStacked";
import { GenerationMixGeneral } from "@/components/Charts/GenerationPie";

type Props = {
  selectedCountry: string;
  isParentOpen: boolean;
  setIsParentOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const GenerationMixBottomDrawer = ({
  selectedCountry,
  isParentOpen,
  setIsParentOpen,
}: Props) => {
  const { data: generationComparisonData2050 } = useSWR(
    `/api/generation_mix/${selectedCountry}/2050`,
    fetcher,
    { suspense: false }
  );

  const { data: generationComparisonData2021 } = useSWR(
    `/api/generation_mix/${selectedCountry}/2021`,
    fetcher,
    { suspense: false }
  );

  const [generationComparisonState2050, setGenerationComparisonState] =
    React.useState<typeof generationComparisonData2050>(null);

  const [generationComparisonState2021, setGenerationComparisonState2021] =
    React.useState<typeof generationComparisonData2021>(null);

  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (generationComparisonData2050?.data) {
      setGenerationComparisonState(generationComparisonData2050.data);
    }
  }, [generationComparisonData2050]);

  useEffect(() => {
    if (generationComparisonData2021?.data) {
      setGenerationComparisonState2021(generationComparisonData2021.data);
    }
  }, [generationComparisonData2021]);

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
          Generation Mix for {selectedCountry}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="top-0">
        <ScrollArea className="w-full overflow-y-auto flex flex-wrap justify-center mt-3">
          <DrawerHeader className="w-full pb-2">
            <DrawerTitle className="text-4xl">
              Generation Mix Analysis
            </DrawerTitle>
            <DrawerDescription className="text-base">
              Comparing energy generation distribution between current state and
              net-zero target for {selectedCountry}
            </DrawerDescription>
          </DrawerHeader>
          <div className="w-[100%] lg:w-[50%] border-t-2 mt-4 border-r-2 p-8">
            <h2 className="w-full text-4xl font-semibold text-card-foreground text-center mb-8">
              Current Generation (2021)
            </h2>
            <p className="text-muted-foreground text-center mb-6">
              Distribution of energy generation by technology type in{" "}
              {selectedCountry}'s current energy mix
            </p>
            <div className="w-full max-w-3xl mx-auto">
              <GenerationMixGeneral data={generationComparisonState2021} />
            </div>
          </div>
          <div className="w-[100%] lg:w-[50%] border-t-2 mt-4 p-8">
            <h2 className="w-full text-4xl font-semibold text-card-foreground text-center mb-8">
              Net-Zero Target (2050)
            </h2>
            <p className="text-muted-foreground text-center mb-6">
              Projected energy generation distribution to achieve carbon
              neutrality
            </p>
            <div className="w-full max-w-3xl mx-auto">
              <GenerationMixGeneral data={generationComparisonState2050} />
            </div>
          </div>
          <DrawerFooter className="w-full border-t">
            <DrawerClose asChild>
              <Button className="w-[80%]">Close Comparison</Button>
            </DrawerClose>
          </DrawerFooter>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default GenerationMixBottomDrawer;
