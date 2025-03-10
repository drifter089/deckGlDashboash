"use client";

import * as React from "react";
import Link from "next/link";
import OET_LOGO_TEXT from "../../public/OET_LOGO_1.svg";
import OET_LOGO from "../../public/OET_LOGO_NO_TEXT.svg";
import { cn } from "@/lib/utils";
// import { Icons } from "@/components/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

import { Moon, Sun } from "lucide-react";

import Menu from "./Menu";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { useTheme } from "next-themes";
import Image from "next/image";
import { usePathname } from "next/navigation";
import GithubIcon from "../icons/github-icon";

export function NavigationMenuDemo() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  return (
    <NavigationMenu className="fixed top-0 left-0 z-50 w-full bg-transparent max-w-[100vw] font-mono">
      {pathname === "/" && (
        <Link
          href="https://openenergytransition.org/index.html"
          target="_blank"
          className="absolute left-4 w-32 h-12 hidden lg:block"
        >
          <Image src="OET_LOGO_1.svg" fill alt="logo" />
        </Link>
      )}
      <div className="absolute right-5 top-5 hidden lg:block ml-auto">
        <Link
          href="https://github.com/open-energy-transition/deckGlDashboard"
          target="_blank"
        >
          <GithubIcon
            className="w-6 h-6 text-foreground scale-150"
            fill="currentColor"
          />
        </Link>
      </div>
      <Menu />
      <NavigationMenuList className="max-w-[100vw] w-full p-4 flex justify-center gap-2 flex-wrap">
        <NavigationMenuItem className="hidden lg:block">
          <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
            About
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden lg:block">
          <NavigationMenuLink
            href="/network"
            className={navigationMenuTriggerStyle()}
          >
            Now
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden lg:block">
          <NavigationMenuLink
            href="/landingglobe"
            className={navigationMenuTriggerStyle()}
          >
            2050
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <div
            className={`${navigationMenuTriggerStyle()} flex items-center gap-1 cursor-pointer`}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Label
              htmlFor="theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="cursor-pointer"
            >
              {theme === "light" ? <Moon /> : <Sun />}
            </Label>
          </div>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuViewport className="right-0 left-auto" />
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

