import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface DisclaimerProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export function Disclaimer({ className = '', variant = 'default' }: DisclaimerProps) {
  if (variant === 'compact') {
    return (
      <Alert className={`bg-yellow-50/70 border-yellow-100 py-2 ${className}`}>
        <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
        <AlertDescription className="text-xs text-yellow-700">
          MedGenius AI provides AI-generated insights. Always consult healthcare professionals for medical advice.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className={`bg-yellow-50/70 border-yellow-100 py-3 ${className}`}>
      <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
      <AlertTitle className="text-yellow-700 font-medium text-sm">MedGenius AI Disclaimer</AlertTitle>
      <AlertDescription className="text-yellow-700 mt-1 text-xs">
        <p>MedGenius AI is designed to assist with medical insights, education, and research.</p>
        <p className="mt-1">While we strive to provide accurate information, the results are AI-generated and may not always be fully reliable.</p>
        <p className="mt-1">Use this platform as a reference — not as a replacement for professional medical advice.</p>
      </AlertDescription>
    </Alert>
  );
} 