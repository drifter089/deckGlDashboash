import DiscordIcon from "@/components/icons/discord-icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const CommunitySection = () => {
  return (
    <section id="community" className="mb-28">
      <div className="container py-12 sm:py-24">
        <Card className="bg-background border-none shadow-none text-center flex flex-col items-center justify-center w-full">
          <CardHeader>
            <CardTitle className="text-4xl md:text-5xl font-bold flex flex-col items-center">
              
              <div>
                Want to run 
                <span className="text-transparent pl-2 md:pl-3 bg-gradient-to-r from-[#E31937] via-[#E31937]/80 to-[#E31937] bg-clip-text">
                  energy models?
                </span>
              </div>
            </CardTitle>
          </CardHeader>

          <CardFooter>
            <Button className="w-40 p-4 mx-2" asChild>
              <a
                href="https://discord.gg/AnuJBk23FU"
                target="_blank"
                className="font-semibold"
              >
                Join our Discord
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};
