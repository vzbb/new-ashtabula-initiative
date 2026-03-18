import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions | Permit Whisperer",
  description: "Find answers to common questions about permits in Ashtabula. Learn about zoning permits, building permits, fees, inspections, and the application process.",
  keywords: ["permit FAQ", "Ashtabula permit questions", "do I need a permit", "permit process", "zoning questions"],
};

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqCategories = [
  {
    category: "General Process",
    questions: [
      {
        q: "Do I need a permit for my project?",
        a: "It depends on the type, size, and location of your project. Use our Permit Wizard to find out exactly which permits you need based on your specific situation. Generally, projects like large sheds (over 200 sq ft), decks over 30 inches high, pools, fences over 6 feet, and any additions require permits."
      },
      {
        q: "What's the difference between zoning and building permits?",
        a: "Zoning permits (from the City) ensure your project complies with land use regulations like setbacks, height limits, and property line requirements. Building permits (from the County) ensure your project meets safety and construction codes. Many projects require both."
      },
      {
        q: "How long does the permit process take?",
        a: "City zoning permits typically take up to 1 week. County building permits can take up to 30 days, especially if plan review is required. Projects in the Historic District require an additional 14 days for HARB review. Starting early is always recommended."
      },
      {
        q: "Can I apply online?",
        a: "The County uses CitizenServe for online permit applications. The City of Ashtabula currently requires in-person submission for most permits. Check our Contact page for current office hours and submission methods."
      }
    ]
  },
  {
    category: "City Zoning Permits",
    questions: [
      {
        q: "Do I need a permit for a shed?",
        a: "Sheds over 200 square feet or taller than 10 feet require a City Zoning Permit. Sheds 200 sq ft or smaller and under 10 feet tall typically do not require a city permit, but may still need a County permit if they have electrical."
      },
      {
        q: "Do I need a permit for a fence?",
        a: "Fences over 6 feet tall or located in the front yard require a City Zoning Permit. Fences 6 feet or shorter in side or rear yards typically do not require a permit. Corner lots have special front yard requirements on both street sides."
      },
      {
        q: "What is the Historic District?",
        a: "The Historic District is a designated area in Ashtabula with special review requirements for exterior changes to properties. If your property is in this district, you'll need Historic District Review approval in addition to other permits. Contact the PCD office to confirm if your property is included."
      },
      {
        q: "How much do City permits cost?",
        a: "City zoning permits are generally 1% of the project value, with minimum fees ranging from $50 for fences to $200 for pools. Use our Fee Calculator for specific estimates."
      }
    ]
  },
  {
    category: "County Building Permits",
    questions: [
      {
        q: "Do I need a County permit for interior work?",
        a: "Yes, interior remodeling, basement finishing, and kitchen/bathroom renovations require a County Residential Alteration Permit. This ensures electrical, plumbing, and structural work meets code requirements."
      },
      {
        q: "What about electrical or plumbing work?",
        a: "All electrical, plumbing, and HVAC work requires separate trade permits from the County. These have flat fees: Electrical (~$75), Plumbing (~$50), HVAC (~$100). Even if you're doing the work yourself, permits are required."
      },
      {
        q: "How do I schedule an inspection?",
        a: "Contact the County Building Department at (440) 576-3737 to schedule inspections. Required inspections vary by project but typically include foundation, framing, rough-in (electrical/plumbing), and final inspection."
      },
      {
        q: "Can I do my own electrical work?",
        a: "Homeowners can perform electrical work on their own primary residence with a permit. However, the work must meet all code requirements and pass inspection. For rentals or commercial properties, a licensed electrician is required."
      }
    ]
  },
  {
    category: "Fees & Payments",
    questions: [
      {
        q: "What payment methods are accepted?",
        a: "Both City and County offices accept cash, check, and money order. The County's CitizenServe portal accepts online payments for applicable permits. Credit cards may be accepted with a processing fee - call ahead to confirm."
      },
      {
        q: "Are permit fees refundable?",
        a: "Permit fees are generally not refundable once the application is processed. If your project changes significantly, you may be able to amend your permit rather than apply for a new one. Contact the relevant office for specific situations."
      },
      {
        q: "Can I estimate my own fees?",
        a: "Yes! Use our Fee Calculator to get an estimate based on your project type and value. Keep in mind these are estimates - final fees may vary based on specific project details and additional requirements."
      }
    ]
  },
  {
    category: "Inspections",
    questions: [
      {
        q: "What happens if I start work without a permit?",
        a: "Starting work without required permits can result in stop-work orders, fines, and having to remove or redo work. It's always better to get permits first. If work has already started, contact the offices immediately to discuss your options."
      },
      {
        q: "How many inspections will I need?",
        a: "The number of inspections varies by project. A simple shed might only need a final inspection, while a home addition could require 5+ inspections (foundation, framing, electrical rough-in, plumbing rough-in, insulation, and final)."
      },
      {
        q: "Do I need to be present for inspections?",
        a: "Yes, either you or your contractor should be present to provide access and answer questions. Make sure the work area is accessible and safe for the inspector."
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <div className="container py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
        <p className="text-muted-foreground mt-2">
          Find answers to common permitting questions
        </p>
      </div>

      <div className="space-y-8">
        {faqCategories.map((category) => (
          <Card key={category.category}>
            <CardHeader>
              <CardTitle>{category.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((item, index) => (
                  <AccordionItem key={index} value={`${category.category}-${index}`}>
                    <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{item.a}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Still have questions?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Contact the appropriate office directly for specific questions about your project.
          </p>
          <a 
            href="/contact" 
            className="text-primary hover:underline mt-2 inline-block"
          >
            View Contact Information →
          </a>
        </CardContent>
      </Card>
    </div>
  );
}