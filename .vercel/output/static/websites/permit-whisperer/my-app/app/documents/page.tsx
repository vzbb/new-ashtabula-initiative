import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Document Library - Permit Forms & Applications | Permit Whisperer",
  description: "Download permit application forms for the City of Ashtabula and Ashtabula County. Find zoning permits, building permits, and all required documentation.",
  keywords: ["permit forms", "Ashtabula permit application", "zoning permit form", "building permit form", "download forms"],
};

import Link from "next/link";
import { FileText, Download, ExternalLink, Building2, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { allDocuments } from "@/lib/document-data";

export default function DocumentsPage() {
  const cityDocs = allDocuments.filter(d => d.jurisdiction === "city");
  const countyDocs = allDocuments.filter(d => d.jurisdiction === "county");

  return (
    <div className="container py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Document Library</h1>
        <p className="text-muted-foreground mt-2">
          Find and download all the forms you need for your permit applications
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* City Documents */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">City of Ashtabula</h2>
          </div>

          <div className="space-y-3">
            {cityDocs.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{doc.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {doc.whenRequired.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {doc.whenRequired.map((type) => (
                              <Badge key={type} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                        <span>Submit to: {doc.submitLocation}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {doc.downloadUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={doc.downloadUrl} target="_blank">
                              <Download className="h-4 w-4 mr-1" />
                              Download Form
                            </Link>
                          </Button>
                        )}
                        {doc.onlineLink && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={doc.onlineLink} target="_blank">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Online Portal
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* County Documents */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Home className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold">Ashtabula County</h2>
          </div>

          <div className="space-y-3">
            {countyDocs.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-100 rounded-lg shrink-0">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{doc.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {doc.whenRequired.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {doc.whenRequired.map((type) => (
                              <Badge key={type} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                        <span>Submit to: {doc.submitLocation}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {doc.downloadUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={doc.downloadUrl} target="_blank">
                              <Download className="h-4 w-4 mr-1" />
                              Download Form
                            </Link>
                          </Button>
                        )}
                        {doc.onlineLink && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={doc.onlineLink} target="_blank">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Online Portal
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>
            Not sure which forms you need? Use our wizard to find out.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/wizard">Start the Wizard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}