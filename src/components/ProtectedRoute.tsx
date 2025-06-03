
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <AnimatedBackground variant="dashboard">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      </AnimatedBackground>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
