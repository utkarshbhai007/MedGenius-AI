
import { FlaskConical, Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4 max-w-md">
            <Link to="/" className="flex items-center gap-2">
              <FlaskConical className="h-6 w-6 text-primary" />
              <span className="font-semibold text-xl tracking-tight">MedGenius AI</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              AI-powered drug discovery platform that revolutionizes how novel treatments are developed, bringing safer and more effective medications to patients faster.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Platform</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/patient-analysis" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                    Patient Analysis
                  </Link>
                </li>
                <li>
                  <Link to="/drug-recommendation" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                    Drug Recommendation
                  </Link>
                </li>
                <li>
                  <Link to="/drug-discovery" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                    Drug Discovery
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-sm">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/clinical-trials" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                    Clinical Trials
                  </Link>
                </li>
                <li>
                  <Link to="/side-effects" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                    Side Effects
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4 col-span-2 md:col-span-1">
              <h4 className="font-medium text-sm">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-12 pt-8">
          <p className="text-muted-foreground text-sm text-center">
            © {new Date().getFullYear()} MedGenius AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
