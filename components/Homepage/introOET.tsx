import DiscordIcon from "@/components/icons/discord-icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export const IntroOETSection = () => {
  return (
    <section id="OET" className="mb-28">
      <div className="container py-12 sm:py-24">
        <Card className="bg-background border-none shadow-none text-center flex flex-col items-center justify-center w-full">
          <CardHeader>
            <CardTitle className="text-4xl md:text-5xl font-bold flex flex-col items-center">
              Who are we?
            </CardTitle>
          </CardHeader>
          <CardContent>
            As an environmental think tank, OET conducts research, analysis, and develops open-source tools and methodologies to drive the global energy transition towards 100% renewable energy. Simultaneously, as a software company, OET focuses on the development, provision and support of open-source software solutions that enhance energy transition planning and decision-making processes. By combining the roles of a think tank and a software company, OET brings together unique expertise in environmental sustainability and software development to facilitate the transition to a sustainable energy future.
          </CardContent>

          <CardFooter>
            <Link href="https://openenergytransition.org/" target="_blank" className="transition-transform hover:scale-105">
              <Image
                src="/images/credits/OET logo.png"
                alt="OET"
                width={200}
                height={100}
                className="h-[100px] w-auto object-contain"
              />
            </Link>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};
