import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Permit Whisperer - Ashtabula Permitting Guide",
    template: "%s | Permit Whisperer"
  },
  description: "Find out which permits you need for your project in Ashtabula. Interactive wizard for City Zoning and County Building permits.",
  keywords: ["Ashtabula permits", "permit guide", "zoning permit", "building permit", "Ohio permits"],
  authors: [{ name: "Permit Whisperer" }],
  metadataBase: new URL("https://permit-whisperer.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Permit Whisperer",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}