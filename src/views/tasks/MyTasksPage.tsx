import React, { useMemo, useState } from 'react';
import PageContainer from 'src/components/container/PageContainer';
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Checkbox,
  Select,
  MenuItem,
  IconButton,
  alpha,
  useTheme,
  Paper,
} from '@mui/material';
import { useKanban } from 'src/views/apps/kanban/kanban.hooks';
import { useNavigate } from 'react-router-dom';
import { 
  IconArrowLeft, 
  IconCalendar, 
  IconChecklist,
  IconAlertCircle,
  IconClock,
  IconArrowRight,
  IconCheck,
} from '@tabler/icons-react';

type Filter = 'today' | 'overdue' | 'upcoming' | 'all';
type SortOrder = 'asc' | 'desc';

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

const MyTasksPage: React.FC = () => {
  const { board, updateCard, isLoading } = useKanban();
  const navigate = useNavigate();
  const theme = useTheme();
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
      if (filter === 'today') {
        if (!c.dueDate) return false;
        const due = new Date(c.dueDate);
        return isSameDay(due, today);
      }
      if (filter === 'overdue') {
        if (!c.dueDate) return false;
        const due = new Date(c.dueDate);
        const dueDateOnly = new Date(due.getFullYear(), due.getMonth(), due.getDate());
        return dueDateOnly < startOfToday && !c.completed;
      }
      if (filter === 'upcoming') {
        if (!c.dueDate) return false;
        const due = new Date(c.dueDate);
        const dueDateOnly = new Date(due.getFullYear(), due.getMonth(), due.getDate());
        return dueDateOnly > startOfToday;
      }
      return true;
    });

    const sorted = filtered.sort((a, b) => {
      const ad = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY;
      const bd = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY;
      return sortOrder === 'asc' ? ad - bd : bd - ad;
    });

    return sorted;
  }, [board.cards, filter, sortOrder]);

  const stats = useMemo(() => {
    const all = Object.values(board.cards);
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    return {
      total: all.length,
      completed: all.filter(c => c.completed).length,
      today: all.filter(c => {
        if (!c.dueDate) return false;
        return isSameDay(new Date(c.dueDate), today);
      }).length,
      overdue: all.filter(c => {
        if (!c.dueDate || c.completed) return false;
        const due = new Date(c.dueDate);
        const dueDateOnly = new Date(due.getFullYear(), due.getMonth(), due.getDate());
        return dueDateOnly < startOfToday;
      }).length,
    };
  }, [board.cards]);

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

  const getDueDateColor = (dueDate: string | undefined, completed: boolean) => {
    if (!dueDate || completed) return 'text.secondary';
    const due = new Date(dueDate);
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dueDateOnly = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    
    if (dueDateOnly < startOfToday) return 'error.main';
    if (isSameDay(dueDateOnly, today)) return 'warning.main';
    return 'text.secondary';
  };

  const EmptyState = (
    <Box textAlign="center" py={10}>
      <Box
        sx={{
          width: 100,
          height: 100,
          borderRadius: '24px',
          bgcolor: alpha(theme.palette.primary.main, 0.06),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          mb: 3,
        }}
      >
        <IconChecklist size={48} color={theme.palette.primary.main} opacity={0.6} />
      </Box>
      <Typography variant="h5" fontWeight={600} mb={1.5} color="text.primary">
        No tasks found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320, mx: 'auto' }}>
        Try adjusting your filters or create new tasks in the Kanban board
      </Typography>
    </Box>
  );

  return (
    <PageContainer title="My Tasks" description="Personal aggregated task list">
      <Box 
        sx={{ 
          minHeight: '100vh',
          bgcolor: alpha(theme.palette.primary.main, 0.02),
          pb: 6,
        }}
      >
        {/* Header */}
        <Box px={{ xs: 3, md: 4 }} pt={4} pb={3}>
          <Button
            variant="text"
            startIcon={<IconArrowLeft size={18} />}
            onClick={() => navigate('/app')}
            sx={{ 
              mb: 3,
              color: 'text.secondary',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.06),
              },
            }}
          >
            Back to Board
          </Button>
          
          <Box mb={4}>
            <Typography variant="h3" fontWeight={700} mb={1} letterSpacing={-0.5}>
              My Tasks
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Stay organized and track your progress
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={2.5}>
            <Grid item xs={6} md={3}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                  transition: 'all 0.3s ease',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.08)}`,
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2.5,
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <IconChecklist size={28} color={theme.palette.primary.main} />
                  </Box>
                  <Box flex={1}>
                    <Typography variant="h4" fontWeight={700} mb={0.5} lineHeight={1.2}>
                      {stats.total}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      Total Tasks
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                  transition: 'all 0.3s ease',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 24px ${alpha(theme.palette.success.main, 0.08)}`,
                    borderColor: alpha(theme.palette.success.main, 0.2),
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2.5,
                      bgcolor: alpha(theme.palette.success.main, 0.08),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <IconCheck size={28} color={theme.palette.success.main} />
                  </Box>
                  <Box flex={1}>
                    <Typography variant="h4" fontWeight={700} mb={0.5} lineHeight={1.2}>
                      {stats.completed}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      Completed
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                  transition: 'all 0.3s ease',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 24px ${alpha(theme.palette.warning.main, 0.08)}`,
                    borderColor: alpha(theme.palette.warning.main, 0.2),
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2.5,
                      bgcolor: alpha(theme.palette.warning.main, 0.08),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <IconCalendar size={28} color={theme.palette.warning.main} />
                  </Box>
                  <Box flex={1}>
                    <Typography variant="h4" fontWeight={700} mb={0.5} lineHeight={1.2}>
                      {stats.today}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      Due Today
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                  transition: 'all 0.3s ease',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 24px ${alpha(theme.palette.error.main, 0.08)}`,
                    borderColor: alpha(theme.palette.error.main, 0.2),
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2.5,
                      bgcolor: alpha(theme.palette.error.main, 0.08),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <IconAlertCircle size={28} color={theme.palette.error.main} />
                  </Box>
                  <Box flex={1}>
                    <Typography variant="h4" fontWeight={700} mb={0.5} lineHeight={1.2}>
                      {stats.overdue}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      Overdue
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Main Content */}
        <Box px={{ xs: 3, md: 4 }}>
          <Paper 
            elevation={0}
            sx={{ 
              borderRadius: 4,
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            }}
          >
            <Box sx={{ p: { xs: 2.5, md: 3.5 } }}>
              {/* Filters */}
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2.5} 
                alignItems={{ xs: 'stretch', sm: 'center' }} 
                justifyContent="space-between"
                mb={3}
              >
                <ToggleButtonGroup
                  value={filter}
                  exclusive
                  onChange={(_, v) => v && setFilter(v)}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                    borderRadius: 2,
                    p: 0.5,
                    '& .MuiToggleButton-root': {
                      border: 'none',
                      borderRadius: 1.5,
                      px: 2.5,
                      py: 1,
                      color: 'text.secondary',
                      fontWeight: 500,
                      transition: 'all 0.2s ease',
                      '&.Mui-selected': {
                        bgcolor: 'background.paper',
                        color: 'primary.main',
                        fontWeight: 600,
                        boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`,
                        '&:hover': {
                          bgcolor: 'background.paper',
                        },
                      },
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                      },
                    },
                  }}
                >
                  <ToggleButton value="all">All Tasks</ToggleButton>
                  <ToggleButton value="today">Today</ToggleButton>
                  <ToggleButton value="overdue">Overdue</ToggleButton>
                  <ToggleButton value="upcoming">Upcoming</ToggleButton>
                </ToggleButtonGroup>
                
                <Stack direction="row" spacing={1.5} alignItems="center" minWidth={{ sm: 200 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={500} noWrap>
                    Sort by
                  </Typography>
                  <Select
                    size="small"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                    sx={{ 
                      flex: 1,
                      borderRadius: 2,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(theme.palette.divider, 0.5),
                      },
                    }}
                  >
                    <MenuItem value="asc">Due date (earliest)</MenuItem>
                    <MenuItem value="desc">Due date (latest)</MenuItem>
                  </Select>
                </Stack>
              </Stack>

              <Divider sx={{ mb: 3, borderColor: alpha(theme.palette.divider, 0.5) }} />

              {/* Task List */}
              {isLoading ? (
                <Box textAlign="center" py={8}>
                  <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    Loading your tasks…
                  </Typography>
                </Box>
              ) : tasks.length === 0 ? (
                EmptyState
              ) : (
                <Stack spacing={2}>
                  {tasks.map((c) => {
                    const col = columnByCard[c.id];
                    const due = c.dueDate ? new Date(c.dueDate) : null;
                    const dueText = due ? due.toLocaleDateString() : 'No due date';
                    const dueColor = getDueDateColor(c.dueDate, c.completed);
                    
                    return (
                      <Paper
                        key={c.id}
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: 3,
                          border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                          bgcolor: c.completed 
                            ? alpha(theme.palette.success.main, 0.02)
                            : 'background.paper',
                          transition: 'all 0.25s ease',
                          '&:hover': {
                            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.08)}`,
                            transform: 'translateY(-2px)',
                            borderColor: alpha(theme.palette.primary.main, 0.2),
                          },
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                          <Checkbox
                            checked={!!c.completed}
                            onChange={(e) => handleToggleComplete(c.id, e.target.checked)}
                            sx={{ 
                              mt: -0.5,
                              color: alpha(theme.palette.primary.main, 0.4),
                              '&.Mui-checked': {
                                color: 'success.main',
                              },
                            }}
                          />
                          
                          <Box flex={1}>
                            <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5} flexWrap="wrap">
                              <Typography 
                                variant="body1" 
                                fontWeight={600}
                                sx={{ 
                                  textDecoration: c.completed ? 'line-through' : 'none',
                                  color: c.completed ? 'text.secondary' : 'text.primary',
                                  lineHeight: 1.5,
                                }}
                              >
                                {c.title}
                              </Typography>
                              {col && (
                                <Chip 
                                  size="small" 
                                  label={col.title} 
                                  sx={{ 
                                    height: 24,
                                    fontSize: '0.75rem',
                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    borderRadius: 1.5,
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                                  }}
                                />
                              )}
                            </Stack>
                            
                            <Stack 
                              direction="row" 
                              spacing={2.5} 
                              alignItems="center" 
                              flexWrap="wrap"
                            >
                              <Stack direction="row" spacing={1} alignItems="center">
                                <IconClock 
                                  size={16} 
                                  style={{ 
                                    color: theme.palette.text.secondary,
                                    opacity: 0.7,
                                  }} 
                                />
                                <Typography 
                                  variant="body2" 
                                  color={dueColor}
                                  fontWeight={500}
                                  sx={{ fontSize: '0.875rem' }}
                                >
                                  {dueText}
                                </Typography>
                              </Stack>
                              
                              <Chip
                                size="small"
                                label={c.completed ? 'Completed' : 'In Progress'}
                                sx={{
                                  height: 24,
                                  fontSize: '0.75rem',
                                  bgcolor: c.completed 
                                    ? alpha(theme.palette.success.main, 0.08)
                                    : alpha(theme.palette.warning.main, 0.08),
                                  color: c.completed ? 'success.main' : 'warning.main',
                                  fontWeight: 600,
                                  borderRadius: 1.5,
                                  border: c.completed
                                    ? `1px solid ${alpha(theme.palette.success.main, 0.15)}`
                                    : `1px solid ${alpha(theme.palette.warning.main, 0.15)}`,
                                }}
                              />
                            </Stack>
                          </Box>

                          <IconButton 
                            size="small" 
                            onClick={() => goToKanban(c.id)}
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.06),
                              width: 36,
                              height: 36,
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.12),
                                transform: 'translateX(2px)',
                              },
                            }}
                          >
                            <IconArrowRight size={18} color={theme.palette.primary.main} />
                          </IconButton>
                        </Stack>
                      </Paper>
                    );
                  })}
                </Stack>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default MyTasksPage;