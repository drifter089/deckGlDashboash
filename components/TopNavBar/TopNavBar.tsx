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

export function NavigationMenuDemo() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  return (
    <NavigationMenu className="fixed top-0 left-0 z-50 w-full bg-transparent max-w-[100vw] font-mono">
      <Menu />
      <NavigationMenuList className="max-w-[100vw] w-full p-4 flex justify-center gap-2 flex-wrap">
        <NavigationMenuItem className="hidden lg:block">
          <Link href="/">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              About
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden lg:block">
          <Link href="/network">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Now
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden lg:block">
          <Link href="/landingglobe">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              2050
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden lg:block">
          <Link href="/scenarios">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Scenarios
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden lg:block">
          <Link href="/learnmore">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Learn more
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <div
            className={`${navigationMenuTriggerStyle()} flex items-center gap-1`}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Label htmlFor="theme">
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

