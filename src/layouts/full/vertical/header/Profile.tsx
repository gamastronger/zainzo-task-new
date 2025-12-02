// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useState } from 'react';
import { Box, Menu, Avatar, Typography, Divider, Button, IconButton } from '@mui/material';
import * as dropdownData from './data';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { IconMail } from '@tabler/icons-react';
import { Stack } from '@mui/system';

import useMounted from 'src/guards/authGuard/UseMounted';
import useAuth from 'src/guards/authGuard/UseAuth';

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const mounted = useMounted();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Extract user data
  const userName = user?.name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || 'user@example.com';
  const userAvatar = user?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=5D87FF&color=fff&size=128`;
  const userRole = 'Google User';

  const handleClick2 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      if (mounted.current) {
        handleClose2();
      }
    } catch (error) {
      console.error(error);
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
