import type { Metadata } from "next";
import { CalculatorContent } from "./CalculatorContent";

export const metadata: Metadata = {
  title: "Fee Calculator - Estimate Permit Costs | Permit Whisperer",
  description: "Calculate estimated permit fees for your project in Ashtabula. Get instant estimates for City zoning permits and County building permits based on project value and size.",
  keywords: ["permit fees", "Ashtabula permit cost", "zoning permit fee", "building permit fee", "fee calculator"],
};

export default function CalculatorPage() {
  return <CalculatorContent />;
}
