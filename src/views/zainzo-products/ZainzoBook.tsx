import { Box, Typography, Container, Card, CardContent } from '@mui/material';
import { IconBook } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';

const ZainzoBook = () => {
  return (
    <PageContainer title="Zainzo Book" description="Zainzo Book Application">
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Card sx={{ textAlign: 'center', py: 6 }}>
            <CardContent>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                <IconBook size={80} stroke={1.5} color="#5D87FF" />
              </Box>
              <Typography variant="h3" fontWeight={600} gutterBottom>
                Zainzo Book
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                Coming Soon
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 600, mx: 'auto' }}>
                Aplikasi manajemen buku digital yang powerful untuk mengelola koleksi buku Anda.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </PageContainer>
  );
};

export default ZainzoBook;
