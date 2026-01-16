import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';

const textSx = {
  maxWidth: 420,
  width: '100%',
};

const imageSx = {
  maxWidth: 460,
  width: '100%',
  borderRadius: 4,
  boxShadow: 3,
};

export const FocusSection: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, md: 8 } }}>
      <Grid
        container
        spacing={{ xs: 2, md: 4 }}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={textSx}>
            <Typography
              variant="h4"
              fontWeight={700}
              mb={2}
              color="text.primary"
            >
              Tampilan yang lebih fokus
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.7 }}
            >
              Melihat semua tugas di satu layar<br />
              membantu kamu bekerja<br />
              dengan lebih maksimal.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Box
            component="img"
            src="src/assets/images/landingpage/google-task.png"
            alt="Tampilan tugas yang lebih fokus"
            sx={imageSx}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export const DataSection: React.FC = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, md: 8 } }}
    >
      <Grid
        container
        spacing={{ xs: 4, md: 6 }}
        alignItems="center"
        justifyContent="center"
      >
        <Grid
          item
          xs={12}
          md={12}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* VISUAL / BUTTON — KIRI */}
          <Box
            component="img"
            src="src/assets/images/landingpage/google-workspace.png"
            alt="Integrasi Google Workspace"
            sx={{
              ...imageSx,
              mr: { md: 10, xs: 0 },
              mb: { xs: 4, md: 0 },
            }}
          />

          {/* TEXT — KANAN */}
          <Box
            sx={{
              ...textSx,
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            <Typography
              variant="h4"
              fontWeight={700}
              mb={2}
              color="text.primary"
            >
              Data tersimpan di Google
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.7 }}
            >
              Semua tugas tetap tersimpan di akun Google kamu
              <br />
              dan bisa diakses dari Gmail,
              <br />
              Calendar, dan Google Tasks.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};


export const SyncSection: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, md: 8 } }}>
      <Grid
        container
        spacing={{ xs: 2, md: 4 }}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={textSx}>
            <Typography
              variant="h4"
              fontWeight={700}
              mb={2}
              color="text.primary"
            >
              Data sinkron otomatis
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.7 }}
            >
              Apa pun perangkat yang kamu gunakan,<br />
              semua data akan sinkron otomatis<br />
              tanpa ribet setting manual.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Box
            component="img"
            src="src/assets/images/landingpage/digitalisasi.png"
            alt="Digitalisasi dan sinkronisasi data"
            sx={imageSx}
          />
        </Grid>
      </Grid>
    </Container>
  );
};
