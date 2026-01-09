import React, { useState, useEffect } from 'react';
import PageContainer from 'src/components/container/PageContainer';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Button,
  TextField,
  Divider,
  Alert,
  Snackbar,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  IconEdit,
  IconCheck,
  IconX,
  IconMail,
  IconUser,
  IconArrowLeft,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import useAuth from 'src/guards/authGuard/UseAuth';

interface GoogleUser {
  name?: string;
  displayName?: string;
  email?: string;
  picture?: string;
  photoURL?: string;
}

interface ProfileData {
  name: string;
  email: string;
  picture: string;
}

const UserProfile: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  let user: GoogleUser | null = auth?.user ?? null;

  if (!user) {
    const stored = sessionStorage.getItem('google_user');
    if (stored) {
      try {
        user = JSON.parse(stored);
      } catch {
        // Failed to parse stored user, fallback to null
        user = null;
      }
    }
  }

  const defaultName = user?.name || user?.displayName || 'Unknown User';
  const defaultEmail = user?.email || 'No email available';
  const defaultPicture = user?.picture || user?.photoURL || '';

  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    name: defaultName,
    email: defaultEmail,
    picture: defaultPicture,
  });

  const [editedData, setEditedData] = useState<ProfileData>(profileData);

  useEffect(() => {
    const saved = localStorage.getItem('user_profile_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ProfileData;
        setProfileData(parsed);
        setEditedData(parsed);
      } catch {
        // Failed to parse saved profile data, use defaults
      }
    }
  }, []);

  const handleEditToggle = () => {
    if (isEditing) setEditedData(profileData);
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    localStorage.setItem('user_profile_data', JSON.stringify(editedData));

    const currentUser = sessionStorage.getItem('google_user');
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        sessionStorage.setItem(
          'google_user',
          JSON.stringify({
            ...userData,
            name: editedData.name,
            picture: editedData.picture,
          })
        );
      } catch {
        // Failed to update session storage, continue anyway
      }
    }

    setProfileData(editedData);
    setIsEditing(false);
    setShowSuccess(true);
    window.dispatchEvent(new Event('profileUpdated'));
  };

  const handleChange =
    (field: keyof ProfileData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEditedData({ ...editedData, [field]: event.target.value });
    };

  const displayData = isEditing ? editedData : profileData;

  return (
    <PageContainer title="My Profile" description="View and edit your profile">
      <Grid container spacing={3}>
        {/* ================= HEADER ================= */}
        <Grid item xs={12}>
          <Card
  elevation={0}
  sx={{
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    position: 'relative',
    overflow: 'visible', // WAJIB
  }}
>
            <CardContent
  sx={{
    pb: isMobile ? 3 : 12, // DESKTOP dikasih ruang BESAR
  }}
>
              <Stack
                direction={isMobile ? 'column' : 'row'}
                spacing={2}
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    color="inherit"
                    startIcon={<IconArrowLeft size={18} />}
                    onClick={() => navigate('/app')}
                  >
                    Back
                  </Button>
                  <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700}>
                    My Profile
                  </Typography>
                </Stack>

                <Button
                  fullWidth={isMobile}
                  variant={isEditing ? 'outlined' : 'contained'}
                  color="inherit"
                  startIcon={
                    isEditing ? <IconX size={18} /> : <IconEdit size={18} />
                  }
                  onClick={handleEditToggle}
                  sx={{
                    bgcolor: isEditing
                      ? 'transparent'
                      : 'rgba(255,255,255,0.2)',
                  }}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </Stack>
            </CardContent>

            {/* AVATAR */}
            {/* AVATAR */}
<Box
  sx={{
    position: isMobile ? 'relative' : 'absolute',
    bottom: isMobile ? 'auto' : -60,
    left: isMobile ? 'auto' : 40,
    display: 'flex',
    justifyContent: 'center',
    width: isMobile ? '100%' : 'auto',
    mt: isMobile ? 2 : 0,
    zIndex: 3,
  }}
>
  <Avatar
    src={displayData.picture}
    alt={displayData.name}
    sx={{
      width: isMobile ? 96 : 120,
      height: isMobile ? 96 : 120,
      border: '4px solid white',
      boxShadow: '0 6px 24px rgba(0,0,0,0.25)',
    }}
  >
    {!displayData.picture && displayData.name.charAt(0)}
  </Avatar>
</Box>

          </Card>
        </Grid>

        {/* ================= PROFILE INFO ================= */}
        <Grid item xs={12} md={8} sx={{ mt: isMobile ? 0 : 6 }}>
          <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: isMobile ? 2.5 : 4 }}>
              <Stack spacing={3}>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <IconUser size={18} />
                    <Typography variant="caption" fontWeight={600}>
                      FULL NAME
                    </Typography>
                  </Stack>

                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      value={editedData.name}
                      onChange={handleChange('name')}
                    />
                  ) : (
                    <Typography fontWeight={500}>
                      {displayData.name}
                    </Typography>
                  )}
                </Box>

                <Divider />

                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <IconMail size={18} />
                    <Typography variant="caption" fontWeight={600}>
                      EMAIL
                    </Typography>
                  </Stack>
                  <Typography color="text.secondary">
                    {displayData.email}
                  </Typography>
                  <Chip
                    label="Verified"
                    size="small"
                    color="success"
                    sx={{ mt: 1 }}
                  />
                </Box>

                {isEditing && (
                  <>
                    <Divider />
                    <Stack
                      direction={isMobile ? 'column' : 'row'}
                      spacing={2}
                      justifyContent="flex-end"
                    >
                      <Button
                        fullWidth={isMobile}
                        variant="outlined"
                        onClick={handleEditToggle}
                        startIcon={<IconX size={18} />}
                      >
                        Cancel
                      </Button>
                      <Button
                        fullWidth={isMobile}
                        variant="contained"
                        onClick={handleSave}
                        startIcon={<IconCheck size={18} />}
                      >
                        Save Changes
                      </Button>
                    </Stack>
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* ================= ACCOUNT INFO ================= */}
        <Grid item xs={12} md={4} sx={{ mt: isMobile ? 0 : 6 }}>
          <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: isMobile ? 2.5 : 4 }}>
              <Typography fontWeight={600} mb={2}>
                Account Info
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption">Account Type</Typography>
                  <Typography fontWeight={600}>Google Account</Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption">Member Since</Typography>
                  <Typography fontWeight={600}>January 2026</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          Profile updated successfully
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default UserProfile;
