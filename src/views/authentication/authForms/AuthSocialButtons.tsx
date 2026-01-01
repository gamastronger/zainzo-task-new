import icon1 from 'src/assets/images/svgs/google-icon.svg';
import CustomSocialButton from '../../../components/forms/theme-elements/CustomSocialButton';
import { Avatar, Box, Stack } from '@mui/material';
import useAuth from 'src/guards/authGuard/UseAuth';
import { signInType } from 'src/types/auth/auth';

const AuthSocialButtons = ({ title }: signInType) => {
  const { loginWithGoogle } = useAuth();

  const handleLoginGoogle = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error('Login Google gagal', err);
    }
  };

  return (
    <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
      <CustomSocialButton onClick={handleLoginGoogle} fullWidth>
        <Avatar
          src={icon1}
          sx={{ width: 20, height: 20, borderRadius: 0, mr: 1 }}
        />
        <Box sx={{ whiteSpace: 'nowrap' }}>
          {title || 'Sign in with'} Google
        </Box>
      </CustomSocialButton>
    </Stack>
  );
};

export default AuthSocialButtons;
