import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NavBar from "../components/NavBar";
import { ThemeProvider } from "@/components/theme-provider";
import { CountryProvider } from "@/components/country-context";
import { NavigationMenuDemo } from "@/components/TopNavBar/TopNavBar";

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
  title: "PyPSA-Earth - Power System Analysis",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen no-scrollbar`}
      >
        <NavigationMenuDemo />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CountryProvider>
            {children}

            <NavBar />
          </CountryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

