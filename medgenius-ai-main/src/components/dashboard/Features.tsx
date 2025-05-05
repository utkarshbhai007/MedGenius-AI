
import { FileText, FlaskConical, HeartPulse, Users, ShieldAlert, Activity } from "lucide-react";
import FeatureCard from "./FeatureCard";

const Features = () => {
  const features = [
    {
      title: "Patient Report Analysis",
      description: "Extract key symptoms, medical history, and genetic information from patient reports using advanced NLP technology.",
      icon: <FileText className="h-6 w-6" />,
      link: "/patient-analysis"
    },
    {
      title: "Drug Recommendation",
      description: "Match patient data with existing drug databases to suggest the most effective treatments based on personalized profiles.",
      icon: <FlaskConical className="h-6 w-6" />,
      link: "/drug-recommendation"
    },
    {
      title: "AI-Driven Drug Discovery",
      description: "Generate novel drug molecules and evaluate molecular properties using generative AI and reinforcement learning.",
      icon: <HeartPulse className="h-6 w-6" />,
      link: "/drug-discovery"
    },
    {
      title: "Clinical Trial Matching",
      description: "Connect patients with ongoing clinical trials for rare diseases and research institutions based on their profiles.",
      icon: <Users className="h-6 w-6" />,
      link: "/clinical-trials"
    },
    {
      title: "Side Effect Prediction",
      description: "Identify possible side effects and detect harmful drug interactions before prescribing using predictive AI models.",
      icon: <ShieldAlert className="h-6 w-6" />,
      link: "/side-effects"
    },
    {
      title: "Disease Prediction",
      description: "AI-powered analysis to predict diseases and health conditions based on patient symptoms and genetic markers.",
      icon: <Activity className="h-6 w-6" />,
      link: "/disease-prediction"
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Comprehensive AI-Powered Features
          </h2>
          <p className="text-muted-foreground text-lg">
            Our platform combines cutting-edge AI technologies to transform drug discovery and personalized medicine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up stagger-animation">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              link={feature.link}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
