import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Permit Whisperer - Ashtabula Permitting Guide",
  description: "Find out which permits you need for your project in Ashtabula. Interactive wizard for City Zoning and County Building permits. Free fee calculator and document library.",
  keywords: ["Ashtabula permits", "permit guide", "zoning permit", "building permit", "Ashtabula Ohio", "permit requirements"],
};

import Link from "next/link";
import { 
  Warehouse, 
  LayoutGrid, 
  Waves, 
  Fence, 
  Home, 
  Paintbrush, 
  Zap, 
  Trash2,
  ArrowRight,
  Search,
  Calculator,
  FileCheck,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { projectTypes, ProjectCategory } from "@/lib/wizard-logic";

const iconMap: Record<ProjectCategory, React.ReactNode> = {
  shed: <Warehouse className="h-8 w-8" />,
  deck: <LayoutGrid className="h-8 w-8" />,
  pool: <Waves className="h-8 w-8" />,
  fence: <Fence className="h-8 w-8" />,
  addition: <Home className="h-8 w-8" />,
  interior: <Paintbrush className="h-8 w-8" />,
  trade: <Zap className="h-8 w-8" />,
  demolition: <Trash2 className="h-8 w-8" />,
};

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Find Your Permits<br className="hidden sm:inline" />
              <span className="text-primary">Without the Guesswork</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Answer a few simple questions and we&apos;ll tell you exactly which permits 
              you need from the City of Ashtabula and Ashtabula County.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link href="/wizard">
                  <Search className="h-4 w-4" />
                  Find Your Permits
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/calculator">
                  <Calculator className="h-4 w-4" />
                  Calculate Fees
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Category Cards */}
      <section className="py-16 container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">What are you building?</h2>
          <p className="mt-4 text-muted-foreground">
            Select a project type to get started with the wizard
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {projectTypes.map((project) => (
            <Link key={project.id} href={`/wizard?type=${project.id}`}>
              <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {iconMap[project.id]}
                  </div>
                  <div>
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {project.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="mt-4 text-muted-foreground">
              Three simple steps to get your permits sorted
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="relative">
              <CardContent className="p-8 text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div className="mt-4 flex justify-center">
                  <Search className="h-12 w-12 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Answer Questions</h3>
                <p className="mt-2 text-muted-foreground">
                  Tell us about your project with our simple step-by-step wizard
                </p>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardContent className="p-8 text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div className="mt-4 flex justify-center">
                  <FileCheck className="h-12 w-12 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Get Requirements</h3>
                <p className="mt-2 text-muted-foreground">
                  See exactly which permits you need and what documents to prepare
                </p>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardContent className="p-8 text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div className="mt-4 flex justify-center">
                  <Clock className="h-12 w-12 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Apply With Confidence</h3>
                <p className="mt-2 text-muted-foreground">
                  Submit your applications knowing you have everything you need
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Two-Stage Workflow */}
      <section className="py-16 container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">The Two-Stage Process</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Understanding the sequence helps avoid delays. In Ashtabula, 
            most projects require permits from both the City and County in a specific order.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold">City of Ashtabula</h3>
                  <p className="text-sm text-blue-600 font-medium">Planning & Community Development</p>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3" /> Zoning approval
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3" /> Historic review (if applicable)
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3" /> Setback verification
                    </li>
                  </ul>
                  <p className="mt-4 text-sm">
                    <strong>Timeline:</strong> Up to 1 week
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Ashtabula County</h3>
                  <p className="text-sm text-green-600 font-medium">Building Department</p>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3" /> Building code review
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3" /> Structural approval
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3" /> Inspections
                    </li>
                  </ul>
                  <p className="mt-4 text-sm">
                    <strong>Timeline:</strong> Up to 30 days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button asChild size="lg">
            <Link href="/wizard">Start the Wizard</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}