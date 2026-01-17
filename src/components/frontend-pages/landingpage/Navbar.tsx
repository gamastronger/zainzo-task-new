import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import ZtLogo from 'src/assets/images/svgs/ztlogo.svg';

const LandingNavbar: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 16,
        zIndex: 1200,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            bgcolor: '#FFFFFF',
            borderRadius: 999,
            px: { xs: 2, sm: 4 },
            py: 1.5,
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* LEFT — LOGO */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="img"
              src={ZtLogo}
              alt="Zainzo Task"
              sx={{ width: 22, height: 22 }}
            />
            <Typography fontWeight={600} fontSize={14}>
              Zainzo Task
            </Typography>
          </Box>

          {/* CENTER — DESKTOP MENU */}
          {!isMobile && (
            <Typography
              component="a"
              href="https://account.zainzo.com/dashboards/modern"
              sx={{
                fontSize: 14,
                color: '#1c1d1f',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Semua Produk
            </Typography>
          )}

          {/* RIGHT — CTA + HAMBURGER */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate('/auth/login')}
              sx={{
                textTransform: 'none',
                borderRadius: 666,
                px: 2.5,
                bgcolor: '#5A4CA6',
                boxShadow: '0 6px 16px rgba(90, 76, 166, 0.35)',
                '&:hover': {
                  bgcolor: '#4F4196',
                  boxShadow: '0 8px 20px rgba(90, 76, 166, 0.45)',
                },
              }}
            >
              Masuk
            </Button>

            {isMobile && (
              <>
                <IconButton
                  onClick={handleMenuOpen}
                  size="small"
                  sx={{ color: '#1c1d1f' }}
                >
                  <MenuIcon />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 160,
                      borderRadius: 2,
                      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
                      p: 0.5,
                    },
                  }}
                >

                  <MenuItem
                    component="a"
                    href="https://account.zainzo.com/dashboards/modern"
                    onClick={handleMenuClose}
                    sx={{
                      fontSize: 13,
                      py: 0.75,
                      px: 1.5,
                      borderRadius: 1.5,
                      '&:hover': {
                        bgcolor: 'rgba(90, 76, 166, 0.08)',
                      },
                    }}
                  >
                    Semua Produk
                  </MenuItem>

                </Menu>
              </>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingNavbar;
