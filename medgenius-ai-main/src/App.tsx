
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PatientAnalysis from "./pages/PatientAnalysis";
import DrugRecommendation from "./pages/DrugRecommendation";
import DrugDiscovery from "./pages/DrugDiscovery";
import DiseasePrediction from "./pages/DiseasePrediction";
import SideEffects from "./pages/SideEffects";
import ClinicalTrials from "./pages/ClinicalTrials";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/patient-analysis" element={<PatientAnalysis />} />
          <Route path="/drug-recommendation" element={<DrugRecommendation />} />
          <Route path="/drug-discovery" element={<DrugDiscovery />} />
          <Route path="/disease-prediction" element={<DiseasePrediction />} />
          <Route path="/side-effects" element={<SideEffects />} />
          <Route path="/clinical-trials" element={<ClinicalTrials />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
