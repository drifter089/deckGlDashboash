import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CountryProvider } from "@/components/country-context";
import { NavigationMenuDemo } from "@/components/TopNavBar/TopNavBar";
import { VisualizationProvider } from "@/components/visualization-context";
import { NetworkViewProvider } from "@/components/network-view-context";
import { TransitionProvider } from "@/components/TransitionProvider";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Space_Grotesk, Wix_Madefor_Display } from "next/font/google";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const wixDisplay = Wix_Madefor_Display({
  variable: "--font-wix-display",
  subsets: ["latin"],
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "PyPSA-Earth - Python for Power System Analysis",
  description:
    "Created by OET, this is a web-based tool for power system analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${spaceGrotesk.variable} ${wixDisplay.variable} antialiased relative min-h-screen no-scrollbar max-w-screen overflow-x-clip font-wix-display`}
      >
        <TransitionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <CountryProvider>
              <NavigationMenuDemo />
              <VisualizationProvider>
                <NetworkViewProvider>{children}</NetworkViewProvider>
              </VisualizationProvider>
            </CountryProvider>
          </ThemeProvider>
        </TransitionProvider>
      </body>
      <GoogleAnalytics gaId="G-F4Y26SDXLW" />
    </html>
  );
}
