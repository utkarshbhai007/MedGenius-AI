
import { Link } from "react-router-dom";
import { useEffect } from "react";
import Hero from "@/components/dashboard/Hero";
import Features from "@/components/dashboard/Features";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight, Brain, Dna, Heart, Check, Shield, Users, Microscope } from "lucide-react";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50/30">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <Features />
        
        {/* How it works section with animated cards */}
        <section className="py-20 md:py-28 px-6 md:px-12 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white to-primary-50/30" />
          
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
                How MedGenius AI Works
              </h2>
              <p className="text-muted-foreground text-lg">
                Our AI-powered platform transforms the drug discovery process through these key steps.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Data Analysis",
                  description: "Our AI analyzes patient reports, research papers, and medical data to identify patterns and insights.",
                  icon: <Brain className="h-8 w-8 text-primary-600" />,
                  steps: ["Extract medical data", "Process through NLP", "Identify key markers"]
                },
                {
                  title: "AI-Powered Modeling",
                  description: "Advanced models predict drug efficacy, potential interactions, and generate novel molecular structures.",
                  icon: <Dna className="h-8 w-8 text-primary-600" />,
                  steps: ["Generate drug candidates", "Simulate interactions", "Optimize molecular structures"]
                },
                {
                  title: "Personalized Recommendations",
                  description: "Patients receive tailored treatment recommendations based on their unique genetic profile.",
                  icon: <Heart className="h-8 w-8 text-primary-600" />,
                  steps: ["Match patient profiles", "Rank treatment options", "Provide explained results"]
                }
              ].map((step, i) => (
                <div 
                  key={i}
                  className="flex flex-col p-8 rounded-2xl border border-primary/10 bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                  style={{ animationDelay: `${0.1 + i * 0.1}s` }}
                >
                  <div className="mb-6 p-4 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 w-fit">
                    {step.icon}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6">
                    {step.description}
                  </p>
                  
                  <ul className="space-y-3 mb-6">
                    {step.steps.map((item, j) => (
                      <li key={j} className="flex items-start">
                        <Check className="h-5 w-5 text-primary-500 mr-2 shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-20 md:py-28 px-6 md:px-12 bg-gradient-to-b from-white to-primary-50/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
                Why Choose MedGenius AI
              </h2>
              <p className="text-muted-foreground text-lg">
                Our platform offers unique advantages for researchers, clinicians, and patients.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Advanced AI Algorithms",
                  description: "Leveraging state-of-the-art machine learning models for accurate predictions",
                  icon: <Brain />
                },
                {
                  title: "Comprehensive Analysis",
                  description: "Thorough examination of patient data, genetic markers, and medical history",
                  icon: <Microscope />
                },
                {
                  title: "Privacy & Security",
                  description: "Enterprise-grade security protocols to protect sensitive medical information",
                  icon: <Shield />
                },
                {
                  title: "Collaborative Platform",
                  description: "Facilitates teamwork between researchers, clinicians, and pharmaceutical companies",
                  icon: <Users />
                },
                {
                  title: "Faster Development",
                  description: "Accelerates the drug discovery process by 60% compared to traditional methods",
                  icon: <ArrowRight />
                },
                {
                  title: "Personalized Medicine",
                  description: "Tailored treatment recommendations based on individual patient profiles",
                  icon: <Heart />
                }
              ].map((benefit, i) => (
                <div 
                  key={i}
                  className="flex p-6 rounded-xl border border-primary/10 bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-1 animate-slide-up"
                  style={{ animationDelay: `${0.05 * i}s` }}
                >
                  <div className="mr-4 mt-1 p-3 rounded-full bg-primary-50 h-fit">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section with gradient background */}
        <section className="py-20 md:py-28 px-6 md:px-12 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-primary-400/5" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-100 rounded-full opacity-70 blur-3xl" />
            <div className="absolute top-1/3 -left-24 w-80 h-80 bg-blue-50 rounded-full opacity-60 blur-3xl" />
          </div>
          
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="p-8 md:p-12 rounded-2xl bg-white/80 backdrop-blur-md border border-primary/10 shadow-xl">
              <div className="max-w-3xl mx-auto text-center space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
                  Ready to Revolutionize Drug Discovery?
                </h2>
                
                <p className="text-lg text-gray-700">
                  Join the AI-powered revolution in medicine. Start exploring our platform today and see how AI can accelerate drug discovery and improve patient outcomes.
                </p>
                
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <Link to="/patient-analysis">
                    <Button size="lg" className="group h-12 px-6 gap-2 shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400">
                      Get Started Now
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  
                  <a href="#">
                    <Button variant="outline" size="lg" className="h-12 px-6 gap-2 shadow-sm hover:shadow-md transition-all border-primary/20 hover:bg-primary-50/30">
                      View Documentation
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
