import { FC } from 'react';
import { styled, Container, Box } from '@mui/material';
import { useSelector } from 'src/store/Store';
import { Outlet, useLocation } from 'react-router-dom';
import { AppState } from 'src/store/Store';
import Header from './vertical/header/Header';
import Navigation from '../full/horizontal/navbar/Navigation';
import HorizontalHeader from '../full/horizontal/header/Header';

const MainWrapper = styled('div')(() => ({
  display: 'flex',
  minHeight: '100vh',
  width: '100%',
  overflow: 'hidden',
}));

const PageWrapper = styled('div')(() => ({
  display: 'flex',
  flexGrow: 1,
  paddingBottom: '60px',
  flexDirection: 'column',
  zIndex: 1,
  backgroundColor: 'transparent',
  maxWidth: '100%',
  overflow: 'hidden',
}));

const FullLayout: FC = () => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const location = useLocation();
  const isKanbanPage = location.pathname.includes('/app');
  const headerHeight = customizer.TopbarHeight || 70;

  return (
    <MainWrapper
      className={customizer.activeMode === 'dark' ? 'darkbg mainwrapper' : 'mainwrapper'}
    >
      {/* ------------------------------------------- */}
      {/* Main Wrapper */}
      {/* ------------------------------------------- */}
      <PageWrapper className="page-wrapper">
        {/* ------------------------------------------- */}
        {/* Header */}
        {/* ------------------------------------------- */}
        {customizer.isHorizontal ? <HorizontalHeader /> : <Header />}
        {/* PageContent */}
        {customizer.isHorizontal ? <Navigation /> : ''}
        <Container
          sx={{
            maxWidth: customizer.isLayout === 'boxed' ? 'lg' : '100%!important',
            paddingTop: isKanbanPage ? 0 : { xs: '16px', sm: '24px' },
            paddingLeft: isKanbanPage ? 0 : { xs: '16px', sm: '24px' },
            paddingRight: isKanbanPage ? 0 : { xs: '16px', sm: '24px' },
            marginTop: { xs: '56px', lg: `${headerHeight}px` },
            overflow: 'hidden',
            height: isKanbanPage ? `calc(100vh - ${headerHeight}px)` : 'auto',
          }}
        >
          {/* ------------------------------------------- */}
          {/* PageContent */}
          {/* ------------------------------------------- */}
          <Box sx={{ 
            minHeight: isKanbanPage ? '100%' : 'calc(100vh - 170px)',
            height: isKanbanPage ? '100%' : 'auto',
            maxWidth: '100%',
            overflow: 'hidden',
          }}>
            <Outlet />
          </Box>
          {/* ------------------------------------------- */}
          {/* End Page */}
          {/* ------------------------------------------- */}
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
};

export default FullLayout;
