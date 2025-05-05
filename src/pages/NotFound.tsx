import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700">
          Page Not Found
        </h2>
        <p className="text-gray-500 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="space-x-4">
          <Button onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
