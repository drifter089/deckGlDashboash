import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface FeaturesProps {
  icon: string;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: "TabletSmartphone",
    title: "Accessible Anywhere",
    description:
      "Our platform is designed to be mobile-friendly, allowing you to explore energy models and scenarios on any device, anytime.",
  },
  {
    icon: "BadgeCheck",
    title: "Reliable Insights",
    description:
      "Built on validated data and reproducible results, ensuring accuracy and trust in energy planning and analysis.",
  },
  {
    icon: "Goal",
    title: "Targeted Scenarios",
    description:
      "Dive into tailored energy scenarios, from today’s grid operations to net-zero 2050 projections, for informed decision-making.",
  },
  {
    icon: "PictureInPicture",
    title: "Interactive Visuals",
    description:
      "Gain clarity with strong visualizations of power systems, including energy flows and infrastructure, to better understand complex data.",
  },
  {
    icon: "MousePointerClick",
    title: "Actionable Guidance",
    description:
      "Explore clear pathways and next steps for energy planning, with tools and insights to guide decision-making.",
  },
  {
    icon: "Newspaper",
    title: "Comprehensive Details",
    description:
      "Access detailed scenario definitions, assumptions, and technical documentation to fully understand power system dynamics.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="container py-16 sm:py-20 lg:py-32">
      <h2 className="text-3xl md:text-4xl lg:text-5xl text-center font-bold mb-4 text-card-foreground">
        What This Dashboard Offers
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureList.map(({ icon, title, description }) => (
          <div key={title}>
            <Card className="h-full bg-background border-0 shadow-none">
              <CardHeader className="flex justify-center items-center">
                <div className="bg-oet-red p-2 rounded-full ring-8 ring-ring/10 mb-4">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={24}
                    color="hsl(var(--oet-red))"
                    className="text-oet-red"
                  />
                </div>

                <CardTitle className="lg:text-xl">{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground text-center">
                {description}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};
