import * as React from "react";
import { useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GlassCard from "@/components/ui/GlassCard";
import { ShieldAlert, ArrowRightLeft, Sparkles, Loader2, Download, Book, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { fetchOpenAI, parseAIResponse } from "@/utils/apiService";
import jsPDF from 'jspdf';
import { Disclaimer } from "@/components/ui/Disclaimer";
import ActivityService from "@/services/ActivityService";

const SideEffects = () => {
  const [drugName, setDrugName] = useState("");
  const [interactionDrugs, setInteractionDrugs] = useState(["", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [sideEffects, setSideEffects] = useState<any[]>([]);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [drugInfo, setDrugInfo] = useState<any>(null);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("side-effects");

  const getDrugInfo = async (drugName: string) => {
    try {
      console.log(`Fetching information for drug: ${drugName}`);
      
      const systemMessage = `You are a medical AI assistant specialized in pharmaceutical knowledge. 
      Provide detailed, accurate information about medications, including their clinical uses, mechanisms, 
      and safety profiles. Format your response in JSON.`;
      
      const prompt = `Provide comprehensive information about the drug ${drugName}. Include:
      1. Generic and brand names
      2. Drug class and mechanism of action
      3. Primary uses and indications
      4. Common dosage forms
      5. Important warnings and precautions
      6. Known drug interactions
      
      Format the response as a JSON object with the following structure:
      {
        "name": "drug name",
        "genericName": "generic name",
        "drugClass": "classification",
        "description": "brief description",
        "usedFor": ["indication1", "indication2", ...],
        "mechanism": "mechanism of action",
        "commonDosage": "dosing information",
        "warnings": ["warning1", "warning2", ...],
        "interactions": ["interaction1", "interaction2", ...]
      }`;

      const response = await fetchOpenAI({
        prompt,
        systemMessage,
        temperature: 0.3
      });

      if (response?.choices?.[0]?.message?.content) {
        const result = parseAIResponse(response.choices[0].message.content);
        return result;
      }
      
      throw new Error("Invalid API response format");
    } catch (error) {
      console.error("Error retrieving drug information:", error);
      throw error;
    }
  };

  const handlePrediction = async () => {
    if (!drugName.trim()) {
      toast({
        title: "Drug name is required",
        description: "Please enter a drug name to predict side effects.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setDrugInfo(null);
    setSideEffects([]);
    
    const interval = setInterval(() => {
      setProgress(prev => Math.min(90, prev + 10));
    }, 300);
    
    try {
      // First, get drug information
      const drugInfoResult = await getDrugInfo(drugName);
      setDrugInfo(drugInfoResult);
      
      // Then, get detailed side effects
      const systemMessage = `You are a medical AI assistant specialized in analyzing drug side effects. 
      Provide detailed, evidence-based information about medication side effects, including their likelihood, 
      severity, and management strategies. Format your response in JSON.`;
      
      const prompt = `Analyze and provide detailed information about the side effects of ${drugName}. 
      Include common and significant side effects, their probability of occurrence, severity levels, 
      and management approaches.

      Format the response as a JSON array with the following structure for each side effect:
      [
        {
          "name": "side effect name",
          "probability": (number between 0 and 1, based on clinical data),
          "severity": "Mild/Moderate/Severe",
          "management": "specific management approach",
          "timeframe": "when it typically occurs",
          "riskFactors": ["risk factor 1", "risk factor 2"]
        },
        ...
      ]
      
      Base your response on clinical data and medical literature. Include both common and serious side effects.`;

      const response = await fetchOpenAI({
        prompt,
        systemMessage,
        temperature: 0.3
      });

      if (response?.choices?.[0]?.message?.content) {
        const result = parseAIResponse(response.choices[0].message.content);
        setSideEffects(Array.isArray(result) ? result : []);
        setShowResults(true);
        setProgress(100);
        
        // Track the side effects prediction
        ActivityService.addActivity(
          'analysis',
          `Side effects analysis for ${drugName}`,
          `Found ${Array.isArray(result) ? result.length : 0} potential side effects`
        );
        
        toast({
          title: "Analysis complete",
          description: "Drug information and side effect analysis has been completed successfully.",
        });
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error("Error in prediction:", error);
      
      // Track the failed analysis
      ActivityService.addActivity(
        'analysis',
        `Failed side effects analysis for ${drugName}`,
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      
      toast({
        title: "Error",
        description: "An error occurred during the analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  const handleInteractionCheck = async () => {
    if (!interactionDrugs[0].trim() || !interactionDrugs[1].trim()) {
      toast({
        title: "Both drug names are required",
        description: "Please enter names for both drugs to check for interactions.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setInteractions([]);
    setShowResults(false);
    
    const interval = setInterval(() => {
      setProgress(prev => Math.min(90, prev + 10));
    }, 300);
    
    try {
      const systemMessage = `You are a medical AI assistant specialized in analyzing drug interactions. 
      Provide detailed, evidence-based information about potential interactions between medications, 
      including their mechanisms, clinical significance, and management strategies. Format your response in JSON.`;
      
      const prompt = `Analyze potential drug interactions between ${interactionDrugs[0]} and ${interactionDrugs[1]}. 
      Include:
      1. Type and mechanism of interaction
      2. Clinical significance and severity
      3. Potential outcomes
      4. Management recommendations
      5. Supporting evidence from medical literature

      Format the response as a JSON array with the following structure:
      [
        {
          "drug1": "${interactionDrugs[0]}",
          "drug2": "${interactionDrugs[1]}",
          "mechanism": "how the interaction occurs",
          "severity": "Mild/Moderate/Severe",
          "effect": "detailed description of the interaction effect",
          "evidence": "brief reference to clinical evidence",
          "recommendation": "specific clinical recommendation"
        },
        ...
      ]`;

      const response = await fetchOpenAI({
        prompt,
        systemMessage,
        temperature: 0.3
      });

      if (response?.choices?.[0]?.message?.content) {
        const result = parseAIResponse(response.choices[0].message.content);
        console.log("Interaction results:", result);
        setInteractions(Array.isArray(result) ? result : [result]);
        setShowResults(true);
        setProgress(100);
        
        // Track the interaction check
        ActivityService.addActivity(
          'analysis',
          `Drug interaction check: ${interactionDrugs[0]} + ${interactionDrugs[1]}`,
          `Found ${Array.isArray(result) ? result.length : 1} interaction(s)`
        );
        
        toast({
          title: "Interaction check complete",
          description: "Drug interaction analysis has been completed successfully.",
        });
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error("Error in interaction check:", error);
      
      // Track the failed interaction check
      ActivityService.addActivity(
        'analysis',
        `Failed drug interaction check: ${interactionDrugs[0]} + ${interactionDrugs[1]}`,
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred during the interaction check. Please try again.",
      });
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!showResults) return;

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Add header
      pdf.setFontSize(24);
      pdf.setTextColor(44, 62, 80);
      pdf.text(activeTab === 'side-effects' ? 'Drug Side Effects Report' : 'Drug Interactions Report', pdfWidth / 2, 20, { align: 'center' });
      
      // Add timestamp
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, pdfWidth / 2, 30, { align: 'center' });
      
      let yPos = 50;

      if (activeTab === 'side-effects') {
        // Add drug information section
        if (drugInfo) {
          pdf.setFontSize(16);
          pdf.setFont(undefined, 'bold');
          pdf.setTextColor(44, 62, 80);
          pdf.text('Drug Information', 20, yPos);
          yPos += 10;

          pdf.setFontSize(12);
          pdf.setFont(undefined, 'normal');
          
          // Drug name and generic name
          pdf.text(`Name: ${drugInfo.name || drugName}`, 20, yPos);
          yPos += 7;
          if (drugInfo.genericName) {
            pdf.text(`Generic Name: ${drugInfo.genericName}`, 20, yPos);
            yPos += 7;
          }

          // Drug class and mechanism
          if (drugInfo.drugClass) {
            pdf.text(`Drug Class: ${drugInfo.drugClass}`, 20, yPos);
            yPos += 7;
          }
          if (drugInfo.mechanism) {
            const mechanismLines = pdf.splitTextToSize(`Mechanism: ${drugInfo.mechanism}`, pdfWidth - 40);
            pdf.text(mechanismLines, 20, yPos);
            yPos += (mechanismLines.length * 7);
          }
          yPos += 10;

          // Used for section
          if (drugInfo.usedFor && drugInfo.usedFor.length > 0) {
            pdf.setFont(undefined, 'bold');
            pdf.text('Primary Uses:', 20, yPos);
            yPos += 7;
            pdf.setFont(undefined, 'normal');
            drugInfo.usedFor.forEach((use: string) => {
              pdf.text(`• ${use}`, 25, yPos);
              yPos += 7;
            });
            yPos += 5;
          }
        }

        // Add side effects section
        if (sideEffects.length > 0) {
          // Check if we need a new page
          if (yPos > pdfHeight - 60) {
            pdf.addPage();
            yPos = 20;
          }

          pdf.setFontSize(16);
          pdf.setFont(undefined, 'bold');
          pdf.text('Side Effects Analysis', 20, yPos);
          yPos += 10;

          pdf.setFontSize(12);
          sideEffects.forEach((effect, index) => {
            // Check if we need a new page
            if (yPos > pdfHeight - 60) {
              pdf.addPage();
              yPos = 20;
            }

            pdf.setFont(undefined, 'bold');
            pdf.text(`${index + 1}. ${effect.name}`, 20, yPos);
            yPos += 7;

            pdf.setFont(undefined, 'normal');
            pdf.text(`Probability: ${Math.round(effect.probability * 100)}%`, 25, yPos);
            yPos += 7;
            pdf.text(`Severity: ${effect.severity}`, 25, yPos);
            yPos += 7;

            const managementLines = pdf.splitTextToSize(`Management: ${effect.management}`, pdfWidth - 50);
            pdf.text(managementLines, 25, yPos);
            yPos += (managementLines.length * 7) + 5;
          });
        }
      } else {
        // Drug Interactions Report
        if (interactions.length > 0) {
          pdf.setFontSize(16);
          pdf.setFont(undefined, 'bold');
          pdf.text(`Interaction Analysis: ${interactionDrugs[0]} + ${interactionDrugs[1]}`, 20, yPos);
          yPos += 15;

          pdf.setFontSize(12);
          interactions.forEach((interaction, index) => {
            // Check if we need a new page
            if (yPos > pdfHeight - 60) {
              pdf.addPage();
              yPos = 20;
            }

            pdf.setFont(undefined, 'bold');
            pdf.text(`Interaction ${index + 1}`, 20, yPos);
            yPos += 7;

            pdf.setFont(undefined, 'normal');
            pdf.text(`Severity: ${interaction.severity}`, 25, yPos);
            yPos += 7;

            const effectLines = pdf.splitTextToSize(`Effect: ${interaction.effect}`, pdfWidth - 50);
            pdf.text(effectLines, 25, yPos);
            yPos += (effectLines.length * 7) + 5;

            if (interaction.mechanism) {
              const mechanismLines = pdf.splitTextToSize(`Mechanism: ${interaction.mechanism}`, pdfWidth - 50);
              pdf.text(mechanismLines, 25, yPos);
              yPos += (mechanismLines.length * 7) + 5;
            }

            const recommendationLines = pdf.splitTextToSize(`Recommendation: ${interaction.recommendation}`, pdfWidth - 50);
            pdf.text(recommendationLines, 25, yPos);
            yPos += (recommendationLines.length * 7) + 10;
          });
        }
      }

      // Add footer
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      pdf.text('Generated by MedGenius AI', pdfWidth / 2, pdfHeight - 10, { align: 'center' });
      
      // Save the PDF
      const fileName = activeTab === 'side-effects' 
        ? `${drugName.toLowerCase().replace(/\s+/g, '_')}_side_effects.pdf`
        : `${interactionDrugs[0].toLowerCase().replace(/\s+/g, '_')}_${interactionDrugs[1].toLowerCase().replace(/\s+/g, '_')}_interactions.pdf`;
      
      pdf.save(fileName);
      
      // Track the PDF generation
      ActivityService.addActivity(
        'download',
        `Generated report: ${activeTab === 'side-effects' ? drugName : `${interactionDrugs[0]} + ${interactionDrugs[1]}`}`,
        `Report type: ${activeTab === 'side-effects' ? 'Side Effects' : 'Drug Interactions'}`
      );
      
      toast({
        title: "Report Generated",
        description: "Your analysis report has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "Could not generate the analysis report",
      });
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
            Drug Side Effects Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analyze potential side effects and interactions between medications using advanced AI technology.
          </p>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-xl shadow-sm border p-6 max-w-3xl mx-auto">
              <Tabs defaultValue="side-effects" className="w-full" onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="side-effects" className="px-2 text-xs sm:text-sm md:text-base">Side Effect Prediction</TabsTrigger>
                  <TabsTrigger value="interactions" className="px-2 text-xs sm:text-sm md:text-base">Drug Interactions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="side-effects" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Drug Name</label>
                      <Input 
                        placeholder="Enter drug name (e.g., Lisinopril)" 
                        value={drugName}
                        onChange={(e) => setDrugName(e.target.value)}
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handlePrediction}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="mr-2 h-4 w-4" />
                          Predict Side Effects
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
                </TabsContent>
                
                <TabsContent value="interactions" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Drug 1</label>
                      <Input 
                        placeholder="Enter first drug name" 
                        value={interactionDrugs[0]}
                        onChange={(e) => setInteractionDrugs([e.target.value, interactionDrugs[1]])}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Drug 2</label>
                      <Input 
                        placeholder="Enter second drug name" 
                        value={interactionDrugs[1]}
                        onChange={(e) => setInteractionDrugs([interactionDrugs[0], e.target.value])}
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleInteractionCheck}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <ArrowRightLeft className="mr-2 h-4 w-4" />
                          Check Interactions
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
                </TabsContent>
              </Tabs>
            </div>

            {showResults && (
              <div className="mt-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
                  <Button
                    onClick={generatePDF}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
                
                {drugInfo && activeTab === "side-effects" && (
                  <div className="mb-8 animate-fadeIn">
                    <GlassCard className="p-6 border-primary/10 bg-gradient-to-r from-blue-50 to-white">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                          <div className="flex items-center mb-4">
                            <div className="bg-primary-100 p-2 rounded-full mr-3">
                              <Book className="h-5 w-5 text-primary-600" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">{drugInfo.name || drugName}</h3>
                              {drugInfo.genericName && (
                                <p className="text-sm text-muted-foreground">{drugInfo.genericName}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            {drugInfo.drugClass && (
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Drug Class</h4>
                                <p className="font-medium">{drugInfo.drugClass}</p>
                              </div>
                            )}
                            
                            {drugInfo.description && (
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                                <p>{drugInfo.description}</p>
                              </div>
                            )}
                            
                            {drugInfo.mechanism && (
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Mechanism of Action</h4>
                                <p>{drugInfo.mechanism}</p>
                              </div>
                            )}
                            
                            {drugInfo.commonDosage && (
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Common Dosage</h4>
                                <p>{drugInfo.commonDosage}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          {drugInfo.usedFor && Array.isArray(drugInfo.usedFor) && drugInfo.usedFor.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-muted-foreground mb-2">Used For</h4>
                              <div className="flex flex-wrap gap-2">
                                {drugInfo.usedFor.map((use: string, index: number) => (
                                  <div key={index} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                                    {use}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {drugInfo.warnings && Array.isArray(drugInfo.warnings) && drugInfo.warnings.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-muted-foreground mb-2">Warnings</h4>
                              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                                <ul className="space-y-2">
                                  {drugInfo.warnings.map((warning: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2 text-amber-800">
                                      <ShieldAlert className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                      <span>{warning}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                          
                          {drugInfo.interactions && Array.isArray(drugInfo.interactions) && drugInfo.interactions.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-2">Common Interactions</h4>
                              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                                <ul className="space-y-2">
                                  {drugInfo.interactions.map((interaction: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2 text-blue-800">
                                      <ArrowRightLeft className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                      <span>{interaction}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                )}
                
                <div className="w-full">
                  {activeTab === "side-effects" && sideEffects.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {sideEffects.map((effect, index) => (
                        <GlassCard key={index} className="p-6 hover:shadow-md transition-shadow bg-blue-50/50 border border-blue-100">
                          <div className="flex items-start gap-4">
                            <div className={`rounded-full p-2 ${
                              effect.probability > 0.6 
                                ? "bg-red-50 text-red-600" 
                                : effect.probability > 0.4 
                                  ? "bg-yellow-50 text-yellow-600" 
                                  : "bg-green-50 text-green-600"
                            }`}>
                              <ShieldAlert className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-lg">{effect.name}</h3>
                                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                                  effect.probability > 0.6 
                                    ? "bg-red-50 text-red-600" 
                                    : effect.probability > 0.4 
                                      ? "bg-yellow-50 text-yellow-600" 
                                      : "bg-green-50 text-green-600"
                                }`}>
                                  {Math.round(effect.probability * 100)}%
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                <span className="font-medium">Severity:</span> {effect.severity}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                <span className="font-medium">Management:</span> {effect.management}
                              </p>
                            </div>
                          </div>
                        </GlassCard>
                      ))}
                    </div>
                  )}
                  
                  {activeTab === "interactions" && interactions.length > 0 && (
                    <div className="space-y-6">
                      {interactions.map((interaction, index) => (
                        <GlassCard key={index} className="p-6 hover:shadow-md transition-shadow bg-blue-50/50 border border-blue-100">
                          <div className="flex items-start gap-4">
                            <div className={`rounded-full p-2 ${
                              interaction.severity === "Severe" 
                                ? "bg-red-50 text-red-600" 
                                : interaction.severity === "Moderate" 
                                  ? "bg-yellow-50 text-yellow-600" 
                                  : "bg-green-50 text-green-600"
                            }`}>
                              <ArrowRightLeft className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-lg">
                                  {interaction.drug1} + {interaction.drug2}
                                </h3>
                                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                                  interaction.severity === "Severe" 
                                    ? "bg-red-50 text-red-600" 
                                    : interaction.severity === "Moderate" 
                                      ? "bg-yellow-50 text-yellow-600" 
                                      : "bg-green-50 text-green-600"
                                }`}>
                                  {interaction.severity}
                                </span>
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    <span className="font-medium">Effect:</span> {interaction.effect}
                                  </p>
                                </div>
                                
                                {interaction.mechanism && (
                                  <div className="bg-blue-50/50 p-3 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                      <span className="font-medium">Mechanism of Action:</span> {interaction.mechanism}
                                    </p>
                                  </div>
                                )}
                                
                                {interaction.evidence && (
                                  <div className="bg-purple-50/50 p-3 rounded-lg">
                                    <p className="text-sm text-purple-800">
                                      <span className="font-medium">Evidence:</span> {interaction.evidence}
                                    </p>
                                  </div>
                                )}
                                
                                <div className="bg-blue-50 p-3 rounded-lg flex gap-3">
                                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <p className="text-sm text-blue-800">
                                    <span className="font-medium">Recommendation:</span> {interaction.recommendation}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </GlassCard>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <Disclaimer className="mt-16" />
      </div>
    </PageContainer>
  );
};

export default SideEffects;
