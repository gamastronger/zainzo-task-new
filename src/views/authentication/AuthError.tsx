/**
 * AuthError Component
 * 
 * User-friendly error page displayed when Google OAuth authentication fails.
 * 
 * This page is shown when:
 * - User denies Google OAuth permission
 * - Backend authentication fails
 * - Session validation fails after redirect
 * 
 * Provides a clear error message and action to retry login.
 */

import { FC } from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const AuthError: FC = () => {
  const navigate = useNavigate();

  const handleRetryLogin = () => {
    navigate('/auth/login', { replace: true });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      textAlign="center"
      justifyContent="center"
      sx={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={3} alignItems="center">
          <ErrorOutlineIcon 
            sx={{ 
              fontSize: 120, 
              color: 'error.main',
              opacity: 0.8 
            }} 
          />
          
          <Typography variant="h2" fontWeight="bold" color="text.primary">
            Authentication Failed
          </Typography>
          
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 450 }}>
            We couldn't complete your Google login. This might happen if you denied permissions or there was a connection issue.
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              color="primary"
              variant="contained"
              size="large"
              onClick={handleRetryLogin}
              disableElevation
            >
              Try Again
            </Button>
            
            <Button
              color="inherit"
              variant="outlined"
              size="large"
              onClick={() => navigate('/', { replace: true })}
            >
              Go Home
            </Button>
          </Stack>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 4 }}>
            If this problem persists, please contact support.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default AuthError;
