import React from "react";
import { Footprints } from "lucide-react";
export const NextSteps = () => {
  return (
    <div className="flex flex-col text-destructive dark:text-secondary">
      <Footprints className="w-[3rem] h-[3rem]" />
      <h1 className="font-sans text-card-foreground text-2xl md:text-3xl lg:text-4xl font-bold py-[1rem]">
        {" "}
        Next Steps
      </h1>
      <p className=" md:text-[1.25rem] text-[1rem] md:w-[45rem] lg:w-[50rem] text-foreground">
        {" "}
        We are actively seeking financial support to refine the application,
        address current limitations, and unlock its full potential for global
        energy planning — empowering researchers, policymakers, and energy
        technology providers with actionable insights.
        <br />
        <br />
        If you're a software developer or energy modeller, contributing to or
        building upon open-source tools and open data platforms is incredibly
        valuable. This application is built using <strong>
          PyPSA
        </strong> and <strong>PyPSA-Earth</strong>, both open-source frameworks.
        <br />
        <br />
        The entire application is open-source — we invite you to reuse it,
        contribute to it, and help make it better!
      </p>
    </div>
  );
};
