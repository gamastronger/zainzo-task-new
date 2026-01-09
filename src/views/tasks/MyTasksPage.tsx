import React, { useMemo, useState } from 'react';
import PageContainer from 'src/components/container/PageContainer';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Checkbox,
  Select,
  MenuItem,
} from '@mui/material';
import { useKanban } from 'src/views/apps/kanban/kanban.hooks';
import { useNavigate } from 'react-router-dom';

type Filter = 'today' | 'overdue' | 'upcoming' | 'all';
type SortOrder = 'asc' | 'desc';

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

const MyTasksPage: React.FC = () => {
  const { board, updateCard, isLoading } = useKanban();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const columnByCard: Record<string, { id: string; title: string }> = useMemo(() => {
    const map: Record<string, { id: string; title: string }> = {};
    for (const col of board.columns) {
      for (const cid of col.cardIds) {
        map[cid] = { id: col.id, title: col.title };
      }
    }
    return map;
  }, [board.columns]);

  const tasks = useMemo(() => {
    const all = Object.values(board.cards);

    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const filtered = all.filter((c) => {
      if (!c) return false;
      // Apply filter
      if (filter === 'today') {
        if (!c.dueDate) return false;
        const due = new Date(c.dueDate);
        return isSameDay(due, today);
      }
      if (filter === 'overdue') {
        if (!c.dueDate) return false;
        const due = new Date(c.dueDate);
        // overdue if due strictly before today (ignore time)
        const dueDateOnly = new Date(due.getFullYear(), due.getMonth(), due.getDate());
        return dueDateOnly < startOfToday && !c.completed;
      }
      if (filter === 'upcoming') {
        if (!c.dueDate) return false;
        const due = new Date(c.dueDate);
        const dueDateOnly = new Date(due.getFullYear(), due.getMonth(), due.getDate());
        return dueDateOnly > startOfToday;
      }
      return true; // 'all'
    });

    const sorted = filtered.sort((a, b) => {
      const ad = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY;
      const bd = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY;
      return sortOrder === 'asc' ? ad - bd : bd - ad;
    });

    return sorted;
  }, [board.cards, filter, sortOrder]);

  const handleToggleComplete = (id: string, checked: boolean) => {
    updateCard(id, { completed: checked });
  };

  const goToKanban = (cardId: string) => {
    const col = columnByCard[cardId]?.id;
    const query = new URLSearchParams();
    query.set('task', cardId);
    if (col) query.set('col', col);
    navigate(`/app?${query.toString()}`);
  };

  const EmptyState = (
    <Box textAlign="center" py={6}>
      <Typography variant="h6">No tasks found</Typography>
      <Typography variant="body2" color="text.secondary">
        Try adjusting filters or add tasks in the Kanban board.
      </Typography>
    </Box>
  );

  return (
    <PageContainer title="My Tasks" description="Personal aggregated task list">
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={7}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <ToggleButtonGroup
                  value={filter}
                  exclusive
                  onChange={(_, v) => v && setFilter(v)}
                  size="small"
                >
                  <ToggleButton value="all">All</ToggleButton>
                  <ToggleButton value="today">Today</ToggleButton>
                  <ToggleButton value="overdue">Overdue</ToggleButton>
                  <ToggleButton value="upcoming">Upcoming</ToggleButton>
                </ToggleButtonGroup>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" color="text.secondary">Sort</Typography>
                  <Select
                    size="small"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                  >
                    <MenuItem value="asc">Due date (asc)</MenuItem>
                    <MenuItem value="desc">Due date (desc)</MenuItem>
                  </Select>
                </Stack>
              </Stack>

              <Divider sx={{ my: 2 }} />

              {isLoading ? (
                <Typography variant="body2" color="text.secondary">Loading tasks…</Typography>
              ) : tasks.length === 0 ? (
                EmptyState
              ) : (
                <List>
                  {tasks.map((c) => {
                    const col = columnByCard[c.id];
                    const due = c.dueDate ? new Date(c.dueDate) : null;
                    const dueText = due ? due.toLocaleDateString() : '—';
                    return (
                      <ListItem key={c.id} disableGutters>
                        <Checkbox
                          checked={!!c.completed}
                          onChange={(e) => handleToggleComplete(c.id, e.target.checked)}
                        />
                        <ListItemText
                          primary={
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography variant="body1" fontWeight={600} sx={{ textDecoration: c.completed ? 'line-through' : 'none' }}>
                                {c.title}
                              </Typography>
                              {col && (
                                <Chip size="small" label={col.title} variant="outlined" />
                              )}
                            </Stack>
                          }
                          secondary={
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Typography variant="body2" color="text.secondary">Due: {dueText}</Typography>
                              <Typography variant="body2" color={c.completed ? 'success.main' : 'warning.main'}>
                                {c.completed ? 'Completed' : 'Open'}
                              </Typography>
                            </Stack>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Button size="small" onClick={() => goToKanban(c.id)}>Open in Board</Button>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default MyTasksPage;
