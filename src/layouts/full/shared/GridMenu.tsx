import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Typography, Box } from '@mui/material';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ReactComponent as GridIcon } from 'src/assets/images/svgs/grid-icon.svg';
import { IconBook, IconAddressBook } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const GridMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleClose();
  };

  return (
    <>
      <IconButton
        size="large"
        aria-label="grid menu"
        color="inherit"
        onClick={handleClick}
        aria-controls={open ? 'grid-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <GridIcon style={{ width: 20, height: 20 }} />
      </IconButton>
      <Menu
        id="grid-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 200,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            borderRadius: 2,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={600} color="text.primary">
            Zainzo Products
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => handleNavigate('/zainzo-book')} sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon>
            <IconBook size={20} stroke={1.5} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500}>
              Zainzo Book
            </Typography>
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleNavigate('/zainzo-contact')} sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon>
            <IconAddressBook size={20} stroke={1.5} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" fontWeight={500}>
              Zainzo Contact
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default GridMenu;
