"use client";
import React from "react";
import { Generation_info_type } from "../ExplainerText/GenerationMix";
import { Installed_capacity_info_type } from "../ExplainerText/InstalledCapacity";
import { NominalCapacity_info_type } from "../ExplainerText/NominalCapacity";
import { TotalSystemCost_info_type } from "../ExplainerText/TotalSystemCost";

import { CalendarIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { InfoCircledIcon } from "@radix-ui/react-icons";

interface ChartInfoTooltipProps {
  tooltipInfo?:
    | Generation_info_type
    | Installed_capacity_info_type
    | NominalCapacity_info_type
    | TotalSystemCost_info_type;
  className?: string;
}

const ChartInfoTooltip = ({
  tooltipInfo,
  className,
}: ChartInfoTooltipProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger
        asChild
        className={`relative cursor-pointer inline-block `}
      >
        <InfoCircledIcon
          className={`${className || ""}`}
          width={24}
          height={24}
        />
      </HoverCardTrigger>
      <HoverCardContent className="w-96 p-4 space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            {tooltipInfo?.full_name}
          </h3>
          <p className="text-sm text-muted-foreground font-thin">
            {tooltipInfo?.definition}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium">{`Unit`}</h4>
            <p className="text-sm text-muted-foreground font-thin">
              {tooltipInfo?.unit}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium">{`Source`}</h4>
            <p className="text-sm text-muted-foreground font-thin">
              {tooltipInfo?.source}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium">{`Values`}</h4>
            <p className="text-sm text-muted-foreground font-thin">
              {tooltipInfo?.values}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium">{`Comparison`}</h4>
            <p className="text-sm text-muted-foreground">
              {tooltipInfo?.comparison}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
export default ChartInfoTooltip;
