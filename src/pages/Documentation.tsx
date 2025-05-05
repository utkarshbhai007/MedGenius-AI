import * as React from "react";
import { FileText, Code, Zap, Shield, Book, Terminal } from "lucide-react";

const Documentation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <main className="container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Book className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Documentation</h1>
          </div>
          
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Book className="h-6 w-6 text-blue-600" />
              Introduction
            </h2>
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-600">
                MedGenius AI is an advanced medical assistant platform that leverages artificial intelligence 
                to provide healthcare professionals with powerful tools for patient analysis, drug recommendations, 
                and side effect analysis. This documentation will help you understand and utilize all features 
                of our platform effectively.
              </p>
            </div>
          </section>

          {/* Features */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="h-6 w-6 text-blue-600" />
              Core Features
            </h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-medium text-gray-900 mb-3">Patient Analysis</h3>
                <p className="text-gray-600 mb-4">
                  Our AI-powered patient analysis system processes patient information to provide:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Comprehensive medical analysis</li>
                  <li>Potential diagnosis suggestions</li>
                  <li>Risk factor identification</li>
                  <li>Personalized medical recommendations</li>
                  <li>Suggested next steps for treatment</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-medium text-gray-900 mb-3">Drug Recommendations</h3>
                <p className="text-gray-600 mb-4">
                  Get intelligent drug recommendations based on:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Patient medical history</li>
                  <li>Current symptoms and conditions</li>
                  <li>Known drug interactions</li>
                  <li>Patient-specific factors</li>
                  <li>Treatment effectiveness data</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-medium text-gray-900 mb-3">Drug Discovery</h3>
                <p className="text-gray-600 mb-4">
                  Our AI-powered drug discovery system provides:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Molecular structure analysis</li>
                  <li>Potential drug target identification</li>
                  <li>Drug-likeness prediction</li>
                  <li>ADME (Absorption, Distribution, Metabolism, Excretion) properties</li>
                  <li>Novel compound generation</li>
                  <li>Structure-activity relationship analysis</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-medium text-gray-900 mb-3">Side Effects Analysis</h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive analysis of potential side effects including:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Drug interaction checks</li>
                  <li>Common side effects prediction</li>
                  <li>Risk level assessment</li>
                  <li>Contraindication warnings</li>
                  <li>Alternative medication suggestions</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Getting Started */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Terminal className="h-6 w-6 text-blue-600" />
              Getting Started
            </h2>
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-600 mb-4">
                To begin using MedGenius AI:
              </p>
              <ol className="list-decimal list-inside text-gray-600 space-y-4">
                <li>Create an account or log in to your existing account</li>
                <li>Navigate to the desired analysis tool (Patient Analysis, Drug Recommendations, etc.)</li>
                <li>Enter the required information in the provided fields</li>
                <li>Review the AI-generated analysis and recommendations</li>
                <li>Export or save the results as needed</li>
              </ol>
            </div>
          </section>

          {/* Security */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              Security & Privacy
            </h2>
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-600">
                MedGenius AI prioritizes the security and privacy of your medical data. We employ:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>End-to-end encryption for all data transmission</li>
                <li>Secure data storage compliant with healthcare regulations</li>
                <li>Regular security audits and updates</li>
                <li>Strict access controls and authentication</li>
                <li>Data anonymization and privacy protection measures</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Documentation; 