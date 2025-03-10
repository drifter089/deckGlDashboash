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
    icon: "BatteryMedium",
    title: "Installed Capacity Comparison",
    description:
      "Current vs. Future Energy Infrastructure, highlighting the expansion needed for renewables and grid scaling.",
  },
  {
    icon: "HandCoins",
    title: "Investment Requirements",
    description:
      "Capital needed to achieve net-zero, including financial estimates for infrastructure expansion and clean energy deployment.",
  },
  {
    icon: "Factory",
    title: "Energy Generation Mix",
    description:
      "How energy is produced today vs. the future, highlighting financial implications for policymakers and investors.",
  },
  {
    icon: "Network",
    title: "Network Statistics & Model Comparisons",
    description:
      "Compares PyPSA-generated energy data with external datasets (EMBER, EIA) to validate energy modeling approaches.",
  },
  {
    icon: "MousePointerClick",
    title: "CO₂ Emissions",
    description:
      "Compares current emissions (2021) with net-zero targets for 2050, showcasing the impact of different energy policies.",
  },
  {
    icon: "Newspaper",
    title: "Total System Costs",
    description:
      "The cost of transitioning to net-zero, including a breakdown of investment in power generation, storage, and grid expansion.",
  },
];

export const DataSection = () => {
  return (
    <section
      id="datasection"
      className="container w-full py-16 sm:py-20 lg:py-48 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows gap-4"
    >
      <h3 className=" mb-0 col-span-1 md:col-span-2 lg:col-span-4 row-span-1 dark:text-secondary text-destructive">
        insights
      </h3>
      <h2 className="text-5xl md:text-6xl lg:text-6xl font-bold mb-16 text-card-foreground col-span-1 md:col-span-2 lg:col-span-4 row-span-1">
        Featured Data
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
