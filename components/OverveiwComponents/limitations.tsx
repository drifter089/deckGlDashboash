import React from "react";
import DiscordIcon from "../icons/discord-icon";
import { Crosshair } from "lucide-react";

export const Limitations = () => {
  return (
    <div className="flex flex-col text-destructive dark:text-secondary">
      <Crosshair className="w-[3rem] h-[3rem]" />
      <h1 className="font-sans text-card-foreground text-2xl md:text-3xl lg:text-4xl font-bold py-[1rem]">
        {" "}
        Limitations
      </h1>
      <ul className="list-disc pl-5 space-y-2 md:text-[1.25rem] text-[1rem] text-foreground lg:w-[50rem]">
        <li>
          <strong>Sector scope is limited:</strong> Only the power sector is
          modeled, overlooking transport, industry, and heating—leading to
          incomplete decarbonization pathways.
        </li>
        <li>
          <strong>No cross-border modeling:</strong> Countries are treated in
          isolation, missing the benefits of international energy exchange like
          load balancing and shared infrastructure.
        </li>
        <li>
          <strong>Only single weather-year:</strong> The model uses a single
          weather year, which may lead to over- or underestimation of
          generation and storage needs.
        </li>
        <li>
          <strong>Limited data validation:</strong>: A general data extraction workflow used without regional-specific
          adjustments which can result in unreliable outputs, especially in data-sparse regions.
        </li>
        <li>
          <strong>Limited visualization coverage:</strong> Currently supports
          only 9 countries, restricting global insights and stakeholder
          engagement.
        </li>
        <li>
          <strong>Cumbersome data extraction:</strong> Output data is not easily
          accessible, making detailed analysis and validation more difficult.
        </li>
        <li>
          <strong>Low reproducibility:</strong> The entry barrier arises from a specialized skill set required to build and run
          a model which hinder consistent replication of results.
        </li>
        <li>
          <strong>Simplistic optimization:</strong> An analysis returns only one
          a single pathway, missing the broader solution space needed for robust
          decision-making.
        </li>
        <li>
          <strong>PyPSA-Earth improvements:</strong> The model framework
requires regional-focused improvements in data processing  to increase the overall accuracy
          <strong>Overlooking Distribution Grids:</strong> Transmission grid only considered
          which may lead to underestimating the costs and efforts
        </li>
      </ul>
    </div>
  );
};
