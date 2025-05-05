import * as React from "react";
import { Code, Database, Lock, Zap, Terminal, Webhook } from "lucide-react";

const ApiReference = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <main className="container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-8">API Reference</h1>
          
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Code className="h-6 w-6 text-blue-600" />
              API Overview
            </h2>
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-600">
                MedGenius AI provides a comprehensive RESTful API that allows you to integrate our 
                AI-powered medical analysis capabilities into your own applications. This reference 
                documents all available endpoints and their usage.
              </p>
            </div>
          </section>

          {/* Authentication */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="h-6 w-6 text-blue-600" />
              Authentication
            </h2>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <p className="text-gray-600 mb-4">
                All API requests require authentication using an API key. Include your API key in the 
                request headers:
              </p>
              <div className="bg-gray-50 p-4 rounded-md font-mono text-sm">
                Authorization: Bearer YOUR_API_KEY
              </div>
            </div>
          </section>

          {/* Endpoints */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Webhook className="h-6 w-6 text-blue-600" />
              API Endpoints
            </h2>
            <div className="space-y-6">
              {/* Patient Analysis Endpoint */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-medium text-gray-900 mb-3">Patient Analysis</h3>
                <div className="space-y-4">
                  <div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">POST</span>
                    <code className="ml-2 text-gray-700">/api/v1/patient-analysis</code>
                  </div>
                  <p className="text-gray-600">Analyze patient information and generate medical insights.</p>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-700">Request Body:</p>
                    <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-x-auto">
{`{
  "patientInfo": "string",
  "includeRecommendations": boolean,
  "includeDiagnosis": boolean
}`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Drug Recommendations Endpoint */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-medium text-gray-900 mb-3">Drug Recommendations</h3>
                <div className="space-y-4">
                  <div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">POST</span>
                    <code className="ml-2 text-gray-700">/api/v1/drug-recommendations</code>
                  </div>
                  <p className="text-gray-600">Get drug recommendations based on patient data or disease.</p>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-700">Request Body:</p>
                    <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-x-auto">
{`{
  "patientInfo": "string",
  "disease": "string",
  "includeSideEffects": boolean
}`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Side Effects Analysis Endpoint */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-medium text-gray-900 mb-3">Side Effects Analysis</h3>
                <div className="space-y-4">
                  <div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">POST</span>
                    <code className="ml-2 text-gray-700">/api/v1/side-effects</code>
                  </div>
                  <p className="text-gray-600">Analyze potential drug interactions and side effects.</p>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-700">Request Body:</p>
                    <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-x-auto">
{`{
  "medications": ["string"],
  "patientInfo": "string",
  "includeAlternatives": boolean
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Rate Limits */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="h-6 w-6 text-blue-600" />
              Rate Limits
            </h2>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <p className="text-gray-600 mb-4">
                API requests are subject to the following rate limits:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Free tier: 100 requests per day</li>
                <li>Professional tier: 1,000 requests per day</li>
                <li>Enterprise tier: Custom limits</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ApiReference; 