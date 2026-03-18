"use client";

import { useState } from "react";
import { Calculator, DollarSign, Info, Ruler, Home, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { projectTypes, ProjectCategory } from "@/lib/wizard-logic";
import { calculateFees, getFeeRange } from "@/lib/fee-data";

export function CalculatorContent() {
  const [selectedType, setSelectedType] = useState<ProjectCategory | null>(null);
  const [projectValue, setProjectValue] = useState<string>("");
  const [squareFootage, setSquareFootage] = useState<string>("");
  const [historicDistrict, setHistoricDistrict] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof calculateFees> | null>(null);

  const handleCalculate = () => {
    if (!selectedType) return;
    const value = parseFloat(projectValue) || 0;
    const sqft = parseFloat(squareFootage) || 0;
    const fees = calculateFees(selectedType, {
      projectValue: value,
      squareFootage: sqft,
      historicDistrict,
    });
    setResult(fees);
  };

  const feeRange = selectedType ? getFeeRange(selectedType) : null;

  return (
    <div className="container py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Calculator className="h-8 w-8" />
          Fee Calculator
        </h1>
        <p className="text-muted-foreground mt-2">
          Estimate your permit fees based on project type and value
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Select your project type and enter project details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Project Type</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {projectTypes.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => {
                    setSelectedType(project.id);
                    setResult(null);
                  }}
                  className={`p-3 text-left border rounded-lg transition-colors text-sm ${
                    selectedType === project.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted"
                  }`}
                >
                  {project.name}
                </button>
              ))}
            </div>
            {feeRange && (
              <p className="text-sm text-muted-foreground">
                Typical range: <span className="font-medium text-foreground">{feeRange.typical}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="projectValue">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Estimated Project Value ($)
              </Label>
              <Input
                id="projectValue"
                type="number"
                placeholder="e.g., 25000"
                value={projectValue}
                onChange={(e) => {
                  setProjectValue(e.target.value);
                  setResult(null);
                }}
                className="h-12"
              />
              <p className="text-xs text-muted-foreground">
                Include materials, labor, and all construction costs
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="squareFootage">
                <Ruler className="h-4 w-4 inline mr-1" />
                Square Footage (optional)
              </Label>
              <Input
                id="squareFootage"
                type="number"
                placeholder="e.g., 400"
                value={squareFootage}
                onChange={(e) => {
                  setSquareFootage(e.target.value);
                  setResult(null);
                }}
                className="h-12"
              />
              <p className="text-xs text-muted-foreground">
                Required for accurate County building permit calculation
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <Home className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="historicDistrict" className="cursor-pointer">
                  Historic District Property
                </Label>
                <p className="text-xs text-muted-foreground">
                  Additional $100 Historic Review Certificate required
                </p>
              </div>
            </div>
            <Switch
              id="historicDistrict"
              checked={historicDistrict}
              onCheckedChange={(checked) => {
                setHistoricDistrict(checked);
                setResult(null);
              }}
            />
          </div>

          <Button 
            onClick={handleCalculate} 
            disabled={!selectedType || !projectValue}
            className="w-full"
            size="lg"
          >
            Calculate Fees
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Fee Estimate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {result.breakdown.length > 0 ? (
              <>
                <div className="space-y-3">
                  {result.breakdown.map((line, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">{line}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Total Estimated Fees</span>
                  <span className="text-3xl font-bold text-primary">${result.total.toLocaleString()}</span>
                </div>

                {result.notes.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-2">Calculation Notes:</p>
                    <ul className="space-y-1">
                      {result.notes.map((note, i) => (
                        <li key={i} className="text-sm text-blue-800 flex items-start gap-2">
                          <span>•</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
                  <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium">Important Notes:</p>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      <li>Fees are estimates only based on published fee schedules</li>
                      <li>Additional fees may apply for plan review, inspections, or special circumstances</li>
                      <li>Trade permits (electrical, plumbing, HVAC) are separate and not included</li>
                      <li>Contact the relevant office for exact fee amounts</li>
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Badge variant="secondary">No Permit Required</Badge>
                <p className="mt-4 text-muted-foreground">
                  Based on your project type and value, no permits are typically required.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Badge className="bg-blue-600">City</Badge>
              City Fee Formula
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              <strong>Zoning Permit:</strong> 1% of project value<br />
              <strong>Minimum:</strong> $50 (residential)<br />
              <strong>Maximum:</strong> $2,500 cap (residential)
            </p>
            <Separator />
            <p className="text-sm text-muted-foreground">
              <strong>Flat Fees:</strong><br />
              • Fence Permit: $50<br />
              • Pool Permit: $150 + $50 inspection<br />
              • Demolition: $100 + $25/structure
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Badge className="bg-green-600 text-white">County</Badge>
              County Fee Formula
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              <strong>Building Permits:</strong> Base fee + per sq ft<br />
              • New home: $200 + $0.25/sq ft<br />
              • Addition: $150 + $0.20/sq ft<br />
              • Deck/Shed: $100/$150 + $0.15/sq ft<br />
              • Pool/Demo: $200/$100 flat
            </p>
            <Separator />
            <p className="text-sm text-muted-foreground">
              <strong>Trade Permits:</strong><br />
              • Electrical: $75 + $10/circuit<br />
              • Plumbing: $75 + $15/fixture<br />
              • HVAC: $100 + $25/ton
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            Additional Fees That May Apply
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground mb-1">City of Ashtabula</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Plan review (commercial): 25% of permit fee</li>
                <li>Reinspection: $50 per visit</li>
                <li>Historic Review Certificate: $100</li>
                <li>Permit extension: $50</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Ashtabula County</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Plan review (projects &gt;$50K): 20% of fee</li>
                <li>Reinspection: $75 per failed inspection</li>
                <li>Same-day rush processing: $100</li>
                <li>Permit extension: $75</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
