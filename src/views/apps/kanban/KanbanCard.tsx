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
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [form, setForm] = useState(() => ({
    title: card.title,
    description: card.description ?? '',
    image: card.image ?? '',
    dueDate: card.dueDate ?? '',
    labels: (card.labels ?? []).join(', '),
  }));

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const isChecked = event.target.checked;
    
    if (isChecked) {
      // Start checking animation
      setIsChecking(true);
      
      // Trigger celebration animation after check animation
      setTimeout(() => {
        setCelebrating(true);
        setIsChecking(false);
      }, 200);
      
      // Update card as completed after celebration
      setTimeout(() => {
        onUpdate(card.id, { completed: true });
        setCelebrating(false);
      }, 1000);
    } else {
      // Smooth unchecking
      setIsChecking(true);
      setTimeout(() => {
        onUpdate(card.id, { completed: false });
        setIsChecking(false);
      }, 200);
    }
  };

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.6 : 1,
      cursor: isDragging ? 'grabbing' : 'grab',
    }),
    [transform, transition, isDragging],
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
        elevation={isDragging ? 8 : 0}
        style={style}
        {...attributes}
        {...listeners}
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderRadius: { xs: 1.5, sm: 2 },
          backgroundColor: 'white',
          border: 'none',
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          opacity: card.completed ? 0.7 : 1,
          transform: isChecking ? 'scale(0.98)' : 'scale(1)',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)',
            transform: isChecking ? 'scale(0.98) translateY(-2px)' : 'translateY(-2px)',
          },
        }}
      >
        {/* Celebration overlay with confetti particles */}
        {celebrating && (
          <>
            {/* Ripple effect */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 0,
                height: 0,
                borderRadius: '50%',
                bgcolor: 'rgba(76, 175, 80, 0.3)',
                zIndex: 10,
                animation: 'ripple 0.8s ease-out',
                '@keyframes ripple': {
                  '0%': { 
                    width: '0px',
                    height: '0px',
                    opacity: 1,
                    transform: 'translate(-50%, -50%)',
                  },
                  '100%': { 
                    width: '300px',
                    height: '300px',
                    opacity: 0,
                    transform: 'translate(-50%, -50%)',
                  },
                },
              }}
            />
            
            {/* Confetti particles */}
            {[...Array(12)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  bgcolor: ['#4CAF50', '#66BB6A', '#81C784', '#FFA726', '#42A5F5', '#7E57C2'][i % 6],
                  zIndex: 11,
                  animation: `confetti-${i} 0.8s ease-out forwards`,
                  '@keyframes confetti-0': {
                    '0%': { transform: 'translate(-50%, -50%) translate(0, 0) scale(0)', opacity: 1 },
                    '100%': { transform: `translate(-50%, -50%) translate(${Math.cos(0) * 60}px, ${Math.sin(0) * 60}px) scale(0)`, opacity: 0 },
                  },
                  '@keyframes confetti-1': {
                    '0%': { transform: 'translate(-50%, -50%) translate(0, 0) scale(0)', opacity: 1 },
                    '100%': { transform: `translate(-50%, -50%) translate(${Math.cos(Math.PI / 6) * 70}px, ${Math.sin(Math.PI / 6) * 70}px) scale(0)`, opacity: 0 },
                  },
                  '@keyframes confetti-2': {
                    '0%': { transform: 'translate(-50%, -50%) translate(0, 0) scale(0)', opacity: 1 },
                    '100%': { transform: `translate(-50%, -50%) translate(${Math.cos(Math.PI / 3) * 65}px, ${Math.sin(Math.PI / 3) * 65}px) scale(0)`, opacity: 0 },
                  },
                  '@keyframes confetti-3': {
                    '0%': { transform: 'translate(-50%, -50%) translate(0, 0) scale(0)', opacity: 1 },
                    '100%': { transform: `translate(-50%, -50%) translate(${Math.cos(Math.PI / 2) * 75}px, ${Math.sin(Math.PI / 2) * 75}px) scale(0)`, opacity: 0 },
                  },
                  '@keyframes confetti-4': {
                    '0%': { transform: 'translate(-50%, -50%) translate(0, 0) scale(0)', opacity: 1 },
                    '100%': { transform: `translate(-50%, -50%) translate(${Math.cos(2 * Math.PI / 3) * 70}px, ${Math.sin(2 * Math.PI / 3) * 70}px) scale(0)`, opacity: 0 },
                  },
                  '@keyframes confetti-5': {
                    '0%': { transform: 'translate(-50%, -50%) translate(0, 0) scale(0)', opacity: 1 },
                    '100%': { transform: `translate(-50%, -50%) translate(${Math.cos(5 * Math.PI / 6) * 65}px, ${Math.sin(5 * Math.PI / 6) * 65}px) scale(0)`, opacity: 0 },
                  },
                  '@keyframes confetti-6': {
                    '0%': { transform: 'translate(-50%, -50%) translate(0, 0) scale(0)', opacity: 1 },
                    '100%': { transform: `translate(-50%, -50%) translate(${Math.cos(Math.PI) * 60}px, ${Math.sin(Math.PI) * 60}px) scale(0)`, opacity: 0 },
                  },
                  '@keyframes confetti-7': {
                    '0%': { transform: 'translate(-50%, -50%) translate(0, 0) scale(0)', opacity: 1 },
                    '100%': { transform: `translate(-50%, -50%) translate(${Math.cos(7 * Math.PI / 6) * 70}px, ${Math.sin(7 * Math.PI / 6) * 70}px) scale(0)`, opacity: 0 },
                  },
                  '@keyframes confetti-8': {
                    '0%': { transform: 'translate(-50%, -50%) translate(0, 0) scale(0)', opacity: 1 },
                    '100%': { transform: `translate(-50%, -50%) translate(${Math.cos(4 * Math.PI / 3) * 65}px, ${Math.sin(4 * Math.PI / 3) * 65}px) scale(0)`, opacity: 0 },
                  },
                  '@keyframes confetti-9': {
                    '0%': { transform: 'translate(-50%, -50%) translate(0, 0) scale(0)', opacity: 1 },
                    '100%': { transform: `translate(-50%, -50%) translate(${Math.cos(3 * Math.PI / 2) * 75}px, ${Math.sin(3 * Math.PI / 2) * 75}px) scale(0)`, opacity: 0 },
                  },
                  '@keyframes confetti-10': {
                    '0%': { transform: 'translate(-50%, -50%) translate(0, 0) scale(0)', opacity: 1 },
                    '100%': { transform: `translate(-50%, -50%) translate(${Math.cos(5 * Math.PI / 3) * 70}px, ${Math.sin(5 * Math.PI / 3) * 70}px) scale(0)`, opacity: 0 },
                  },
                  '@keyframes confetti-11': {
                    '0%': { transform: 'translate(-50%, -50%) translate(0, 0) scale(0)', opacity: 1 },
                    '100%': { transform: `translate(-50%, -50%) translate(${Math.cos(11 * Math.PI / 6) * 65}px, ${Math.sin(11 * Math.PI / 6) * 65}px) scale(0)`, opacity: 0 },
                  },
                }}
              />
            ))}
            
            {/* Success check icon */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 12,
                animation: 'checkPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                '@keyframes checkPop': {
                  '0%': { transform: 'translate(-50%, -50%) scale(0) rotate(-45deg)', opacity: 0 },
                  '50%': { transform: 'translate(-50%, -50%) scale(1.3) rotate(0deg)', opacity: 1 },
                  '100%': { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 1 },
                },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: '#4CAF50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(76, 175, 80, 0.4)',
                }}
              >
                <Box
                  component="svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Box>
              </Box>
            </Box>
          </>
        )}
        
        {card.image && (
          <Box
            component="img"
            src={card.image}
            alt={card.title}
            sx={{
              width: '100%',
              height: { xs: 120, sm: 140 },
              borderRadius: { xs: 1, sm: 1.5 },
              objectFit: 'cover',
              mb: { xs: 1, sm: 1.5 },
            }}
          />
        )}
        <Stack direction="row" alignItems="flex-start" spacing={1}>
          <Checkbox
            checked={card.completed || false}
            onChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
            size="small"
            icon={
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: isChecking ? '#4CAF50' : 'grey.400',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isChecking ? 'scale(0.9)' : 'scale(1)',
                }}
              />
            }
            checkedIcon={
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: '#4CAF50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isChecking ? 'scale(1.1)' : 'scale(1)',
                  animation: !isChecking && card.completed ? 'checkBounce 0.4s ease-out' : 'none',
                  '@keyframes checkBounce': {
                    '0%': { transform: 'scale(0)' },
                    '50%': { transform: 'scale(1.2)' },
                    '100%': { transform: 'scale(1)' },
                  },
                }}
              >
                ✓
              </Box>
            }
            sx={{
              p: 0,
              mt: 0.2,
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
              <Typography 
                variant="subtitle2" 
                fontWeight={600} 
                sx={{ 
                  flex: 1, 
                  lineHeight: 1.4,
                  textDecoration: card.completed ? 'line-through' : 'none',
                  color: card.completed ? 'text.secondary' : 'text.primary',
                  transition: 'all 0.3s ease',
                  opacity: isChecking ? 0.6 : 1,
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
              mt: 1, 
              mb: 1.5, 
              ml: 4,
              display: '-webkit-box', 
              WebkitLineClamp: 2, 
              WebkitBoxOrient: 'vertical', 
              overflow: 'hidden',
              fontSize: '0.85rem',
              lineHeight: 1.5,
              textDecoration: card.completed ? 'line-through' : 'none',
            }}
          >
            {card.description}
          </Typography>
        )}
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1} sx={{ ml: 4 }}>
          {formattedDate && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <IconCalendar size={14} color={theme.palette.text.secondary} />
              <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
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
                    height: 22,
                    fontSize: '0.75rem',
                    borderRadius: '4px',
                    '& .MuiChip-label': {
                      px: 1.5,
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
              dueDate: card.dueDate ?? '',
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
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              onUpdate(card.id, {
                title: form.title,
                description: form.description.trim() ? form.description : undefined,
                image: form.image.trim() ? form.image : undefined,
                dueDate: form.dueDate || undefined,
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
