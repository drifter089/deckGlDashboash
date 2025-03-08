import React, { useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Link } from "next-transition-router";
import { usePathname } from "next/navigation";
import { navigationMenuTriggerStyle } from "../ui/navigation-menu";
import { AlignJustify, X } from "lucide-react";
gsap.registerPlugin(useGSAP);

const Menu = () => {
  const menuContainer = React.useRef(null);

  const tl = React.useRef(gsap.timeline({ paused: true }));

  useGSAP(() => {
    const menuElement = menuContainer.current;
    if (!menuElement) return;

    tl.current.fromTo(
      menuElement,
      {
        height: "0",
        opacity: 0,
        display: "none",
      },
      {
        height: "100vh",
        opacity: 1,
        duration: 0.7,
        ease: "power2",
        display: "flex",
      }
    );

    // Add display: none when animation reverses
    tl.current.eventCallback("onReverseComplete", () => {
      gsap.set(menuElement, { display: "none" });
    });
  }, []);

  const pathUrl = usePathname(); // Adding underscore to indicate it's intentionally unused for now

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (pathUrl !== href) {
      tl.current.reverse();
    } else {
      e.preventDefault();
      tl.current.reverse();
    }
  };

  return (
    <>
      <div
        onClick={() => {
          tl.current.play();
        }}
        className={`${navigationMenuTriggerStyle()} cursor-pointer hover:text-accent lg:hidden`}
      >
        <AlignJustify />
      </div>
      <div
        className="absolute left-0 top-0 z-10 hidden h-0 w-screen flex-col items-center justify-center gap-4 bg-card font-mono text-3xl opacity-0"
        ref={menuContainer}
      >
        <X
          onClick={() => {
            tl.current.reverse();
          }}
          className="absolute top-8 right-8 scale-125 cursor-pointer"
        />
        {[
          { href: "/", text: "About" },
          { href: "/network", text: "Now" },
          { href: "/landingglobe", text: "2050" },
          { href: "/scenarios", text: "Scenarios" },
          { href: "/learnmore", text: "Learn more" },
        ].map(({ href, text }) => (
          <Link
            key={href}
            href={href}
            onClick={(e) => handleLinkClick(e, href)}
            className={` ${
              pathUrl === href ? "text-hover" : "hover:text-hover"
            }`}
          >
            {text}
          </Link>
        ))}
      </div>
    </>
  );
};

export default Menu;