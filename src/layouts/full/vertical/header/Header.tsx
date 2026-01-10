import { IconButton, Box, AppBar, Toolbar, styled, Stack, Typography, Button } from '@mui/material';

import { useSelector } from 'src/store/Store';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { IconPlus } from '@tabler/icons-react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import Notifications from './Notification';
import Profile from './Profile';
import { AppState } from 'src/store/Store';
import GridMenu from 'src/layouts/full/shared/GridMenu';
import Logo from 'src/assets/images/svgs/ztlogo.svg';

const Header = () => {
  const handleAddList = () => {
    if (typeof window !== 'undefined' && (window as unknown as { __kanbanAddListHandler?: () => void }).__kanbanAddListHandler) {
      (window as unknown as { __kanbanAddListHandler: () => void }).__kanbanAddListHandler();
    }
  };

  // drawer
  const customizer = useSelector((state: AppState) => state.customizer);

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: 'rgb(249, 251, 255)',
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    width: '100%',
    maxWidth: '100%',
    [theme.breakpoints.up('lg')]: {
      minHeight: customizer.TopbarHeight,
    },
    [theme.breakpoints.down('sm')]: {
      minHeight: '56px',
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    maxWidth: '100%',
    color: theme.palette.text.secondary,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    minHeight: '56px !important',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(1.5),
      paddingRight: theme.spacing(1.5),
    },
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        {/* Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
          <Box
            component="img"
            src={Logo}
            alt="Zainzo Task Logo"
            sx={{
              height: { xs: 28, sm: 32 },
              width: 'auto',
              display: 'block',
            }}
          />
          <Typography
            variant="h6"
            fontWeight={600}
            color="text.primary"
            sx={{
              fontSize: { xs: '17px', sm: '19px' },
              display: { xs: 'none', sm: 'block' },
              lineHeight: 1.3,
              letterSpacing: 0,
            }}
          >
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
            mr: { xs: 1, sm: 2 },
            color: 'text.primary',
            textTransform: 'none',
            fontSize: { xs: '13px', sm: '14px' },
            minWidth: 'auto',
            px: { xs: 1, sm: 2 },
            '& .MuiButton-startIcon': {
              mr: { xs: 0.5, sm: 1 },
            },
          }}
        >
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            Tambah List
          </Box>
          <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
            Tambah
          </Box>
        </Button>

        <Stack spacing={{ xs: 0.5, sm: 1.5 }} direction="row" alignItems="center">
          {/* Refresh Button */}
          <IconButton 
            color="inherit" 
            size="medium"
            sx={{
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
            }}
            aria-label="Refresh"
            onClick={() => window.location.reload()}
          >
            <Box sx={{ width: { xs: 18, sm: 20 }, height: { xs: 18, sm: 20 } }}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 3.11 16.44 3.11 16.44M3.11 16.44H7.63M3.11 16.44V21.44M2 12C2 6.48 6.44 2 12 2C18.67 2 22 7.56 22 7.56M22 7.56V2.56M22 7.56H17.56" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Box>
          </IconButton>
            {/* 9-dots Grid Menu */}
            <GridMenu />
          <Notifications />
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;