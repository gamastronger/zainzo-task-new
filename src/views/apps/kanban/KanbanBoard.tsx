// src/views/apps/kanban/KanbanBoard.tsx

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, CircularProgress } from '@mui/material';
import { useKanban } from './kanban.hooks';
import KanbanColumn from './KanbanColumn';
import { useEffect, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';
import { Card } from './kanban.types';

type KanbanBoardProps = {
  onRequestAddColumn?: (handler: () => void) => void;
};

export default function KanbanBoard({ onRequestAddColumn }: KanbanBoardProps) {
  const { board, isSyncing, isLoading, columnColors, setColumnColor, addCard, updateCard, removeCard, addColumn, removeColumn, moveCard, reorderColumns, reorderCards } = useKanban();
  const [addOpen, setAddOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (onRequestAddColumn) {
      onRequestAddColumn(() => setAddOpen(true));
    }
  }, [onRequestAddColumn]);

  const handleAddColumn = async () => {
    if (!newListTitle.trim()) return;
    await addColumn(newListTitle.trim());
    setNewListTitle('');
    setAddOpen(false);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;

    if (activeData?.type === 'card') {
      const card = board.cards[activeData.cardId];
      if (card && !card.completed) {
        setActiveCard(card);
        console.log('🟢 Drag started:', activeData.cardId);
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Just log for debugging, don't move yet
    if (activeData?.type === 'card' && overData?.type === 'column') {
      const activeCardId = activeData.cardId;
      const overColumnId = overData.columnId;

      const card = board.cards[activeCardId];
      if (card && !card.completed && activeData.columnId !== overColumnId) {
        console.log('📍 Dragging over column:', overColumnId);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Reset state
    setActiveCard(null);

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle column reordering
    if (activeData?.type === 'column' && overData?.type === 'column') {
      const activeColumnId = activeData.columnId;
      const overColumnId = overData.columnId;

      if (activeColumnId !== overColumnId) {
        const oldIndex = board.columns.findIndex((col) => col.id === activeColumnId);
        const newIndex = board.columns.findIndex((col) => col.id === overColumnId);
        reorderColumns(oldIndex, newIndex);
      }
      return;
    }

    // Handle card operations
    if (activeData?.type === 'card') {
      const activeCardId = activeData.cardId;
      const activeCard = board.cards[activeCardId];
      
      if (!activeCard || activeCard.completed) return;

      const activeColumnId = activeData.columnId;

      // Case 1: Dropped on empty area of another column (move to different list)
      if (overData?.type === 'column') {
        const overColumnId = overData.columnId;
        
        if (activeColumnId !== overColumnId) {
          console.log('🔵 Moving card to different column (drop on column)');
          moveCard(activeCardId, activeColumnId, overColumnId);
        }
        return;
      }

      // Case 2: Dropped on a card
      if (overData?.type === 'card') {
        const overCardId = overData.cardId;
        const overColumnId = overData.columnId;

        // 2a. Same column -> reorder only
        if (activeColumnId === overColumnId && activeCardId !== overCardId) {
          const column = board.columns.find((col) => col.id === activeColumnId);
          if (column) {
            const oldIndex = column.cardIds.indexOf(activeCardId);
            const newIndex = column.cardIds.indexOf(overCardId);
            
            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
              console.log('🔵 Reordering card within column');
              reorderCards(activeColumnId, oldIndex, newIndex);
            }
          }
          return;
        }

        // 2b. Different column -> move to that column
        if (activeColumnId !== overColumnId) {
          console.log('🔵 Moving card to different column (drop on card)');
          moveCard(activeCardId, activeColumnId, overColumnId);
          return;
        }
      }
    }
  };

  return (
    <>
      {isLoading && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            bgcolor: 'background.default',
          }}
        >
          <CircularProgress size={56} />
          <Typography variant="body1" sx={{ mt: 2 }} color="textSecondary">
            Memuat Kanban...
          </Typography>
        </Box>
      )}
      {isSyncing && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 16, 
            right: 16, 
            zIndex: 9999,
            bgcolor: 'primary.main',
            color: 'white',
            px: 2,
            py: 1,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Typography variant="body2">Menyinkronkan...</Typography>
        </Box>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={board.columns.map((col) => col.id)} strategy={horizontalListSortingStrategy}>
          <Box display="flex" gap={2} p={2} sx={{ overflowX: 'auto', height: '100%' }}>
            {board.columns.map((col) => {
              const allCards = col.cardIds.map((id) => board.cards[id]).filter(Boolean);
              const activeCards = allCards.filter(card => !card.completed);
              const completedCards = allCards.filter(card => card.completed);
              
              console.log(`📊 Column "${col.title}":`, { 
                total: allCards.length, 
                active: activeCards.length, 
                completed: completedCards.length 
              });
              
              return (
                <KanbanColumn
                  key={col.id}
                  column={col}
                  cards={activeCards}
                  completedCards={completedCards}
                  columnColor={columnColors[col.id]}
                  onAddCard={async (columnId, card) => {
                    console.log('🟢 KanbanBoard onAddCard called:', { columnId, card });
                    await addCard(columnId, card);
                  }}
                  onUpdateCard={updateCard}
                  onRemoveCard={removeCard}
                  onRemoveColumn={removeColumn}
                  onSetColumnColor={setColumnColor}
                />
              );
            })}
          </Box>
        </SortableContext>
        <DragOverlay>
          {activeCard ? (
            <Box sx={{ opacity: 0.8, cursor: 'grabbing' }}>
              <KanbanCard
                card={activeCard}
                columnId=""
                onUpdate={() => {}}
                onDelete={() => {}}
              />
            </Box>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Add Column Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Buat List Baru</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nama List"
            fullWidth
            variant="outlined"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddColumn();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Batal</Button>
          <Button onClick={handleAddColumn} variant="contained" disabled={!newListTitle.trim()}>
            Buat
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
