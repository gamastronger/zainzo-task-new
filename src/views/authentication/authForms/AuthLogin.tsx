// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';

import { loginType } from 'src/types/auth/auth';
import AuthSocialButtons from './AuthSocialButtons';

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <Box mt={3}>
        <Typography
          component="div"
          color="textSecondary"
          variant="h6"
          fontWeight="400"
          textAlign="center"
          mb={2}
        >
          Sign in with your Google account
        </Typography>
      </Box>

      <AuthSocialButtons title="" />

      {subtitle}
    </>
  );
};

export default AuthLogin;
