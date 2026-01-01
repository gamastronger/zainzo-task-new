import { Box, Typography, Container, Paper } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

const PrivacyPolicy = () => {
  return (
    <PageContainer title="Privacy Policy" description="Zainzo Task Privacy Policy">
      <Box
        sx={{
        height: 'calc(100vh - 64px)',
        overflowY: 'auto',
        bgcolor: '#F8FAFC',
        py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 3,
              border: '1px solid #E2E8F0',
              userSelect: 'text',
            }}
          >
            {/* HEADER */}
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, mb: 1 }}
            >
              Privacy Policy
            </Typography>

            <Typography sx={{ color: '#64748B', mb: 4 }}>
              Last updated: January 1, 2026
            </Typography>

            {/* CONTENT */}
            {[
              {
                title: '1. Introduction',
                body: `Zainzo Task respects your privacy. This Privacy Policy explains how we collect, use, store,
                and protect your personal information when you use our application. Zainzo Task integrates with
                Google services via Google OAuth 2.0 and the Google Tasks API.`,
              },
              {
                title: '2. Google OAuth Authentication',
                body: `Zainzo Task uses Google OAuth 2.0 for secure authentication. We never see or store your
                Google password. Authentication is handled entirely by Google, and access can be revoked
                at any time through your Google Account settings.`,
              },
              {
                title: '3. Information We Collect',
                body: `We may collect your email address, basic profile information, and Google Tasks data
                strictly for account identification, personalization, and task synchronization.`,
              },
              {
                title: '4. Data Storage & Security',
                body: `All data is encrypted in transit using HTTPS/TLS. Sensitive data and tokens are stored
                securely on our servers and are never exposed to the client.`,
              },
              {
                title: '5. How We Use Your Data',
                body: `Your information is used only to provide and improve the Zainzo Task service,
                including authentication, task synchronization, support, and service communication.`,
              },
              {
                title: '6. Data Sharing',
                body: `We do not sell, rent, or trade your personal data. Information is shared only when
                required by law, with your consent, or to provide core service functionality.`,
              },
              {
                title: '7. Your Rights',
                body: `You may access, update, export, revoke access, or request deletion of your data at any time.`,
              },
              {
                title: '8. Cookies & Sessions',
                body: `We use secure, HTTP-only cookies strictly for session management. We do not use tracking
                or advertising cookies.`,
              },
              {
                title: '9. Data Retention',
                body: `Your data is retained only as long as your account is active or as required by law.`,
              },
              {
                title: `10. Children's Privacy`,
                body: `Zainzo Task is not intended for users under the age of 13.`,
              },
              {
                title: '11. Policy Updates',
                body: `We may update this policy periodically. Continued use of the service indicates acceptance
                of the updated policy.`,
              },
            ].map((section, index) => (
              <Box key={index} sx={{ mb: 4 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  {section.title}
                </Typography>
                <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>
                  {section.body}
                </Typography>
              </Box>
            ))}

            {/* HIGHLIGHT */}
            <Box
              sx={{
                mt: 6,
                p: 3,
                bgcolor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: 2,
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>
                We do not sell your data.
              </Typography>
              <Typography sx={{ mt: 1, color: '#475569' }}>
                Your information is used solely to operate and improve Zainzo Task.
              </Typography>
            </Box>

            {/* CONTACT */}
            <Box sx={{ mt: 6 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Contact
              </Typography>
              <Typography sx={{ color: '#475569' }}>
                Email: <strong>privacy@zainzotask.com</strong>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </PageContainer>
  );
};

export default PrivacyPolicy;
