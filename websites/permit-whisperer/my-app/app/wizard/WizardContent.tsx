"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Building2, 
  Home,
  AlertCircle,
  FileText,
  Clock,
  DollarSign,
  Download,
  RotateCcw,
  Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  projectTypes, 
  wizardQuestions, 
  determinePermits,
  ProjectCategory,
  ProjectType
} from "@/lib/wizard-logic";

const iconMap: Record<ProjectCategory, React.ReactNode> = {
  shed: <Building2 className="h-6 w-6" />,
  deck: <Home className="h-6 w-6" />,
  pool: <div className="h-6 w-6 flex items-center justify-center">🏊</div>,
  fence: <div className="h-6 w-6 flex items-center justify-center">🚧</div>,
  addition: <Home className="h-6 w-6" />,
  interior: <div className="h-6 w-6 flex items-center justify-center">🎨</div>,
  trade: <div className="h-6 w-6 flex items-center justify-center">⚡</div>,
  demolition: <div className="h-6 w-6 flex items-center justify-center">🗑️</div>,
};

export function WizardContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<ProjectCategory | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [result, setResult] = useState<ReturnType<typeof determinePermits> | null>(null);

  useEffect(() => {
    const type = searchParams.get("type") as ProjectCategory;
    if (type && projectTypes.find(p => p.id === type)) {
      setSelectedType(type);
      setStep(2);
    }
  }, [searchParams]);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleTypeSelect = (type: ProjectCategory) => {
    setSelectedType(type);
    setStep(2);
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (step === 2 && selectedType) {
      const permitResult = determinePermits(selectedType, answers);
      setResult(permitResult);
    }
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleRestart = () => {
    setStep(1);
    setSelectedType(null);
    setAnswers({});
    setResult(null);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">What are you building?</h2>
        <p className="text-muted-foreground mt-2">
          Select your project type to get started
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {projectTypes.map((project) => (
          <Card
            key={project.id}
            className={`cursor-pointer transition-all hover:border-primary ${
              selectedType === project.id ? "border-primary ring-2 ring-primary/20" : ""
            }`}
            onClick={() => handleTypeSelect(project.id)}
          >
            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                {iconMap[project.id]}
              </div>
              <h3 className="font-semibold">{project.name}</h3>
              <p className="text-xs text-muted-foreground">{project.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => {
    if (!selectedType) return null;
    const questions = wizardQuestions[selectedType];
    const project = projectTypes.find(p => p.id === selectedType);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <span className="text-sm text-muted-foreground">
            Project: {project?.name}
          </span>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold">Project Details</h2>
          <p className="text-muted-foreground mt-2">
            Answer a few questions about your {project?.name.toLowerCase()}
          </p>
        </div>

        <div className="space-y-6 max-w-xl mx-auto">
          {questions.map((q) => (
            <div key={q.id} className="space-y-3">
              <Label htmlFor={q.id} className="text-base font-medium">
                {q.question}
              </Label>
              {q.helpText && (
                <p className="text-sm text-muted-foreground">{q.helpText}</p>
              )}

              {q.type === "number" && (
                <Input
                  id={q.id}
                  type="number"
                  placeholder={q.placeholder}
                  value={answers[q.id] || ""}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  className="h-12"
                />
              )}

              {q.type === "boolean" && (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <span>Yes</span>
                  <Switch
                    checked={answers[q.id] || false}
                    onCheckedChange={(checked) => handleAnswerChange(q.id, checked)}
                  />
                </div>
              )}

              {q.type === "select" && q.options && (
                <div className="grid grid-cols-1 gap-2">
                  {q.options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleAnswerChange(q.id, option.value)}
                      className={`p-4 text-left border rounded-lg transition-colors ${
                        answers[q.id] === option.value
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}

              {q.type === "radio" && q.options && (
                <div className="grid grid-cols-1 gap-2">
                  {q.options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleAnswerChange(q.id, option.value)}
                      className={`p-4 text-left border rounded-lg transition-colors ${
                        answers[q.id] === option.value
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleNext}>
            Get Results
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    if (!result) return null;

    return (
      <div className="space-y-6 print-results">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-1" /> Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleRestart}>
              <RotateCcw className="h-4 w-4 mr-1" /> Start Over
            </Button>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold">Your Permit Requirements</h2>
          <p className="text-muted-foreground mt-2">
            Based on your project details, here&apos;s what you need
          </p>
        </div>

        {/* Workflow Timeline */}
        <div className="bg-muted/50 p-6 rounded-lg">
          <h3 className="font-semibold mb-4 text-center">Two-Stage Workflow</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className={`p-4 rounded-lg border-2 flex-1 max-w-xs ${
              result.cityPermit.required 
                ? "border-blue-500 bg-blue-50" 
                : "border-muted bg-muted/30 opacity-50"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">City of Ashtabula</span>
              </div>
              {result.cityPermit.required ? (
                <>
                  <Badge className="mb-2 bg-green-100 text-green-800 hover:bg-green-100">Required</Badge>
                  <p className="text-sm">{result.cityPermit.type}</p>
                </>
              ) : (
                <Badge variant="secondary">Not Required</Badge>
              )}
            </div>

            <ChevronRight className="hidden md:block h-6 w-6 text-muted-foreground" />
            <div className="md:hidden h-6 w-6 flex justify-center">
              <div className="h-full w-0.5 bg-muted-foreground" />
            </div>

            <div className={`p-4 rounded-lg border-2 flex-1 max-w-xs ${
              result.countyPermit.required 
                ? "border-green-500 bg-green-50" 
                : "border-muted bg-muted/30 opacity-50"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Home className="h-5 w-5 text-green-600" />
                <span className="font-semibold">Ashtabula County</span>
              </div>
              {result.countyPermit.required ? (
                <>
                  <Badge className="mb-2 bg-green-100 text-green-800 hover:bg-green-100">Required</Badge>
                  <p className="text-sm">{result.countyPermit.type}</p>
                </>
              ) : (
                <Badge variant="secondary">Not Required</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.cityPermit.required && (
            <Card className="border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  City Permit Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Permit Type</p>
                  <p className="text-sm text-muted-foreground">{result.cityPermit.type}</p>
                </div>
                {result.cityPermit.fee && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Estimated Fee: <strong>{result.cityPermit.fee}</strong></span>
                  </div>
                )}
                {result.cityPermit.timeline && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Timeline: {result.cityPermit.timeline}</span>
                  </div>
                )}
                {result.cityPermit.explanation && (
                  <div className="flex items-start gap-2 bg-blue-50 p-3 rounded">
                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                    <p className="text-sm">{result.cityPermit.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {result.countyPermit.required && (
            <Card className="border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Home className="h-5 w-5 text-green-600" />
                  County Permit Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Permit Type</p>
                  <p className="text-sm text-muted-foreground">{result.countyPermit.type}</p>
                </div>
                {result.countyPermit.fee && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Estimated Fee: <strong>{result.countyPermit.fee}</strong></span>
                  </div>
                )}
                {result.countyPermit.timeline && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Timeline: {result.countyPermit.timeline}</span>
                  </div>
                )}
                {result.countyPermit.explanation && (
                  <div className="flex items-start gap-2 bg-green-50 p-3 rounded">
                    <AlertCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-sm">{result.countyPermit.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Special Requirements */}
        {result.specialRequirements.length > 0 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                Special Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.specialRequirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-600">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Documents Checklist */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Required Documents
            </CardTitle>
            <CardDescription>
              Gather these documents before applying
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.documents.map((doc, i) => (
                <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="mt-0.5">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                    <Badge variant={doc.jurisdiction === "city" ? "default" : "secondary"} className="mt-2">
                      {doc.jurisdiction === "city" ? "City" : "County"}
                    </Badge>
                  </div>
                  {doc.downloadUrl && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={doc.downloadUrl}>
                        <Download className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild>
            <Link href="/contact">
              Contact Offices
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/documents">
              View All Documents
            </Link>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Step {step} of {totalSteps}</span>
          <span>{step === 1 ? "Select Project" : step === 2 ? "Project Details" : "Results"}</span>
        </div>
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
}
