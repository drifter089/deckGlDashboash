import { HeroSection } from "@/components/OverveiwComponents/hero";
import { ScenariosSection } from "@/components/OverveiwComponents/scenarios";
import { GithubSection } from "@/components/OverveiwComponents/github";
import { CreditsSection } from "@/components/OverveiwComponents/credits";
import { CommunitySection } from "@/components/OverveiwComponents/community";
import ScrollButton from "@/components/OverveiwComponents/ScrollButton";
import { IntroOETSection } from "@/components/OverveiwComponents/introOET";

export default function Page() {
  return (
    <div className="w-screen min-h-screen overflow-y-scroll overflow-x-hidden bg-background flex flex-col items-center justify-center gap-4 p-4 lg:gap-8 lg:p-0 box-border max-w-screen">
      <HeroSection />
      <ScenariosSection />
      <IntroOETSection />
      <GithubSection />
      <CommunitySection />
    </div>
  );
}
