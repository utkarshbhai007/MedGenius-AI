import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GlassCard from "@/components/ui/GlassCard";
import { Users, FileText, Search, CheckCircle, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ClinicalTrials = () => {
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [phase, setPhase] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { toast } = useToast();

  const sampleTrials = [
    {
      id: "NCT04832932",
      title: "A Study of Gene Therapy for Metachromatic Leukodystrophy",
      condition: "Metachromatic Leukodystrophy",
      phase: "Phase 1/2",
      status: "Recruiting",
      location: "Boston, Massachusetts",
      institution: "Boston Children's Hospital",
      contactName: "Dr. Sarah Johnson",
      contactEmail: "s.johnson@example.edu",
      eligibility: "Children ages 3-17 with confirmed diagnosis of MLD",
      description: "This study evaluates the safety and efficacy of a gene therapy approach for treating Metachromatic Leukodystrophy (MLD), a rare genetic disorder affecting the nervous system."
    },
    {
      id: "NCT04751877",
      title: "Immunotherapy Combination for Advanced Rare Cancers",
      condition: "Rare Cancers",
      phase: "Phase 2",
      status: "Recruiting",
      location: "Houston, Texas",
      institution: "MD Anderson Cancer Center",
      contactName: "Dr. Michael Chen",
      contactEmail: "m.chen@example.org",
      eligibility: "Adults with advanced rare solid tumors that have progressed on standard therapies",
      description: "This trial investigates a novel combination of immunotherapy agents targeting rare cancer types with high unmet medical need."
    },
    {
      id: "NCT04962451",
      title: "Novel Treatment for Familial Amyloid Polyneuropathy",
      condition: "Familial Amyloid Polyneuropathy",
      phase: "Phase 3",
      status: "Recruiting",
      location: "San Francisco, California",
      institution: "UCSF Medical Center",
      contactName: "Dr. Emily Rodriguez",
      contactEmail: "e.rodriguez@example.net",
      eligibility: "Adults aged 18-75 with genetically confirmed hATTR amyloidosis with polyneuropathy",
      description: "A randomized, double-blind, placebo-controlled study evaluating the efficacy and safety of a novel RNA-targeting therapy for patients with hereditary transthyretin-mediated amyloidosis."
    }
  ];

  const handleSearch = () => {
    if (!condition && !location && !phase) {
      toast({
        title: "Search criteria required",
        description: "Please enter at least one search criterion.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      let results = [...sampleTrials];
      
      if (condition) {
        results = results.filter(trial => 
          trial.condition.toLowerCase().includes(condition.toLowerCase())
        );
      }
      
      if (location) {
        results = results.filter(trial => 
          trial.location.toLowerCase().includes(location.toLowerCase())
        );
      }
      
      if (phase) {
        results = results.filter(trial => 
          trial.phase === phase
        );
      }
      
      setSearchResults(results);
      setIsLoading(false);
      
      toast({
        title: `Found ${results.length} trials`,
        description: results.length > 0 
          ? "Clinical trials matching your criteria." 
          : "No clinical trials found matching your criteria. Try broadening your search.",
      });
    }, 1500);
  };

  const handleDownload = (trial: any) => {
    const jsonData = JSON.stringify(trial, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `clinical_trial_${trial.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download complete",
      description: `Information for trial ${trial.id} has been downloaded.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/10 bg-primary/5 text-primary-600 mb-4">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Clinical Trials</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Clinical Trial Matching
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect patients with ongoing clinical trials for rare diseases and research institutions based on their profiles.
            </p>
          </div>

          <GlassCard className="max-w-4xl mx-auto mb-12">
            <h2 className="text-xl font-semibold mb-6">Search Clinical Trials</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Medical Condition</label>
                <Input 
                  placeholder="E.g., Rare genetic disorder"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Input 
                  placeholder="City, State, or Country"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Trial Phase</label>
                <Select value={phase} onValueChange={setPhase}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select phase" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Phase</SelectItem>
                    <SelectItem value="Phase 1">Phase 1</SelectItem>
                    <SelectItem value="Phase 1/2">Phase 1/2</SelectItem>
                    <SelectItem value="Phase 2">Phase 2</SelectItem>
                    <SelectItem value="Phase 2/3">Phase 2/3</SelectItem>
                    <SelectItem value="Phase 3">Phase 3</SelectItem>
                    <SelectItem value="Phase 4">Phase 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Find Clinical Trials
                </>
              )}
            </Button>
          </GlassCard>

          {searchResults.length > 0 && (
            <div className="space-y-6 max-w-4xl mx-auto mb-12">
              <h2 className="text-2xl font-semibold">
                Found {searchResults.length} Clinical Trials
              </h2>
              
              {searchResults.map((trial, index) => (
                <GlassCard key={index} className="overflow-hidden">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{trial.title}</h3>
                      <p className="text-sm text-muted-foreground">ID: {trial.id}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                        {trial.phase}
                      </span>
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                        {trial.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Condition</h4>
                      <p className="text-sm">{trial.condition}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Location</h4>
                      <p className="text-sm">{trial.location}</p>
                      <p className="text-sm text-muted-foreground">{trial.institution}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-1">Description</h4>
                    <p className="text-sm">{trial.description}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-1">Eligibility</h4>
                    <p className="text-sm">{trial.eligibility}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-between items-center bg-gray-50 p-4 -mx-6 -mb-6 mt-6">
                    <div>
                      <h4 className="text-sm font-medium">Contact</h4>
                      <p className="text-sm">{trial.contactName} - {trial.contactEmail}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleDownload(trial)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Details
                      </Button>
                      <Button size="sm">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Apply for Patient
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ClinicalTrials;
