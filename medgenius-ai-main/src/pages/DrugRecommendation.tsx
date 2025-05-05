
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/GlassCard";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, FlaskConical, User, FileText, BarChart, 
  ShieldCheck, PlusCircle, Loader2, ChevronRight, 
  Star, Scale, Heart, Pill, Dna, Download
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// Groq API key
const GROQ_API_KEY = "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";

const DrugRecommendation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedDrug, setSelectedDrug] = useState<any>(null);
  const [patientData, setPatientData] = useState<any>(null);
  const [drugRecommendations, setDrugRecommendations] = useState<any[]>([]);
  const [patientInput, setPatientInput] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const analyzeWithGroq = async (patientInfo: string) => {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content: "You are a medical AI assistant specialized in drug recommendations based on patient data. Provide comprehensive, evidence-based drug recommendations with supporting data."
            },
            {
              role: "user",
              content: `Based on these patient details, provide drug recommendations with efficacy scores, side effect profiles, and genetic compatibility. Format your response as a JSON object with patientData and drugRecommendations arrays. ${patientInfo}`
            }
          ],
          temperature: 0.3,
          max_tokens: 2048
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("Groq API response:", data);
      
      const content = data.choices[0].message.content;
      try {
        // Try to extract JSON from the response which might be markdown formatted
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                         content.match(/```\n([\s\S]*?)\n```/) ||
                         content.match(/{[\s\S]*}/);
        
        const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
        return JSON.parse(jsonStr.trim());
      } catch (jsonError) {
        console.error("Error parsing JSON from Groq response:", jsonError);
        throw new Error("Could not parse response from AI service");
      }
    } catch (error) {
      console.error("Error calling Groq API:", error);
      throw error;
    }
  };

  const handlePatientAnalysis = async () => {
    if (!patientInput.trim()) {
      toast({
        title: "Patient information required",
        description: "Please provide patient details to generate drug recommendations.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setSelectedDrug(null);
    
    // Setup progress simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 90) {
          clearInterval(interval);
          return 90;
        }
        return newProgress;
      });
    }, 200);

    try {
      const result = await analyzeWithGroq(patientInput);
      
      // Extract patient data and drug recommendations
      const patientDataFromAPI = result.patientData || {
        id: `PT-${Math.floor(10000 + Math.random() * 90000)}`,
        name: "Patient",
        age: 56,
        gender: "Male",
        condition: "Type 2 Diabetes with Hypertension",
        geneticMarkers: [
          { name: "CYP2D6", status: "Intermediate metabolizer" },
          { name: "SLCO1B1", status: "Reduced function" }
        ]
      };
      
      // If the patientData is an array, extract the first element
      const normalizedPatientData = Array.isArray(patientDataFromAPI) 
        ? patientDataFromAPI[0] 
        : patientDataFromAPI;
        
      // If geneticMarkers is not an array, create an empty array to prevent map errors
      if (!normalizedPatientData.geneticMarkers || !Array.isArray(normalizedPatientData.geneticMarkers)) {
        normalizedPatientData.geneticMarkers = [];
      }
      
      setPatientData(normalizedPatientData);
      
      // Ensure drugRecommendations is an array
      const drugRecsFromAPI = result.drugRecommendations || [];
      setDrugRecommendations(Array.isArray(drugRecsFromAPI) ? drugRecsFromAPI : []);
      
      clearInterval(interval);
      setProgress(100);
      
      toast({
        title: "Analysis complete",
        description: "Drug recommendations generated successfully.",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: "Error generating drug recommendations. Please try again.",
      });
      
      // Set default values if API fails
      setPatientData({
        id: `PT-${Math.floor(10000 + Math.random() * 90000)}`,
        name: "Patient",
        age: 56,
        gender: "Male",
        condition: "Type 2 Diabetes with Hypertension",
        geneticMarkers: [
          { name: "CYP2D6", status: "Intermediate metabolizer" },
          { name: "SLCO1B1", status: "Reduced function" }
        ]
      });
      
      setDrugRecommendations([
        {
          name: "Metformin XR",
          score: 92,
          confidence: "High",
          effectiveness: 94,
          sideEffects: "Low",
          interactions: "Minimal",
          geneticMatch: "Optimal",
          reasoning: [
            "Excellent glycemic control for T2DM patients",
            "Low risk profile for patients with hypertension",
            "Compatible with CYP2D6 intermediate metabolizer status",
            "Minimal drug interactions with current medications"
          ]
        },
        {
          name: "Lisinopril",
          score: 88,
          confidence: "High",
          effectiveness: 90,
          sideEffects: "Low to Moderate",
          interactions: "Minimal",
          geneticMatch: "Good",
          reasoning: [
            "Effective blood pressure management",
            "Protective renal effects beneficial for diabetic patients",
            "Well-tolerated in patients with metabolic conditions",
            "Favorable pharmacokinetic profile for the patient's genetic markers"
          ]
        }
      ]);
      
      clearInterval(interval);
      setProgress(100);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadResults = () => {
    if (!patientData || !drugRecommendations.length) return;
    
    const results = {
      patientData: patientData,
      drugRecommendations: selectedDrug ? [selectedDrug] : drugRecommendations
    };
    
    const jsonData = JSON.stringify(results, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = "drug_recommendations.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: "Drug recommendations have been downloaded",
    });
  };

  // Helper function to safely stringify objects that might be directly rendered
  const safelyRenderValue = (value: any): string => {
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto py-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Drug Recommendation
            </h1>
            <p className="text-lg text-muted-foreground">
              AI-powered personalized drug recommendations based on patient data, genetic markers, and medical history.
            </p>
          </div>

          {!patientData ? (
            <div className="max-w-2xl mx-auto">
              <GlassCard>
                <h2 className="text-xl font-semibold mb-6">Enter Patient Information</h2>
                <div className="space-y-4">
                  <Textarea 
                    className="min-h-[200px]"
                    placeholder="Enter patient details including age, gender, medical conditions, symptoms, genetic information, current medications, etc."
                    value={patientInput}
                    onChange={(e) => setPatientInput(e.target.value)}
                  />
                  <Button 
                    className="w-full" 
                    onClick={handlePatientAnalysis}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <User className="mr-2 h-4 w-4" />
                        Analyze Patient Data
                      </>
                    )}
                  </Button>
                  
                  {isLoading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Processing data</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Patient Information */}
              <div className="lg:col-span-1 animate-slide-up">
                <GlassCard>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Patient Profile</h2>
                    <Button variant="outline" size="sm" onClick={handleDownloadResults}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  
                  <div className="flex items-center mb-6">
                    <div className="bg-primary-50 p-3 rounded-full mr-4">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{patientData.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {patientData.age} years, {patientData.gender} • ID: {patientData.id}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Primary Condition
                      </h4>
                      <div className="bg-gray-50 p-3 rounded-lg text-sm">
                        {safelyRenderValue(patientData.condition)}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Genetic Markers
                      </h4>
                      <ul className="space-y-2">
                        {patientData.geneticMarkers && patientData.geneticMarkers.length > 0 ? (
                          patientData.geneticMarkers.map((marker: any, i: number) => (
                            <li key={i} className="bg-gray-50 p-3 rounded-lg text-sm flex items-center">
                              <Dna className="h-4 w-4 mr-2 text-primary" />
                              <div>
                                <span className="font-medium">{marker.name}:</span>{" "}
                                {safelyRenderValue(marker.status)}
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="bg-gray-50 p-3 rounded-lg text-sm">
                            No genetic markers available
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full" onClick={() => {
                    setPatientData(null);
                    setSelectedDrug(null);
                    setDrugRecommendations([]);
                  }}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Enter New Patient
                  </Button>
                </GlassCard>
              </div>
              
              {/* Drug Recommendations */}
              <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <GlassCard>
                  <h2 className="text-xl font-semibold mb-6">AI-Generated Drug Recommendations</h2>
                  
                  {isLoading ? (
                    <div className="text-center py-12 animate-fade-in">
                      <div className="space-y-6 max-w-xs mx-auto">
                        <FlaskConical className="h-12 w-12 mx-auto text-primary animate-pulse-slow" />
                        <h3 className="font-medium">Analyzing patient data...</h3>
                        <p className="text-sm text-muted-foreground">
                          Our AI is analyzing genetic markers, medical history, and current conditions to find the optimal treatment options.
                        </p>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-fade-in">
                      {drugRecommendations.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          {drugRecommendations.map((drug, i) => (
                            <div
                              key={i}
                              className={cn(
                                "border rounded-lg p-4 cursor-pointer transition-all duration-300",
                                selectedDrug === drug 
                                  ? "border-primary bg-primary-50/50 shadow-sm" 
                                  : "hover:border-primary/30 hover:shadow-sm"
                              )}
                              onClick={() => setSelectedDrug(drug)}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center">
                                  <div className={cn(
                                    "h-10 w-10 rounded-full flex items-center justify-center text-white mr-3",
                                    drug.score >= 90 ? "bg-green-500" : 
                                    drug.score >= 80 ? "bg-primary" : "bg-amber-500"
                                  )}>
                                    <Pill className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <h3 className="font-medium">{safelyRenderValue(drug.name)}</h3>
                                    <div className="flex items-center text-sm">
                                      <div className="flex gap-1 mr-2">
                                        {[...Array(Math.floor((drug.score || 70) / 20))].map((_, i) => (
                                          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                                        ))}
                                        {[...Array(5 - Math.floor((drug.score || 70) / 20))].map((_, i) => (
                                          <Star key={i} className="h-3 w-3 text-gray-300" />
                                        ))}
                                      </div>
                                      <span className="text-muted-foreground">{drug.score || drug.efficacyScore * 100 || 70}% match</span>
                                    </div>
                                  </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center">
                                  <BarChart className="h-3 w-3 text-primary mr-1" />
                                  <span className="text-muted-foreground">Effectiveness:</span>
                                </div>
                                <span className="font-medium">{safelyRenderValue(drug.effectiveness || Math.round(drug.efficacyScore * 100) || 80)}%</span>
                                
                                <div className="flex items-center">
                                  <ShieldCheck className="h-3 w-3 text-primary mr-1" />
                                  <span className="text-muted-foreground">Side Effects:</span>
                                </div>
                                <span className="font-medium">{safelyRenderValue(drug.sideEffects || drug.sideEffectProfile || "Moderate")}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p>No drug recommendations available. Try analyzing a different patient.</p>
                        </div>
                      )}
                      
                      {selectedDrug && (
                        <div className="animate-fade-in border-t pt-6">
                          <h3 className="text-lg font-semibold mb-4">{safelyRenderValue(selectedDrug.name)} • Detailed Analysis</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center mb-2">
                                <BarChart className="h-4 w-4 text-primary mr-2" />
                                <h4 className="font-medium">Effectiveness</h4>
                              </div>
                              <div className="flex items-center">
                                <span className="text-2xl font-bold">
                                  {safelyRenderValue(selectedDrug.effectiveness || Math.round(selectedDrug.efficacyScore * 100) || 80)}%
                                </span>
                                <span className="ml-2 text-sm text-muted-foreground">
                                  Confidence: {safelyRenderValue(selectedDrug.confidence || "Moderate")}
                                </span>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center mb-2">
                                <ShieldCheck className="h-4 w-4 text-primary mr-2" />
                                <h4 className="font-medium">Safety Profile</h4>
                              </div>
                              <div>
                                <div className="text-sm">
                                  <span className="font-medium">Side Effects:</span> {safelyRenderValue(selectedDrug.sideEffects || selectedDrug.sideEffectProfile || "Moderate")}
                                </div>
                                <div className="text-sm">
                                  <span className="font-medium">Interactions:</span> {safelyRenderValue(selectedDrug.interactions || "Minimal")}
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center mb-2">
                                <Dna className="h-4 w-4 text-primary mr-2" />
                                <h4 className="font-medium">Genetic Compatibility</h4>
                              </div>
                              <div className="flex items-center">
                                <span className="font-medium">
                                  {safelyRenderValue(selectedDrug.geneticMatch || selectedDrug.geneticCompatibility || "Good")}
                                </span>
                                <div className="ml-2 flex">
                                  {[...Array(
                                    (selectedDrug.geneticMatch === "Optimal" || selectedDrug.geneticCompatibility === "Optimal") ? 3 : 
                                    (selectedDrug.geneticMatch === "Good" || selectedDrug.geneticCompatibility === "Good") ? 2 : 1
                                  )].map((_, i) => (
                                    <Dna key={i} className="h-3 w-3 text-primary" />
                                  ))}
                                  {[...Array(3 - (
                                    (selectedDrug.geneticMatch === "Optimal" || selectedDrug.geneticCompatibility === "Optimal") ? 3 : 
                                    (selectedDrug.geneticMatch === "Good" || selectedDrug.geneticCompatibility === "Good") ? 2 : 1
                                  ))].map((_, i) => (
                                    <Dna key={i} className="h-3 w-3 text-muted" />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <h4 className="font-medium mb-3">AI Reasoning</h4>
                            <ul className="bg-gray-50 rounded-lg p-4 space-y-2">
                              {(selectedDrug.reasoning && Array.isArray(selectedDrug.reasoning)) ? (
                                selectedDrug.reasoning.map((reason: string, i: number) => (
                                  <li key={i} className="flex items-start text-sm gap-2">
                                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                    {safelyRenderValue(reason)}
                                  </li>
                                ))
                              ) : (
                                <li className="flex items-start text-sm gap-2">
                                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                  {selectedDrug.geneticCompatibility ? 
                                    `Compatible with ${safelyRenderValue(selectedDrug.geneticCompatibility)}` : 
                                    "Recommended based on patient profile"}
                                </li>
                              )}
                            </ul>
                          </div>
                          
                          <div className="flex justify-end space-x-3">
                            <Button variant="outline" onClick={handleDownloadResults}>
                              <Download className="h-4 w-4 mr-2" />
                              Download Report
                            </Button>
                            <Button>
                              <Heart className="h-4 w-4 mr-2" />
                              Accept Recommendation
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </GlassCard>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Check component
const Check = ({ className }: { className?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
};

export default DrugRecommendation;
