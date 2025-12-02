import { IconButton, Box, AppBar, Toolbar, styled, Stack, Typography, Button } from '@mui/material';

import { useSelector } from 'src/store/Store';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { IconPlus } from '@tabler/icons-react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ReactComponent as ZainzoLogo } from 'src/assets/images/svgs/zainzocontact.svg';
import Notifications from './Notification';
import Profile from './Profile';
import { AppState } from 'src/store/Store';

const Header = () => {
  const handleAddList = () => {
    if (typeof window !== 'undefined' && (window as any).__kanbanAddListHandler) {
      (window as any).__kanbanAddListHandler();
    }
  };

  // drawer
  const customizer = useSelector((state: AppState) => state.customizer);

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    width: '100%',
    maxWidth: '100%',
    [theme.breakpoints.up('lg')]: {
      minHeight: customizer.TopbarHeight,
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    maxWidth: '100%',
    color: theme.palette.text.secondary,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        {/* Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ZainzoLogo style={{ width: '28px', height: '28px' }} />
          </Box>
          <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ fontSize: '18px' }}>
            Zainzo Task
          </Typography>
        </Box>

        <Box flexGrow={1} />
        
        {/* Add List Button */}
        <Button
          variant="text"
          startIcon={<IconPlus size={18} />}
          onClick={handleAddList}
          sx={{ 
            mr: 2,
            color: 'text.primary',
            textTransform: 'none',
            fontSize: '14px',
          }}
        >
          Tambah List
        </Button>

        <Stack spacing={1.5} direction="row" alignItems="center">
          <IconButton color="inherit" size="medium">
            <Box sx={{ width: 20, height: 20 }}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 3.11 16.44 3.11 16.44M3.11 16.44H7.63M3.11 16.44V21.44M2 12C2 6.48 6.44 2 12 2C18.67 2 22 7.56 22 7.56M22 7.56V2.56M22 7.56H17.56" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Box>
          </IconButton>
          <Notifications />
          <IconButton color="inherit" size="medium">
            <Box sx={{ display: 'flex', gap: 0.4, flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', gap: 0.4 }}>
                <Box sx={{ width: 3, height: 3, bgcolor: 'text.secondary', borderRadius: '50%' }} />
                <Box sx={{ width: 3, height: 3, bgcolor: 'text.secondary', borderRadius: '50%' }} />
                <Box sx={{ width: 3, height: 3, bgcolor: 'text.secondary', borderRadius: '50%' }} />
              </Box>
              <Box sx={{ display: 'flex', gap: 0.4 }}>
                <Box sx={{ width: 3, height: 3, bgcolor: 'text.secondary', borderRadius: '50%' }} />
                <Box sx={{ width: 3, height: 3, bgcolor: 'text.secondary', borderRadius: '50%' }} />
                <Box sx={{ width: 3, height: 3, bgcolor: 'text.secondary', borderRadius: '50%' }} />
              </Box>
              <Box sx={{ display: 'flex', gap: 0.4 }}>
                <Box sx={{ width: 3, height: 3, bgcolor: 'text.secondary', borderRadius: '50%' }} />
                <Box sx={{ width: 3, height: 3, bgcolor: 'text.secondary', borderRadius: '50%' }} />
                <Box sx={{ width: 3, height: 3, bgcolor: 'text.secondary', borderRadius: '50%' }} />
              </Box>
            </Box>
          </IconButton>
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;
