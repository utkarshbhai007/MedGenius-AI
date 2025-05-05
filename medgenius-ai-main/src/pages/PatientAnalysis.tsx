import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import GlassCard from "@/components/ui/GlassCard";
import { FileUp, FileText, Check, X, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const GROQ_API_KEY = "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";

// Helper function to ensure a value is an array
const ensureArray = (value: any): any[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

// Helper function to flatten nested objects into an array of strings
const flattenObject = (obj: any): string[] => {
  if (!obj) return [];
  if (typeof obj !== 'object') return [String(obj)];
  if (Array.isArray(obj)) return obj.map(item => typeof item === 'string' ? item : JSON.stringify(item));
  
  // Handle nested object by concatenating all values
  return Object.values(obj).flatMap(value => 
    typeof value === 'string' ? value :
    Array.isArray(value) ? value.map(v => typeof v === 'string' ? v : JSON.stringify(v)) :
    typeof value === 'object' ? flattenObject(value) :
    String(value)
  );
};

const PatientAnalysis = () => {
  const [file, setFile] = useState<File | null>(null);
  const [patientText, setPatientText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      toast({
        title: "File uploaded",
        description: `${selectedFile.name} has been uploaded.`,
      });
    }
  };

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
              content: "You are a medical AI assistant specialized in analyzing patient reports. Extract key information and organize it into structured data. Return a JSON object with demographics, symptoms, medicalHistory, geneticMarkers, currentMedications, and allergies properties."
            },
            {
              role: "user",
              content: `Analyze this patient report and extract key information into JSON format with demographics, symptoms, medicalHistory, geneticMarkers, currentMedications, and allergies fields: ${patientInfo}`
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
        const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                         content.match(/```\s*([\s\S]*?)\s*```/) ||
                         content.match(/{[\s\S]*}/);
        
        const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
        
        const cleanedJson = jsonStr.replace(/```[a-z]*\n?/g, '').trim();
        
        try {
          const parsed = JSON.parse(cleanedJson);
          
          // Process any nested objects that might be in medicalHistory
          let medicalHistory = ensureArray(parsed.medicalHistory);
          if (medicalHistory.length === 1 && typeof medicalHistory[0] === 'object' && !Array.isArray(medicalHistory[0])) {
            medicalHistory = flattenObject(medicalHistory[0]);
          }
          
          // Ensure all array properties are actually arrays and flatten any nested objects
          const normalized = {
            demographics: parsed.demographics || {},
            symptoms: ensureArray(parsed.symptoms),
            medicalHistory: medicalHistory,
            geneticMarkers: ensureArray(parsed.geneticMarkers),
            currentMedications: ensureArray(parsed.currentMedications),
            allergies: ensureArray(parsed.allergies)
          };
          
          return normalized;
        } catch (innerError) {
          console.error("Failed to parse cleaned JSON:", innerError);
          
          const lastAttempt = cleanedJson.match(/{[\s\S]*}/);
          if (lastAttempt) {
            const parsed = JSON.parse(lastAttempt[0]);
            
            // Process any nested objects that might be in medicalHistory
            let medicalHistory = ensureArray(parsed.medicalHistory);
            if (medicalHistory.length === 1 && typeof medicalHistory[0] === 'object' && !Array.isArray(medicalHistory[0])) {
              medicalHistory = flattenObject(medicalHistory[0]);
            }
            
            // Ensure all array properties are actually arrays
            return {
              demographics: parsed.demographics || {},
              symptoms: ensureArray(parsed.symptoms),
              medicalHistory: medicalHistory,
              geneticMarkers: ensureArray(parsed.geneticMarkers),
              currentMedications: ensureArray(parsed.currentMedications),
              allergies: ensureArray(parsed.allergies)
            };
          }
          
          throw new Error("Could not parse response from AI service");
        }
      } catch (jsonError) {
        console.error("Error parsing JSON from Groq response:", jsonError, content);
        
        const sections = content.split(/\*\*([^*]+)\*\*/g).filter(Boolean);
        const result: any = {
          demographics: {},
          symptoms: [],
          medicalHistory: [],
          geneticMarkers: [],
          currentMedications: [],
          allergies: []
        };
        
        let currentSection = "";
        
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i].trim();
          
          if (section === "Demographics") {
            currentSection = "demographics";
            
            const demographicText = sections[i + 1] || "";
            const lines = demographicText.split('\n').filter(Boolean);
            
            lines.forEach(line => {
              const parts = line.split(':').map(part => part.trim());
              if (parts.length >= 2) {
                const key = parts[0].toLowerCase().replace(/\*/g, '').replace(/ /g, '');
                const value = parts[1].replace(/\*/g, '');
                result.demographics[key] = value;
              }
            });
            
          } else if (section === "Symptoms") {
            currentSection = "symptoms";
            
            const symptomsText = sections[i + 1] || "";
            const lines = symptomsText.split('\n').filter(Boolean);
            
            lines.forEach(line => {
              const symptom = line.replace(/^\s*\*\s*/, '').trim();
              if (symptom) {
                result.symptoms.push(symptom);
              }
            });
            
          } else if (section === "Medical History") {
            currentSection = "medicalHistory";
            
            const historyText = sections[i + 1] || "";
            const lines = historyText.split('\n').filter(Boolean);
            
            lines.forEach(line => {
              const history = line.replace(/^\s*\*\s*/, '').replace(/^\s*\+\s*/, '').trim();
              if (history && !history.includes('Chronic Conditions') && !history.includes('Past Surgeries') && !history.includes('Family History')) {
                result.medicalHistory.push(history);
              }
            });
            
          } else if (section === "Genetic Markers") {
            currentSection = "geneticMarkers";
            
            const markersText = sections[i + 1] || "";
            const lines = markersText.split('\n').filter(Boolean);
            
            lines.forEach(line => {
              const marker = line.replace(/^\s*\*\s*/, '').trim();
              if (marker && !marker.includes('Other Genetic Conditions')) {
                result.geneticMarkers.push(marker);
              }
            });
            
          } else if (section === "Current Medications") {
            currentSection = "currentMedications";
            
            const medsText = sections[i + 1] || "";
            const lines = medsText.split('\n').filter(Boolean);
            
            lines.forEach(line => {
              const medication = line.replace(/^\s*\*\s*/, '').trim();
              if (medication) {
                result.currentMedications.push(medication);
              }
            });
            
          } else if (section === "Allergies") {
            currentSection = "allergies";
            
            const allergiesText = sections[i + 1] || "";
            const lines = allergiesText.split('\n').filter(Boolean);
            
            lines.forEach(line => {
              const allergy = line.replace(/^\s*\*\s*/, '').trim();
              if (allergy && !allergy.includes('None mentioned')) {
                result.allergies.push(allergy);
              }
            });
          }
        }
        
        return result;
      }
    } catch (error) {
      console.error("Error calling Groq API:", error);
      throw error;
    }
  };

  const simulateAnalysis = async () => {
    if (!file && !patientText) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please upload a file or enter patient information.",
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setAnalysisResults(null);

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 90) {
          clearInterval(interval);
          return 90;
        }
        return newProgress;
      });
    }, 300);

    try {
      const textToAnalyze = patientText || 
        "56-year-old male with persistent cough, fever of 101.2°F, shortness of breath, and fatigue. Medical history includes hypertension diagnosed in 2015 and Type 2 Diabetes diagnosed in 2018. Genetic test shows CYP2D6 - Intermediate metabolizer and SLCO1B1 - Reduced function. Currently taking Lisinopril 10mg daily and Metformin 500mg twice daily. Known allergies to Penicillin and Shellfish.";
      
      const result = await analyzeWithGroq(textToAnalyze);
      
      // Ensure all array properties are actually arrays and flatten any nested objects
      let medicalHistory = ensureArray(result.medicalHistory);
      if (medicalHistory.length === 1 && typeof medicalHistory[0] === 'object' && !Array.isArray(medicalHistory[0])) {
        medicalHistory = flattenObject(medicalHistory[0]);
      }
      
      const normalizedResults = {
        demographics: result.demographics || {},
        symptoms: ensureArray(result.symptoms),
        medicalHistory: medicalHistory,
        geneticMarkers: ensureArray(result.geneticMarkers),
        currentMedications: ensureArray(result.currentMedications),
        allergies: ensureArray(result.allergies)
      };
      
      setAnalysisResults(normalizedResults);
      clearInterval(interval);
      setProgress(100);
      
      toast({
        title: "Analysis complete",
        description: "Patient report analysis has been completed successfully.",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: "We'll use a sample analysis for demonstration purposes.",
      });
      
      setAnalysisResults({
        demographics: {
          age: 56,
          gender: "Male",
          ethnicity: "Caucasian"
        },
        symptoms: [
          "Persistent cough",
          "Fever (101.2°F)",
          "Shortness of breath",
          "Fatigue"
        ],
        medicalHistory: [
          "Hypertension (diagnosed 2015)",
          "Type 2 Diabetes (diagnosed 2018)"
        ],
        geneticMarkers: [
          "CYP2D6 - Intermediate metabolizer",
          "SLCO1B1 - Reduced function"
        ],
        currentMedications: [
          "Lisinopril 10mg daily",
          "Metformin 500mg twice daily"
        ],
        allergies: [
          "Penicillin (severe rash)",
          "Shellfish"
        ]
      });
      
      clearInterval(interval);
      setProgress(100);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadResults = () => {
    if (!analysisResults) return;
    
    const jsonData = JSON.stringify(analysisResults, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = "patient_analysis_results.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: "Patient analysis results have been downloaded",
    });
  };

  const renderValue = (value: any): string => {
    if (value === undefined || value === null) {
      return "Not specified";
    }
    if (typeof value === "object") {
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
              Patient Report Analysis
            </h1>
            <p className="text-lg text-muted-foreground">
              Extract key symptoms, medical history, and genetic information from patient reports using our advanced NLP technology.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-6 animate-slide-up">
              <GlassCard className="h-full">
                <h2 className="text-xl font-semibold mb-6">Upload Patient Data</h2>
                
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <Input
                      type="file"
                      className="hidden"
                      id="file-upload"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.png,.txt"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <FileUp className="h-8 w-8 mx-auto text-gray-400 mb-4" />
                      <p className="text-sm font-medium mb-1">
                        {file ? file.name : "Drag & drop or click to upload"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supports PDF, JPG, PNG, TXT
                      </p>
                    </label>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Or</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Enter Patient Information
                    </label>
                    <Textarea
                      placeholder="Enter symptoms, medical history, current medications, etc."
                      className="min-h-[150px]"
                      value={patientText}
                      onChange={e => setPatientText(e.target.value)}
                    />
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={simulateAnalysis}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Analyze Patient Data
                      </>
                    )}
                  </Button>

                  {isAnalyzing && (
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

            <div className="lg:col-span-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <GlassCard className="h-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Analysis Results</h2>
                  {analysisResults && (
                    <Button variant="outline" size="sm" onClick={handleDownloadResults}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Report
                    </Button>
                  )}
                </div>
                
                {!analysisResults ? (
                  <div className="text-center py-20 text-muted-foreground">
                    {isAnalyzing ? (
                      <div className="space-y-4">
                        <Loader2 className="h-10 w-10 mx-auto animate-spin text-primary" />
                        <p>Processing patient data with AI...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
                        <p>Upload or enter patient data to see analysis results</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Demographics</h3>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {Object.entries(analysisResults.demographics || {}).map(([key, value]) => (
                                <React.Fragment key={key}>
                                  <p className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}:</p>
                                  <p>{renderValue(value)}</p>
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Symptoms</h3>
                          <ul className="bg-gray-50 rounded-lg p-4 space-y-2">
                            {(analysisResults.symptoms || []).map((symptom: string, i: number) => (
                              <li key={i} className="flex items-start text-sm gap-2">
                                <span className="text-primary bg-primary-50 p-1 rounded-full">
                                  <Check className="h-3 w-3" />
                                </span>
                                {symptom}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Medical History</h3>
                          <ul className="bg-gray-50 rounded-lg p-4 space-y-2">
                            {(analysisResults.medicalHistory || []).map((item: string, i: number) => (
                              <li key={i} className="flex items-start text-sm gap-2">
                                <span className="text-primary bg-primary-50 p-1 rounded-full">
                                  <Check className="h-3 w-3" />
                                </span>
                                {typeof item === 'string' ? item : JSON.stringify(item)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Genetic Markers</h3>
                          <ul className="bg-gray-50 rounded-lg p-4 space-y-2">
                            {(analysisResults.geneticMarkers || []).map((marker: string, i: number) => (
                              <li key={i} className="flex items-start text-sm gap-2">
                                <span className="text-primary bg-primary-50 p-1 rounded-full">
                                  <Check className="h-3 w-3" />
                                </span>
                                {typeof marker === 'string' ? marker : JSON.stringify(marker)}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Medications</h3>
                          <ul className="bg-gray-50 rounded-lg p-4 space-y-2">
                            {(analysisResults.currentMedications || []).map((med: string, i: number) => (
                              <li key={i} className="flex items-start text-sm gap-2">
                                <span className="text-primary bg-primary-50 p-1 rounded-full">
                                  <Check className="h-3 w-3" />
                                </span>
                                {typeof med === 'string' ? med : JSON.stringify(med)}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Allergies</h3>
                          <ul className="bg-gray-50 rounded-lg p-4 space-y-2">
                            {(analysisResults.allergies || []).length > 0 ? (
                              (analysisResults.allergies || []).map((allergy: string, i: number) => (
                                <li key={i} className="flex items-start text-sm gap-2">
                                  <span className="text-destructive bg-destructive/10 p-1 rounded-full">
                                    <X className="h-3 w-3" />
                                  </span>
                                  {typeof allergy === 'string' ? allergy : JSON.stringify(allergy)}
                                </li>
                              ))
                            ) : (
                              <li className="text-sm text-muted-foreground">No known allergies</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 justify-end">
                      <Button variant="outline" onClick={handleDownloadResults}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Report
                      </Button>
                      <Button>
                        <FileText className="mr-2 h-4 w-4" />
                        Proceed to Recommendations
                      </Button>
                    </div>
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PatientAnalysis;
