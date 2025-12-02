import { Box, Typography, Container, Card, CardContent } from '@mui/material';
import { IconAddressBook } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';

const ZainzoContact = () => {
  return (
    <PageContainer title="Zainzo Contact" description="Zainzo Contact Application">
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Card sx={{ textAlign: 'center', py: 6 }}>
            <CardContent>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                <IconAddressBook size={80} stroke={1.5} color="#198754" />
              </Box>
              <Typography variant="h3" fontWeight={600} gutterBottom>
                Zainzo Contact
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                Coming Soon
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 600, mx: 'auto' }}>
                Aplikasi manajemen kontak yang modern untuk mengelola semua kontak Anda dengan mudah.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </PageContainer>
  );
};

export default ZainzoContact;
