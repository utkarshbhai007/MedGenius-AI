import { Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Vidit Purohit",
      role: "Full Stack & Security Engineer",
      github: "https://github.com/vidit",
      linkedin: "https://linkedin.com/in/vidit-purohit",
      email: "vidit.purohit@example.com"
    },
    {
      name: "Utkarsh Barad",
      role: "UI/UX Engineer",
      github: "https://github.com/utkarsh",
      linkedin: "https://linkedin.com/in/utkarsh-barad",
      email: "utkarsh.barad@example.com"
    },
    {
      name: "Ayush Suthar",
      role: "AI/ML Engineer",
      github: "https://github.com/ayush",
      linkedin: "https://linkedin.com/in/ayush-suthar",
      email: "ayush.suthar@example.com"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 pt-20">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            About <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">MedGenius AI</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Revolutionizing healthcare through artificial intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              MedGenius AI is dedicated to transforming healthcare through cutting-edge artificial intelligence. 
              Our platform empowers healthcare professionals with advanced tools for patient analysis, drug discovery, 
              and treatment optimization. We strive to make medical decision-making more accurate, efficient, and 
              accessible to healthcare providers worldwide.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
            <ul className="text-gray-600 space-y-3">
              <li>• Advanced patient symptom analysis using AI</li>
              <li>• Intelligent drug recommendation system</li>
              <li>• Cutting-edge drug discovery algorithms</li>
              <li>• Comprehensive side effects analysis</li>
              <li>• Real-time medical data processing</li>
              <li>• Secure and compliant healthcare platform</li>
            </ul>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-blue-600 font-bold">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                <div className="flex justify-center space-x-4">
                  <a href={member.github} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                      <Github className="h-5 w-5" />
                    </Button>
                  </a>
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                      <Linkedin className="h-5 w-5" />
                    </Button>
                  </a>
                  <a href={`mailto:${member.email}`}>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                      <Mail className="h-5 w-5" />
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-3">Frontend</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• React with TypeScript</li>
                <li>• Tailwind CSS for styling</li>
                <li>• React Router for navigation</li>
                <li>• Modern UI components</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-3">Backend & AI</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Advanced AI/ML algorithms</li>
                <li>• Secure API architecture</li>
                <li>• Real-time data processing</li>
                <li>• Cloud-based infrastructure</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600 max-w-2xl mx-auto">
            MedGenius AI is committed to advancing healthcare through technology. 
            Our team combines expertise in artificial intelligence, software development, 
            and healthcare to create innovative solutions for medical professionals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 