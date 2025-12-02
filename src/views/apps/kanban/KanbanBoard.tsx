import { useMemo, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  useTheme,
  Paper,
} from '@mui/material';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useKanban } from './kanban.hooks';
import { BoardData } from './kanban.types';
import KanbanColumn from './KanbanColumn';

type KanbanBoardProps = {
  initialData?: BoardData;
  onRequestAddColumn?: (handler: () => void) => void;
};

const KanbanBoard = ({ initialData, onRequestAddColumn }: KanbanBoardProps) => {
  const theme = useTheme();
  const {
    board,
    addColumn,
    removeColumn,
    addCard,
    updateCard,
    removeCard,
    moveCard,
    moveColumn,
  } = useKanban(initialData);

  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [addColumnOpen, setAddColumnOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  // Expose add column handler to parent via callback
  useEffect(() => {
    if (onRequestAddColumn) {
      onRequestAddColumn(() => setAddColumnOpen(true));
    }
  }, [onRequestAddColumn]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const activeCard = useMemo(() => {
    if (!activeCardId) {
      return undefined;
    }
    return board.cards[activeCardId];
  }, [activeCardId, board.cards]);

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current as { type: string; cardId?: string; columnId?: string } | undefined;
    if (data?.type === 'card' && data.cardId) {
      setActiveCardId(data.cardId);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCardId(null);

    if (!over) {
      return;
    }

    const activeData = active.data.current as { type: string; columnId?: string; cardId?: string } | undefined;
    const overData = over.data?.current as { type?: string; columnId?: string } | undefined;

    // Handle column reordering
    if (activeData?.type === 'column' && overData?.type === 'column') {
      const activeColumnIndex = board.columns.findIndex((col) => col.id === activeData.columnId);
      const overColumnIndex = board.columns.findIndex((col) => col.id === overData.columnId);

      if (activeColumnIndex !== -1 && overColumnIndex !== -1 && activeColumnIndex !== overColumnIndex) {
        moveColumn(activeColumnIndex, overColumnIndex);
      }
      return;
    }

    // Handle card moving
    if (!activeData || activeData.type !== 'card') {
      return;
    }

    const sourceColumnId = activeData.columnId;
    let destinationColumnId = sourceColumnId;
    let destinationIndex = 0;

    if (overData?.type === 'card' && overData.columnId) {
      destinationColumnId = overData.columnId;
      const destinationColumn = board.columns.find((column) => column.id === destinationColumnId);
      const overIndex = destinationColumn?.cardIds.indexOf(over.id as string) ?? -1;
      destinationIndex = overIndex >= 0 ? overIndex : destinationColumn?.cardIds.length ?? 0;
    } else if (overData?.type === 'column' && overData.columnId) {
      destinationColumnId = overData.columnId;
      const destinationColumn = board.columns.find((column) => column.id === destinationColumnId);
      destinationIndex = destinationColumn?.cardIds.length ?? 0;
    } else {
      const fallbackColumn = board.columns.find((column) => column.cardIds.includes(over.id as string) || column.id === over.id);
      if (fallbackColumn) {
        destinationColumnId = fallbackColumn.id;
        destinationIndex = fallbackColumn.cardIds.length;
      }
    }

    const sourceColumn = board.columns.find((column) => column.id === sourceColumnId);
    if (!sourceColumn) {
      return;
    }

    const sourceIndex = sourceColumn.cardIds.indexOf(active.id as string);

    if (sourceIndex === -1) {
      return;
    }

    if (sourceColumnId && destinationColumnId) {
      moveCard({
        cardId: active.id as string,
        fromColumnId: sourceColumnId,
        toColumnId: destinationColumnId,
        toIndex: destinationIndex,
      });
    }
  };

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) {
      return;
    }
    addColumn(newColumnTitle);
    setNewColumnTitle('');
    setAddColumnOpen(false);
  };

  return (
    <Box sx={{ 
      height: '100%',
      width: '100%',
      bgcolor: '#FAFAFA',
      overflowX: 'auto',
      overflowY: 'auto',
      '&::-webkit-scrollbar': {
        height: 8,
        width: 8,
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
        borderRadius: 4,
        '&:hover': {
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
        },
      },
      '&::-webkit-scrollbar-corner': {
        backgroundColor: 'transparent',
      },
    }}>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <SortableContext items={board.columns.map((col) => col.id)} strategy={horizontalListSortingStrategy}>
          <Box sx={{
            display: 'flex',
            gap: { xs: 1.5, sm: 2 },
            p: { xs: 1.5, sm: 2 },
            minWidth: 'min-content',
            minHeight: 'min-content',
            alignItems: 'flex-start',
          }}>
            {board.columns.map((column) => {
              const allColumnCards = column.cardIds
                .map((id) => board.cards[id])
                .filter((card): card is NonNullable<typeof card> => Boolean(card));
              
              const activeCards = allColumnCards.filter((card) => !card.completed);
              const completedCards = allColumnCards.filter((card) => card.completed);

              return (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  cards={activeCards}
                  completedCards={completedCards}
                  onAddCard={addCard}
                  onUpdateCard={updateCard}
                  onRemoveCard={removeCard}
                  onRemoveColumn={removeColumn}
                />
              );
            })}
          </Box>
        </SortableContext>
        <DragOverlay>
            {activeCard ? (
              <Paper
                sx={{
                  width: 300,
                  p: 2,
                  borderRadius: 2,
                  boxShadow: theme.shadows[8],
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  {activeCard.title}
                </Typography>
                {activeCard.description && (
                  <Typography variant="body2" color="text.secondary">
                    {activeCard.description}
                  </Typography>
                )}
              </Paper>
            ) : null}
        </DragOverlay>
      </DndContext>

      <Dialog open={addColumnOpen} onClose={() => setAddColumnOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add Column</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Column title"
            value={newColumnTitle}
            onChange={(event) => setNewColumnTitle(event.target.value)}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddColumnOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddColumn} disabled={!newColumnTitle.trim()}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default KanbanBoard;
