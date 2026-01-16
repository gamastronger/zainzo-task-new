import { Box } from '@mui/material';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import PageContainer from 'src/components/container/PageContainer';
import Footer from 'src/components/frontend-pages/shared/footer';
import LandingNavbar from 'src/components/frontend-pages/landingpage/Navbar';
import LandingHero from 'src/components/frontend-pages/landingpage/Hero';
import { FocusSection, DataSection, SyncSection } from 'src/components/frontend-pages/landingpage/Sections';
import CtaSection from 'src/components/frontend-pages/landingpage/CtaSection';

const LandingPage: React.FC = () => {
  return (
    <PageContainer title="Zainzo Task" description="Landing page Zainzo Task">
      <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh' }}>
        <LandingNavbar />
        <LandingHero />
        <FocusSection />
        <DataSection />
        <SyncSection />
        <CtaSection />
        <Footer />
      </Box>
    </PageContainer>
  );
};

export default LandingPage;
