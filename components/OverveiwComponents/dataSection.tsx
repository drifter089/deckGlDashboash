import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";
import Image from "next/image";

// import icchartImage from "../";

interface DataProps {
  icon: string;
  title: string;
  description: string;
}

const DataList: DataProps[] = [
  {
    icon: "HandCoins",
    title: "Investment Requirements",
    description:
      "Explore how much investment is needed to reach net-zero, broken down by resource type and country.",
  },
  {
    icon: "CircleDollarSign",
    title: "Total System Costs",
    description:
      "Discover the overall cost of running the future electricity system — including generation, storage, and grid.",
  },
  {
    icon: "ChartPie",
    title: "Future Energy Mix",
    description:
      "See which energy sources are projected to power your country in 2050 under a clean energy scenario.",
  },
  {
    icon: "Zap",
    title: "Infrastructure Expansion Outlook",
    description:
      "Explore how generation, storage, and grid capacity must expand by 2050 — broken down by technology and region.",
  },
  {
    icon: "Network",
    title: "Model Validation & Benchmarking",
    description:
      "Compare PyPSA-Earth data with other datasets like EMBER and EIA to validate assumptions and outputs.",
  },
  {
    icon: "Globe",
    title: "Regional Comparisons",
    description:
      "Compare countries or regions across key metrics like cost, emissions, and renewable share.",
  },
  {
    icon: "Cpu",
    title: "Technology Performance & Market Fit",
    description:
      "Evaluate how different energy technologies perform under future scenarios and where they offer the most value.",
  },
  {
    icon: "Code",
    title: "Open Source & Reproducible",
    description:
      "All data, models, and workflows are fully open-source — empowering users to explore, reproduce, and extend the results freely.",
  },
];

export const DataSection = () => {
  return (
    <section
      id="datasection"
      className="container w-full py-16 sm:py-20 lg:py-48 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows gap-4"
    >
      <h2 className="text-5xl md:text-6xl lg:text-6xl font-bold mb-16 text-card-foreground col-span-1 md:col-span-2 lg:col-span-4 row-span-1">
        Features
      </h2>

      {DataList.map(({ icon, title, description }) => (
        <div key={title} className="col-span-1">
          <Card className="h-full bg-background border shadow-none">
            <CardHeader className="flex justify-start ">
              <div className="bg-none p-2 rounded-full  mb-4">
                <Icon
                  name={icon as keyof typeof icons}
                  size={48}
                  //   color="hsl(var(--secondary))"
                  className="dark:text-secondary text-destructive"
                />
              </div>

              <CardTitle className="lg:text-xl font-sans">{title}</CardTitle>
            </CardHeader>

            <CardContent className="text-muted-foreground text-start">
              {description}
            </CardContent>
          </Card>
        </div>
      ))}
    </section>
  );
};
