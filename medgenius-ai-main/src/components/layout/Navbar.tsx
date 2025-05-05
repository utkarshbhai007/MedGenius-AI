
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X, FlaskConical, HeartPulse, FileText, Beaker, TestTube } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: "Home", path: "/", icon: <HeartPulse className="mr-2 h-4 w-4" /> },
    { name: "Patient Analysis", path: "/patient-analysis", icon: <FileText className="mr-2 h-4 w-4" /> },
    { name: "Drug Recommendation", path: "/drug-recommendation", icon: <FlaskConical className="mr-2 h-4 w-4" /> },
    { name: "Drug Discovery", path: "/drug-discovery", icon: <Beaker className="mr-2 h-4 w-4" /> },
    
    { name: "Side Effects", path: "/side-effects", icon: <HeartPulse className="mr-2 h-4 w-4" /> },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 py-4 px-6 md:px-12",
        isScrolled ? "backdrop-blur-lg bg-white/70 shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <NavLink 
          to="/" 
          className="flex items-center gap-2 font-semibold text-xl"
          onClick={() => setIsMenuOpen(false)}
        >
          <FlaskConical className="h-6 w-6 text-primary" />
          <span className="font-semibold tracking-tight">MedGenius AI</span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => cn(
                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobile && isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white/90 backdrop-blur-lg shadow-lg animate-fade-in">
          <div className="flex flex-col p-6 space-y-4 stagger-animation">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => cn(
                  "flex items-center py-2 text-base font-medium transition-colors hover:text-primary animate-slide-in",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon}
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
