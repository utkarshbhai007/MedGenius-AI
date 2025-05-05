import * as React from "react";
import { useState, useEffect } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import GlassCard from "@/components/ui/GlassCard";
import { Search, ArrowRight, FileText, RotateCcw, Info, Shield, Tag, Loader2, Download, Activity, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { fetchOpenAI, parseAIResponse, deepParseJsonStrings } from "@/utils/apiService";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Disclaimer } from "@/components/ui/Disclaimer";
import { FileUpload } from '@/components/FileUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import ActivityService from "@/services/ActivityService";

const PatientAnalysis = () => {
  const [activeTab, setActiveTab] = useState<'manual' | 'upload'>('manual');
  const [loading, setLoading] = useState(false);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: '',
    patientData: '',
    fileMetadata: null as {
      fileName: string;
      fileType: string;
      fileSize: number;
      pageCount?: number;
    } | null
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load saved analysis data when component mounts
  useEffect(() => {
    const savedData = localStorage.getItem('currentPatientAnalysis');
    if (savedData) {
      try {
        const { patientInfo: savedPatientInfo, analysis: savedAnalysis } = JSON.parse(savedData);
        setPatientInfo(savedPatientInfo);
        setAnalysis(savedAnalysis);
        
        // If there's file data, switch to upload tab
        if (savedPatientInfo.fileMetadata) {
          setActiveTab('upload');
        }
      } catch (error) {
        console.error('Error restoring saved analysis:', error);
      }
    }
  }, []);

  // Save current analysis data whenever it changes
  useEffect(() => {
    if (analysis && patientInfo.patientData) {
      localStorage.setItem('currentPatientAnalysis', JSON.stringify({
        patientInfo,
        analysis
      }));
    }
  }, [analysis, patientInfo]);

  const handleFileUpload = (text: string, metadata: any) => {
    setPatientInfo(prev => ({
      ...prev,
      patientData: text,
      fileMetadata: metadata
    }));

    // Extract patient information from the text if possible
    const nameMatch = text.match(/Name:\s*([^\n]+)/i);
    const ageMatch = text.match(/Age:\s*(\d+)/i);
    const genderMatch = text.match(/Gender:\s*([^\n]+)/i);

    if (nameMatch || ageMatch || genderMatch) {
      setPatientInfo(prev => ({
        ...prev,
        name: nameMatch?.[1]?.trim() || prev.name,
        age: ageMatch?.[1]?.trim() || prev.age,
        gender: genderMatch?.[1]?.trim() || prev.gender
      }));
    }
  };

  const handleClear = () => {
    setPatientInfo(prev => ({
      ...prev,
      patientData: '',
      fileMetadata: null
    }));
    setAnalysis(null);
    localStorage.removeItem('currentPatientAnalysis');
  };

  const handleAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setProgress(0);
    
    // Create a progress interval that updates regularly
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(90, prev + 10));
    }, 500);

    try {
      // Enhanced system message with more context
      const systemMessage = `You are a medical AI assistant specialized in patient analysis. 
      Analyze the provided patient data and provide a comprehensive medical assessment.
      Consider the following:
      - Patient demographics and history
      - Current symptoms and conditions
      - Past medical history if available
      - Any medications mentioned
      - Lab results or test findings if present
      
      Format your response as a detailed JSON object with the following structure:
      {
        "diagnosis": [
          { 
            "condition": "Primary condition", 
            "confidenceLevel": "High/Medium/Low", 
            "description": "Brief description",
            "evidenceFromText": "Relevant text from patient data that supports this diagnosis"
          }
        ],
        "riskFactors": [
          { 
            "factor": "Risk factor name", 
            "impact": "High/Medium/Low", 
            "description": "Brief description",
            "mitigation": "Suggested steps to address this risk factor"
          }
        ],
        "recommendations": [
          { 
            "recommendation": "Action item", 
            "reason": "Clinical reasoning", 
            "priority": "High/Medium/Low",
            "timeframe": "Immediate/Short-term/Long-term"
          }
        ],
        "nextSteps": [
          { 
            "step": "Next step", 
            "reason": "Rationale", 
            "timeline": "Immediate/Soon/Future",
            "details": "Specific instructions or requirements"
          }
        ],
        "dataQuality": {
          "completeness": "High/Medium/Low",
          "missingInformation": ["List of important missing information"],
          "suggestedTests": ["Additional tests or information that would be helpful"]
        }
      }`;
      
      const prompt = `Analyze the following patient data and provide a comprehensive medical assessment:
      
      ${patientInfo.fileMetadata ? `Source: ${patientInfo.fileMetadata.fileName} (${patientInfo.fileMetadata.fileType})` : 'Manual Entry'}
      
      Patient Information:
      ${patientInfo.name ? `Name: ${patientInfo.name}` : ''}
      ${patientInfo.age ? `Age: ${patientInfo.age}` : ''}
      ${patientInfo.gender ? `Gender: ${patientInfo.gender}` : ''}
      
      Patient Data:
      ${patientInfo.patientData}
      
      Provide a thorough analysis including diagnoses, risk factors, recommendations, and next steps.
      If there is not enough information for any section, clearly indicate what additional information would be helpful.
      Be evidence-based in your assessment and cite specific information from the patient data when possible.`;

      // Call the OpenAI API for analysis
      const response = await fetchOpenAI({
        prompt,
        systemMessage,
        temperature: 0.4,
        maxTokens: 2000
      });

      if (response?.choices?.[0]?.message?.content) {
        const result = parseAIResponse(response.choices[0].message.content);
        console.log("Analysis result:", result);
        
        // Ensure all sections exist in the response and add metadata
        const completeResult = {
          diagnosis: result.diagnosis || [],
          riskFactors: result.riskFactors || [],
          recommendations: result.recommendations || [],
          nextSteps: result.nextSteps || [],
          dataQuality: result.dataQuality || {
            completeness: "Low",
            missingInformation: [],
            suggestedTests: []
          },
          metadata: {
            analysisDate: new Date().toISOString(),
            source: patientInfo.fileMetadata ? {
              fileName: patientInfo.fileMetadata.fileName,
              fileType: patientInfo.fileMetadata.fileType,
              pageCount: patientInfo.fileMetadata.pageCount
            } : 'Manual Entry'
          }
        };
        
        setAnalysis(completeResult);
        setProgress(100);
        
        // Track the patient analysis activity with more details
        ActivityService.addActivity(
          'analysis',
          `Patient analysis completed`,
          `Analyzed ${patientInfo.fileMetadata ? 
            `${patientInfo.fileMetadata.fileName} (${patientInfo.fileMetadata.fileType})` : 
            'manually entered data'} with ${patientInfo.patientData.length} characters`
        );
        
        toast({
          title: "Analysis Complete",
          description: "Your patient analysis has been processed successfully.",
        });
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error('Analysis error:', error);
      
      ActivityService.addActivity(
        'analysis',
        `Patient analysis failed`,
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "There was an error processing your analysis. Please try again.",
      });
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
    }
  };

  const handleProceedToRecommendations = () => {
    if (!analysis) {
      toast({
        variant: "destructive",
        title: "No analysis available",
        description: "Please complete the patient analysis first.",
      });
      return;
    }
    
    // Store both the analysis and patient information
    const dataToStore = {
      analysis,
      patientInfo
    };
    
    localStorage.setItem('patientAnalysis', JSON.stringify(dataToStore));
    localStorage.setItem('currentPatientAnalysis', JSON.stringify(dataToStore)); // Store current analysis
    
    // Track the navigation to recommendations
    ActivityService.addActivity(
      'view',
      `Proceeded to drug recommendations`,
      `Based on patient analysis`
    );
    
    // Navigate to drug recommendations page
    navigate('/drug-recommendation');
  };

  const handleResetAnalysis = () => {
    const confirmed = window.confirm('Are you sure you want to clear the current analysis and start over?');
    if (confirmed) {
      handleClear();
      toast({
        title: "Analysis Reset",
        description: "The current analysis has been cleared. You can now start a new analysis.",
      });
    }
  };

  const generatePDF = async () => {
    if (!analysis) return;

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Add header with border bottom
      pdf.setFontSize(24);
      pdf.setTextColor(44, 62, 80);
      pdf.text('Patient Analysis Report', pdfWidth / 2, 20, { align: 'center' });
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, 25, pdfWidth - 20, 25);
      
      // Add timestamp
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, pdfWidth / 2, 35, { align: 'center' });
      
      // Add patient information section
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      let yPos = 50;
      
      // Add patient info section with border
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text('Patient Information', 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'normal');

      // Format patient info
      const patientData = patientInfo.patientData.split('\n').map(line => line.trim()).filter(Boolean);
      patientData.forEach(line => {
        const lines = pdf.splitTextToSize(line, pdfWidth - 40);
        pdf.text(lines, 20, yPos);
        yPos += (lines.length * 7);
      });
      
      yPos += 10;
      pdf.setDrawColor(220, 220, 220);
      pdf.line(20, yPos - 5, pdfWidth - 20, yPos - 5);
      yPos += 10;

      // Add diagnosis section with border
      if (analysis.diagnosis) {
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.text('Diagnosis', 20, yPos);
        yPos += 10;
        
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'normal');
        
        if (Array.isArray(analysis.diagnosis)) {
          analysis.diagnosis.forEach((item: any) => {
            if (typeof item === 'object') {
              pdf.setFont(undefined, 'bold');
              pdf.text(item.condition, 25, yPos);
              yPos += 7;
              
              if (item.confidenceLevel) {
                pdf.setFont(undefined, 'normal');
                pdf.text(`Confidence: ${item.confidenceLevel}`, 30, yPos);
                yPos += 7;
              }
              
              if (item.description) {
                const descLines = pdf.splitTextToSize(item.description, pdfWidth - 60);
                pdf.text(descLines, 30, yPos);
                yPos += (descLines.length * 7);
              }
            } else {
              pdf.text(item.toString(), 25, yPos);
              yPos += 7;
            }
            yPos += 3;
          });
        }
        yPos += 5;
        pdf.line(20, yPos - 5, pdfWidth - 20, yPos - 5);
        yPos += 10;
      }

      // Check if we need a new page
      if (yPos > pdfHeight - 60) {
        pdf.addPage();
        yPos = 20;
      }

      // Add risk factors section with border
      if (analysis.riskFactors) {
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.text('Risk Factors', 20, yPos);
        yPos += 10;
        
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'normal');
        
        if (Array.isArray(analysis.riskFactors)) {
          analysis.riskFactors.forEach((item: any) => {
            if (typeof item === 'object') {
              pdf.setFont(undefined, 'bold');
              pdf.text(item.factor, 25, yPos);
              yPos += 7;
              
              if (item.impact) {
                pdf.setFont(undefined, 'normal');
                pdf.text(`Impact: ${item.impact}`, 30, yPos);
                yPos += 7;
              }
              
              if (item.description) {
                const descLines = pdf.splitTextToSize(item.description, pdfWidth - 60);
                pdf.text(descLines, 30, yPos);
                yPos += (descLines.length * 7);
              }
            } else {
              pdf.text(item.toString(), 25, yPos);
              yPos += 7;
            }
            yPos += 3;
          });
        }
        yPos += 5;
        pdf.line(20, yPos - 5, pdfWidth - 20, yPos - 5);
        yPos += 10;
      }

      // Check if we need a new page
      if (yPos > pdfHeight - 60) {
        pdf.addPage();
        yPos = 20;
      }

      // Add recommendations section with border
      if (analysis.recommendations) {
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.text('Recommendations', 20, yPos);
        yPos += 10;
        
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'normal');
        
        if (Array.isArray(analysis.recommendations)) {
          analysis.recommendations.forEach((item: any, index: number) => {
            if (typeof item === 'object') {
              pdf.setFont(undefined, 'bold');
              pdf.text(item.recommendation, 25, yPos);
              yPos += 7;
              
              if (item.reason) {
                pdf.setFont(undefined, 'normal');
                const reasonLines = pdf.splitTextToSize(`Reason: ${item.reason}`, pdfWidth - 60);
                pdf.text(reasonLines, 30, yPos);
                yPos += (reasonLines.length * 7);
              }
              
              if (item.priority) {
                pdf.text(`Priority: ${item.priority}`, 30, yPos);
                yPos += 7;
              }
            } else {
              pdf.text(item.toString(), 25, yPos);
              yPos += 7;
            }
            yPos += 3;
          });
        }
        yPos += 5;
        pdf.line(20, yPos - 5, pdfWidth - 20, yPos - 5);
        yPos += 10;
      }

      // Check if we need a new page
      if (yPos > pdfHeight - 60) {
        pdf.addPage();
        yPos = 20;
      }

      // Add next steps section with border
      if (analysis.nextSteps) {
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.text('Next Steps', 20, yPos);
        yPos += 10;
        
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'normal');
        
        if (Array.isArray(analysis.nextSteps)) {
          analysis.nextSteps.forEach((item: any, index: number) => {
            if (typeof item === 'object') {
              pdf.setFont(undefined, 'bold');
              pdf.text(item.step, 25, yPos);
              yPos += 7;
              
              if (item.reason) {
                pdf.setFont(undefined, 'normal');
                const reasonLines = pdf.splitTextToSize(`Reason: ${item.reason}`, pdfWidth - 60);
                pdf.text(reasonLines, 30, yPos);
                yPos += (reasonLines.length * 7);
              }
              
              if (item.timeline) {
                pdf.text(`Timeline: ${item.timeline}`, 30, yPos);
                yPos += 7;
              }
            } else {
              pdf.text(item.toString(), 25, yPos);
              yPos += 7;
            }
            yPos += 3;
          });
        }
        yPos += 5;
        pdf.line(20, yPos - 5, pdfWidth - 20, yPos - 5);
      }

      // Add border around the entire content
      pdf.setDrawColor(180, 180, 180);
      pdf.rect(15, 15, pdfWidth - 30, pdfHeight - 25);
      
      // Add footer with border top
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      pdf.line(20, pdfHeight - 15, pdfWidth - 20, pdfHeight - 15);
      pdf.text('Generated by MedGenius AI', pdfWidth / 2, pdfHeight - 10, { align: 'center' });
      
      // Save the PDF
      pdf.save('patient-analysis-report.pdf');
      
      // Track the PDF generation
      ActivityService.addActivity(
        'download',
        `Generated patient analysis report`,
        `PDF report created successfully`
      );
      
      toast({
        title: "Report Generated",
        description: "Your patient analysis report has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "Could not generate the patient analysis report",
      });
    }
  };

      return (
    <PageContainer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
              Patient Analysis
            </h1>
            {(analysis || patientInfo.patientData) && (
              <Button
                variant="outline"
                onClick={handleResetAnalysis}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                New Analysis
              </Button>
            )}
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analyze patient information to get comprehensive medical insights and recommendations.
          </p>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-4">Patient Analysis</h1>
              <p className="text-gray-600">
                Enter patient information, symptoms, and medical history for AI-powered analysis.
            </p>
          </div>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'manual' | 'upload')} className="mb-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                <TabsTrigger value="upload">Upload Document</TabsTrigger>
              </TabsList>

              <TabsContent value="manual">
                <form onSubmit={handleAnalysis} className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="patientData">Patient Data</Label>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setPatientInfo({ ...patientInfo, patientData: '' })}
                        className="text-xs"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Clear
                      </Button>
                    </div>
                    <Textarea
                      id="patientData"
                      value={patientInfo.patientData}
                      onChange={(e) => setPatientInfo({ ...patientInfo, patientData: e.target.value })}
                      required
                      className="min-h-[300px] font-mono text-sm"
                      placeholder="Enter or paste all patient data here, including:
- Patient name, age, and gender
- Symptoms
- Medical history
- Current medications
- Allergies
- Lab results
- Vital signs
- Any other relevant information"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Enter all patient information in this field. You can copy and paste from electronic health records or other documents.
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Analyzing...' : 'Analyze Patient'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="upload">
                <div className="space-y-6">
                  <FileUpload onFileUpload={(text) => setPatientInfo({ ...patientInfo, patientData: text })} onClear={() => setPatientInfo({ ...patientInfo, patientData: '' })} />
                  
                  <form onSubmit={handleAnalysis} className="space-y-6">
                    <div>
                      <Label htmlFor="uploadedData">Uploaded Patient Data</Label>
                      <Textarea
                        id="uploadedData"
                        value={patientInfo.patientData}
                        onChange={(e) => setPatientInfo({ ...patientInfo, patientData: e.target.value })}
                        className="min-h-[300px] font-mono text-sm"
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Analyzing...' : 'Analyze Patient'}
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>

            <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <GlassCard className="h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Analysis Results</h2>
                  {analysis && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={generatePDF}
                      className="text-xs shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-[1px] font-semibold"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Export Report
                    </Button>
                  )}
                </div>
                
              {!analysis ? (
                  <div className="text-center py-20 text-muted-foreground">
                  {loading ? (
                      <div className="space-y-4">
                        <Loader2 className="h-10 w-10 mx-auto animate-spin text-primary" />
                        <p>Analyzing patient data...</p>
                        <Progress value={progress} className="w-[60%] mx-auto" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Search className="h-10 w-10 mx-auto text-muted-foreground" />
                        <p>Enter patient information to see analysis results</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6 animate-fade-in p-4 bg-white rounded-lg shadow-sm border">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-full mr-4">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-green-800">Analysis Complete</h3>
                          <p className="text-sm text-green-700">Your patient analysis has been processed successfully.</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
                          <div className="p-1.5 bg-primary/10 rounded-full mr-2">
                            <Activity className="h-4 w-4 text-primary" />
                          </div>
                          Diagnosis
                        </h3>
                        <div className="bg-white rounded-lg p-4 shadow-sm border">
                          {Array.isArray(analysis.diagnosis) ? (
                            analysis.diagnosis.map((item: any, index: number) => (
                              <div key={index} className="mb-4 last:mb-0">
                                {typeof item === 'object' ? (
                                  <div className="border-l-4 border-primary pl-3 py-1">
                                    <div className="font-medium text-primary">{item.condition}</div>
                                    {item.confidenceLevel && (
                                      <div className="text-sm text-muted-foreground flex items-center mt-1">
                                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                          item.confidenceLevel === 'High' ? 'bg-green-500' : 
                                          item.confidenceLevel === 'Medium' ? 'bg-yellow-500' : 
                                          'bg-red-500'
                                        }`}></span>
                                        Confidence: {item.confidenceLevel}
                                      </div>
                                    )}
                                    {item.description && (
                                      <div className="text-sm mt-1">{item.description}</div>
                                    )}
                                  </div>
                                ) : (
                                  <div>{item}</div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div>
                              {typeof analysis.diagnosis === 'object' ? (
                                <div>
                                  <div className="font-medium">{analysis.diagnosis.condition}</div>
                                  {analysis.diagnosis.confidenceLevel && (
                                    <div className="text-sm text-muted-foreground">
                                      Confidence: {analysis.diagnosis.confidenceLevel}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div>{analysis.diagnosis}</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
                          <div className="p-1.5 bg-primary/10 rounded-full mr-2">
                            <Shield className="h-4 w-4 text-primary" />
                          </div>
                          Risk Factors
                        </h3>
                        <div className="bg-white rounded-lg p-4 shadow-sm border">
                          {Array.isArray(analysis.riskFactors) ? (
                            analysis.riskFactors.map((item: any, index: number) => (
                              <div key={index} className="mb-4 last:mb-0">
                                {typeof item === 'object' ? (
                                  <div className="border-l-4 border-orange-400 pl-3 py-1">
                                    <div className="font-medium text-orange-700">{item.factor}</div>
                                    {item.impact && (
                                      <div className="text-sm text-muted-foreground flex items-center mt-1">
                                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                          item.impact === 'High' ? 'bg-red-500' : 
                                          item.impact === 'Medium' ? 'bg-yellow-500' : 
                                          'bg-green-500'
                                        }`}></span>
                                        Impact: {item.impact}
                                      </div>
                                    )}
                                    {item.description && (
                                      <div className="text-sm mt-1">{item.description}</div>
                                    )}
                                  </div>
                                ) : (
                                  <div>{item}</div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div>
                              {typeof analysis.riskFactors === 'object' ? (
                                <div>
                                  <div className="font-medium">{analysis.riskFactors.factor}</div>
                                  {analysis.riskFactors.impact && (
                                    <div className="text-sm text-muted-foreground">
                                      Impact: {analysis.riskFactors.impact}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div>{analysis.riskFactors}</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
                          <div className="p-1.5 bg-primary/10 rounded-full mr-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                          </div>
                          Recommendations
                        </h3>
                        <div className="bg-white rounded-lg p-4 shadow-sm border">
                          {Array.isArray(analysis.recommendations) ? (
                            analysis.recommendations.map((item: any, index: number) => (
                              <div key={index} className="mb-4 last:mb-0">
                                {typeof item === 'object' ? (
                                  <div className="border-l-4 border-blue-400 pl-3 py-1">
                                    <div className="font-medium text-blue-700">{item.recommendation}</div>
                                    {item.reason && (
                                      <div className="text-sm mt-1">
                                        Reason: {item.reason}
                                      </div>
                                    )}
                                    {item.priority && (
                                      <div className="text-sm text-muted-foreground flex items-center mt-1">
                                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                          item.priority === 'High' ? 'bg-red-500' : 
                                          item.priority === 'Medium' ? 'bg-yellow-500' : 
                                          'bg-green-500'
                                        }`}></span>
                                        Priority: {item.priority}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div>{item}</div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div>
                              {typeof analysis.recommendations === 'object' ? (
                                <div>
                                  <div className="font-medium">{analysis.recommendations.recommendation}</div>
                                  {analysis.recommendations.reason && (
                                    <div className="text-sm text-muted-foreground">
                                      Reason: {analysis.recommendations.reason}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div>{analysis.recommendations}</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
                          <div className="p-1.5 bg-primary/10 rounded-full mr-2">
                            <ArrowRight className="h-4 w-4 text-primary" />
                          </div>
                          Next Steps
                        </h3>
                        <div className="bg-white rounded-lg p-4 shadow-sm border">
                          {Array.isArray(analysis.nextSteps) ? (
                            analysis.nextSteps.map((item: any, index: number) => (
                              <div key={index} className="mb-4 last:mb-0">
                                {typeof item === 'object' ? (
                                  <div className="border-l-4 border-green-400 pl-3 py-1">
                                    <div className="font-medium text-green-700">{item.step}</div>
                                    {item.reason && (
                                      <div className="text-sm mt-1">
                                        Reason: {item.reason}
                                      </div>
                                    )}
                                    {item.timeline && (
                                      <div className="text-sm text-muted-foreground flex items-center mt-1">
                                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                          item.timeline === 'Immediate' ? 'bg-red-500' : 
                                          item.timeline === 'Soon' ? 'bg-yellow-500' : 
                                          'bg-green-500'
                                        }`}></span>
                                          Timeline: {item.timeline}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div>{item}</div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div>
                              {typeof analysis.nextSteps === 'object' ? (
                                <div>
                                  <div className="font-medium">{analysis.nextSteps.step}</div>
                                  {analysis.nextSteps.reason && (
                                    <div className="text-sm text-muted-foreground">
                                      Reason: {analysis.nextSteps.reason}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div>{analysis.nextSteps}</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleProceedToRecommendations}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Proceed to Recommendations
                      </Button>
                    </div>
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        </div>
      
        <Disclaimer className="mt-16" />
    </div>
    </PageContainer>
  );
};

export default PatientAnalysis;
