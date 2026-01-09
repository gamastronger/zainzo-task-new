import { FC } from 'react';
import { useSelector } from 'src/store/Store';
import { Link } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ReactComponent as ZainzoLogo } from 'src/assets/images/svgs/ztlogo.svg';
import { styled, Typography } from '@mui/material';
import { AppState } from 'src/store/Store';

const Logo: FC = () => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const LinkStyled = styled(Link)(() => ({
    height: customizer.TopbarHeight,
    width: customizer.isCollapse ? '40px' : '180px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }));

  return (
    <LinkStyled to="/">
      <ZainzoLogo style={{ width: '28px', height: '28px' }} />
      {!customizer.isCollapse && (
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: '18px',
            color: '#1a1a1a',
            letterSpacing: '-0.5px',
          }}
        >
          Zainzo Task
        </Typography>
      )}
    </LinkStyled>
  );
};

export default Logo;
