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
} from '@mui/material';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { IconEdit, IconCheck, IconX, IconMail, IconUser, IconArrowLeft } from '@tabler/icons-react';
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
  let user: GoogleUser | null = auth?.user ?? null;

  if (!user) {
    const stored = sessionStorage.getItem('google_user');
    if (stored) {
      try {
        user = JSON.parse(stored) as GoogleUser;
      } catch {
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

  // Load saved profile data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('user_profile_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ProfileData;
        setProfileData(parsed);
        setEditedData(parsed);
      } catch {
        // Use defaults
      }
    }
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - revert changes
      setEditedData(profileData);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('user_profile_data', JSON.stringify(editedData));
    
    // Update sessionStorage untuk backward compatibility
    const currentUser = sessionStorage.getItem('google_user');
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        const updatedUser = {
          ...userData,
          name: editedData.name,
          picture: editedData.picture,
        };
        sessionStorage.setItem('google_user', JSON.stringify(updatedUser));
      } catch {
        // Ignore parse errors
      }
    }
    
    setProfileData(editedData);
    setIsEditing(false);
    setShowSuccess(true);
    
    // Dispatch custom event untuk update header dropdown
    window.dispatchEvent(new Event('profileUpdated'));
    
    // Trigger storage event untuk cross-tab sync
    window.dispatchEvent(new Event('storage'));
  };

  const handleChange = (field: keyof ProfileData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditedData({
      ...editedData,
      [field]: event.target.value,
    });
  };

  const displayData = isEditing ? editedData : profileData;

  return (
    <PageContainer title="My Profile" description="View and edit your profile information">
      <Grid container spacing={3}>
        {/* Profile Header Card */}
        <Grid item xs={12}>
          <Card
            elevation={0}
            sx={{
              background: 'linear-gradient(135deg, #7790ffff 0%)',
              color: 'white',
              position: 'relative',
              overflow: 'visible',
            }}
          >
            <CardContent sx={{ pb: 8 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    variant="text"
                    color="inherit"
                    startIcon={<IconArrowLeft size={18} />}
                    onClick={() => navigate('/app')}
                    sx={{ color: 'white' }}
                  >
                    Back
                  </Button>
                  <Typography variant="h4" fontWeight={700}>
                    My Profile
                  </Typography>
                </Stack>
                <Button
                  variant={isEditing ? 'outlined' : 'contained'}
                  color="inherit"
                  startIcon={isEditing ? <IconX size={18} /> : <IconEdit size={18} />}
                  onClick={handleEditToggle}
                  sx={{
                    bgcolor: isEditing ? 'transparent' : 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    border: isEditing ? '1px solid rgba(255,255,255,0.5)' : 'none',
                    '&:hover': {
                      bgcolor: isEditing ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)',
                    },
                  }}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </Stack>
            </CardContent>

            {/* Avatar Section - Overlapping */}
            <Box
              sx={{
                position: 'absolute',
                bottom: -60,
                left: 40,
                zIndex: 1,
              }}
            >
              <Avatar
                src={displayData.picture}
                alt={displayData.name}
                sx={{
                  width: 120,
                  height: 120,
                  border: '4px solid white',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                }}
              >
                {!displayData.picture && displayData.name.charAt(0)}
              </Avatar>
            </Box>
          </Card>
        </Grid>

        {/* Profile Information */}
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={3}>
                {/* Name */}
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <IconUser size={18} color="#667eea" />
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      FULL NAME
                    </Typography>
                  </Stack>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={editedData.name}
                      onChange={handleChange('name')}
                      placeholder="Enter your full name"
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1" fontWeight={500}>
                      {displayData.name}
                    </Typography>
                  )}
                </Box>

                <Divider />

                {/* Email */}
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <IconMail size={18} color="#667eea" />
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      EMAIL ADDRESS
                    </Typography>
                  </Stack>
                  <Typography variant="body1" fontWeight={500} color="text.secondary">
                    {displayData.email}
                  </Typography>
                  <Chip
                    label="Verified"
                    size="small"
                    color="success"
                    sx={{ mt: 1, height: 22 }}
                  />
                </Box>

                <Divider />



                {isEditing && (
                  <>
                    <Divider />
                    <Box>
                      <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
                        <Button
                          variant="outlined"
                          onClick={handleEditToggle}
                          startIcon={<IconX size={18} />}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          onClick={handleSave}
                          startIcon={<IconCheck size={18} />}
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          }}
                        >
                          Save Changes
                        </Button>
                      </Stack>
                    </Box>
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Account Info */}
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Account Info
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Account Type
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    Google Account
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Member Since
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    January 2026
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default UserProfile;
