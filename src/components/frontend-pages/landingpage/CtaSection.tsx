import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CtaSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 10, textAlign: 'center', bgcolor: '#e8f0fb' }}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Mulai dengan Zainzo Task
      </Typography>

      <Button
        variant="outlined"
        size="large"
        onClick={() => navigate('/auth/login')}
        startIcon={
          <Box
            component="img"
            src="/google.png"
            alt="Google"
            sx={{ width: 20, height: 20 }}
          />
        }
        sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              borderColor: '#5A4CA6',
              color: '#5A4CA6',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgb(226, 221, 255)',
                borderColor: '#5A4CA6',
                boxShadow: '0 6px 20px rgba(90, 76, 166, 0.35)',
                transform: 'translateY(-1px)',
                color: '#3a2e81',
              },
              '&:active': {
                transform: 'translateY(0)',
                boxShadow: '0 3px 10px rgba(15, 23, 42, 0.08)',
              },
            }}
      >
        Masuk dengan Google
      </Button>
    </Box>
  );
};

export default CtaSection;
