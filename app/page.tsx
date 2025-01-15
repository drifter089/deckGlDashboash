import BenefitsSection from "@/components/OverveiwComponents/BenefitSection";
import { CommunitySection } from "@/components/OverveiwComponents/community";
import { FeaturesSection } from "@/components/OverveiwComponents/features";
import { ServicesSection } from "@/components/OverveiwComponents/services";
import { HeroSection } from "@/components/OverveiwComponents/hero";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import ScrollButton from "@/components/OverveiwComponents/ScrollButton";

export default function Page() {
  return (
    <div className="w-screen min-h-screen overflow-y-scroll overflow-x-hidden bg-background flex flex-col items-center justify-center gap-4 p-4 lg:gap-8 lg:p-0 box-border max-w-screen">
      <HeroSection />
      <ServicesSection />
      <BenefitsSection />
      <FeaturesSection />
      <CommunitySection />
      <ScrollButton />
    </div>
  );
}
