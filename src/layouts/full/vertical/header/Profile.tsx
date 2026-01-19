import { useState, useEffect } from 'react';
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
// import * as dropdownData from './data';
import { IconMail } from '@tabler/icons-react';
import useAuth from 'src/guards/authGuard/UseAuth';
import { IconSwitchHorizontal, IconLogout } from '@tabler/icons-react';

type StoredUser = {
  name?: string;
  email?: string;
  picture?: string;
  jobTitle?: string;
} | null;

function normalizeAvatarUrl(picture?: string): string | undefined {
  if (!picture) return undefined;

  try {
    const url = new URL(picture);

    // Optimalkan avatar Google menjadi resolusi lebih tinggi
    if (url.hostname.includes('googleusercontent.com')) {
      // Pola umum: ...=s96-c  → ganti ke s256-c
      if (url.searchParams.has('sz')) {
        url.searchParams.set('sz', '256');
      } else if (url.pathname.includes('=s96-c')) {
        url.pathname = url.pathname.replace('=s96-c', '=s256-c');
      }
    }

    return url.toString();
  } catch {
    // Jika bukan URL valid, kembalikan apa adanya
    return picture;
  }
}

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
  const { logout, user, switchAccount } = useAuth();
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
  const rawPicture = (user as any)?.picture || userData?.picture;
  const userAvatar =
    normalizeAvatarUrl(rawPicture) ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      userName
    )}&background=5D87FF&color=fff&size=128`;
  const userRole = userData?.jobTitle || 'Google User';

  const handleSwitchAccount = () => {
    try {
      setAnchorEl(null);
      switchAccount();
    } catch (error) {
      console.error('Failed to switch account', error);
    }
  };

  const handleLogout = async () => {
    try {
      setAnchorEl(null);
      await logout();
    } finally {
      // Preserve kanban column colors across logout/login
      const kanbanColors = localStorage.getItem('kanban_column_colors');

      // Clear all local storage (auth/session data, etc.)
      localStorage.clear();

      // Restore kanban colors if they existed
      if (kanbanColors) {
        localStorage.setItem('kanban_column_colors', kanbanColors);
      }
      window.location.href = '/auth/login';
    }
  };

  return (
    <Box>
      {/* Avatar Trigger */}
      <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Avatar
          src={userAvatar}
          alt={userName}
          sx={{ width: 34, height: 34 }}
          imgProps={{ referrerPolicy: 'no-referrer' }}
        />
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
          <Avatar
            src={userAvatar}
            alt={userName}
            sx={{ width: 64, height: 64 }}
            imgProps={{ referrerPolicy: 'no-referrer' }}
          />
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
        {/* <Stack spacing={0.5}>
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
                color: 'text.primary', 
                transition: 'background-color .15s ease',

                '&:hover': {
                  bgcolor: 'rgba(93, 135, 255, 0.08)', // biru soft
                  color: 'text.primary',              
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
        </Stack> */}

        <Divider sx={{ my: 2 }} />

        {/* Switch account & Logout */}
        <Stack spacing={1}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleSwitchAccount}
            startIcon={<IconSwitchHorizontal size={18} />}
            sx={{
              borderRadius: 2,
              justifyContent: 'flex-start',
              textTransform: 'none',
              pl: 1.5,
            }}
          >
            Switch account
          </Button>

                    <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={handleLogout}
            startIcon={<IconLogout size={18} />}
            sx={{
              borderRadius: 2,
              justifyContent: 'flex-start',
              textTransform: 'none',
              pl: 1.5,
            }}
          >
            Sign out
          </Button>

        </Stack>
      </Menu>
    </Box>
  );
};

export default Profile;
