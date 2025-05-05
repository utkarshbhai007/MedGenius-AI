import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import InfoCard from "../components/ui/InfoCard";
import { Brain, Microscope, Pill, Stethoscope, Search, Loader2, CheckCircle, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Disclaimer } from "@/components/ui/Disclaimer";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <main className="flex-grow pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
              AI-Powered Drug Discovery Platform
            </h1>
            <p className="text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Revolutionizing healthcare through advanced AI analysis for patient diagnosis,
              drug discovery, and side effect prediction.
            </p>
            {!user && (
              <Button
                className="mt-8"
                size="lg"
                onClick={() => navigate('/login')}
              >
                Get Started
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <InfoCard
              title="Patient Analysis"
              subtitle="Analyze patient symptoms and medical history for accurate disease prediction."
              icon={<Stethoscope className="h-6 w-6" />}
              onClick={() => navigate('/patient-analysis')}
            >
              <span className="sr-only">Go to Patient Analysis</span>
            </InfoCard>
            <InfoCard
              title="Drug Discovery"
              subtitle="Explore and analyze molecular compounds for potential drug candidates."
              icon={<Microscope className="h-6 w-6" />}
              onClick={() => navigate('/drug-discovery')}
            >
              <span className="sr-only">Go to Drug Discovery</span>
            </InfoCard>
            <InfoCard
              title="Side Effects"
              subtitle="Predict potential side effects and drug interactions."
              icon={<Shield className="h-6 w-6" />}
              onClick={() => navigate('/side-effects')}
            >
              <span className="sr-only">Go to Side Effects</span>
            </InfoCard>
          </div>

          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Input Data</h3>
                <p className="text-gray-600">Enter patient symptoms, molecular data, or drug information.</p>
              </div>
              <div className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">2. AI Analysis</h3>
                <p className="text-gray-600">Our AI processes the data using advanced algorithms.</p>
              </div>
              <div className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Get Results</h3>
                <p className="text-gray-600">Receive comprehensive analysis and recommendations.</p>
              </div>
            </div>
          </div>

          <Disclaimer className="mt-16" />
        </div>
      </main>
    </div>
  );
};

export default Index;
