/**
 * AuthSuccess Component
 * 
 * This is NOT a UI page - it's a logic-only handler for the OAuth callback.
 * 
 * Flow:
 * 1. Backend completes Google OAuth and redirects user to /auth/success
 * 2. This component mounts and calls /api/auth/me to verify authentication
 * 3. If authenticated: store user in context → redirect to /app (dashboard)
 * 4. If not authenticated: redirect to /auth/error
 * 
 * IMPORTANT: Frontend does NOT handle Google tokens directly.
 * Laravel Sanctum manages authentication via HTTP-only cookies.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import useAuth from 'src/guards/authGuard/UseAuth';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { handleAuthCallback } = useAuth();
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Call backend /api/auth/me to verify authentication
        // Session cookie is automatically sent by browser (Laravel Sanctum)
        const isAuthenticated = await handleAuthCallback();

        if (isAuthenticated) {
          setStatus('success');
          // Wait a moment to show success state, then redirect
          setTimeout(() => {
            navigate('/app', { replace: true });
          }, 1000);
        } else {
          // Authentication failed - redirect to error page
          setStatus('error');
          setTimeout(() => {
            navigate('/auth/error', { replace: true });
          }, 1500);
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        setStatus('error');
        setTimeout(() => {
          navigate('/auth/error', { replace: true });
        }, 1500);
      }
    };

    verifyAuth();
  }, [handleAuthCallback, navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
      gap={3}
    >
      <CircularProgress size={60} />
      
      {status === 'checking' && (
        <Typography variant="h6" color="textSecondary">
          Verifying authentication...
        </Typography>
      )}
      
      {status === 'success' && (
        <Typography variant="h6" color="success.main">
          Authentication successful! Redirecting to dashboard...
        </Typography>
      )}
      
      {status === 'error' && (
        <Typography variant="h6" color="error.main">
          Authentication failed. Redirecting...
        </Typography>
      )}
    </Box>
  );
};

export default AuthSuccess;
