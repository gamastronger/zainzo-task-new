import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { AppState, useDispatch } from 'src/store/Store';
import { InboxItem, inboxActions } from 'src/store/inbox/InboxSlice';
import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  IconCheck,
  IconCalendar,
  IconChevronRight,
  IconInbox,
  IconListCheck,
  IconArrowLeft,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';

function formatTime(ts: number) {
  return new Date(ts).toLocaleString();
}

export default function InboxPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const items = useSelector((s: AppState) => s.inbox.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sorted = useMemo(
    () => [...items].sort((a, b) => b.timestamp - a.timestamp),
    [items]
  );

  const unreadCount = sorted.filter((i) => i.unread).length;

  const handleOpen = (it: InboxItem) => {
    dispatch(inboxActions.markRead(it.id));
    const params = new URLSearchParams();
    if (it.columnId) params.set('col', it.columnId);
    if (it.taskId) params.set('task', it.taskId);
    navigate(`/app?${params.toString()}`);
  };

  return (
    <PageContainer title="My Inbox" description="Notifications and activity">
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: { xs: 2, md: 3 },
          maxWidth: 900,
          mx: 'auto',
        }}
      >
        {/* Header */}
        <Button
          startIcon={<IconArrowLeft size={18} />}
          onClick={() => navigate('/app')}
          sx={{ mb: 2 }}
        >
          Back to Board
        </Button>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <IconInbox size={20} />
            <Typography variant="h6" fontWeight={700}>
              My Inbox
            </Typography>
            {unreadCount > 0 && (
              <Typography variant="body2" color="primary.main">
                {unreadCount} unread
              </Typography>
            )}
          </Stack>

          {items.length > 0 && (
            <Button
              size="small"
              startIcon={<IconCheck size={16} />}
              onClick={() => dispatch(inboxActions.markAllRead())}
            >
              Mark all read
            </Button>
          )}
        </Stack>

        {/* Content */}
        <Card variant="outlined">
          {sorted.length === 0 ? (
            <Box textAlign="center" py={8}>
              <IconListCheck size={40} />
              <Typography mt={1} fontWeight={600}>
                No notifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You’re all caught up.
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {sorted.map((it, idx) => (
                <Box key={it.id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleOpen(it)}
                      sx={{
                        py: isMobile ? 2 : 2.5,
                        px: isMobile ? 2 : 3,
                        bgcolor: it.unread
                          ? 'action.hover'
                          : 'transparent',
                        alignItems: 'flex-start',
                      }}
                    >
                      <ListItemText
                        primary={
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            {it.type === 'completed' && (
                              <IconCheck size={16} />
                            )}
                            {(it.type === 'due' ||
                              it.type === 'overdue') && (
                              <IconCalendar
                                size={16}
                                color={
                                  it.type === 'overdue'
                                    ? '#d32f2f'
                                    : undefined
                                }
                              />
                            )}
                            <Typography fontWeight={600}>
                              {it.title}
                            </Typography>
                          </Stack>
                        }
                        secondary={
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {formatTime(it.timestamp)}
                          </Typography>
                        }
                      />

                      <IconButton edge="end">
                        <IconChevronRight size={18} />
                      </IconButton>
                    </ListItemButton>
                  </ListItem>

                  {idx < sorted.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          )}
        </Card>
      </Box>
    </PageContainer>
  );
}
