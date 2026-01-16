import React, { useMemo, useState } from 'react';
import { Box,} from '@mui/material';
import {
  DndContext,
  PointerSensor,
  closestCorners,
  DragEndEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanColumn from 'src/views/apps/kanban/KanbanColumn';
import { BoardData, Card } from 'src/views/apps/kanban/kanban.types';

const initialBoard: BoardData = {
  columns: [
    {
      id: 'sample-todo',
      title: 'To Do',
      cardIds: ['c1', 'c2'],
    },
    {
      id: 'sample-progress',
      title: 'In Progress',
      cardIds: ['c3'],
    },
    // {
    //   id: 'sample-done',
    //   title: 'Done',
    //   cardIds: ['c4'],
    // },
  ],
  cards: {
    c1: {
      id: 'c1',
      title: 'Rencanakan minggu kerja',
      description: 'Buat daftar prioritas tugas di Google Tasks',
      completed: false,
      labels: ['planning'],
    },
    c2: {
      id: 'c2',
      title: 'Kumpulkan semua task penting',
      description: 'Satukan tugas dari Gmail dan Calendar',
      completed: false,
      labels: ['inbox'],
    },
    c3: {
      id: 'c3',
      title: 'Fokus ke tugas hari ini',
      description: 'Pilih 3 tugas utama untuk dikerjakan duluan',
      completed: false,
      labels: ['today'],
    },
    c4: {
      id: 'c4',
      title: 'Review progres mingguan',
      description: 'Cek task yang sudah selesai dan yang tertunda',
      completed: true,
      labels: ['review'],
    },
  },
};

const LandingKanbanSample: React.FC = () => {
//   const theme = useTheme();
  const [board, setBoard] = useState<BoardData>(initialBoard);
  const [columnColors, setColumnColors] = useState<Record<string, string>>({
    'sample-todo': '#F2E7FE',
    'sample-progress': '#D8E5FF',
    // 'sample-done': '#DAFFEA',
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  const activeColumns = useMemo(() => board.columns, [board.columns]);

  const addCard = async (columnId: string, cardData: Omit<Card, 'id'>) => {
    const id = `sample-${Date.now()}`;

    setBoard((prev) => ({
      columns: prev.columns.map((col) =>
        col.id === columnId ? { ...col, cardIds: [...col.cardIds, id] } : col,
      ),
      cards: {
        ...prev.cards,
        [id]: {
          ...cardData,
          id,
        },
      },
    }));
  };

  const updateCard = (cardId: string, updates: Partial<Card>) => {
    setBoard((prev) => ({
      ...prev,
      cards: {
        ...prev.cards,
        [cardId]: {
          ...prev.cards[cardId],
          ...updates,
        },
      },
    }));
  };

  const removeCard = (cardId: string) => {
    setBoard((prev) => ({
      columns: prev.columns.map((col) => ({
        ...col,
        cardIds: col.cardIds.filter((id) => id !== cardId),
      })),
      cards: Object.fromEntries(
        Object.entries(prev.cards).filter(([id]) => id !== cardId),
      ),
    }));
  };

  // For the landing sample we keep columns fixed
  const removeColumn = () => {
    // no-op to avoid deleting demo columns
  };

  const setColumnColor = (columnId: string, color: string) => {
    setColumnColors((prev) => ({
      ...prev,
      [columnId]: color,
    }));
  };

  const moveCard = (cardId: string, fromColumnId: string, toColumnId: string) => {
    setBoard((prev) => {
      if (fromColumnId === toColumnId) return prev;

      const nextColumns = prev.columns.map((col) => {
        if (col.id === fromColumnId) {
          return { ...col, cardIds: col.cardIds.filter((id) => id !== cardId) };
        }
        if (col.id === toColumnId) {
          return { ...col, cardIds: [...col.cardIds, cardId] };
        }
        return col;
      });

      return { ...prev, columns: nextColumns };
    });
  };

  const reorderCards = (columnId: string, fromIndex: number, toIndex: number) => {
    setBoard((prev) => {
      const column = prev.columns.find((c) => c.id === columnId);
      if (!column) return prev;

      const nextIds = [...column.cardIds];
      const [moved] = nextIds.splice(fromIndex, 1);
      nextIds.splice(toIndex, 0, moved);

      return {
        ...prev,
        columns: prev.columns.map((c) =>
          c.id === columnId ? { ...c, cardIds: nextIds } : c,
        ),
      };
    });
  };

  type DragItemData =
    | { type: 'card'; cardId: string; columnId: string }
    | { type: 'column'; columnId: string }
    | undefined;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current as DragItemData;
    const overData = over.data.current as DragItemData;

    if (!activeData || activeData.type !== 'card') return;

    const activeCardId = activeData.cardId;
    const activeColumnId = activeData.columnId;

    if (overData?.type === 'column') {
      const overColumnId = overData.columnId;
      if (activeColumnId !== overColumnId) {
        moveCard(activeCardId, activeColumnId, overColumnId);
      }
      return;
    }

    if (overData?.type === 'card') {
      const overCardId = overData.cardId;
      const overColumnId = overData.columnId;

      const column = board.columns.find((c) => c.id === activeColumnId);
      if (!column) return;

      const oldIndex = column.cardIds.indexOf(activeCardId);
      if (oldIndex === -1) return;

      if (activeColumnId === overColumnId) {
        const newIndex = column.cardIds.indexOf(overCardId);
        if (newIndex === -1 || newIndex === oldIndex) return;
        reorderCards(activeColumnId, oldIndex, newIndex);
        return;
      }

      moveCard(activeCardId, activeColumnId, overColumnId);
    }
  };

  return (
    <Box
    sx={{
        width: '100%',
        maxWidth: 480,
        borderRadius: 3,
        bgcolor: '#F8FAFC',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
        p: 2,
    }}
    >

      {/* <Typography
        variant="subtitle2"
        color={theme.palette.text.secondary}
        sx={{ mb: 1.5, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8 }}
      >
        Contoh mini board
      </Typography> */}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={activeColumns.map((c) => c.id)}
          strategy={horizontalListSortingStrategy}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              overflowX: 'auto',
              pb: 1,
              '&::-webkit-scrollbar': {
                height: 6,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(15, 23, 42, 0.18)',
                borderRadius: 999,
              },
            }}
          >
            {activeColumns.map((col) => {
              const allCards = col.cardIds.map((id) => board.cards[id]).filter(Boolean);
              const activeCards = allCards.filter((card) => !card.completed);
              const completedCards = allCards.filter((card) => card.completed);

              return (
                <KanbanColumn
                  key={col.id}
                  column={col}
                  cards={activeCards}
                  completedCards={completedCards}
                  columnColor={columnColors[col.id]}
                  onAddCard={addCard}
                  onUpdateCard={updateCard}
                  onRemoveCard={removeCard}
                  onRemoveColumn={removeColumn}
                  onSetColumnColor={setColumnColor}
                />
              );
            })}
          </Box>
        </SortableContext>
      </DndContext>
    </Box>
  );
};

export default LandingKanbanSample;
