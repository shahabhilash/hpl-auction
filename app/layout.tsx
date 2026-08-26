import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });

export const metadata: Metadata = {
  title: "HPL Auction | Command Center",
  description: "Inter-house sports tournament and auction management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${oswald.variable} font-sans flex h-screen overflow-hidden selection:bg-primary/30 selection:text-primary`}>
        <Sidebar />
        <main className="flex-1 overflow-y-auto flex flex-col bg-background">
          {children}
        </main>
      </body>
    </html>
  );
}
