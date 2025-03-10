export const InfoSection = () => {
  return (
    <section className="container w-full pt-24">
      <div className="flex flex-row flex-wrap sm:flex-nowrap gap-[8rem] items-start border-t-[0.5px] border-foreground pt-4 pb-16  justify-between ">
        <div className=" font-bold font-sans  max-w-[22rem] text-5xl md:text-6xl lg:text-6xl dark:text-secondary">
          {" "}
          What is
          <span className="px-2 dark:text-card-foreground text-destructive">
            Energy Modeling?
          </span>
        </div>
        <div className=" md:text-[1.25rem] text-[1rem] max-w-[45rem] text-foreground">
          When planning and operating energy systems, we must account for
          natural forces alongside economic and societal dynamics. Energy models
          help navigate this complexity, allowing decision-makers to explore
          scenarios, assess risks, and plan sustainable transitions.
        </div>
      </div>
    </section>
  );
};
