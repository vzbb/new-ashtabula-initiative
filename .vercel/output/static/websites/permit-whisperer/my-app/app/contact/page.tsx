import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - City & County Offices | Permit Whisperer",
  description: "Contact information for the City of Ashtabula Planning & Community Development and Ashtabula County Building Department. Phone numbers, addresses, and office hours.",
  keywords: ["Ashtabula city office", "Ashtabula county office", "permit contact", "zoning office", "building department"],
};

import { MapPin, Phone, Mail, Clock, Globe, Building2, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ContactPage() {
  return (
    <div className="container py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Contact Information</h1>
        <p className="text-muted-foreground mt-2">
          Get in touch with the City and County offices
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* City of Ashtabula */}
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50/50">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle>City of Ashtabula</CardTitle>
                <CardDescription>Planning & Community Development</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-sm text-muted-foreground">
                  4717 Main Avenue<br />
                  Ashtabula, OH 44004
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Phone</p>
                <a 
                  href="tel:4409927112" 
                  className="text-sm text-primary hover:underline"
                >
                  (440) 992-7112
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Email</p>
                <a 
                  href="mailto:PCD@cityofashtabula.com" 
                  className="text-sm text-primary hover:underline"
                >
                  PCD@cityofashtabula.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Hours</p>
                <p className="text-sm text-muted-foreground">
                  Monday - Friday<br />
                  8:30 AM - 4:30 PM
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Website</p>
                <a 
                  href="https://www.cityofashtabula.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  www.cityofashtabula.com
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ashtabula County */}
        <Card className="border-green-200">
          <CardHeader className="bg-green-50/50">
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6 text-green-600" />
              <div>
                <CardTitle>Ashtabula County</CardTitle>
                <CardDescription>Building Department</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-sm text-muted-foreground">
                  25 West Jefferson Street<br />
                  Jefferson, OH 44047
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Phone</p>
                <a 
                  href="tel:4405763737" 
                  className="text-sm text-primary hover:underline"
                >
                  (440) 576-3737
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Hours</p>
                <p className="text-sm text-muted-foreground">
                  Monday - Friday<br />
                  8:00 AM - 4:30 PM
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Online Portal</p>
                <a 
                  href="https://www.citizenserve.com/ashtabula" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  CitizenServe Portal
                </a>
                <p className="text-xs text-muted-foreground mt-1">
                  Apply for permits and track applications online
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Before You Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            To help staff assist you more efficiently, please have the following information ready:
          </p>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            <li>• Property address</li>
            <li>• Type of project (shed, deck, addition, etc.)</li>
            <li>• Approximate size/dimensions</li>
            <li>• Estimated project value</li>
            <li>• Any special circumstances (historic district, waterfront, etc.)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}