// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useState } from 'react';
import { Box, Menu, Avatar, Typography, Divider, Button, IconButton } from '@mui/material';
import * as dropdownData from './data';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { IconMail } from '@tabler/icons-react';
import { Stack } from '@mui/system';

import useAuth from 'src/guards/authGuard/UseAuth';

type StoredUser = { name?: string; email?: string; picture?: string } | null;

function getStoredUser(): StoredUser {
  try {
    if (typeof window === 'undefined') return null;
    const raw = sessionStorage.getItem('google_user');
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const { logout, user } = useAuth();

  // Prefer context user; fallback to sessionStorage cached user
  const effectiveUser = user ?? getStoredUser();

  // Extract user data
  const userName = effectiveUser?.name || effectiveUser?.email?.split('@')[0] || 'User';
  const userEmail = effectiveUser?.email || 'user@example.com';
  const userAvatar = effectiveUser?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=5D87FF&color=fff&size=128`;
  const userRole = 'Google User';

  const handleClick2 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleLogout = async () => {
    try {
      handleClose2();
      await logout();
      // Clear all auth data
      localStorage.removeItem('userId');
      localStorage.removeItem('authToken');
      // Redirect to login
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Force clear and redirect even on error
      localStorage.removeItem('userId');
      localStorage.removeItem('authToken');
      window.location.href = '/auth/login';
    }
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={userAvatar}
          alt={userName}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '360px',
            p: 4,
          },
        }}
      >
        <Typography variant="h5">User Profile</Typography>
        <Stack direction="row" py={3} spacing={2} alignItems="center">
          <Avatar src={userAvatar} alt={userName} sx={{ width: 95, height: 95 }} />
          <Box>
            <Typography variant="subtitle2" color="textPrimary" fontWeight={600}>
              {userName}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {userRole}
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <IconMail width={15} height={15} />
              {userEmail}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        {dropdownData.profile.map((profile) => (
          <Box key={profile.title}>
            <Box sx={{ py: 2, px: 0 }} className="hover-text-primary">
              <Stack direction="row" spacing={2}>
                <Box
                  width="45px"
                  height="45px"
                  bgcolor="primary.light"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Avatar
                    src={profile.icon}
                    alt={profile.icon}
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: 0,
                    }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="textPrimary"
                    className="text-hover"
                    noWrap
                    sx={{
                      width: '240px',
                    }}
                  >
                    {profile.title}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    sx={{
                      width: '240px',
                    }}
                    noWrap
                  >
                    {profile.subtitle}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        ))}
        <Box mt={2}>
          <Button variant="contained" color="primary" fullWidth onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
