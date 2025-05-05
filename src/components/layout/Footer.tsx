import { FlaskConical, Github, Twitter, Linkedin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/about');
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4 max-w-md">
            <Link to="/" className="flex items-center gap-2">
              <FlaskConical className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-xl tracking-tight text-gray-900">MedGenius AI</span>
            </Link>
            <p className="text-gray-600 text-sm">
              AI-powered drug discovery platform that revolutionizes how novel treatments are developed, bringing safer and more effective medications to patients faster.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-900">Platform</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/home" className="text-gray-600 text-sm hover:text-blue-600 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/patient-analysis" className="text-gray-600 text-sm hover:text-blue-600 transition-colors">
                    Patient Analysis
                  </Link>
                </li>
                <li>
                  <Link to="/drug-recommendation" className="text-gray-600 text-sm hover:text-blue-600 transition-colors">
                    Drug Recommendation
                  </Link>
                </li>
                <li>
                  <Link to="/drug-discovery" className="text-gray-600 text-sm hover:text-blue-600 transition-colors">
                    Drug Discovery
                  </Link>
                </li>
                <li>
                  <Link to="/side-effects" className="text-gray-600 text-sm hover:text-blue-600 transition-colors">
                    Side Effects
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-900">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/documentation" className="text-gray-600 text-sm hover:text-blue-600 transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/api-reference" className="text-gray-600 text-sm hover:text-blue-600 transition-colors">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-600 text-sm hover:text-blue-600 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-600 text-sm hover:text-blue-600 transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-sm text-gray-900">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} MedGenius AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
