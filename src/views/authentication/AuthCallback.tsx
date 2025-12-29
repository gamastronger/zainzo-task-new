import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Legacy Google OAuth callback.
 * This route only redirects to /auth/success.
 */
export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/auth/success', { replace: true });
  }, [navigate]);

  return null;
}
