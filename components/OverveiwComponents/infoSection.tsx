export const InfoSection = () => {
  return (
    <section className="container w-full pt-24">
      <div className="flex flex-row flex-wrap sm:flex-nowrap gap-[8rem] items-start border-t-[0.5px] border-foreground pt-4 pb-16  justify-between ">
        <div className=" font-bold font-sans  max-w-[22rem] text-5xl md:text-6xl lg:text-6xl dark:text-secondary">
          {" "}
          Why did we build
          <span className="px-2 dark:text-card-foreground text-destructive">
            this?
          </span>
        </div>
        <div className="md:text-[1.25rem] text-[1rem] max-w-[45rem] text-foreground">
          We believe that accessible, transparent, and data-driven insights can
          help accelerate the global energy transition. While this platform is
          still a prototype, our vision is to enable answers to key questions
          such as:
          <ul className="mt-2 list-disc pl-5 space-y-2 md:text-[1.25rem] text-[1rem] text-foreground lg:w-[50rem]">
            <li>
              How much investment is needed to achieve a 100% clean or net-zero
              power system?
            </li>
            <li>
              Where can climate finance deliver the greatest CO₂ reduction per
              dollar?
            </li>
            <li>
              Where could be clean energy already cheaper than fossil fuels —
              and why?
            </li>
            <li>
              What will future electricity costs look like for households and
              businesses?
            </li>
            <li>
              How much new capacity is required for generators, grids, and
              storage?
            </li>
            <li>
              How should manufacturers design future-ready energy technologies
              to stay competitive?
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
