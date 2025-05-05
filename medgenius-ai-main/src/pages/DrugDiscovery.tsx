import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/GlassCard";
import { 
  Beaker, Atom, Sparkles, FileSymlink, 
  DownloadCloud, Dna, Loader2, CircleEqual,
  ArrowRightLeft, ShieldAlert, CheckCircle,
  Microscope 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Custom BeakerIcon component - renamed to CustomBeakerIcon to avoid conflict
const CustomBeakerIcon = ({ className }: { className?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8 3v4a1 1 0 0 1-1 1H3" />
      <path d="M10 3h4a1 1 0 0 1 1 1v19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h6" />
      <path d="M6 12V8c0-.34.03-.67.08-1" />
      <path d="M14 12V7c0-1.66-1-3-3-3" />
      <path d="M7 16H6" />
      <path d="M7 19h3" />
      <path d="M14 3h1a2 2 0 0 1 2 2v2" />
      <path d="M18 10v.9" />
      <path d="M18 16c0 2.5-2.5 3-3 3" />
      <path d="M22 12h-7" />
      <path d="M17 13v4" />
    </svg>
  );
};

// Sample generated molecules
const generatedMolecules = [
  {
    id: "MOL-001",
    name: "Compound AZ-42195",
    formula: "C₂₁H₂₃N₃O₄",
    targetReceptor: "SGLT2 Inhibitor",
    confidence: 89,
    efficacy: 92,
    toxicity: "Low",
    bioavailability: "High",
    synthesizability: "Medium",
    diagram: "/placeholder.svg", // Placeholder for molecule diagram
    description: "Novel sodium-glucose transport protein 2 (SGLT2) inhibitor with enhanced selectivity and reduced off-target effects compared to existing molecules. Shows promise for type 2 diabetes treatment."
  },
  {
    id: "MOL-002",
    name: "Compound BQ-78310",
    formula: "C₁₉H₂₂FN₅O",
    targetReceptor: "JAK1 Inhibitor",
    confidence: 84,
    efficacy: 88,
    toxicity: "Very Low",
    bioavailability: "Medium",
    synthesizability: "High",
    diagram: "/placeholder.svg", // Placeholder for molecule diagram
    description: "Selective JAK1 inhibitor designed for inflammatory conditions with reduced immunosuppressive side effects. Molecular docking simulations suggest strong binding affinity to the target."
  },
  {
    id: "MOL-003",
    name: "Compound CR-11056",
    formula: "C₂₃H₂₅N₅O₂S",
    targetReceptor: "5-HT Receptor Agonist",
    confidence: 79,
    efficacy: 85,
    toxicity: "Low",
    bioavailability: "High",
    synthesizability: "Medium",
    diagram: "/placeholder.svg", // Placeholder for molecule diagram
    description: "Novel serotonin receptor agonist with increased selectivity for 5-HT1A receptors, potentially useful for anxiety disorders with reduced side effects compared to existing treatments."
  }
];

const DrugDiscovery = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedMolecule, setSelectedMolecule] = useState<any>(null);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGenerateMolecules = () => {
    setIsGenerating(true);
    setProgress(0);
    setGenerationComplete(false);
    setSelectedMolecule(null);

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGenerating(false);
            setGenerationComplete(true);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto py-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              AI-Driven Drug Discovery
            </h1>
            <p className="text-lg text-muted-foreground">
              Generate novel drug molecules and evaluate their properties using our cutting-edge AI technology and reinforcement learning.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Controls */}
            <div className="lg:col-span-2 animate-slide-up">
              <GlassCard>
                <h2 className="text-xl font-semibold mb-6">Molecule Generation</h2>
                
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Target Disease/Condition</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          <Microscope className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Type 2 Diabetes Mellitus</h4>
                          <p className="text-sm text-muted-foreground">With focus on SGLT2 inhibition</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">AI Model Parameters</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-muted-foreground">Generation Method:</span>
                        <span className="font-medium">Generative Adversarial Networks</span>
                        
                        <span className="text-muted-foreground">Molecular Weight Range:</span>
                        <span className="font-medium">250-500 Da</span>
                        
                        <span className="text-muted-foreground">Binding Affinity Target:</span>
                        <span className="font-medium">SGLT2 Transporter</span>
                        
                        <span className="text-muted-foreground">Optimization Goal:</span>
                        <span className="font-medium">Efficacy + Bioavailability</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Additional Constraints</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span className="text-sm">Reduce hepatic metabolism</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span className="text-sm">Minimize off-target effects</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span className="text-sm">Prioritize synthetic accessibility</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    {isGenerating ? (
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Generating molecules</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {progress < 30 ? (
                            "Initializing molecular generation algorithms..."
                          ) : progress < 60 ? (
                            "Applying reinforcement learning to optimize structures..."
                          ) : (
                            "Evaluating drug-likeness and synthesizability..."
                          )}
                        </div>
                      </div>
                    ) : (
                      <Button 
                        className="w-full" 
                        onClick={handleGenerateMolecules}
                        disabled={isGenerating}
                      >
                        {generationComplete ? (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate New Molecules
                          </>
                        ) : (
                          <>
                            <CustomBeakerIcon className="mr-2 h-4 w-4" />
                            Start AI Generation
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </GlassCard>
            </div>
            
            {/* Results */}
            <div className="lg:col-span-3 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <GlassCard>
                <h2 className="text-xl font-semibold mb-6">AI-Generated Molecules</h2>
                
                {!generationComplete && !isGenerating ? (
                  <div className="text-center py-20 text-muted-foreground">
                    <Atom className="h-16 w-16 mx-auto text-muted-foreground opacity-20 mb-4" />
                    <p className="max-w-md mx-auto">
                      Configure your parameters and click "Start AI Generation" to create novel drug candidates with our AI system.
                    </p>
                  </div>
                ) : isGenerating ? (
                  <div className="text-center py-12 animate-fade-in">
                    <div className="relative mx-auto w-32 h-32 mb-6">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Atom className="h-16 w-16 text-primary animate-pulse" />
                      </div>
                      <div className="absolute inset-0 animate-spin [animation-duration:8s]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary-200"></div>
                      </div>
                      <div className="absolute inset-0 animate-spin [animation-duration:12s] [animation-direction:reverse]">
                        <div className="absolute bottom-4 right-0 w-3 h-3 rounded-full bg-primary-300"></div>
                      </div>
                      <div className="absolute inset-0 animate-spin [animation-duration:15s]">
                        <div className="absolute bottom-0 left-6 w-5 h-5 rounded-full bg-primary-400"></div>
                      </div>
                    </div>
                    <h3 className="font-medium">Generating novel molecules</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
                      Our AI is analyzing thousands of molecular combinations and optimizing for your specified parameters.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fade-in">
                    <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="structures">Structures</TabsTrigger>
                        <TabsTrigger value="properties">Properties</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          {generatedMolecules.map((molecule, index) => (
                            <div
                              key={index}
                              className={cn(
                                "border rounded-lg p-4 cursor-pointer transition-all duration-300",
                                selectedMolecule === molecule 
                                  ? "border-primary bg-primary-50/50 shadow-sm" 
                                  : "hover:border-primary/30 hover:shadow-sm"
                              )}
                              onClick={() => setSelectedMolecule(molecule)}
                            >
                              <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div className="bg-gray-100 rounded-lg p-3 w-full md:w-28 h-28 md:h-28 flex items-center justify-center">
                                  <Atom className="h-12 w-12 text-primary" />
                                </div>
                                
                                <div className="flex-grow">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h3 className="font-medium">{molecule.name}</h3>
                                      <p className="text-sm text-muted-foreground">{molecule.formula}</p>
                                    </div>
                                    <div className="bg-primary-50 text-primary text-xs font-medium px-2 py-1 rounded">
                                      {molecule.id}
                                    </div>
                                  </div>
                                  
                                  <p className="text-sm mb-3 line-clamp-2">
                                    {molecule.description}
                                  </p>
                                  
                                  <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div>
                                      <span className="text-muted-foreground">Target: </span>
                                      <span className="font-medium">{molecule.targetReceptor}</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Efficacy: </span>
                                      <span className="font-medium">{molecule.efficacy}%</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Toxicity: </span>
                                      <span className="font-medium">{molecule.toxicity}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="structures">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {generatedMolecules.map((molecule, index) => (
                            <div
                              key={index}
                              className="border rounded-lg p-4 flex flex-col items-center"
                            >
                              <h3 className="font-medium text-center mb-4">{molecule.name}</h3>
                              <div className="bg-gray-100 rounded-lg p-6 w-full h-48 flex items-center justify-center mb-4">
                                <div className="relative">
                                  <Atom className="h-16 w-16 text-primary mx-auto" />
                                  <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                                    <CircleEqual className="h-6 w-6 text-primary-700" />
                                  </div>
                                </div>
                              </div>
                              <div className="text-center space-y-1">
                                <p className="text-sm font-mono">{molecule.formula}</p>
                                <p className="text-xs text-muted-foreground">Molecular Weight: 384.43 g/mol</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="properties">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="text-left p-3 text-sm font-medium">Molecule</th>
                                <th className="text-center p-3 text-sm font-medium">Efficacy</th>
                                <th className="text-center p-3 text-sm font-medium">Toxicity</th>
                                <th className="text-center p-3 text-sm font-medium">Bioavailability</th>
                                <th className="text-center p-3 text-sm font-medium">Synthesizability</th>
                                <th className="text-center p-3 text-sm font-medium">Confidence</th>
                              </tr>
                            </thead>
                            <tbody>
                              {generatedMolecules.map((molecule, index) => (
                                <tr key={index} className="border-b">
                                  <td className="p-3 text-sm font-medium">{molecule.name}</td>
                                  <td className="p-3 text-sm text-center">
                                    <div className="inline-flex items-center">
                                      <span className="font-medium mr-2">{molecule.efficacy}%</span>
                                      <Progress value={molecule.efficacy} className="h-1.5 w-16" />
                                    </div>
                                  </td>
                                  <td className="p-3 text-sm text-center">
                                    <span className={cn(
                                      "px-2 py-1 rounded-full text-xs font-medium",
                                      molecule.toxicity === "Low" ? "bg-green-100 text-green-700" :
                                      molecule.toxicity === "Very Low" ? "bg-green-100 text-green-700" :
                                      molecule.toxicity === "Medium" ? "bg-amber-100 text-amber-700" :
                                      "bg-red-100 text-red-700"
                                    )}>
                                      {molecule.toxicity}
                                    </span>
                                  </td>
                                  <td className="p-3 text-sm text-center">
                                    <span className={cn(
                                      "px-2 py-1 rounded-full text-xs font-medium",
                                      molecule.bioavailability === "High" ? "bg-green-100 text-green-700" :
                                      molecule.bioavailability === "Medium" ? "bg-blue-100 text-blue-700" :
                                      "bg-amber-100 text-amber-700"
                                    )}>
                                      {molecule.bioavailability}
                                    </span>
                                  </td>
                                  <td className="p-3 text-sm text-center">
                                    <span className={cn(
                                      "px-2 py-1 rounded-full text-xs font-medium",
                                      molecule.synthesizability === "High" ? "bg-green-100 text-green-700" :
                                      molecule.synthesizability === "Medium" ? "bg-blue-100 text-blue-700" :
                                      "bg-amber-100 text-amber-700"
                                    )}>
                                      {molecule.synthesizability}
                                    </span>
                                  </td>
                                  <td className="p-3 text-sm text-center">
                                    <div className="inline-flex items-center">
                                      <span className="font-medium mr-2">{molecule.confidence}%</span>
                                      <Progress value={molecule.confidence} className="h-1.5 w-16" />
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    {selectedMolecule && activeTab === "overview" && (
                      <div className="mt-6 border-t pt-6 animate-fade-in">
                        <h3 className="text-lg font-semibold mb-4">Detailed Analysis: {selectedMolecule.name}</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                          <div className="md:col-span-1">
                            <div className="bg-gray-50 rounded-lg p-6 h-full flex flex-col justify-center items-center">
                              <Atom className="h-20 w-20 text-primary mb-4" />
                              <div className="text-center">
                                <p className="font-mono text-sm">{selectedMolecule.formula}</p>
                                <p className="text-xs text-muted-foreground">Target: {selectedMolecule.targetReceptor}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="md:col-span-2">
                            <div className="space-y-4">
                              <p className="text-sm">{selectedMolecule.description}</p>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <div className="flex items-center mb-1">
                                    <ArrowRightLeft className="h-4 w-4 text-primary mr-2" />
                                    <span className="text-sm font-medium">Binding Affinity</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Progress value={selectedMolecule.efficacy} className="h-2 flex-grow mr-2" />
                                    <span className="text-sm font-medium">{selectedMolecule.efficacy}%</span>
                                  </div>
                                </div>
                                
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <div className="flex items-center mb-1">
                                    <ShieldAlert className="h-4 w-4 text-primary mr-2" />
                                    <span className="text-sm font-medium">Safety Profile</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-sm">{selectedMolecule.toxicity} toxicity</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                          <Button variant="outline" size="sm">
                            <FileSymlink className="h-4 w-4 mr-2" />
                            Export to Lab
                          </Button>
                          <Button variant="outline" size="sm">
                            <Dna className="h-4 w-4 mr-2" />
                            Molecular Simulation
                          </Button>
                          <Button size="sm">
                            <DownloadCloud className="h-4 w-4 mr-2" />
                            Download Structure
                          </Button>
                        </div>
                      </div>
                    )}
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

export default DrugDiscovery;
