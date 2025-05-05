import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, ArrowLeft } from 'lucide-react';
import jsPDF from 'jspdf';
import PageContainer from '@/components/layout/PageContainer';
import ActivityService from '@/services/ActivityService';

interface PatientSection {
  title: string;
  content: string;
}

export default function AnalysisResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { patientInfo } = location.state || {};
  const [parsedSections, setParsedSections] = useState<PatientSection[]>([]);
  
  useEffect(() => {
    if (patientInfo && patientInfo.patientData) {
      // Parse the patientData into sections
      const sections = extractSectionsFromPatientData(patientInfo.patientData);
      setParsedSections(sections);
      
      // Log activity
      ActivityService.addActivity(
        'view', 
        'Viewed patient analysis results', 
        `Analysis data with ${patientInfo.patientData.length} characters`
      );
    }
  }, [patientInfo]);
  
  // Function to extract sections from the patient data text
  const extractSectionsFromPatientData = (data: string): PatientSection[] => {
    // Default sections
    const defaultSections = [
      { title: 'Patient Information', content: '' },
      { title: 'Symptoms', content: '' },
      { title: 'Medical History', content: '' },
      { title: 'Current Medications', content: '' },
      { title: 'Allergies', content: '' }
    ];
    
    if (!data) return defaultSections;
    
    try {
      // Try to identify sections based on common patterns
      const lines = data.split('\n');
      let currentSection = '';
      const extractedSections: Record<string, string[]> = {};
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Skip empty lines
        if (!trimmedLine) continue;
        
        // Check if this line looks like a section header
        const possibleSectionHeaders = [
          { pattern: /patient|name|age|gender|personal/i, title: 'Patient Information' },
          { pattern: /symptom|sign|complaint|problem/i, title: 'Symptoms' },
          { pattern: /history|past|previous|condition/i, title: 'Medical History' },
          { pattern: /medication|drug|dose|prescription|taking/i, title: 'Current Medications' },
          { pattern: /allerg|reaction|sensitive/i, title: 'Allergies' }
        ];
        
        let foundSection = false;
        for (const { pattern, title } of possibleSectionHeaders) {
          if (pattern.test(trimmedLine)) {
            currentSection = title;
            if (!extractedSections[currentSection]) {
              extractedSections[currentSection] = [];
            }
            foundSection = true;
            break;
          }
        }
        
        if (!foundSection && currentSection) {
          // Add line to current section
          extractedSections[currentSection].push(trimmedLine);
        } else if (!foundSection && !currentSection) {
          // If no section identified yet, put in Patient Information
          currentSection = 'Patient Information';
          if (!extractedSections[currentSection]) {
            extractedSections[currentSection] = [];
          }
          extractedSections[currentSection].push(trimmedLine);
        }
      }
      
      // Convert extracted sections to our format
      return defaultSections.map(section => {
        return {
          title: section.title,
          content: extractedSections[section.title] ? extractedSections[section.title].join('\n') : ''
        };
      });
    } catch (error) {
      console.error('Error parsing patient data:', error);
      
      // If parsing fails, just put all content in the first section
      const fallbackSection = defaultSections[0];
      fallbackSection.content = data;
      return defaultSections;
    }
  };

  const handleDownloadPDF = () => {
    if (!patientInfo) return;
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Patient Analysis Report', 20, 20);
    
    let yPos = 40;
    
    // Add all sections
    parsedSections.forEach(section => {
      if (section.content) {
        // Check if we need a new page
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(section.title, 20, yPos);
        yPos += 10;
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        
        // Handle long text with word wrapping
        const splitText = doc.splitTextToSize(section.content, 170);
        doc.text(splitText, 20, yPos);
        yPos += splitText.length * 7 + 15;
      }
    });
    
    // Add analysis complete note
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Analysis Complete', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Your patient analysis has been processed successfully.', 20, yPos);
    
    // Save the PDF
    doc.save('patient-analysis-report.pdf');
    
    // Log activity
    ActivityService.addActivity(
      'download', 
      'Downloaded patient analysis report', 
      'PDF report generated successfully'
    );
  };

  if (!patientInfo) {
    return (
      <PageContainer>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>No Analysis Data</CardTitle>
                <CardDescription>Please perform a patient analysis first.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/patient/analysis')}>
                  Go to Patient Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => navigate('/patient/analysis')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Analysis
          </Button>
          <Button onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>

        <Card className="mb-6 bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full mr-4">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-green-800">Analysis Complete</h2>
                <p className="text-green-700">Your patient analysis has been processed successfully.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {parsedSections.map((section, index) => (
            section.content && (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{section.content}</p>
                </CardContent>
              </Card>
            )
          ))}
        </div>
      </div>
    </PageContainer>
  );
} 