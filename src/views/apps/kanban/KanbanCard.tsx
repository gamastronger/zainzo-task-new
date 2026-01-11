import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { IconCalendar, IconDotsVertical, IconTrash } from '@tabler/icons-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from './kanban.types';
import confetti from 'canvas-confetti';

// Subtle radial confetti ring originating from the checkbox center
const fireRingConfetti = (x: number, y: number) => {
  const cx = x / window.innerWidth;
  const cy = y / window.innerHeight;
  const segments = 10; // 8–12 total particles
  // const colors = ['#66BB6A', '#4CAF50']; // muted success tones

  for (let i = 0; i < segments; i++) {
    const angleDeg = (360 / segments) * i; // evenly distributed 360°
confetti({
  particleCount: 3,        
  angle: angleDeg,
  spread: 6,               
  startVelocity: 14,      
  gravity: 0.9,
  scalar: 0.55,            
  ticks: 32,               
  origin: { x: cx, y: cy },
  colors: ['#ebffa9', '#ff8686', '#a692ff'], 
});

  }
};


const getLabelColor = (label: string): string => {
  const normalized = label.trim().toLowerCase();
  // Mapping untuk warna dari Figma
  if (normalized.includes('design')) return '#00D4AA';
  if (normalized.includes('development')) return '#FFA726';
  if (normalized.includes('mobile')) return '#42A5F5';
  
  // Default hijau untuk label lainnya
  return '#198754';
};

type KanbanCardProps = {
  card: Card;
  columnId: string;
  onUpdate: (cardId: string, updates: Partial<Card>) => void;
  onDelete: (cardId: string) => void;
};

const KanbanCard = ({ card, columnId, onUpdate, onDelete }: KanbanCardProps) => {
  const theme = useTheme();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: {
      type: 'card',
      cardId: card.id,
      columnId,
    },
    disabled: card.completed, // Disable dragging for completed tasks
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editOpen, setEditOpen] = useState(false);
  const getDueDateString = (due?: string | null) => {
    if (!due) {
      return '';
    }
    const d = new Date(due);
    if (Number.isNaN(d.getTime())) {
      return '';
    }
    // Use UTC methods to avoid timezone conversion
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [form, setForm] = useState(() => {
    return {
      title: card.title,
      description: card.description ?? '',
      image: card.image ?? '',
      dueDate: getDueDateString(card.dueDate),
      labels: (card.labels ?? []).join(', '),
    };
  });

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const isChecked = event.target.checked;

    // Trigger ONLY when transitioning from unchecked → checked
    if (!card.completed && isChecked) {
      const rect = event.target.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      fireRingConfetti(x, y);
    }

    onUpdate(card.id, { completed: isChecked });
  };



  const CircleIcon = () => (
  <Box
    sx={{
      width: 16,
      height: 16,
      borderRadius: '50%',
      border: '2px solid',
      borderColor: 'grey.400',
    }}
  />
);

const CircleCheckedIcon = () => (
  <Box
    sx={{
      width: 16,
      height: 16,
      borderRadius: '50%',
      bgcolor: '#4CAF50',
      color: 'white',
      fontSize: '0.65rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'checkPop 180ms ease-out',
      '@keyframes checkPop': {
        '0%': { transform: 'scale(0.7)', opacity: 0 },
        '100%': { transform: 'scale(1)', opacity: 1 },
      },
    }}
  >
    ✓
  </Box>
);



  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.6 : 1,
      cursor: card.completed ? 'default' : (isDragging ? 'grabbing' : 'grab'),
    }),
    [transform, transition, isDragging, card.completed],
  );

  const formattedDate = useMemo(() => {
    if (!card.dueDate) {
      return '';
    }
    const date = new Date(card.dueDate);
    if (Number.isNaN(date.getTime())) {
      return card.dueDate;
    }
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }, [card.dueDate]);

  const labels = useMemo(() => card.labels ?? [], [card.labels]);

  return (
    <>
      <Paper
        ref={setNodeRef}
        elevation={0}
        style={style}
        {...attributes}
        {...(!card.completed ? listeners : {})}
        sx={{
          p: { xs: 1, sm: 1.25 },
          borderRadius: 1,
          backgroundColor: 'white',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
          transition: 'border-color 0.2s ease, background-color 0.2s ease, opacity 0.2s ease',
          position: 'relative',
          opacity: card.completed ? 0.7 : 1,
          '&:hover': {
            borderColor: card.completed ? 'divider' : 'primary.light',
            backgroundColor: card.completed ? 'white' : 'action.hover',
          },
        }}
        data-card-id={card.id}
      >
        {card.image && (
          <Box
            component="img"
            src={card.image}
            alt={card.title}
            sx={{
              width: '100%',
                height: { xs: 120, sm: 140 },
                borderRadius: { xs: 0.5, sm: 1 },
              objectFit: 'cover',
              mb: { xs: 1, sm: 1.5 },
            }}
          />
        )}
        <Stack direction="row" alignItems="flex-start" spacing={1}>
          <Checkbox
  checked={card.completed}
  onChange={handleCheckboxChange}
  onClick={(e) => e.stopPropagation()}
  size="small"
  icon={<CircleIcon />}
  checkedIcon={<CircleCheckedIcon />}
  sx={{
  p: 0,
  mt: 0.2,
  borderRadius: '50%',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  '&:hover': {
    transform: 'scale(1.04)',
    boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.12)',
  },
  '&:active': {
    transform: 'scale(0.96)',
  },
}}

/>


          <Box sx={{ flex: 1 }}>
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
              <Typography 
                variant="body2" 
                fontWeight={500} 
                sx={{ 
                  flex: 1, 
                  lineHeight: 1.5,
                  fontSize: '0.9rem',
                  textDecoration: card.completed ? 'line-through' : 'none',
                  color: card.completed ? 'text.secondary' : 'text.primary',
                  transition: 'color 0.25s ease, text-decoration-color 0.25s ease, opacity 0.2s ease',
                  opacity: card.completed ? 0.7 : 1,
                }}
              >
                {card.title}
              </Typography>
              <IconButton
                size="small"
                aria-label="Card actions"
                onClick={(event) => {
                  event.stopPropagation();
                  setAnchorEl(event.currentTarget);
                }}
                sx={{ mt: -0.5, mr: -0.5 }}
              >
                <IconDotsVertical size={16} />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
        {card.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ 
              mt: 0.5, 
              mb: 1, 
              ml: 4,
              display: '-webkit-box', 
              WebkitLineClamp: 2, 
              WebkitBoxOrient: 'vertical', 
              overflow: 'hidden',
              fontSize: '0.8rem',
              lineHeight: 1.4,
              textDecoration: card.completed ? 'line-through' : 'none',
            }}
          >
            {card.description}
          </Typography>
        )}
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={0.5} sx={{ ml: 4, mt: 0.5 }}>
          {formattedDate && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <IconCalendar size={12} color={theme.palette.text.secondary} />
              <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                {formattedDate}
              </Typography>
            </Stack>
          )}
          {labels.length > 0 && (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" justifyContent="flex-end">
              {labels.map((label) => (
                <Chip
                  key={label}
                  size="small"
                  label={label}
                  sx={{
                    backgroundColor: getLabelColor(label),
                    color: 'white',
                    fontWeight: 500,
                    height: 18,
                    fontSize: '0.7rem',
                    borderRadius: '2px',
                    '& .MuiChip-label': {
                      px: 1,
                      py: 0,
                    },
                  }}
                />
              ))}
            </Stack>
          )}
        </Stack>
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setForm({
              title: card.title,
              description: card.description ?? '',
              image: card.image ?? '',
                dueDate: getDueDateString(card.dueDate),
              labels: (card.labels ?? []).join(', '),
            });
            setEditOpen(true);
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            if (window.confirm('Delete this card?')) {
              onDelete(card.id);
            }
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <IconTrash size={16} />
            <span>Delete</span>
          </Stack>
        </MenuItem>
      </Menu>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Card</DialogTitle>
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
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              const buildDueIso = (dateStr: string) => {
                if (!dateStr) return '';
                const [y, m, d] = dateStr.split('-').map((v) => parseInt(v, 10));
                if (!y || !m || !d) return '';
                
                // Use Date.UTC to avoid timezone conversion issues
                const utcTimestamp = Date.UTC(y, m - 1, d, 0, 0, 0, 0);
                const dt = new Date(utcTimestamp);
                return dt.toISOString();
              };

              const dueIso = form.dueDate ? buildDueIso(form.dueDate) : '';

              onUpdate(card.id, {
                title: form.title,
                description: form.description.trim() ? form.description : undefined,
                image: form.image.trim() ? form.image : undefined,
                dueDate: dueIso, // '' artinya clear, ISO jika di-set
                labels: form.labels
                  .split(',')
                  .map((label) => label.trim())
                  .filter((label) => label.length > 0),
              });
              setEditOpen(false);
            }}
            disabled={!form.title.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default KanbanCard;
