import DiscordIcon from "@/components/icons/discord-icon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "lucide-react";

export const GithubSection = () => {
  return (
    <section id="github" className="mb-28">
      <div className="container py-12 sm:py-24">
        <Card className="bg-background border-none shadow-none text-center flex flex-col items-center justify-center w-full">
          <CardTitle>Github</CardTitle>
          <CardDescription>Find us at these places</CardDescription>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">

            <Card className="bg-background border-none text-center items-center justify-center w-full">
              <CardHeader>
                <CardTitle>ji-gis-validation</CardTitle>
                <CardDescription>Repository that contains notebooks for network validation</CardDescription>
              </CardHeader>
              <CardContent>

              </CardContent>
              <CardFooter className="flex justify-center">

                <Button variant="outline">
                  <a href="https://github.com/open-energy-transition/ji-gis-validation">
                    Repository
                  </a>
                </Button>
              </CardFooter>
            </Card>

            {/* 
            <Separator className="md:hidden" />
            <Separator className="hidden md:block justify-self-center" orientation="vertical" />
 */}

            <Card className="bg-background border-none text-center items-center justify-center w-full">
              <CardHeader>
                <CardTitle>deckGlDashboard</CardTitle>
                <CardDescription>Repository that contains this website</CardDescription>
              </CardHeader>
              <CardContent>

              </CardContent>
              <CardFooter className="flex justify-center">

                <Button variant="outline">
                  <a href="https://github.com/open-energy-transition/deckGlDashboard">
                    Repository
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </Card>
      </div>
    </section>
  );
};
