import { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Typography,
  Box,
  Stack,
} from '@mui/material';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ReactComponent as GridIcon } from 'src/assets/images/svgs/grid-icon.svg';

import ZainzoContact from 'src/assets/images/svgs/zainzocontact.svg';
import ZainzoBook from 'src/assets/images/svgs/zainzobook.svg';

const GridMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleExternalRedirect = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
  handleClose();
};

  const MenuCard = ({
    title,
    subtitle,
    icon,
    onClick,
  }: {
    title: string;
    subtitle: string;
    icon: string;
    onClick: () => void;
  }) => (
    <MenuItem
      disableGutters
      onClick={onClick}
      sx={{
        px: 1.5,
        py: 1,
        borderRadius: 2,
        mb: 0.5,
        transition: 'all .2s ease',
        '&:hover': {
          bgcolor: 'action.hover',
          transform: 'translateY(-1px)',
        },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        {/* Icon */}
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.100',
            flexShrink: 0,
          }}
        >
          <Box
            component="img"
            src={icon}
            alt={title}
            sx={{ width: 20, height: 20 }}
          />
        </Box>

        {/* Text */}
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Stack>
    </MenuItem>
  );

  return (
    <>
      {/* 9 DOTS ICON */}
      <IconButton
        size="large"
        aria-label="grid menu"
        color="inherit"
        onClick={handleClick}
        aria-controls={open ? 'grid-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <GridIcon style={{ width: 24, height: 24 }} />
      </IconButton>

      <Menu
        id="grid-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            p: 1.5,
            width: 260,
            borderRadius: 3,
            boxShadow: '0 12px 32px rgba(0,0,0,0.14)',
          },
        }}
      >
        {/* Header */}
        <Typography variant="subtitle2" fontWeight={600} mb={1}>
          Zainzo Products
        </Typography>

        <Divider sx={{ mb: 1 }} />

        {/* Menu Items */}
        <MenuCard
          title="Zainzo Book"
          subtitle="Knowledge & Docs"
          icon={ZainzoBook}
          onClick={() => handleExternalRedirect('https://book.zainzo.com')}
        />

        <MenuCard
          title="Zainzo Contact"
          subtitle="Manage Contacts"
          icon={ZainzoContact}
          onClick={() => handleExternalRedirect('https://contact.zainzo.com')}
        />
      </Menu>
    </>
  );
};

export default GridMenu;
