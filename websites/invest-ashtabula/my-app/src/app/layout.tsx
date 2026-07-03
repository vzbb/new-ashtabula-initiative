import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "Invest Ashtabula | Economic Development Portal",
  description: "Discover industrial sites, incentives, and economic development opportunities in Ashtabula County, Ohio.",
  keywords: ["Ashtabula", "economic development", "industrial sites", "Ohio", "investment", "incentives"],
  openGraph: {
    title: "Invest Ashtabula",
    description: "Your gateway to economic development opportunities in Ashtabula County",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
