import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import useAuth from 'src/guards/authGuard/UseAuth';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleAuthCallback } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get token from query string (sent by backend)
        const token = searchParams.get('token');
        const errorMsg = searchParams.get('error');

        if (errorMsg) {
          setError(errorMsg);
          setProcessing(false);
          setTimeout(() => {
            navigate('/auth/login', { replace: true });
          }, 3000);
          return;
        }

        if (!token) {
          setError('No authentication token received');
          setProcessing(false);
          setTimeout(() => {
            navigate('/auth/login', { replace: true });
          }, 3000);
          return;
        }

        // Process the token through auth context
        const success = await handleAuthCallback(token);

        if (success) {
          // Redirect to dashboard
          setTimeout(() => {
            navigate('/apps/kanban', { replace: true });
          }, 1000);
        } else {
          setError('Failed to authenticate with provided token');
          setProcessing(false);
          setTimeout(() => {
            navigate('/auth/login', { replace: true });
          }, 3000);
        }
      } catch (err) {
        console.error('Callback processing error:', err);
        setError('An error occurred during authentication');
        setProcessing(false);
        setTimeout(() => {
          navigate('/auth/login', { replace: true });
        }, 3000);
      }
    };

    processCallback();
  }, [searchParams, navigate, handleAuthCallback]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        gap: 2,
      }}
    >
      {error ? (
        <>
          <Typography variant="h4" color="error">
            Authentication Failed
          </Typography>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Redirecting to login page...
          </Typography>
        </>
      ) : processing ? (
        <>
          <CircularProgress size={60} />
          <Typography variant="h5" sx={{ mt: 2 }}>
            Completing your login...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we verify your credentials
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="h5" color="success.main">
            Login Successful!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Redirecting to dashboard...
          </Typography>
        </>
      )}
    </Box>
  );
};

export default AuthCallback;
