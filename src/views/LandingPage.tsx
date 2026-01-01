import GoogleIcon from '@mui/icons-material/Google';
import {
  Box,
  Typography,
  Container,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  TaskAlt,
  CloudDone,
  Security,
  VerifiedUser,
  PrivacyTip,
} from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      {/* HERO */}
      <Box
        sx={{
          background: 'linear-gradient(180deg, #EFF6FF 0%, #FFFFFF 100%)',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: '#0F172A',
              mb: 2,
            }}
          >
            Zainzo Task
          </Typography>

          <Typography
            variant="h5"
            sx={{
              color: '#334155',
              mb: 3,
              fontWeight: 500,
            }}
          >
            Simple task management with Google integration
          </Typography>

          <Typography
            sx={{
              color: '#475569',
              maxWidth: 520,
              mx: 'auto',
              mb: 5,
              lineHeight: 1.7,
            }}
          >
            Organize your tasks effortlessly using a clean kanban board and
            keep everything in sync with your Google account.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
                variant="contained"
                size="large"
                startIcon={<GoogleIcon />}
                onClick={() => navigate('/auth/login')}
                sx={{
                    bgcolor: '#2563EB',
                    px: 4,
                    py: 1.6,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                    bgcolor: '#1E40AF',
                    boxShadow: 'none',
                    },
                }}
                >
                Sign in with Google
                </Button>


            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/privacy-policy')}
              startIcon={<PrivacyTip />}
              sx={{
                borderColor: '#CBD5E1',
                color: '#334155',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                '&:hover': {
                  borderColor: '#2563EB',
                  bgcolor: '#EFF6FF',
                },
              }}
            >
              Privacy Policy
            </Button>
          </Box>
        </Container>
      </Box>

      {/* FEATURES */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 600,
            color: '#0F172A',
            mb: 6,
          }}
        >
          Key Features
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              icon: <TaskAlt />,
              title: 'Task Management',
              desc: 'Create and manage tasks using a simple and intuitive kanban board.',
            },
            {
              icon: <CloudDone />,
              title: 'Google Sync',
              desc: 'Automatically sync your tasks with Google Tasks across devices.',
            },
            {
              icon: <Security />,
              title: 'Secure & Private',
              desc: 'Your data is encrypted and protected using modern security standards.',
            },
          ].map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  border: '1px solid #E2E8F0',
                  boxShadow: 'none',
                  transition: 'all .2s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    borderColor: '#2563EB',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box
                    sx={{
                      color: '#2563EB',
                      mb: 2,
                      fontSize: 36,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: '#475569' }}>
                    {item.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* SECURITY / OAUTH */}
      <Box sx={{ bgcolor: '#FFFFFF', py: 10 }}>
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              border: '1px solid #E2E8F0',
              borderRadius: 3,
              p: 5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <VerifiedUser sx={{ fontSize: 32, color: '#2563EB', mr: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Google OAuth Authentication
              </Typography>
            </Box>

            <Typography sx={{ color: '#475569', mb: 3, lineHeight: 1.8 }}>
              Zainzo Task uses Google OAuth 2.0. We never see or store your Google
              password. Authentication is handled entirely by Google.
            </Typography>

            <Box component="ul" sx={{ pl: 3, color: '#475569' }}>
              <li>Email & basic profile for identification</li>
              <li>Google Tasks access for task synchronization</li>
              <li>Encrypted session & secure token handling</li>
            </Box>

            <Box
              sx={{
                mt: 4,
                p: 3,
                bgcolor: '#EFF6FF',
                borderRadius: 2,
                border: '1px solid #BFDBFE',
              }}
            >
              <Typography sx={{ fontWeight: 600, color: '#0F172A' }}>
                We never sell or share your data.
              </Typography>
              <Typography sx={{ mt: 1, color: '#475569' }}>
                Your information is used only to operate and improve the
                service.
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                onClick={() => navigate('/privacy-policy')}
                startIcon={<PrivacyTip />}
              >
                Read full privacy policy
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* CTA */}
      <Box
        sx={{
          bgcolor: '#2563EB',
          py: 8,
          textAlign: 'center',
          color: 'white',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
            Start managing your tasks today
          </Typography>
          <Typography sx={{ opacity: 0.9, mb: 4 }}>
            Sign in with Google and get productive in seconds.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/auth/login')}
            sx={{
              bgcolor: 'white',
              color: '#2563EB',
              px: 5,
              py: 1.5,
              borderRadius: 2,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#EFF6FF',
                boxShadow: 'none',
              },
            }}
          >
            Sign In with Google
          </Button>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box sx={{ py: 4, textAlign: 'center', bgcolor: '#F8FAFC' }}>
  <Typography sx={{ color: '#64748B', fontSize: 14, mb: 1 }}>
    © 2026 Zainzo Task. All rights reserved.
  </Typography>

  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
    <a
      href="https://task.digitaltech.my.id/privacy-policy/"
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: '#2563EB', textDecoration: 'none', fontSize: 14 }}
    >
      Privacy Policy
    </a>

    <a
      href="https://task.digitaltech.my.id/privacy-policy/"
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: '#2563EB', textDecoration: 'none', fontSize: 14 }}
    >
      Terms of Service
    </a>
  </Box>
</Box>

    </Box>
  );
};

export default LandingPage;
