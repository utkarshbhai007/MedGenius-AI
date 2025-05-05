import * as React from "react";
import { useState, useEffect } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Search,
  Loader2,
  Microscope,
  Atom,
  FlaskConical,
  Scale,
  Brain,
  FileText,
  Tag,
  Link,
  Beaker,
  Download
} from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Disclaimer } from "@/components/ui/Disclaimer";
import ActivityService from "@/services/ActivityService";

interface PubChemCompound {
  CID: string;
  molecularFormula: string;
  molecularWeight: string;
  iupacName: string;
  canonicalSmiles: string;
  image2D: string;
  properties: {
    [key: string]: string | number;
  };
}

const DrugDiscovery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pubchemData, setPubchemData] = useState<PubChemCompound | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const searchPubChem = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      // First, search for the compound to get its CID
      const searchResponse = await fetch(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(query)}/cids/JSON`
      );
      const searchData = await searchResponse.json();
      
      if (!searchData.IdentifierList?.CID?.[0]) {
        throw new Error('Compound not found');
      }

      const cid = searchData.IdentifierList.CID[0];

      // Get compound details
      const detailsResponse = await fetch(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularFormula,MolecularWeight,IUPACName,CanonicalSMILES/JSON`
      );
      const detailsData = await detailsResponse.json();
      
      // Get 2D structure image
      const imageUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG`;

      const compound: PubChemCompound = {
        CID: cid.toString(),
        molecularFormula: detailsData.PropertyTable.Properties[0].MolecularFormula,
        molecularWeight: detailsData.PropertyTable.Properties[0].MolecularWeight,
        iupacName: detailsData.PropertyTable.Properties[0].IUPACName,
        canonicalSmiles: detailsData.PropertyTable.Properties[0].CanonicalSMILES,
        image2D: imageUrl,
        properties: detailsData.PropertyTable.Properties[0]
      };

      setPubchemData(compound);
      
      // Track the successful search activity
      ActivityService.addActivity(
        'search', 
        `Searched for drug compound: ${query}`, 
        `Found compound with CID: ${cid}`
      );
      
      toast({
        title: "Found compound",
        description: `Successfully retrieved data for ${query}`,
      });
    } catch (error) {
      console.error('Error searching PubChem:', error);
      
      // Track the failed search activity
      ActivityService.addActivity(
        'search', 
        `Search failed for drug compound: ${query}`, 
        `Error: Compound not found`
      );
      
      toast({
        variant: "destructive",
        title: "Search failed",
        description: "Could not find compound in PubChem database",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openPubChemPage = (cid: string) => {
    window.open(`https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`, '_blank');
  };

  const generatePDF = async () => {
    if (!pubchemData) return;

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Add header with border bottom
      pdf.setFontSize(24);
      pdf.setTextColor(44, 62, 80);
      pdf.text('Drug Compound Report', pdfWidth / 2, 20, { align: 'center' });
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, 25, pdfWidth - 20, 25);
      
      // Add timestamp
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, pdfWidth / 2, 35, { align: 'center' });
      
      // Add compound name with border bottom
      pdf.setFontSize(18);
      pdf.setTextColor(44, 62, 80);
      pdf.text(searchQuery.toUpperCase(), pdfWidth / 2, 50, { align: 'center' });
      pdf.line(20, 55, pdfWidth - 20, 55);
      
      // Add compound details
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      let yPos = 70;
      
      // Add molecular formula with section border
      pdf.setFont(undefined, 'bold');
      pdf.text('Molecular Formula:', 20, yPos);
      pdf.setFont(undefined, 'normal');
      pdf.text(pubchemData.molecularFormula, 80, yPos);
      yPos += 15;
      pdf.setDrawColor(220, 220, 220);
      pdf.line(20, yPos - 5, pdfWidth - 20, yPos - 5);
      
      // Add molecular weight with section border
      pdf.setFont(undefined, 'bold');
      pdf.text('Molecular Weight:', 20, yPos);
      pdf.setFont(undefined, 'normal');
      pdf.text(`${pubchemData.molecularWeight} g/mol`, 80, yPos);
      yPos += 15;
      pdf.line(20, yPos - 5, pdfWidth - 20, yPos - 5);
      
      // Add IUPAC name with section border
      pdf.setFont(undefined, 'bold');
      pdf.text('IUPAC Name:', 20, yPos);
      pdf.setFont(undefined, 'normal');
      const iupacLines = pdf.splitTextToSize(pubchemData.iupacName, pdfWidth - 100);
      pdf.text(iupacLines, 80, yPos);
      yPos += (iupacLines.length * 7) + 8;
      pdf.line(20, yPos - 3, pdfWidth - 20, yPos - 3);
      
      // Add SMILES with section border
      pdf.setFont(undefined, 'bold');
      pdf.text('SMILES:', 20, yPos);
      pdf.setFont(undefined, 'normal');
      const smilesLines = pdf.splitTextToSize(pubchemData.canonicalSmiles, pdfWidth - 100);
      pdf.text(smilesLines, 80, yPos);
      yPos += (smilesLines.length * 7) + 8;
      pdf.line(20, yPos - 3, pdfWidth - 20, yPos - 3);
      
      // Add PubChem CID with section border
      pdf.setFont(undefined, 'bold');
      pdf.text('PubChem CID:', 20, yPos);
      pdf.setFont(undefined, 'normal');
      pdf.text(pubchemData.CID, 80, yPos);
      yPos += 15;
      pdf.line(20, yPos - 5, pdfWidth - 20, yPos - 5);
      
      // Add section title for 2D structure
      yPos += 10;
      pdf.setFont(undefined, 'bold');
      pdf.text('2D Structure:', pdfWidth / 2, yPos, { align: 'center' });
      yPos += 10;
      
      // Add 2D structure image using canvas to handle CORS
      try {
        const response = await fetch(pubchemData.image2D);
        const blob = await response.blob();
        const base64data = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });

        const img = new Image();
        img.crossOrigin = "Anonymous";
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = base64data as string;
        });

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 100;
        const imgHeight = (img.height * imgWidth) / img.width;
        pdf.addImage(imgData, 'PNG', (pdfWidth - imgWidth) / 2, yPos, imgWidth, imgHeight);
      } catch (error) {
        console.error('Error adding image to PDF:', error);
        pdf.text('Could not load 2D structure image', pdfWidth / 2, yPos, { align: 'center' });
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
      pdf.save(`${searchQuery.toLowerCase()}-report.pdf`);
      
      // Track the PDF generation activity
      ActivityService.addActivity(
        'download', 
        `Generated report for drug compound: ${searchQuery}`, 
        `Molecular formula: ${pubchemData.molecularFormula}`
      );
      
      toast({
        title: "Report Generated",
        description: "Your compound report has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "Could not generate the compound report",
      });
    }
  };

  return (
    <PageContainer>
      <div className="py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
            Drug Discovery Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analyze potential drug candidates and their properties using AI.
          </p>
        </div>

        <div className="py-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <Card className="p-6">
              <div className="space-y-8">
                {/* Search Section */}
                <div>
                  <div className="flex gap-4">
                    <Input
                      placeholder="Enter compound name (e.g., Aspirin, Paracetamol)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-grow"
                    />
                    <Button 
                      onClick={() => searchPubChem(searchQuery)}
                      disabled={isLoading || !searchQuery.trim()}
                      variant="default"
                      className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-[1px] font-semibold"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Search
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Results Section */}
                <div>
                  {isLoading ? (
                    <div className="text-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                      <p className="text-muted-foreground">Searching compound database...</p>
                    </div>
                  ) : !pubchemData ? (
                    <div className="text-center py-12">
                      <Microscope className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Enter a compound name to see detailed chemical information
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-fade-in">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Compound Details</h2>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={generatePDF}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export Report
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="bg-muted/10 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-primary mb-1">
                              <Atom className="h-4 w-4" />
                              <span className="text-sm font-medium">Molecular Formula</span>
                            </div>
                            <p className="text-sm ml-6">{pubchemData.molecularFormula}</p>
                          </div>

                          <div className="bg-muted/10 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-primary mb-1">
                              <Scale className="h-4 w-4" />
                              <span className="text-sm font-medium">Molecular Weight</span>
                            </div>
                            <p className="text-sm ml-6">{pubchemData.molecularWeight} g/mol</p>
                          </div>

                          <div className="bg-muted/10 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-primary mb-1">
                              <FileText className="h-4 w-4" />
                              <span className="text-sm font-medium">IUPAC Name</span>
                            </div>
                            <p className="text-sm ml-6">{pubchemData.iupacName}</p>
                          </div>

                          <div className="bg-muted/10 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-primary mb-1">
                              <Link className="h-4 w-4" />
                              <span className="text-sm font-medium">SMILES</span>
                            </div>
                            <p className="text-sm ml-6 font-mono break-all">
                              {pubchemData.canonicalSmiles}
                            </p>
                          </div>

                          <div className="bg-muted/10 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-primary mb-1">
                              <Tag className="h-4 w-4" />
                              <span className="text-sm font-medium">PubChem CID</span>
                            </div>
                            <p className="text-sm ml-6">{pubchemData.CID}</p>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 flex items-center justify-center border">
                          <img 
                            src={pubchemData.image2D} 
                            alt={pubchemData.iupacName}
                            className="max-w-full max-h-[250px] object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Disclaimer className="mt-16" />
      </div>
    </PageContainer>
  );
};

export default DrugDiscovery;
