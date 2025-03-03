import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const ExplainGlobeSection = () => {
  return (
    <section id="globe" className="container py-12 sm:py-24">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Globe Visualization</CardTitle>
          <CardDescription className="text-xl text-muted-foreground mb-4">
            Understand the global journey to net zero through our interactive 3D globe.
          </CardDescription>
          <div className="flex flex-col md:flex-row gap-6">
            <img src="/path-to-your-image.jpg" alt="Globe Visualization Screenshot" className="w-full md:w-1/3 rounded-lg" />
            <div className="w-full md:w-2/3">
              <ol className="list-decimal list-inside space-y-2">
                <li>Interactive 3D Globe: Rotate and zoom to explore different regions.</li>
                <li>Data Layers: Toggle between various energy metrics and indicators.</li>
                <li>Country Information: Click on a country to view detailed energy statistics.</li>
              </ol>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg mt-4">
            Our globe visualization provides a comprehensive view of energy data across different countries and regions, enabling users to gain insights into global energy trends and patterns.
          </p>
        </CardContent>
      </Card>
    </section>
  );
};