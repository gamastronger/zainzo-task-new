import React, { useState, useEffect } from 'react';
import {
  Box,
  Menu,
  Avatar,
  Typography,
  Divider,
  Button,
  IconButton,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as dropdownData from './data';
import { IconMail } from '@tabler/icons-react';
import useAuth from 'src/guards/authGuard/UseAuth';

type StoredUser = {
  name?: string;
  email?: string;
  picture?: string;
  jobTitle?: string;
} | null;

function getStoredUser(): StoredUser {
  try {
    if (typeof window === 'undefined') return null;

    const profileData = localStorage.getItem('user_profile_data');
    if (profileData) {
      const parsed = JSON.parse(profileData);
      return {
        name: parsed.name,
        email: parsed.email,
        picture: parsed.picture,
        jobTitle: parsed.jobTitle,
      };
    }

    const raw = sessionStorage.getItem('google_user');
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

const Profile = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<StoredUser>(user ?? getStoredUser());

  useEffect(() => {
    const updateUserData = () => {
      const storedUser = getStoredUser();
      setUserData(user ?? storedUser);
    };

    updateUserData();
    window.addEventListener('storage', updateUserData);
    window.addEventListener('profileUpdated', updateUserData);

    return () => {
      window.removeEventListener('storage', updateUserData);
      window.removeEventListener('profileUpdated', updateUserData);
    };
  }, [user]);

  const userName = userData?.name || userData?.email?.split('@')[0] || 'User';
  const userEmail = userData?.email || 'user@example.com';
  const userAvatar =
    userData?.picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      userName
    )}&background=5D87FF&color=fff&size=128`;
  const userRole = userData?.jobTitle || 'Google User';

  const handleLogout = async () => {
    try {
      setAnchorEl(null);
      await logout();
    } finally {
      localStorage.clear();
      window.location.href = '/auth/login';
    }
  };

  return (
    <Box>
      {/* Avatar Trigger */}
      <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Avatar src={userAvatar} alt={userName} sx={{ width: 34, height: 34 }} />
      </IconButton>

      {/* Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        PaperProps={{
          sx: {
            width: 340,
            p: 3,
            borderRadius: 3,
            boxShadow: '0px 12px 32px rgba(0,0,0,0.14)',
          },
        }}
      >
        {/* User Header */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={userAvatar} sx={{ width: 64, height: 64 }} />
          <Box>
            <Typography fontWeight={600}>{userName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {userRole}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center" mt={0.5}>
              <IconMail size={14} />
              <Typography variant="caption" color="text.secondary">
                {userEmail}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Menu Actions */}
        <Stack spacing={0.5}>
          {dropdownData.profile.map((item) => (
            <Button
              key={item.title}
              fullWidth
              onClick={() => {
                setAnchorEl(null);
                navigate(item.href);
              }}
              sx={{
                p: 1.5,
                borderRadius: 2,
                justifyContent: 'flex-start',
                textTransform: 'none',
                bgcolor: 'transparent',
                color: 'text.primary', // ⬅️ warna teks default DIPAKSA
                transition: 'background-color .15s ease',

                '&:hover': {
                  bgcolor: 'rgba(93, 135, 255, 0.08)', // biru soft
                  color: 'text.primary',              // ⬅️ PENTING: JANGAN BIARKAN MUI UBAH
                },
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    bgcolor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Avatar
                    src={item.icon}
                    sx={{ width: 20, height: 20, borderRadius: 0 }}
                  />
                </Box>
                <Box textAlign="left">
                  <Typography fontWeight={600} variant="body2">
                    {item.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.subtitle}
                  </Typography>
                </Box>
              </Stack>
            </Button>
          ))}
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Logout */}
        <Button
          fullWidth
          variant="outlined"
          color="error"
          onClick={handleLogout}
          sx={{ borderRadius: 2 }}
        >
          Logout
        </Button>
      </Menu>
    </Box>
  );
};

export default Profile;
