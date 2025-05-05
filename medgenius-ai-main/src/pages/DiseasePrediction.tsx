
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import GlassCard from "@/components/ui/GlassCard";
import { FileUp, FileText, Check, X, Download, Loader2, Dna, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

// Groq API key
const GROQ_API_KEY = "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";

const DiseasePrediction = () => {
  const [file, setFile] = useState<File | null>(null);
  const [patientText, setPatientText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const { toast } = useToast();

  // Simulating file upload handling
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
                        content: "You are a medical AI assistant. Provide disease predictions in pure JSON format with NO markdown, NO text before/after the JSON."
                    },
                    {
                        role: "user",
                        content: `Analyze this patient and return a JSON object with these fields: predictedDiseases, riskFactors, geneticFactors, recommendations. ${patientInfo}`
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
        console.log("Groq API raw response:", data);

        // Ensure correct response structure
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error("Unexpected API response format");
        }

        let content = data.choices[0].message.content;
        console.log("Extracted Content:", content);

        // Extract JSON from response safely
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                          content.match(/```\n([\s\S]*?)\n```/) ||
                          content.match(/{[\s\S]*}/);

        if (!jsonMatch) {
            throw new Error("Could not extract JSON from response.");
        }

        let jsonStr = jsonMatch[1] || jsonMatch[0];
        console.log("Extracted JSON String:", jsonStr);

        // Validate JSON
        try {
            const parsedJSON = JSON.parse(jsonStr.trim());
            console.log("Parsed JSON:", parsedJSON);
            return parsedJSON;
        } catch (jsonError) {
            console.error("Error parsing JSON from Groq response:", jsonError);
            throw new Error("Invalid JSON format from AI.");
        }
    } catch (error) {
        console.error("Error calling Groq API:", error);
        throw error;
    }
};


  // Analysis process with progress updates
  const handleAnalysis = async () => {
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

    // Setup progress simulation
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
      // Use entered text or placeholder for demo
      const textToAnalyze = patientText || 
        "56-year-old male with persistent cough, fever of 101.2°F, shortness of breath, and fatigue. Medical history includes hypertension diagnosed in 2015 and Type 2 Diabetes diagnosed in 2018. Genetic test shows CYP2D6 - Intermediate metabolizer and SLCO1B1 - Reduced function. Currently taking Lisinopril 10mg daily and Metformin 500mg twice daily. Known allergies to Penicillin and Shellfish.";
      
      const result = await analyzeWithGroq(textToAnalyze);
      
      setAnalysisResults(result);
      clearInterval(interval);
      setProgress(100);
      
      toast({
        title: "Analysis complete",
        description: "AI disease prediction analysis has been completed successfully.",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: "Error during analysis. Please try again.",
      });
      clearInterval(interval);
      setProgress(0);
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
    a.download = "disease_prediction_results.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: "Disease prediction results have been downloaded",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto py-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Disease Prediction
            </h1>
            <p className="text-lg text-muted-foreground">
              AI-powered disease prediction and risk assessment based on patient symptoms, medical history, and genetic markers.
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
                    onClick={handleAnalysis}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Activity className="mr-2 h-4 w-4" />
                        Predict Diseases
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
                  <h2 className="text-xl font-semibold">Prediction Results</h2>
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
                        <p>Analyzing patient data with advanced AI models...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Activity className="h-10 w-10 mx-auto text-muted-foreground" />
                        <p>Upload or enter patient data to see disease predictions</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6 animate-fade-in">
                    {/* Predicted Diseases */}
                    <div>
                      <h3 className="text-md font-medium text-primary mb-3">Predicted Diseases</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysisResults.predictedDiseases?.map((disease: any, i: number) => (
                          <div key={i} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold">{disease.name}</h4>
                              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                                disease.probability > 0.7 
                                  ? "bg-red-50 text-red-600" 
                                  : disease.probability > 0.4 
                                    ? "bg-yellow-50 text-yellow-600" 
                                    : "bg-green-50 text-green-600"
                              }`}>
                                {Math.round(disease.probability * 100)}%
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{disease.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Risk Factors */}
                    <div>
                      <h3 className="text-md font-medium text-primary mb-3">Risk Factors</h3>
                      <ul className="bg-gray-50 rounded-lg p-4 space-y-2">
                        {analysisResults.riskFactors?.map((factor: any, i: number) => (
                          <li key={i} className="flex items-start text-sm gap-2">
                            <span className="text-yellow-600 bg-yellow-50 p-1 rounded-full">
                              <Check className="h-3 w-3" />
                            </span>
                            <div>
                              <span className="font-medium">{factor.name}:</span> {factor.description}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Genetic Factors */}
                    <div>
                      <h3 className="text-md font-medium text-primary mb-3">Genetic Factors</h3>
                      <ul className="bg-gray-50 rounded-lg p-4 space-y-2">
                        {analysisResults.geneticFactors?.map((gene: any, i: number) => (
                          <li key={i} className="flex items-start text-sm gap-2">
                            <span className="text-primary bg-primary-50 p-1 rounded-full">
                              <Dna className="h-3 w-3" />
                            </span>
                            <div>
                              <span className="font-medium">{gene.name}:</span> {gene.impact}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Recommendations */}
                    <div>
                      <h3 className="text-md font-medium text-primary mb-3">Recommendations</h3>
                      <ul className="bg-blue-50 rounded-lg p-4 space-y-2">
                        {analysisResults.recommendations?.map((rec: any, i: number) => (
                          <li key={i} className="flex items-start text-sm gap-2">
                            <span className="text-blue-600 bg-blue-100 p-1 rounded-full">
                              <Check className="h-3 w-3" />
                            </span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 justify-end">
                      <Button variant="outline" onClick={handleDownloadResults}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Report
                      </Button>
                      <Button>
                        <FileText className="mr-2 h-4 w-4" />
                        Proceed to Treatment
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

export default DiseasePrediction;
