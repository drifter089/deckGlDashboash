import Link from "next/link";

export const ReverseInfo = () => {
  return (
    <section className="container w-full pt-24">
      <div className="flex flex-row-reverse flex-wrap sm:flex-nowrap gap-[8rem] items-start border-t-[0.5px] border-foreground pt-4 pb-16 justify-between ">
        <div className=" font-bold font-sans  max-w-[22rem] text-right text-5xl md:text-6xl lg:text-6xl dark:text-secondary">
          {" "}
          Who are we?
          <span className="px-2 dark:text-card-foreground text-destructive">
            Open Energy Transition
          </span>
        </div>
        <div className=" md:text-[1.25rem] text-[1rem] max-w-[45rem] text-foreground">
          Open Energy Transition (OET) is a non-profit organization accelerating
          the global shift to clean energy by making cutting-edge tools and
          insights accessible to energy planners —helping steer billions in
          investment based on trusted information.
          <br />
          <br />
          We advance open-source software and open data as powerful enablers of
          accessibility, transparency, and collaboration—helping stakeholders
          plan faster, lower system costs, and strengthen grid resilience. We
          also provide training and best-practice guidance to ensure planners
          and policymakers can confidently use these tools to drive effective,
          data-informed decisions.
          <br />
          <br />
          Want to build similar applications? Want to tailor this app for your
          need? Explore support opportunities by emailing
          <strong> info@openenergytransition.org</strong>. More information
          about OET can be found at{" "}
          <Link
            href="https://openenergytransition.org/"
            target="_blank"
            className="dark:text-secondary text-destructive"
          >
            https://openenergytransition.org.
          </Link>{" "}
        </div>
      </div>
    </section>
  );
};
