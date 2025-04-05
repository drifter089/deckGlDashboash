import React from "react";
import { Cog } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Methods = () => {
  return (
    <div className="flex flex-col text-destructive dark:text-secondary">
      <Cog className="w-[3rem] h-[3rem] " />
      <h1 className="font-sans text-card-foreground text-2xl md:text-3xl lg:text-4xl font-bold py-[1rem]">
        {" "}
        Methods
      </h1>
      <p className=" md:text-[1.25rem] text-[1rem] md:w-[45rem] lg:w-[50rem] text-foreground">
        The presented results were obtained using the PyPSA-Earth power system
        model. An popular open-source tool that we co-created and now
        co-maintain. The model enables state-of-the-art energy planning for
        everyone. The{" "}
        <Link
          href="https://github.com/pypsa-meets-earth/pypsa-earth"
          target="_blank"
          className="dark:text-secondary text-destructive"
        >
          PyPSA-Earth modeling
        </Link>{" "}
        {""} workflow automatically extracts all necessary data from publicly
        available open-source databases, such as OpenStreetMap and
        GlobalEnergyMonitor. The workflow is designed to be fully functional
        worldwide, which enables modeling for any country of the world.
        <br />
        <br />
        While the workflow is designed to be fully reproducible and globally
        applicable, as noted in the limitations, further work is needed to
        simplify reproducibility and facilitate user-driven modifications.
      </p>
      <Image
        src="/images/credits/VisualisationExpl.svg"
        alt="Background"
        width={0}
        height={0}
        className="w-[100%] max-w-[45rem] h-auto pt-12"
      />
    </div>
  );
};
