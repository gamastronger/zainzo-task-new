import React from 'react';
import { Container, Grid, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ZtLogo from 'src/assets/images/svgs/ztlogo.svg';


const LandingNavbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 24,
        zIndex: 1200,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            bgcolor: '#FFFFFF',
            borderRadius: 999,
            px: 4,
            py: 1.5,
            boxShadow:
              '0 10px 30px rgba(15, 23, 42, 0.08)',
          }}
        >
          <Grid container alignItems="center">
            {/* LEFT */}
            <Grid item xs={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  component="img"
                  src={ZtLogo}
                  alt="Zainzo Task"
                  sx={{
                    width: 22,
                    height: 22,
                  }}
                />
                <Typography fontWeight={600}>
                  Zainzo Task
                </Typography>
              </Box>
            </Grid>


            {/* CENTER */}
            <Grid item xs={4} textAlign="center">
              <Typography
                color="#1c1d1f"
                fontSize={14}
              >
                Semua Produk
              </Typography>
            </Grid>

            {/* RIGHT */}
            <Grid item xs={4} textAlign="right">
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate('/auth/login')}
                sx={{
                  textTransform: 'none',
                  borderRadius: 666,
                  px: 2.5,
                  bgcolor: '#5A4CA6',
                  boxShadow: '0 6px 16px rgba(90, 76, 166, 0.35)',
                  '&:hover': {
                    bgcolor: '#4F4196',
                    boxShadow: '0 8px 20px rgba(90, 76, 166, 0.45)',
                  },
                }}
              >
                Masuk
              </Button>
            </Grid>

          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingNavbar;
