import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingHero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #e0eaff 0%, #ffffff 100%)',
        py: 12,
        textAlign: 'center',
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h3" fontWeight={700} mb={2}>
          Zainzo Task
        </Typography>

        <Typography color="#475569" mb={1}>
          Aplikasi desktop untuk Google Tasks
        </Typography>

        <Typography color="#64748B" maxWidth={520} mx="auto" mb={4}>
          Membantu kamu menata Google Tasks dengan lebih jelas
          tanpa mengubah sistem yang sudah kamu gunakan.
        </Typography>
          <Button
            startIcon={
              <img
                src="/google.png"
                alt="Google"
                style={{ width: 20, height: 20 }}
              />
            }
            size="large"
            variant="outlined"
            onClick={() => navigate('/auth/login')}
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


      </Container>
    </Box>
  );
};

export default LandingHero;
