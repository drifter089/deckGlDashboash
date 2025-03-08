import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const ExplainNetworkSection = () => {
  return (
    <section id="network" className="container py-12 sm:py-24">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Electric Network Visualization</CardTitle>
          <CardDescription className="text-xl text-muted-foreground mb-4">
            Explore the complexity of the electric grid network through our interactive map visualization.
          </CardDescription>
          <div className="flex flex-col md:flex-row gap-6">
            <img src="/path-to-your-image.jpg" alt="Electric Grid Map Visualization" className="w-full md:w-1/3 rounded-lg" />
            <div className="w-full md:w-2/3">
              <ol className="list-decimal list-inside space-y-2">
                <li>Interactive Map: Pan and zoom to explore different regions of the electric grid.</li>
                <li>Color-coded Lines: Visualize transmission capacities with intuitive color schemes.</li>
                <li>Node Information: Click on grid nodes to view detailed statistics.</li>
              </ol>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg mt-4">
            Our electric grid visualization provides a comprehensive view of the power transmission network, enabling users to understand the complexities of energy distribution and identify areas for optimization and improvement.
          </p>
        </CardContent>
      </Card>
    </section>
  );
};