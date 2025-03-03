import DiscordIcon from "@/components/icons/discord-icon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "lucide-react";

const repositories = [
  {
    name: "pypsa-earth",
    description: "Our model",
    url: "https://github.com/pypsa-meets-earth/pypsa-earth",
  },
  {
    name: "ji-gis-validation",
    description: "Notebooks for network validation",
    url: "https://github.com/open-energy-transition/ji-gis-validation",
  },
  {
    name: "deckGlDashboard",
    description: "This website",
    url: "https://github.com/open-energy-transition/deckGlDashboard",
  },
];

export const GithubSection = () => {
  return (
    <section id="github" className="mb-28">
      <div className="container px-4 sm:px-6 py-12 sm:py-24">
        <Card className="bg-background border-none shadow-none text-center flex flex-col items-center justify-center w-full">
          <CardTitle className="text-2xl sm:text-3xl mb-2">Github</CardTitle>
          <CardDescription className="mb-6 text-sm sm:text-lg">
            Our code is open, contributions welcome!
          </CardDescription>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-6xl">
            {repositories.map((repo, index) => (
              <Card
                key={index}
                className="bg-background border shadow-sm hover:shadow-md transition-shadow duration-300 text-center flex flex-col justify-between h-full p-4 sm:p-6 lg:p-8"
              >
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl">
                    {repo.name}
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base lg:text-lg">{repo.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-center mt-auto">
                  <Button variant="outline" className="text-sm sm:text-base lg:text-lg px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3">
                    <a href={repo.url} className="flex items-center">
                      <span className="mr-2">Repository</span>
                      <Link size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
};
