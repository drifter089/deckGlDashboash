"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export const HeroSection = () => {
  const { theme } = useTheme();
  return (
    <section className="container w-full">
      <div className="grid place-items-center lg:max-w-screen-xl mt-24 sm:mt-14 md:mt-0 gap-8 mx-auto pb-12 pt-24 md:pt-48">
        <div className="text-center space-y-16">
          {/* Welcome Section */}
          <div className="space-y-6">
            <div className="mx-auto font-sans text-center text-card-foreground  text-5xl md:text-6xl lg:text-8xl font-bold">
              <h1>
                {" "}
                Net-Zero by
                <span className="px-2 dark:text-accent text-destructive ">
                  2050
                </span>
                {/* Future */}
              </h1>
            </div>
            <p className="max-w-screen mx-auto md:text-[1.25rem] text-[1rem] text-muted-foreground font-mono">
              How much investment is needed to get to net zero by 2050? with an
              open-source model and first of a kind visualizations.
            </p>
          </div>

          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Button
              className="w-full md:w-1/4 text-card-foreground dark:hover:bg-secondary hover:bg-ring"
              variant="outline"
            >
              <Link href="/network">see networks</Link>
            </Button>

            <Button
              asChild
              className="w-full md:w-1/4 dark:bg-secondary bg-ring dark:text-card-foreground text-destructive-foreground hover:bg-popover-foreground dark:hover:bg-border "
            >
              <Link href="/landingglobe">
                explore net-zero
                <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform hover:transform-45" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
