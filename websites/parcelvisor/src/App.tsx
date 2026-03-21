import { useState } from "react";
import { GoogleGenAI, Type } from "@google/genai";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import { Card } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Loader2, MapPin, AlertTriangle, CheckCircle2, TrendingDown, Building2, ArrowRight, ShieldCheck, Clock, BarChart3, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./lib/utils";

const GEMINI_API_KEY = (process.env.GEMINI_API_KEY || "").trim();
let _aiClient: GoogleGenAI | null | undefined;

function getAiClient(): GoogleGenAI | null {
  if (_aiClient !== undefined) return _aiClient;
  if (!GEMINI_API_KEY) {
    _aiClient = null;
    return _aiClient;
  }
  try {
    _aiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  } catch {
    _aiClient = null;
  }
  return _aiClient;
}

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
  type: Type.OBJECT,
  properties: {
    roofCondition: {
      type: Type.STRING,
      description: "Condition of the roof: Good, Fair, Poor, or Unknown",
    },
    windowsCondition: {
      type: Type.STRING,
      description: "Condition of the windows: Good, Fair, Poor, or Unknown",
    },
    exteriorCondition: {
      type: Type.STRING,
      description: "Condition of the exterior walls/siding: Good, Fair, Poor, or Unknown",
    },
    blightScore: {
      type: Type.NUMBER,
      description: "Blight score from 1 to 10. 10 is severely blighted/abandoned, 1 is pristine.",
    },
    estimatedValueImpact: {
      type: Type.STRING,
      description: "Estimated impact on property value, e.g., '-$20,000 due to roof damage', or 'Standard market value'",
    },
    notes: {
      type: Type.STRING,
      description: "Brief summary of visible issues",
    },
  },
  required: ["roofCondition", "windowsCondition", "exteriorCondition", "blightScore", "estimatedValueImpact", "notes"],
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
        const ai = getAiClient();
        if (!ai) {
          throw new Error("AI is disabled on this deployment (missing GEMINI_API_KEY).");
        }

        const res = await fetch(`/api/streetview?address=${encodeURIComponent(assessment.address)}`);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to fetch Street View image");
        }
        const { base64, mimeType } = await res.json();

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: {
            parts: [
              {
                inlineData: {
                  data: base64,
                  mimeType: mimeType,
                },
              },
              {
                text: `You are an expert real estate appraiser and blight inspector for the Ashtabula Land Bank.
Analyze this Google Street View image of a property located at ${assessment.address}.
Provide a detailed assessment of the property's condition focusing on the roof, windows, and overall exterior.
Determine a blight score and estimate the impact on the property's value.`,
              },
            ],
          },
          config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
          },
        });

        const text = response.text;
        if (!text) throw new Error("No response from Gemini");
        
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

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-[#4CAF50]/30">
      {/* Navigation Bar */}
      <nav className="absolute top-0 w-full z-50 border-b border-white/10 bg-[#001F3F]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#003366] to-[#001F3F] shadow-lg border border-white/10">
              <Building2 className="h-6 w-6 text-white" />
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#4CAF50] border-2 border-[#001F3F]">
                <Leaf className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold leading-none text-white tracking-tight">ASHTABULA</span>
              <span className="text-[10px] font-bold leading-tight text-[#4CAF50] tracking-[0.2em] uppercase mt-1">Land Bank</span>
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

      {/* Premium Hero Section */}
      <div className="relative bg-[#001F3F] text-white overflow-hidden pt-20">
        {/* Abstract background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-[#4CAF50]/20 blur-[120px]" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#003366]/50 blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full border border-[#4CAF50]/30 bg-[#4CAF50]/10 px-3 py-1 text-sm font-medium text-[#4CAF50] backdrop-blur-sm">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Ashtabula County Land Reutilization Corp.
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-serif font-semibold leading-[1.1] tracking-tight">
                Identify Blight. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-emerald-200 italic">
                  Restore Ashtabula.
                </span>
              </h1>
              
              <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
                ParcelVisor uses advanced AI Vision to instantly bulk-grade property conditions across Ashtabula County. Save hundreds of hours of manual surveying and prioritize interventions with data-driven precision.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex items-center text-sm text-slate-300">
                  <Clock className="mr-2 h-5 w-5 text-[#4CAF50]" />
                  Assess 100s of parcels in minutes
                </div>
                <div className="flex items-center text-sm text-slate-300">
                  <BarChart3 className="mr-2 h-5 w-5 text-[#4CAF50]" />
                  Automated value impact reports
                </div>
              </div>
            </div>

            {/* Input Card - The "Irresistible Offer" entry point */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#4CAF50] to-[#003366] rounded-2xl blur-xl opacity-30 animate-pulse" />
              <Card className="relative bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl overflow-hidden">
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-white mb-2">Start Bulk Assessment</h3>
                  <p className="text-slate-300 text-sm mb-6">Enter target addresses below to generate instant condition reports.</p>
                  
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
                        Generate Reports <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {assessments.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-end justify-between border-b border-slate-200 pb-6">
              <div>
                <h2 className="text-3xl font-serif font-semibold text-slate-900">Assessment Dossiers</h2>
                <p className="text-slate-500 mt-2">AI-generated condition reports and value estimations.</p>
              </div>
              <div className="text-sm font-medium text-slate-500 bg-slate-100 px-4 py-2 rounded-full">
                {assessments.filter(a => a.status === 'completed').length} / {assessments.length} Processed
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              <AnimatePresence>
                {assessments.map((assessment, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="overflow-hidden border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-white group">
                      <div className="flex flex-col lg:flex-row">
                        {/* Image Column */}
                        <div className="lg:w-2/5 bg-slate-100 relative min-h-[280px] flex items-center justify-center border-r border-slate-100 overflow-hidden">
                          {assessment.status === "pending" && (
                            <div className="text-slate-400 flex flex-col items-center">
                              <MapPin className="h-10 w-10 mb-3 opacity-30" />
                              <span className="text-sm font-medium uppercase tracking-widest">Queued</span>
                            </div>
                          )}
                          {assessment.status === "analyzing" && (
                            <div className="text-[#4CAF50] flex flex-col items-center">
                              <Loader2 className="h-10 w-10 mb-3 animate-spin" />
                              <span className="text-sm font-medium uppercase tracking-widest">Scanning...</span>
                            </div>
                          )}
                          {assessment.status === "error" && (
                            <div className="text-red-500 flex flex-col items-center p-6 text-center">
                              <AlertTriangle className="h-10 w-10 mb-3" />
                              <span className="text-sm font-bold uppercase tracking-widest">Analysis Failed</span>
                              <span className="text-sm mt-2 text-red-400">{assessment.error}</span>
                            </div>
                          )}
                          {assessment.status === "completed" && assessment.imageUrl && (
                            <>
                              <img 
                                src={assessment.imageUrl} 
                                alt={`Street view of ${assessment.address}`}
                                className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-700"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                              <div className="absolute bottom-4 left-4 right-4 text-white">
                                <div className="flex items-center text-xs font-semibold uppercase tracking-wider mb-1 opacity-80">
                                  <MapPin className="h-3 w-3 mr-1" /> Target Parcel
                                </div>
                                <h3 className="text-xl font-serif font-medium leading-tight">{assessment.address}</h3>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Details Column */}
                        <div className="lg:w-3/5 p-8 flex flex-col justify-between bg-white">
                          {assessment.status !== "completed" ? (
                            <div className="h-full flex items-center justify-center text-slate-400">
                              <p className="italic font-serif">Awaiting analysis results...</p>
                            </div>
                          ) : (
                            <>
                              <div>
                                <div className="flex justify-between items-start mb-8">
                                  <div>
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Blight Index</h4>
                                    <div className="flex items-baseline space-x-2">
                                      <span className={cn("text-5xl font-serif font-bold tracking-tighter", getBlightScoreColor(assessment.blightScore))}>
                                        {assessment.blightScore}
                                      </span>
                                      <span className="text-xl text-slate-400 font-medium">/ 10</span>
                                    </div>
                                  </div>
                                  
                                  <div className="text-right">
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Condition Matrix</h4>
                                    <div className="flex flex-col items-end space-y-2">
                                      <div className="flex items-center justify-between w-40">
                                        <span className="text-sm text-slate-600 font-medium">Roof</span>
                                        {getConditionBadge(assessment.roofCondition)}
                                      </div>
                                      <div className="flex items-center justify-between w-40">
                                        <span className="text-sm text-slate-600 font-medium">Windows</span>
                                        {getConditionBadge(assessment.windowsCondition)}
                                      </div>
                                      <div className="flex items-center justify-between w-40">
                                        <span className="text-sm text-slate-600 font-medium">Exterior</span>
                                        {getConditionBadge(assessment.exteriorCondition)}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="h-px w-full bg-slate-100 mb-8" />

                                <div className="grid sm:grid-cols-2 gap-8">
                                  <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center">
                                      <TrendingDown className="h-4 w-4 mr-2 text-slate-400" />
                                      Estimated Value Impact
                                    </h4>
                                    <p className="text-lg font-medium text-slate-900 leading-snug">
                                      {assessment.estimatedValueImpact}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center">
                                      <CheckCircle2 className="h-4 w-4 mr-2 text-slate-400" />
                                      Inspector Notes
                                    </h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                      {assessment.notes}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
