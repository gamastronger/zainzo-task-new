import { useNavigate } from 'react-router-dom';
import useAuth from './UseAuth';
import { useEffect } from 'react';
import Spinner from 'src/views/spinner/Spinner';

const AuthGuard = ({ children }: any) => {
  const { isAuthenticated, isInitialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if initialization is complete and user is not authenticated
    if (isInitialized && !isAuthenticated) {
      navigate('/auth/login', { replace: true });
    }
  }, [isAuthenticated, isInitialized, navigate]);

  // Show loading spinner while checking authentication status
  if (!isInitialized) {
    return <Spinner />;
  }

  // If not authenticated after initialization, don't render children
  // (will redirect in useEffect)
  if (!isAuthenticated) {
    return null;
  }

  return children;
};

export default AuthGuard;
