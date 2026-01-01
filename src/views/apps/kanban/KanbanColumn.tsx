import { useState } from 'react';
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
} from '@mui/material';
import { IconDotsVertical, IconPlus, IconTrash, IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, Column } from './kanban.types';
import KanbanCard from './KanbanCard';

type KanbanColumnProps = {
  column: Column;
  cards: Card[];
  completedCards?: Card[];
  onAddCard: (columnId: string, card: Omit<Card, 'id'>) => void;
  onUpdateCard: (cardId: string, updates: Partial<Card>) => void;
  onRemoveCard: (cardId: string) => void;
  onRemoveColumn: (columnId: string) => void;
};

const KanbanColumn = ({ column, cards, completedCards = [], onAddCard, onUpdateCard, onRemoveCard, onRemoveColumn }: KanbanColumnProps) => {
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [completedExpanded, setCompletedExpanded] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    dueDate: '',
    labels: '',
  });

  const handleSubmit = () => {
    if (!form.title.trim()) {
      return;
    }

    console.log('Adding card to column', column.id, form);
    
    onAddCard(column.id, {
      title: form.title,
      description: form.description.trim() ? form.description : undefined,
      image: form.image.trim() ? form.image : undefined,
      dueDate: form.dueDate || undefined,
      labels: form.labels
        .split(',')
        .map((label) => label.trim())
        .filter((label) => label.length > 0),
    });

    setForm({ title: '', description: '', image: '', dueDate: '', labels: '' });
    setAddOpen(false);
  };

  const handleUncompleteCard = (cardId: string) => {
    onUpdateCard(cardId, { completed: false });
  };

  // Warna background sesuai kolom dari Figma
  const getColumnColor = () => {
    const title = column.title.toLowerCase();
    if (title.includes('todo')) return '#E8EAF6';
    if (title.includes('progress')) return '#E3F2FD';
    if (title.includes('pending')) return '#EDE7F6';
    if (title.includes('done')) return '#E0F2F1';
    return theme.palette.background.paper;
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        minWidth: { xs: 260, sm: 300, md: 320 },
        width: { xs: 260, sm: 300, md: 320 },
        backgroundColor: getColumnColor(),
        borderRadius: { xs: 2, sm: 3 },
        p: { xs: 1.5, sm: 2 },
        border: 'none',
        transition: 'all 0.2s ease',
        boxShadow: isDragging ? '0px 8px 24px rgba(0, 0, 0, 0.15)' : 'none',
        flexShrink: 0,
        height: 'fit-content',
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
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
          ref={setNodeRef}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            minHeight: 100,
            flex: 1,
            overflowY: 'auto',
            pr: 0.5,
            '&::-webkit-scrollbar': {
              width: 5,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
              borderRadius: 3,
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
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
        <Box sx={{ mt: 2 }}>
          <Box 
            onClick={() => setCompletedExpanded(!completedExpanded)}
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              py: 1,
              px: 1,
              cursor: 'pointer',
              borderRadius: 1,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.03)',
              },
              transition: 'background-color 0.2s',
            }}
          >
            <IconButton size="small" sx={{ p: 0.5, mr: 0.5 }}>
              {completedExpanded ? <IconChevronDown size={18} /> : <IconChevronRight size={18} />}
            </IconButton>
            <Typography 
              variant="body2" 
              fontWeight={500}
              color="text.secondary"
              sx={{ fontSize: '0.875rem' }}
            >
              Selesai ({completedCards.length})
            </Typography>
          </Box>

          <Collapse in={completedExpanded}>
            <Box sx={{ mt: 1 }}>
              {completedCards.map((card) => (
                <Box
                  key={card.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    py: 1,
                    px: 1,
                    mb: 0.5,
                    borderRadius: 1,
                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
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
                      mr: 1,
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
                        fontSize: '0.875rem',
                        wordBreak: 'break-word',
                      }}
                    >
                      {card.title}
                    </Typography>
                    {card.dueDate && (
                      <Typography 
                        variant="caption" 
                        color="text.disabled"
                        sx={{ fontSize: '0.75rem' }}
                      >
                        {new Date(card.dueDate).toLocaleDateString('id-ID', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Collapse>
        </Box>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
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
              label="Image URL"
              value={form.image}
              onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))}
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
