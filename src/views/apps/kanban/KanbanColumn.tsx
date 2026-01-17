import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useTheme,
  Collapse,
  // Divider,
  Checkbox,
  Popover,
} from '@mui/material';
import { IconDotsVertical, IconPlus, IconTrash, IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, Column } from './kanban.types';
import KanbanCard from './KanbanCard';
import PaintbrushIcon from 'src/assets/images/svgs/paintbrush.svg';


type KanbanColumnProps = {
  column: Column;
  cards: Card[];
  completedCards?: Card[];
  columnColor?: string;
  onAddCard: (columnId: string, card: Omit<Card, 'id'>) => Promise<void>;
  onUpdateCard: (cardId: string, updates: Partial<Card>) => void;
  onRemoveCard: (cardId: string) => void;
  onRemoveColumn: (columnId: string) => void;
  onSetColumnColor?: (columnId: string, color: string) => void;
};

const KanbanColumn = ({ column, cards, completedCards = [], columnColor, onAddCard, onUpdateCard, onRemoveCard, onRemoveColumn, onSetColumnColor }: KanbanColumnProps) => {
  const theme = useTheme();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: 'column', columnId: column.id },
  });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: `droppable-${column.id}`,
    data: { type: 'column', columnId: column.id },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [completedExpanded, setCompletedExpanded] = useState(false);
  const [colorAnchorEl, setColorAnchorEl] = useState<HTMLElement | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    labels: '',
  });

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      return;
    }

    console.log('handleSubmit called with:', { columnId: column.id, form });
    
    try {
      const buildDueIso = (dateStr: string) => {
        if (!dateStr) return undefined;
        const [y, m, d] = dateStr.split('-').map((v) => parseInt(v, 10));
        if (!y || !m || !d) return undefined;
        
        // Use Date.UTC to avoid timezone conversion issues
        // This creates a UTC timestamp at midnight UTC for the specified date
        const utcTimestamp = Date.UTC(y, m - 1, d, 0, 0, 0, 0);
        const dt = new Date(utcTimestamp);
        return dt.toISOString();
      };

      const dueIso = buildDueIso(form.dueDate);

      await onAddCard(column.id, {
        title: form.title,
        description: form.description.trim() ? form.description : undefined,
        dueDate: dueIso,
        labels: form.labels
          .split(',')
          .map((label) => label.trim())
          .filter((label) => label.length > 0),
        completed: false,
      });

      setForm({ title: '', description: '', dueDate: '', labels: '' });
      setAddOpen(false);
      console.log('✅ Form submitted successfully');
    } catch (error) {
      console.error('❌ Error in handleSubmit:', error);
      // Dialog tetap terbuka jika ada error
    }
  };

  const handleUncompleteCard = (cardId: string) => {
    onUpdateCard(cardId, { completed: false });
  };

  // Default colors by name (fallback) — light pastel
  const getDefaultColumnColor = () => {
    const title = column.title.toLowerCase();
    if (title.includes('todo')) return '#F2E7FE';
    if (title.includes('progress')) return '#D8E5FF';
    if (title.includes('pending')) return '#FFF8D8';
    if (title.includes('done')) return '#DAFFEA';
    return '#ffffff';
  };

  const bgColor = useMemo(() => columnColor || getDefaultColumnColor(), [columnColor, column.title]);

  const pastelPalette = [
    '#F2E7FE', // soft purple 
    '#E3F2FD', // soft blue
    '#E8F5E9', // soft green
    '#FFF8E1', // soft yellow
    '#FCE4EC', // soft pink
    '#E0F7FA', // soft cyan
    '#F3E5F5', // soft violet
    '#FFF3E0', // soft orange
    '#EDE7F6', // soft indigo
    '#ECEFF1', // soft gray
  ];

  const handleOpenColor = (anchor: HTMLElement) => setColorAnchorEl(anchor);
  const handleCloseColor = () => setColorAnchorEl(null);
  const handleSelectColor = (color: string) => {
    onSetColumnColor?.(column.id, color);
    handleCloseColor();
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        // For deep-link focus from Inbox
        '&': { },
        minWidth: { xs: 260, sm: 300, md: 320 },
        width: { xs: 260, sm: 300, md: 320 },
        backgroundColor: bgColor,
        borderRadius: { xs: 2, sm: 2 },
        p: { xs: 1.5, sm: 2 },
        border: 'none',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 6px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)',
        flexShrink: 0,
        height: 'fit-content',
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      data-column-id={column.id}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: { xs: 1.5, sm: 2 } }}>
        <Box
          {...attributes}
          {...listeners}
          sx={{
            cursor: isDragging ? 'grabbing' : 'grab',
            display: 'flex',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ fontSize: { xs: '14px', sm: '16px' } }}>
            {column.title}
          </Typography>
        </Box>
        <Stack direction="row" spacing={0.5}>
          <IconButton
            size="small"
            aria-label="Add card"
            onClick={() => setAddOpen(true)}
            sx={{ 
              color: 'text.primary',
              '&:hover': { 
                backgroundColor: 'rgba(0, 0, 0, 0.04)' 
              } 
            }}
          >
            <IconPlus size={20} />
          </IconButton>
          <IconButton
            size="small"
            aria-label="Column actions"
            onClick={(event) => setAnchorEl(event.currentTarget)}
          >
            <IconDotsVertical size={20} />
          </IconButton>
        </Stack>
      </Stack>

      <SortableContext items={cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
        <Box
          ref={setDroppableRef}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            minHeight: 100,
            maxHeight: 'calc(100vh - 280px)',
            overflowY: 'auto',
            pr: 0.5,
            '&::-webkit-scrollbar': {
              width: 6,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              borderRadius: 3,
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              },
            },
          }}
        >
          {cards.length === 0 && completedCards.length > 0 ? (
            // Show "All tasks completed" message when no active cards
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
                px: 2,
                textAlign: 'center',
              }}
            >
              {/* Animated Check Circle Icon */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
                  animation: 'scaleIn 0.5s ease-out',
                  '@keyframes scaleIn': {
                    from: {
                      transform: 'scale(0)',
                      opacity: 0,
                    },
                    to: {
                      transform: 'scale(1)',
                      opacity: 1,
                    },
                  },
                }}
              >
                <Box
                  component="svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  sx={{
                    animation: 'checkDraw 0.5s ease-out 0.3s both',
                    '@keyframes checkDraw': {
                      from: {
                        strokeDashoffset: 50,
                      },
                      to: {
                        strokeDashoffset: 0,
                      },
                    },
                  }}
                >
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="50"
                    strokeDashoffset="0"
                  />
                </Box>
              </Box>
              <Typography
                variant="h6"
                fontWeight={600}
                color="text.primary"
                sx={{ mb: 0.5 }}
              >
                Semua tugas selesai
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Bagus
              </Typography>
            </Box>
          ) : (
            cards.map((card) => (
              <KanbanCard
                key={card.id}
                card={card}
                columnId={column.id}
                onUpdate={onUpdateCard}
                onDelete={onRemoveCard}
              />
            ))
          )}
        </Box>
      </SortableContext>

      {/* Completed Tasks Section */}
      {completedCards.length > 0 && (
        <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box 
            onClick={() => setCompletedExpanded(!completedExpanded)}
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              py: 0.5,
              px: 0.5,
              cursor: 'pointer',
              borderRadius: 0.5,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.02)',
              },
              transition: 'background-color 0.2s',
            }}
          >
            <IconButton size="small" sx={{ p: 0.25, mr: 0.5 }}>
              {completedExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
            </IconButton>
            <Typography 
              variant="body2" 
              fontWeight={500}
              color="text.secondary"
              sx={{ fontSize: '0.8rem' }}
            >
              Selesai ({completedCards.length})
            </Typography>
          </Box>

          <Collapse in={completedExpanded}>
            <Box
              sx={{
                mt: 0.5,
                maxHeight: 220,
                overflowY: 'auto',
                pr: 0.5,
                '&::-webkit-scrollbar': {
                  width: 5,
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.15)'
                      : 'rgba(0,0,0,0.15)',
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.25)'
                        : 'rgba(0,0,0,0.25)',
                  },
                },
              }}
            >
              {completedCards.map((card) => (
                <Box
                  key={card.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    py: 0.75,
                    px: 0.75,
                    mb: 0.5,
                    borderRadius: 0.5,
                    bgcolor: 'rgba(255, 255, 255, 0.5)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                    },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <Checkbox
                    checked={true}
                    onChange={() => handleUncompleteCard(card.id)}
                    size="small"
                    sx={{
                      p: 0,
                      mr: 0.75,
                      color: 'success.main',
                      '&.Mui-checked': {
                        color: 'success.main',
                      },
                    }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="body2"
                      sx={{
                        textDecoration: 'line-through',
                        color: 'text.secondary',
                        fontSize: '0.8rem',
                        fontWeight: 400,
                        wordBreak: 'break-word',
                      }}
                    >
                      {card.title}
                    </Typography>
                    {card.dueDate && (
                      <Typography 
                        variant="caption" 
                        color="text.disabled"
                        sx={{ fontSize: '0.7rem' }}
                      >
                        {new Date(card.dueDate).toLocaleDateString('id-ID', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </Typography>
                    )}
                  </Box>
                  <IconButton
                    size="small"
                    aria-label="Delete task"
                    onClick={() => onRemoveCard(card.id)}
                    sx={{
                      ml: 0.75,
                      color: 'text.secondary',
                      '&:hover': { color: 'error.main', bgcolor: 'transparent' },
                    }}
                  >
                    <IconTrash size={16} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Collapse>
        </Box>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem
          onClick={(e) => {
            setAnchorEl(null);
            handleOpenColor(e.currentTarget as HTMLElement);
          }}
        >
          <Stack direction="row" spacing={1.2} alignItems="center">
            <img
              src={PaintbrushIcon}
              alt="Set Color"
              width={18}
              height={18}
              style={{ display: 'block' }}
            />
            <span>Set Color</span>
          </Stack>
        </MenuItem>


        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            if (window.confirm(`Delete column "${column.title}" and its cards?`)) {
              onRemoveColumn(column.id);
            }
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <IconTrash size={16} />
            <span>Delete Column</span>
          </Stack>
        </MenuItem>
      </Menu>

      <Popover
        open={Boolean(colorAnchorEl)}
        anchorEl={colorAnchorEl}
        onClose={handleCloseColor}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { p: 1, borderRadius: 1 } }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 28px)', gap: 1 }}>
          {pastelPalette.map((c) => (
            <Box
              key={c}
              onClick={() => handleSelectColor(c)}
                sx={{
                width: 28,
                height: 28,
                borderRadius: 0.5,
                bgcolor: c,
                border: '1px solid rgba(0,0,0,0.1)',
                cursor: 'pointer',
                ':hover': { boxShadow: '0 0 0 2px rgba(0,0,0,0.08) inset' },
              }}
            />
          ))}
        </Box>
      </Popover>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Card</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              required
              autoFocus
            />
            <TextField
              label="Description"
              multiline
              minRows={3}
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            />
            <TextField
              label="Due Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={form.dueDate}
              onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))}
            />
            <TextField
              label="Labels (comma separated)"
              value={form.labels}
              onChange={(event) => setForm((prev) => ({ ...prev, labels: event.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={!form.title.trim()}>
            Add Card
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default KanbanColumn;
