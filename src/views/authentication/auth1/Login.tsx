// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import img1 from 'src/assets/images/backgrounds/login-bg.svg';
import ztLogo from 'src/assets/images/svgs/ztlogo.svg';
import AuthLogin from '../authForms/AuthLogin';

const Login = () => (
  <PageContainer title="Login" description="this is Login page">
    <Grid container spacing={0} sx={{ overflowX: 'hidden', minHeight: '100vh' }}>
      {/* LEFT — BRAND / ILLUSTRATION */}
      <Grid
        item
        xs={12}
        sm={12}
        lg={7}
        xl={8}
        sx={{
          position: 'relative',
          '&:before': {
            content: '""',
            background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            inset: 0,
            opacity: 0.3,
          },
        }}
      >
        <Box position="relative" height="100%">
          {/* LOGO */}
          <Box px={3} py={2} display="flex" alignItems="center" gap={1}>
            <img
              src={ztLogo}
              alt="Zainzo Task Logo"
              style={{ width: 24, height: 24 }}
            />
            <Typography fontWeight={600} fontSize="1.1rem" color="#000">
              Zainzo Task
            </Typography>
          </Box>

          {/* ILLUSTRATION */}
          <Box
            height="calc(100vh - 75px)"
            display={{ xs: 'none', lg: 'flex' }}
            alignItems="center"
            justifyContent="center"
          >
            <img
              src={img1}
              alt="background illustration"
              style={{
                width: '100%',
                maxWidth: 500,
              }}
            />
          </Box>
        </Box>
      </Grid>

      {/* RIGHT — LOGIN FORM */}
      <Grid
        item
        xs={12}
        sm={12}
        lg={5}
        xl={4}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          width="100%"
          maxWidth={420}
          px={4}
          py={6}
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
        >
          <AuthLogin
            title="Welcome to Zainzo Task"
            subtext={
              <Typography variant="subtitle1" color="textSecondary" mb={0}>
                Your Task Management Dashboard
              </Typography>
            }
          />
        </Box>
      </Grid>
    </Grid>
  </PageContainer>
);

export default Login;
