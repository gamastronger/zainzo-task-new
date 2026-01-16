import React from 'react';
import GoogleIcon from '@mui/icons-material/Google';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CtaSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 10, textAlign: 'center', bgcolor: '#EFF6FF' }}>
      <Typography fontWeight={600} mb={3}>
        Mulai dengan Zainzo Task
      </Typography>

      <Button
        startIcon={<GoogleIcon />}
        variant="outlined"
        size="large"
        onClick={() => navigate('/auth/login')}
        sx={{ borderRadius: 3, textTransform: 'none' }}
      >
        Masuk dengan Google
      </Button>
    </Box>
  );
};

export default CtaSection;
