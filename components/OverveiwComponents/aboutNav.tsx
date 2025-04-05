"use client";
import Link from "next/link";
import React from "react";
import { AboutSectionType } from "./AboutSectionContainer";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { use, useRef } from "react";

gsap.registerPlugin(useGSAP);

type AboutNavProps = {
  currentSection: AboutSectionType;
  setCurrentSection: (section: AboutSectionType) => void;
};

export const AboutNav: React.FC<AboutNavProps> = ({
  currentSection,
  setCurrentSection,
}) => {
  return (
    <div className="flex flex-col gap-3 md:text-[1.25rem] text-[1rem] max-w-[25rem] text-foreground w-full">
      <div
        className="cursor-pointer"
        onClick={() => setCurrentSection("vision")}
      >
        <AnimatedNavLink selected={currentSection === "vision"}>
          Vision
        </AnimatedNavLink>
      </div>
      <div
        className="cursor-pointer"
        onClick={() => setCurrentSection("methods")}
      >
        <AnimatedNavLink selected={currentSection === "methods"}>
          Methods
        </AnimatedNavLink>
      </div>
      <div
        className="cursor-pointer"
        onClick={() => setCurrentSection("limitations")}
      >
        <AnimatedNavLink selected={currentSection === "limitations"}>
          Limitations
        </AnimatedNavLink>
      </div>
      <div
        className="cursor-pointer"
        onClick={() => setCurrentSection("next-step")}
      >
        <AnimatedNavLink selected={currentSection === "next-step"}>
          Next steps
        </AnimatedNavLink>
      </div>
    </div>
  );
};

const AnimatedNavLink: React.FC<{
  children: React.ReactNode;
  selected: boolean;
}> = ({ children, selected }) => {
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(lineRef.current, {
      width: selected ? "60%" : "0%",
      duration: 0.2,
      ease: "power1.inOut",
    });
  }, [selected]);

  return (
    <>
      <p
        onMouseEnter={() => {
          if (!selected) {
            gsap.to(lineRef.current, {
              width: "60%",
              duration: 0.2,
              ease: "power1.inOut",
            });
          }
        }}
        onMouseLeave={() => {
          if (!selected) {
            gsap.to(lineRef.current, {
              width: "0%",
              duration: 0.2,
              ease: "power1.inOut",
            });
          }
        }}
      >
        {children}
      </p>
      <div
        className="relative bottom-0 left-0 w-28 h-[2px] bg-destructive dark:bg-secondary"
        ref={lineRef}
      />
    </>
  );
};
