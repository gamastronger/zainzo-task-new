import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'src/store/Store';
import { InboxItem } from 'src/store/inbox/InboxSlice';
import { useDispatch } from 'src/store/Store';
import { inboxActions } from 'src/store/inbox/InboxSlice';
import { Box, Button, Divider, IconButton, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import { IconCheck, IconCalendar, IconChevronRight, IconCircle, IconInbox, IconListCheck, IconArrowLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString();
}

export default function InboxPage() {
  const items = useSelector((s: AppState) => s.inbox.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sorted = useMemo(() => [...items].sort((a, b) => b.timestamp - a.timestamp), [items]);
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
      <Box p={{ xs: 2, md: 3 }}>
        <Button
          variant="text"
          startIcon={<IconArrowLeft size={18} />}
          onClick={() => navigate('/app')}
          sx={{ mb: 2 }}
        >
          Back to Board
        </Button>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconInbox size={18} />
            <Typography variant="h6" fontWeight={700}>My Inbox</Typography>
            {unreadCount > 0 && (
              <Typography variant="body2" color="primary.main">• {unreadCount} unread</Typography>
            )}
          </Stack>
          {items.length > 0 && (
            <Button size="small" variant="text" startIcon={<IconCheck size={16} />} onClick={() => dispatch(inboxActions.markAllRead())}>
              Mark all read
            </Button>
          )}
        </Stack>

        {sorted.length === 0 ? (
          <Box textAlign="center" py={8}>
            <IconListCheck size={36} />
            <Typography variant="subtitle1" mt={1}>No notifications</Typography>
            <Typography variant="body2" color="text.secondary">You’re all caught up.</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {sorted.map((it) => (
              <>
                <ListItem key={it.id} disablePadding secondaryAction={<IconButton edge="end" onClick={() => handleOpen(it)}><IconChevronRight size={18} /></IconButton>}>
                  <ListItemButton onClick={() => handleOpen(it)} selected={it.unread} sx={{ alignItems: 'flex-start', gap: 1 }}>
                    <Box mt={0.6}>{it.unread ? <IconCircle size={10} color="#1976d2" /> : <span style={{ width: 10 }} />}</Box>
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          {it.type === 'completed' && <IconCheck size={14} />}
                          {it.type === 'due' && <IconCalendar size={14} />}
                          {it.type === 'overdue' && <IconCalendar size={14} color="#d32f2f" />}
                          <Typography variant="body2" fontWeight={600}>{it.title}</Typography>
                        </Stack>
                      }
                      secondary={<Typography variant="caption" color="text.secondary">{formatTime(it.timestamp)}</Typography>}
                    />
                  </ListItemButton>
                </ListItem>
                <Divider component="li" />
              </>
            ))}
          </List>
        )}
      </Box>
    </PageContainer>
  );
}
