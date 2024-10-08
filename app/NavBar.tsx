"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const NavBar = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed left-0 top-2/3 transform -translate-y-1/2 z-20 max-w-screen/4 bg-transparent p-3">
      <div className="flex flex-col flex-wrap justify-end gap-1">
        <div className="text-3xl align-text-top-middle">Navigation</div>
        <Button variant="default" onClick={() => router.push("/")}>
          Home
        </Button>
        <Button variant="default" onClick={() => router.push("/network")}>
          Network
        </Button>
        <Button variant="default" onClick={() => router.push("/sidebyside")}>
          Polygon
        </Button>
        <div className="flex items-center space-x-2">
          <Switch
            id="theme"
            checked={theme === "light"}
            onCheckedChange={() => {
              console.log("efwfwe");
              if (theme === "dark") {
                setTheme("light");
              } else {
                setTheme("dark");
              }
            }}
          />
          <Label htmlFor="theme">
            {theme === "light" ? <Moon /> : <Sun />}
          </Label>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
