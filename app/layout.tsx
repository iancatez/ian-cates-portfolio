import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { NeonTopBar } from "@/components/neon-top-bar";
import { FluidCursor } from "@/components/fluid-cursor";
// import { NeonCursor } from "@/components/neon-cursor"; // Sidelined for now

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ian Cates - Portfolio",
  description: "Portfolio showcasing my projects and experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-background text-foreground`}
      >
        <NeonTopBar />
        <FluidCursor />
        {/* Semi-transparent overlay - sandwiches fluid between solid bg and content */}
        <div 
          className="fixed inset-0 z-[5] pointer-events-none bg-background/90"
          aria-hidden="true"
        />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
