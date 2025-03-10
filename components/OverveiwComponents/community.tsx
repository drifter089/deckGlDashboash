"use client";
import DiscordIcon from "@/components/icons/discord-icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { use, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const CommunitySection = () => {
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);
  const line4Ref = useRef(null);
  const line5Ref = useRef(null);
  const line6Ref = useRef(null);

  const parentRef = useRef(null);

  useGSAP(() => {
    const lines = [line1Ref, line2Ref, line3Ref, line4Ref, line5Ref, line6Ref];
    lines.forEach((line, index) => {
      const randomScale = 1 + Math.random() * 0.3; // Random scale between 0.7 and 1.0
      const randomStart = 0.1 + Math.random() * 0.2; // Random start between 0.1 and 0.3

      gsap.fromTo(
        line.current,
        { scaleY: randomStart },
        {
          scaleY: randomScale,
          opacity: 1,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: parentRef.current,
            start: "center 65%",
            end: "center 45%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  return (
    <section
      id="community"
      className="relative w-full px-16 h-screen text-center justify-center items-center content-center flex flex-col gap-4 overflow-hidden"
      ref={parentRef}
    >
      <DiscordIcon />
      <div className="text-5xl md:text-6xl font-sans lg:text-8xl font-bold mb-8 z-20">
        Want to run energy models?
      </div>
      <Button className="w-40 p-4 mx-2 dark:bg-secondary z-20 bg-ring" asChild>
        <Link
          href="https://discord.gg/zxt9QFeF"
          target="_blank"
          className="dark:text-card-foreground text-background"
        >
          Join our Discord
        </Link>
      </Button>
      <div className="absolute top-0 left-0 w-full h-full bg-transparent z-10 animate-[spin_20s_linear_infinite]">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="absolute top-0 left-1/2 w-[1px] h-screen scale-y-0 bg-card-foreground opacity-0"
            style={{
              transform: `translateX(-50%) rotate(${(index * 180) / 6}deg)`,
              transformOrigin: "center center",
            }}
            ref={
              [line1Ref, line2Ref, line3Ref, line4Ref, line5Ref, line6Ref][
                index
              ]
            }
          />
        ))}
      </div>
    </section>
  );
};
