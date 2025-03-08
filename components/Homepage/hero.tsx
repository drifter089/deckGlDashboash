"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export const HeroSection = () => {
  const { theme } = useTheme();
  return (
    <section className="container w-full">
      <div className="grid place-items-center lg:max-w-screen-xl mt-24 sm:mt-14 md:mt-0 gap-8 mx-auto py-16 md:pt-48 md:pb-32">
        <div className="text-center space-y-16">
          {/* Welcome Section */}
          <div className="space-y-6">
            <div className="mx-auto text-center text-4xl md:text-5xl lg:text-7xl font-bold pb-6">
              <h1>
                Net Zero by
                <Link href="/landingglobe">
                  <span className="text-transparent px-2 lg:px-4 bg-gradient-to-r from-[#E31937] to-primary bg-clip-text">
                    2050
                  </span>
                </Link>
              </h1>
            </div>
            <p className="w-[80%] md:w-full mx-auto text-lg md:text-xl text-muted-foreground">
              How much investment is needed to get to net zero by 2050?
            </p>
            <p className="w-[80%] md:w-full mx-auto text-lg md:text-xl text-muted-foreground">
              We used our open-source tool to calculate,
              <Link href="#github" className="text-[#E31937] hover:text-[#E31937]/80 transition-colors font-medium"> and you can too!</Link>

            </p>
          </div>

          <div className="">
            <Link href="/landingglobe">
              <Button className="w-5/6 md:w-1/4 font-bold group/arrow bg-gradient-to-r from-[#E31937] to-primary text-white">
                2050
                <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
