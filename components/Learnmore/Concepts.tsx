import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


interface ServiceProps {
  title: string;
  description: string;
}
const serviceList: ServiceProps[] = [
  {
    title: "Power System",
    description: "A network of electrical components used to generate, transmit and distribute electricity satisfying the electricity demand at each time moment. It includes power plants, substations, transmission lines, and distribution networks.",
  },
  {
    title: "Installed Capacity",
    description: "The maximum power output a power installation or a power system can produce.",
  },
  {
    title: "Generation Mix",
    description: "The combination of different energy sources (like coal, gas, solar, wind, etc.) used to cover electricity demand within a power system. It reflects the diversity and sustainability of energy sources in power generation.",
  },
  {
    title: "Nominal Capacity",
    description: "The rated power output of a power plant or unit under standard operating conditions. It represents the ideal or design capacity, though actual output can vary due to operational factors.",
  },
  {
    title: "Power System Model",
    description: "A detailed representation of a power system used for analyzing system behavior, performance, and stability under different conditions. It provides empiric evidence needed to support decision making for planning, operation, and control of power grids.",
  },
  {
    title: "Optimal Capacity",
    description: "The most efficient and cost-effective combination of power infrastructure instances needed to meet the expected electricity demand. The optimal capacity distribution is calculated as a result of power system optimization runs balancing factors like cost of technologies, available renewable potential and future demand projections.",
  },
  {
    title: "Validation",
    description: "The process of confirming that a power system model or simulation accurately represents real-world performance. It ensures that the model's predictions align with observed data or operational outcomes.",
  },
];

export const ConceptsSection = () => {
  return (
    <section id="concepts" className="container py-12 sm:py-24">
      <h2 className="text-3xl md:text-4xl lg:text-5xl text-center font-bold mb-4 text-card-foreground">
        Concepts
      </h2>
      <h3 className="md:w-2/3 mx-auto text-xl text-center text-muted-foreground mb-8">
        Learn about the key terminology used in energy planning and analysis.
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full lg:w-[60%] mx-auto">
        {serviceList.map(({ title, description }) => (
          <Card key={title} className="bg-card h-full relative">
            <CardHeader>
              <CardTitle className="lg:text-xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
};