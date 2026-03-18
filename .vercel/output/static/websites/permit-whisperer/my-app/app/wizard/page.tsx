import type { Metadata } from "next";
import { Suspense } from "react";
import { WizardContent } from "./WizardContent";

export const metadata: Metadata = {
  title: "Permit Wizard - Find What Permits You Need | Permit Whisperer",
  description: "Answer a few simple questions about your project and get a personalized guide to the permits you need from the City of Ashtabula and Ashtabula County.",
  keywords: ["Ashtabula permits", "permit wizard", "zoning permit", "building permit", "do I need a permit"],
};

export default function WizardPage() {
  return (
    <Suspense fallback={
      <div className="container py-8 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading wizard...</p>
          </div>
        </div>
      </div>
    }>
      <WizardContent />
    </Suspense>
  );
}
