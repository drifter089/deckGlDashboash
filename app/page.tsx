import BenefitsSection from "@/components/OverveiwComponents/BenefitSection";
import { CommunitySection } from "@/components/OverveiwComponents/community";
import { CreditsSection } from "@/components/OverveiwComponents/credits";
import { FeaturesSection } from "@/components/OverveiwComponents/features";
import { ServicesSection } from "@/components/OverveiwComponents/services";
import { HeroSection } from "@/components/OverveiwComponents/hero";
import { DataSection } from "@/components/OverveiwComponents/dataSection";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import ScrollButton from "@/components/OverveiwComponents/ScrollButton";
import { InfoSection } from "@/components/OverveiwComponents/infoSection";
import dynamic from "next/dynamic";
import { ReverseInfo } from "@/components/OverveiwComponents/reverseInfo";
import { AboutHero } from "@/components/OverveiwComponents/aboutHero";

const HeroGlobeScene = dynamic(
  () => import("@/components/OverveiwComponents/HeroGlobeScene"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute w-1 h-1 bottom-0 bg-background opacity-0" />
    ),
  },
);

export default function Page() {
  return (
    <div className="w-screen min-h-screen overflow-y-scroll overflow-x-hidden bg-background flex flex-col items-center justify-center gap-4 p-4 lg:gap-8 lg:p-0 box-border max-w-screen">
      <HeroSection />
      <div className="relative w-full h-[50vh] lg:h[60vh]">
        <HeroGlobeScene />
      </div>

      <InfoSection />
      <DataSection />
      {/* <ServicesSection />
      <BenefitsSection /> */}
      {/* <FeaturesSection /> */}
      <ReverseInfo />
      <CommunitySection />
      <ScrollButton />
      {/* <CreditsSection /> */}
    </div>
  );
}
