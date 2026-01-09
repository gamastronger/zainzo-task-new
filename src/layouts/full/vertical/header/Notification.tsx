import { useState, useMemo } from 'react';
import {
  IconButton,
  Box,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Button,
  Chip,
} from '@mui/material';
import { useSelector, useDispatch } from 'src/store/Store';
import { AppState } from 'src/store/Store';
import { InboxItem, inboxActions } from 'src/store/inbox/InboxSlice';
import Scrollbar from 'src/components/custom-scroll/Scrollbar';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { IconBellRinging, IconCheck, IconCalendar, IconCircle } from '@tabler/icons-react';
import { Stack } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const items = useSelector((s: AppState) => s.inbox.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Sort by timestamp and get unread count
  const sorted = useMemo(() => [...items].sort((a, b) => b.timestamp - a.timestamp), [items]);
  const unreadCount = sorted.filter((i) => i.unread).length;
  
  // Limit to 5 most recent for dropdown
  const recentItems = sorted.slice(0, 5);

  const handleClick2 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleNotificationClick = (item: InboxItem) => {
    // Mark as read
    dispatch(inboxActions.markRead(item.id));
    handleClose2();
    
    // Navigate to the task
    const params = new URLSearchParams();
    if (item.columnId) params.set('col', item.columnId);
    if (item.taskId) params.set('task', item.taskId);
    navigate(`/app?${params.toString()}`);
  };

  const formatTime = (ts: number) => {
    const now = Date.now();
    const diff = now - ts;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'completed':
        return <IconCheck size={20} color="#4caf50" />;
      case 'due':
        return <IconCalendar size={20} color="#ff9800" />;
      case 'overdue':
        return <IconCalendar size={20} color="#f44336" />;
      default:
        return <IconCircle size={20} color="#2196f3" />;
    }
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          color: anchorEl2 ? 'primary.main' : '',
        }}
        onClick={handleClick2}
      >
        <Badge badgeContent={unreadCount} color="primary">
          <IconBellRinging size="21" stroke="1.5" />
        </Badge>
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
          },
        }}
      >
        <Stack direction="row" py={2} px={4} justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Notifications</Typography>
          {unreadCount > 0 && <Chip label={`${unreadCount} new`} color="primary" size="small" />}
        </Stack>
        <Scrollbar sx={{ height: '385px' }}>
          {recentItems.length === 0 ? (
            <Box textAlign="center" py={4}>
              <IconBellRinging size={48} color="#ccc" />
              <Typography variant="body2" color="text.secondary" mt={2}>
                No notifications
              </Typography>
            </Box>
          ) : (
            recentItems.map((item) => (
              <Box key={item.id}>
                <MenuItem
                  sx={{
                    py: 2,
                    px: 4,
                    bgcolor: item.unread ? 'action.hover' : 'transparent',
                  }}
                  onClick={() => handleNotificationClick(item)}
                >
                  <Stack direction="row" spacing={2} width="100%">
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        bgcolor: 'primary.light',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {getNotificationIcon(item.type)}
                    </Box>
                    <Box flex={1} minWidth={0}>
                      <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                        {item.unread && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                            }}
                          />
                        )}
                        <Typography
                          variant="subtitle2"
                          color="textPrimary"
                          fontWeight={600}
                          noWrap
                          sx={{ flex: 1 }}
                        >
                          {item.title}
                        </Typography>
                      </Stack>
                      <Typography
                        color="textSecondary"
                        variant="caption"
                        display="block"
                        noWrap
                      >
                        {formatTime(item.timestamp)}
                      </Typography>
                    </Box>
                  </Stack>
                </MenuItem>
              </Box>
            ))
          )}
        </Scrollbar>
        <Box p={3} pb={1}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={() => {
              handleClose2();
              navigate('/app/inbox');
            }}
          >
            See all Notifications
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Notifications;
