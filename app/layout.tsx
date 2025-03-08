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

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "PowerNetZero",
  description:
    "Created by OET, this website showcases the net-zero scenarios we've calculated for 2050",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen no-scrollbar max-w-screen overflow-x-clip font-sans`}
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

