import { useState } from "react";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import { Card } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Loader2, MapPin, AlertTriangle, CheckCircle2, TrendingDown, Building2, ArrowRight, ShieldCheck, Clock, BarChart3, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./lib/utils";

const OPENROUTER_API_KEY = (import.meta.env.VITE_OPENROUTER_API_KEY || "").trim();
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "google/gemini-2.5-flash-lite";
const HTTP_REFERER = typeof window !== "undefined" ? window.location.origin : "https://openrouter.ai";
const APP_TITLE = "ParcelVisor";

const LAND_BANK = {
  shortName: "AC Land Bank",
  fullName: "Ashtabula County Land Reutilization Corporation",
  tagline: "Your County. Your Data. Your Next Move.",
  mission: "Demolish blight, restore safety, and return property to productive use.",
  focus: [
    "Vacant property assessment",
    "Demolition vs. rehabilitation decisions",
    "Land assembly and redevelopment",
    "Community planning support",
  ],
};

const DEMO_FALLBACKS = [
  {
    roofCondition: "Fair",
    windowsCondition: "Poor",
    exteriorCondition: "Fair",
    blightScore: 7,
    estimatedValueImpact: "-$22,000 due to deferred exterior repairs and vacancy risk",
    notes:
      "Visible deferred maintenance and window neglect suggest the parcel should move into rehab-vs-demo review with a field photo follow-up.",
  },
  {
    roofCondition: "Poor",
    windowsCondition: "Poor",
    exteriorCondition: "Poor",
    blightScore: 9,
    estimatedValueImpact: "-$48,000 due to severe exterior deterioration and likely stabilization costs",
    notes:
      "Severe visible deterioration indicates a likely demolition candidate unless adjacent redevelopment value justifies stabilization.",
  },
  {
    roofCondition: "Good",
    windowsCondition: "Fair",
    exteriorCondition: "Fair",
    blightScore: 4,
    estimatedValueImpact: "-$8,000 due to cosmetic exterior updates and window maintenance needs",
    notes:
      "Overall structure appears salvageable. Parcel is a better candidate for rehab planning than immediate demo consideration.",
  },
];

interface PropertyAssessment {
  address: string;
  imageUrl: string;
  roofCondition: string;
  windowsCondition: string;
  exteriorCondition: string;
  blightScore: number;
  estimatedValueImpact: string;
  notes: string;
  status: "pending" | "analyzing" | "completed" | "error";
  error?: string;
}

const responseSchema = {
  type: "object",
  properties: {
    roofCondition: {
      type: "string",
      description: "Condition of the roof: Good, Fair, Poor, or Unknown",
    },
    windowsCondition: {
      type: "string",
      description: "Condition of the windows: Good, Fair, Poor, or Unknown",
    },
    exteriorCondition: {
      type: "string",
      description: "Condition of the exterior walls/siding: Good, Fair, Poor, or Unknown",
    },
    blightScore: {
      type: "number",
      description: "Blight score from 1 to 10. 10 is severely blighted/abandoned, 1 is pristine.",
    },
    estimatedValueImpact: {
      type: "string",
      description: "Estimated impact on property value, e.g., '-$20,000 due to roof damage', or 'Standard market value'",
    },
    notes: {
      type: "string",
      description: "Brief summary of visible issues",
    },
  },
  required: ["roofCondition", "windowsCondition", "exteriorCondition", "blightScore", "estimatedValueImpact", "notes"],
  additionalProperties: false,
};

export default function App() {
  const [addressesInput, setAddressesInput] = useState("123 Main St, Ashtabula, OH\n456 Elm St, Ashtabula, OH");
  const [assessments, setAssessments] = useState<PropertyAssessment[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAnalyze = async () => {
    const addresses = addressesInput
      .split("\n")
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    if (addresses.length === 0) return;

    const initialAssessments: PropertyAssessment[] = addresses.map((address) => ({
      address,
      imageUrl: "",
      roofCondition: "",
      windowsCondition: "",
      exteriorCondition: "",
      blightScore: 0,
      estimatedValueImpact: "",
      notes: "",
      status: "pending",
    }));

    setAssessments(initialAssessments);
    setIsProcessing(true);

    for (let i = 0; i < initialAssessments.length; i++) {
      const assessment = initialAssessments[i];

      setAssessments((prev) =>
        prev.map((a, idx) => (idx === i ? { ...a, status: "analyzing" } : a))
      );

      try {
        if (!OPENROUTER_API_KEY) {
          const fallback = DEMO_FALLBACKS[i % DEMO_FALLBACKS.length];
          setAssessments((prev) =>
            prev.map((a, idx) =>
              idx === i
                ? {
                    ...a,
                    ...fallback,
                    status: "completed",
                  }
                : a
            )
          );
          continue;
        }

        const res = await fetch(`/api/streetview?address=${encodeURIComponent(assessment.address)}`);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to fetch Street View image");
        }
        const { base64, mimeType } = await res.json();

        const response = await fetch(OPENROUTER_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": HTTP_REFERER,
            "X-Title": APP_TITLE,
          },
          body: JSON.stringify({
            model: OPENROUTER_MODEL,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:${mimeType};base64,${base64}`,
                    },
                  },
                  {
                    type: "text",
                    text: `You are an expert property assessor for ${LAND_BANK.fullName}.
Analyze this Street View image of a parcel in Ashtabula County.
Focus on roof, windows, exterior condition, and blight risk.
Use the result to help prioritize demolition, rehab, or deeper review.
Keep the output concise and field-ready.`,
                  },
                ],
              },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "property_assessment",
                strict: true,
                schema: responseSchema,
              },
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`OpenRouter request failed with status ${response.status}`);
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (!text) throw new Error("No response from OpenRouter");

        const parsed = JSON.parse(text);

        setAssessments((prev) =>
          prev.map((a, idx) =>
            idx === i
              ? {
                  ...a,
                  ...parsed,
                  imageUrl: `data:${mimeType};base64,${base64}`,
                  status: "completed",
                }
              : a
          )
        );
      } catch (error: any) {
        console.error("Error analyzing property:", error);
        setAssessments((prev) =>
          prev.map((a, idx) =>
            idx === i ? { ...a, status: "error", error: error.message } : a
          )
        );
      }
    }

    setIsProcessing(false);
  };

  const getConditionBadge = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes("good")) return <Badge variant="success" className="bg-emerald-100 text-emerald-800 border-emerald-200">Good</Badge>;
    if (lower.includes("fair")) return <Badge variant="warning" className="bg-amber-100 text-amber-800 border-amber-200">Fair</Badge>;
    if (lower.includes("poor")) return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">Poor</Badge>;
    return <Badge variant="secondary" className="bg-slate-100 text-slate-800 border-slate-200">{condition}</Badge>;
  };

  const getBlightScoreColor = (score: number) => {
    if (score <= 3) return "text-[#4CAF50]";
    if (score <= 6) return "text-amber-600";
    return "text-red-600";
  };

  const getDispositionRecommendation = (score: number) => {
    if (score >= 8) {
      return {
        label: "Demolition review",
        detail:
          "High-risk exterior deterioration suggests the parcel should move into demolition budgeting or urgent stabilization review.",
        tone: "bg-red-50 border-red-200 text-red-900",
      };
    }
    if (score >= 5) {
      return {
        label: "Field review first",
        detail:
          "Visible conditions support a deeper site walk, photo set, and rehab-vs-demo comparison before action is chosen.",
        tone: "bg-amber-50 border-amber-200 text-amber-900",
      };
    }
    return {
      label: "Rehab candidate",
      detail:
        "Exterior conditions point toward reuse planning, grant packaging, or transfer preparation instead of immediate demolition.",
      tone: "bg-emerald-50 border-emerald-200 text-emerald-900",
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-[#4CAF50]/30">
      <nav className="absolute top-0 w-full z-50 border-b border-white/10 bg-[#001F3F]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#003366] to-[#001F3F] shadow-lg border border-white/10">
              <Building2 className="h-6 w-6 text-white" />
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#4CAF50] border-2 border-[#001F3F]">
                <Leaf className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold leading-none text-white tracking-tight">{LAND_BANK.shortName}</span>
              <span className="text-[10px] font-bold leading-tight text-[#4CAF50] tracking-[0.2em] uppercase mt-1">
                Land Reutilization Corp.
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
            <a href="#" className="hover:text-white transition-colors">Dashboard</a>
            <a href="#" className="hover:text-white transition-colors">Parcels</a>
            <a href="#" className="hover:text-white transition-colors">Reports</a>
            <div className="h-4 w-px bg-white/20" />
            <span className="text-white">ParcelVisor AI</span>
          </div>
        </div>
      </nav>

      <div className="relative bg-[#001F3F] text-white overflow-hidden pt-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-[#4CAF50]/20 blur-[120px]" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#003366]/50 blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full border border-[#4CAF50]/30 bg-[#4CAF50]/10 px-3 py-1 text-sm font-medium text-[#4CAF50] backdrop-blur-sm">
                <ShieldCheck className="mr-2 h-4 w-4" />
                {LAND_BANK.fullName}
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
                {LAND_BANK.tagline}
              </p>

              <h1 className="text-5xl lg:text-7xl font-serif font-semibold leading-[1.1] tracking-tight">
                Identify Blight. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-emerald-200 italic">
                  Restore Ashtabula.
                </span>
              </h1>

              <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
                ParcelVisor helps the AC Land Bank bulk-grade parcel conditions from Street View and prioritize
                demolition, rehab, or deeper review with fast, field-ready AI analysis.
              </p>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Decision support</p>
                  <p className="mt-2 text-sm font-medium text-white">Demo vs. rehab triage</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Portfolio fit</p>
                  <p className="mt-2 text-sm font-medium text-white">Vacant, abandoned, tax-foreclosed</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Field workflow</p>
                  <p className="mt-2 text-sm font-medium text-white">Board-ready parcel review</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Established</p>
                  <p className="mt-2 text-sm font-medium text-white">Serving Ashtabula County since 2013</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Revitalization signal</p>
                  <p className="mt-2 text-sm font-medium text-white">$609K site-revitalization momentum</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Outcome</p>
                  <p className="mt-2 text-sm font-medium text-white">Return parcels to productive use</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex items-center text-sm text-slate-300">
                  <Clock className="mr-2 h-5 w-5 text-[#4CAF50]" />
                  Assess parcels in minutes
                </div>
                <div className="flex items-center text-sm text-slate-300">
                  <BarChart3 className="mr-2 h-5 w-5 text-[#4CAF50]" />
                  Prioritize action with blight scoring
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#4CAF50] to-[#003366] rounded-2xl blur-xl opacity-30 animate-pulse" />
              <Card className="relative bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl overflow-hidden">
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-white mb-2">Start Bulk Assessment</h3>
                  <p className="text-slate-300 text-sm mb-6">
                    Enter candidate parcels to generate AC Land Bank-ready condition reports.
                  </p>
                  <div className="mb-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs leading-relaxed text-slate-300">
                    Demo mode stays usable even without a live Gemini key. The goal is to show parcel triage,
                    field notes, and prioritization logic in a board-friendly workflow.
                  </div>

                  <Textarea
                    value={addressesInput}
                    onChange={(e) => setAddressesInput(e.target.value)}
                    placeholder="123 Main St, Ashtabula, OH&#10;456 Elm St, Ashtabula, OH"
                    className="min-h-[160px] font-mono text-sm mb-6 bg-black/20 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-[#4CAF50] resize-none"
                    disabled={isProcessing}
                  />

                  <Button
                    onClick={handleAnalyze}
                    disabled={isProcessing || !addressesInput.trim()}
                    className="w-full h-12 text-base font-semibold bg-[#4CAF50] hover:bg-[#45a049] text-white transition-all shadow-[0_0_20px_rgba(76,175,80,0.3)] hover:shadow-[0_0_30px_rgba(76,175,80,0.5)] border-none"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing Parcels...
                      </>
                    ) : (
                      <>
                        <TrendingDown className="mr-2 h-5 w-5" />
                        Generate Assessment
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {LAND_BANK.focus.map((item) => (
            <Card key={item} className="p-6 bg-white border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500 mb-2">Land bank focus</p>
              <h3 className="text-lg font-semibold text-slate-900">{item}</h3>
            </Card>
          ))}
        </div>

        <div className="mb-16 grid gap-6 lg:grid-cols-3">
          <Card className="p-6 bg-white border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500 mb-2">Why this fits AC Land Bank</p>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Built for blight removal and reuse</h3>
            <p className="text-sm leading-relaxed text-slate-700">
              The workflow mirrors how the Ashtabula County Land Bank evaluates vacant and tax-foreclosed parcels:
              fast screen, deeper field review, then demo, rehab, or hold decisions.
            </p>
          </Card>
          <Card className="p-6 bg-white border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500 mb-2">Decision-maker framing</p>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Executive-director-ready output</h3>
            <p className="text-sm leading-relaxed text-slate-700">
              Reports are written to support internal review, grant conversations, and board-level triage without
              forcing staff to decode raw AI output.
            </p>
          </Card>
          <Card className="p-6 bg-white border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500 mb-2">Data roadmap</p>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Ready for parcel and auditor layers</h3>
            <p className="text-sm leading-relaxed text-slate-700">
              ParcelVisor is structured to pair Street View analysis with county parcel records, auditor data, and
              future Regrid-backed mapping layers.
            </p>
          </Card>
        </div>

        <AnimatePresence>
          {assessments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {assessments.map((assessment, idx) => (
                <motion.div
                  key={assessment.address + idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className={cn("overflow-hidden shadow-xl border-0 rounded-2xl", assessment.status === "completed" && "ring-2 ring-green-400/30")}>
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-5 w-5 text-[#4CAF50]" />
                            <h3 className="text-2xl font-bold text-slate-900">{assessment.address}</h3>
                          </div>
                          <p className="text-slate-500 text-sm">AC Land Bank parcel assessment</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {assessment.status === "completed" && <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>}
                          {assessment.status === "analyzing" && <Badge className="bg-blue-100 text-blue-800 border-blue-200 animate-pulse"><Loader2 className="h-3 w-3 mr-1 animate-spin" />Analyzing</Badge>}
                          {assessment.status === "error" && <Badge className="bg-red-100 text-red-800 border-red-200"><AlertTriangle className="h-3 w-3 mr-1" />Error</Badge>}
                        </div>
                      </div>

                      {assessment.error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                          {assessment.error}
                        </div>
                      )}

                      {assessment.status === "completed" && (
                        <div className="grid lg:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <div className="rounded-xl overflow-hidden bg-slate-100 min-h-[280px] flex items-center justify-center">
                              {assessment.imageUrl ? (
                                <img
                                  src={assessment.imageUrl}
                                  alt={`Street view of ${assessment.address}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-slate-400">Image unavailable</div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <p className="text-sm text-slate-500 mb-2">Roof</p>
                                {getConditionBadge(assessment.roofCondition)}
                              </div>
                              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <p className="text-sm text-slate-500 mb-2">Windows</p>
                                {getConditionBadge(assessment.windowsCondition)}
                              </div>
                              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <p className="text-sm text-slate-500 mb-2">Exterior</p>
                                {getConditionBadge(assessment.exteriorCondition)}
                              </div>
                            </div>

                            <div className="p-5 rounded-xl bg-gradient-to-br from-slate-50 to-green-50 border border-slate-200">
                              <p className="text-sm text-slate-500 mb-2">Blight Score</p>
                              <div className={`text-4xl font-bold mb-3 ${getBlightScoreColor(assessment.blightScore)}`}>
                                {assessment.blightScore}/10
                              </div>
                              <p className="text-sm text-slate-700">
                                <strong>Value impact:</strong> {assessment.estimatedValueImpact}
                              </p>
                            </div>

                            <div
                              className={cn(
                                "p-5 rounded-xl border",
                                getDispositionRecommendation(assessment.blightScore).tone
                              )}
                            >
                              <p className="text-sm font-medium uppercase tracking-[0.18em] opacity-70">
                                Recommended next move
                              </p>
                              <h4 className="mt-2 text-lg font-semibold">
                                {getDispositionRecommendation(assessment.blightScore).label}
                              </h4>
                              <p className="mt-2 text-sm leading-relaxed">
                                {getDispositionRecommendation(assessment.blightScore).detail}
                              </p>
                            </div>

                            <div className="p-5 rounded-xl bg-white border border-slate-200">
                              <p className="text-sm text-slate-500 mb-2">Field Notes</p>
                              <p className="text-slate-700 leading-relaxed">{assessment.notes}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-20 border-t border-slate-200 pt-10">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Prototype framing</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                A civic-tech demo built for the Ashtabula County Land Bank workflow
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-700">
                This MVP is a buyer-specific prototype designed around land bank parcel triage, not an official
                government deployment. It is meant to demonstrate how AI-assisted exterior review can support safer,
                faster decisions on demolition, rehabilitation, and redevelopment.
              </p>
            </div>
            <Card className="p-6 bg-slate-900 text-slate-100 border-slate-900 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Source cues</p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
                <li>Ashtabula County Land Bank mission: restore safety and return property to productive use.</li>
                <li>Established in 2013 with active demolition, rehab, and site revitalization work in the county.</li>
                <li>Board-ready parcel review with demolition, rehab, and deeper-review pathways.</li>
                <li>Future integration path for parcel records, auditor context, and mapping overlays.</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
