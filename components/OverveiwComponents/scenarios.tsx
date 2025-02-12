import DiscordIcon from "@/components/icons/discord-icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image";

export const ScenariosSection = () => {
  return (
    <section id="scenarios" className="mb-28">
      <div className="container">
        <Card className="bg-background border-none shadow-none text-center grid grid-cols-1 items-center justify-center w-full px-8">
          <CardHeader>
            <CardTitle className="text-4xl md:text-5xl font-bold flex flex-col items-center">
              Scenarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Carousel className="w-full max-w-xs">
              <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <a href="/scenarios">
                      <Card>
                        <CardContent className="grid grid-cols-4 gap-4 p-6">
                          <div className="col-span-2 font-bold text-xl">
                            US
                          </div>
                          <div className="col-span-2 font-bold text-xl">
                            196 Billion
                          </div>
                          <Image
                            src="/images/US_example.png"
                            alt="US system cost chart"
                            width={434}
                            height={502}
                            className="col-span-4"
                          />
                          <div style={{ borderRadius: '40px', overflow: 'hidden' }}>
                            <Image src="/images/marthasnoopy_resize.png"
                              alt="Author profile image"
                              width={274}
                              height={274}
                              className="col-span-2"/>
                          </div>
                          <div className="col-span-2 place-content-center">
                            Snoopy
                          </div>
                        </CardContent>
                      </Card>
                      </a>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
          <CardFooter>

          </CardFooter>
        </Card>
      </div>
    </section>
  );
};
