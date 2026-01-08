import { useEffect, useState } from 'react';
import {
  fetchTaskLists,
  fetchTasks,
  createTask,
  createTaskList,
  deleteTask,
  deleteTaskList,
  GoogleTask,
} from 'src/api/googleTasks';
import { queueTaskPatch } from 'src/utils/googleTasksQueue';
import { Card, Column, BoardData } from './kanban.types';

/* ================= HELPERS ================= */

function parseTaskNotes(notes?: string): { description?: string; labels?: string[]; image?: string } {
  if (!notes) return {};

  const metadataMarker = '\n---METADATA---\n';
  const parts = notes.split(metadataMarker);

  if (parts.length === 1) {
    return { description: notes };
  }

  const description = parts[0] || undefined;
  try {
    const metadata = JSON.parse(parts[1]);
    return {
      description,
      labels: metadata.labels,
      image: metadata.image,
    };
  } catch {
    return { description: notes };
  }
}

/* ================= HOOK ================= */

export function useKanban() {
  const [board, setBoard] = useState<BoardData>({
    columns: [],
    cards: {},
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [columnColors, setColumnColors] = useState<Record<string, string>>({});

  /* ================= LOAD ================= */

  useEffect(() => {
    loadBoard();
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('🔄 Tab active, auto refreshing board...');
        loadBoard();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  async function loadBoard() {
    try {
      setIsLoading(true);
      const lists = await fetchTaskLists();

      const columns: Column[] = [];
      const cards: Record<string, Card> = {};

      for (const list of lists) {
        const tasks: GoogleTask[] = await fetchTasks(list.id);
        
        const completedCount = tasks.filter(t => t.status === 'completed').length;
        console.log(`📋 List "${list.title}": ${tasks.length} tasks (${completedCount} completed)`);

        columns.push({
          id: list.id,
          title: list.title,
          cardIds: tasks.map((t) => t.id),
        });

        tasks.forEach((t) => {
          const { description, labels, image } = parseTaskNotes(t.notes);
          cards[t.id] = {
            id: t.id,
            title: t.title,
            description,
            completed: t.status === 'completed',
            dueDate: t.due,
            labels,
            image,
          };
        });
      }

      console.log('✅ Board loaded:', { 
        columnCount: columns.length, 
        totalCards: Object.keys(cards).length,
        completedCards: Object.values(cards).filter(c => c.completed).length
      });
      setBoard({ columns, cards });

      // Load persisted colors and keep only for existing columns
      try {
        const raw = localStorage.getItem('kanban_column_colors');
        const persisted: Record<string, string> = raw ? JSON.parse(raw) : {};
        const filtered: Record<string, string> = {};
        for (const col of columns) {
          if (persisted[col.id]) filtered[col.id] = persisted[col.id];
        }
        setColumnColors(filtered);
      } catch (e) {
        console.warn('Failed to load column colors:', e);
        setColumnColors({});
      }
    } catch (err) {
      console.error('Gagal load Google Tasks', err);
    } finally {
      setIsLoading(false);
    }
  }

  /* ================= ADD ================= */

  async function addCard(columnId: string, cardData: Omit<Card, 'id'>) {
    console.log('🔵 addCard called with:', { columnId, cardData });
    
    try {
      // Parse notes untuk extract metadata
      let notes = cardData.description || '';
      const metadata: { labels?: string[]; image?: string } = {};
    
    if (cardData.labels && cardData.labels.length > 0) {
      metadata.labels = cardData.labels;
    }
    if (cardData.image) {
      metadata.image = cardData.image;
    }
    
    // Gabungkan description dengan metadata di notes
    if (Object.keys(metadata).length > 0) {
      notes = notes + '\n\n---METADATA---\n' + JSON.stringify(metadata);
    }

      // Format due date ke RFC 3339 jika ada
      let formattedDue: string | undefined;
      if (cardData.dueDate) {
        try {
          // Input format: YYYY-MM-DD dari date picker
          // Output format: YYYY-MM-DDTHH:MM:SS.000Z untuk Google Tasks API
          const date = new Date(cardData.dueDate);
          formattedDue = date.toISOString();
          console.log('📅 Formatted due date:', { input: cardData.dueDate, output: formattedDue });
        } catch (e) {
          console.warn('⚠️ Invalid due date format:', cardData.dueDate);
        }
      }

      // Build payload - hanya kirim field yang ada nilainya
      const taskPayload: { title: string; notes?: string; due?: string } = {
        title: cardData.title,
      };
      
      // Hanya tambahkan notes jika ada content (selain metadata kosong)
      const hasDescription = cardData.description && cardData.description.trim();
      const hasMetadata = Object.keys(metadata).length > 0;
      
      if (hasDescription || hasMetadata) {
        taskPayload.notes = notes;
      }
      
      if (formattedDue) {
        taskPayload.due = formattedDue;
      }

      console.log('📦 Final payload:', taskPayload);

      const task = await createTask(columnId, taskPayload);
      console.log('✅ Created task successfully:', task);

      // Parse kembali notes untuk extract metadata
      const { description, labels, image } = parseTaskNotes(task.notes);

      setBoard((prev) => ({
      ...prev,
      cards: {
        ...prev.cards,
        [task.id]: {
          id: task.id,
          title: task.title,
          description,
          completed: task.status === 'completed',
          dueDate: task.due,
          labels,
          image,
        },
      },
        columns: prev.columns.map((c) =>
          c.id === columnId
            ? { ...c, cardIds: [...c.cardIds, task.id] }
            : c
        ),
      }));
      console.log('✅ Card added to board state');
    } catch (error) {
      console.error('❌ Error adding card:', error);
      alert('Gagal menambahkan card: ' + (error instanceof Error ? error.message : 'Unknown error'));
      throw error;
    }
  }

  /* ================= UPDATE ================= */

  function updateCard(cardId: string, updates: Partial<Card>) {
    setBoard((prev) => {
      const card = prev.cards[cardId];
      if (!card) return prev;

      const updatedCard: Card = {
        ...card,
        ...updates,
      };

      // Normalisasi dueDate: string kosong berarti clear
      let duePatch: string | null | undefined;
      if (updates.dueDate !== undefined) {
        if (updates.dueDate === '') {
          updatedCard.dueDate = undefined;
          duePatch = null; // Clear due di Google Tasks
        } else {
          updatedCard.dueDate = updates.dueDate;
          duePatch = updates.dueDate;
        }
      }

      // cari column dari state TERBARU
      const column = prev.columns.find((c) =>
        c.cardIds.includes(cardId)
      );

      if (column) {
        queueTaskPatch(column.id, cardId, {
          ...(updates.title !== undefined && { title: updates.title }),
          ...(updates.description !== undefined && {
            notes: updates.description,
          }),
          ...(updates.completed !== undefined && {
            status: updates.completed ? 'completed' : 'needsAction',
          }),
          ...(duePatch !== undefined && { due: duePatch }),
        });
      }

      return {
        ...prev,
        cards: {
          ...prev.cards,
          [cardId]: updatedCard,
        },
      };
    });
  }

  /* ================= DELETE ================= */

  async function removeCard(cardId: string) {
    const column = board.columns.find((c) =>
      c.cardIds.includes(cardId)
    );
    if (!column) return;

    await deleteTask(column.id, cardId);

    setBoard((prev) => ({
      ...prev,
      cards: Object.fromEntries(
        Object.entries(prev.cards).filter(([id]) => id !== cardId)
      ),
      columns: prev.columns.map((c) =>
        c.id === column.id
          ? { ...c, cardIds: c.cardIds.filter((id) => id !== cardId) }
          : c
      ),
    }));
  }

  /* ================= ADD COLUMN ================= */

  async function addColumn(title: string) {
    const newList = await createTaskList(title);
    console.log('Created task list', newList);

    setBoard((prev) => ({
      ...prev,
      columns: [
        ...prev.columns,
        {
          id: newList.id,
          title: newList.title,
          cardIds: [],
        },
      ],
    }));
  }

  /* ================= REMOVE COLUMN ================= */

  async function removeColumn(columnId: string) {
    await deleteTaskList(columnId);
    console.log('Deleted task list', columnId);

    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.filter((c) => c.id !== columnId),
      // Also remove all cards from this column
      cards: Object.fromEntries(
        Object.entries(prev.cards).filter(
          ([cardId]) => !prev.columns.find((c) => c.id === columnId)?.cardIds.includes(cardId)
        )
      ),
    }));
  }

  /* ================= MOVE CARD ================= */

  async function moveCard(cardId: string, fromColumnId: string, toColumnId: string) {
    console.log('🔄 moveCard:', { cardId, fromColumnId, toColumnId });
    
    if (isSyncing) {
      console.log('⚠️ Already syncing, skipping...');
      return;
    }
    
    setIsSyncing(true);
    
    const card = board.cards[cardId];
    if (!card || card.completed) {
      setIsSyncing(false);
      return;
    }
    
    // Update UI immediately (optimistic update)
    setBoard((prev) => {
      const card = prev.cards[cardId];
      if (!card || card.completed) return prev;

      // Remove from old column, add to new column
      const newColumns = prev.columns.map((col) => {
        if (col.id === fromColumnId) {
          return { ...col, cardIds: col.cardIds.filter((id) => id !== cardId) };
        }
        if (col.id === toColumnId) {
          return { ...col, cardIds: [...col.cardIds, cardId] };
        }
        return col;
      });

      return {
        ...prev,
        columns: newColumns,
      };
    });

    // Sync to Google Tasks API
    try {
      // Google Tasks API doesn't support moving tasks between tasklists directly
      // We need to delete from old tasklist and create in new tasklist
      console.log('📤 Moving task between tasklists via delete+create');
      
      // 1. Delete from old tasklist
      await deleteTask(fromColumnId, cardId);
      console.log('✅ Deleted from old tasklist');
      
      // 2. Create in new tasklist dengan data yang sama
      const taskData = {
        title: card.title,
        notes: card.description || undefined,
        due: card.dueDate || undefined,
        status: card.completed ? 'completed' : 'needsAction',
      } as Partial<GoogleTask>;
      
      console.log('📤 Creating task in new tasklist with data:', taskData);
      const newTask = await createTask(toColumnId, taskData as any);
      console.log('✅ Created in new tasklist:', { id: newTask?.id, fullTask: newTask });
      
      if (!newTask || !newTask.id) {
        throw new Error('Failed to create task in new tasklist - no ID returned');
      }

      // Update state lokal agar memakai ID task baru dari Google
      if (newTask.id !== cardId) {
        console.log('🔄 Updating local card ID from', cardId, 'to', newTask.id);
        setBoard((prev) => {
          const { [cardId]: oldCard, ...restCards } = prev.cards;

          const newColumns = prev.columns.map((col) => {
            // Card sudah dipindahkan ke toColumnId secara optimistic di atas,
            // di sini kita hanya mengganti ID di daftar cardIds.
            return {
              ...col,
              cardIds: col.cardIds.map((id) => (id === cardId ? newTask.id! : id)),
            };
          });

          return {
            columns: newColumns,
            cards: {
              ...restCards,
              [newTask.id!]: {
                ...oldCard,
                id: newTask.id!,
              },
            },
          };
        });
      }

      console.log('✅ Task moved between tasklists without full reload');
    } catch (error) {
      console.error('❌ Failed to move task in Google Tasks:', error);
      // Revert UI change jika API gagal
      setBoard((prev) => {
        const newColumns = prev.columns.map((col) => {
          if (col.id === toColumnId) {
            return { ...col, cardIds: col.cardIds.filter((id) => id !== cardId) };
          }
          if (col.id === fromColumnId) {
            return { ...col, cardIds: [...col.cardIds, cardId] };
          }
          return col;
        });
        return { ...prev, columns: newColumns };
      });
      alert('Gagal memindahkan task: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsSyncing(false);
    }
  }

  /* ================= REORDER COLUMNS ================= */

  function reorderColumns(oldIndex: number, newIndex: number) {
    setBoard((prev) => {
      const newColumns = [...prev.columns];
      const [removed] = newColumns.splice(oldIndex, 1);
      newColumns.splice(newIndex, 0, removed);

      return {
        ...prev,
        columns: newColumns,
      };
    });
  }

  /* ================= REORDER CARDS ================= */

  function reorderCards(columnId: string, oldIndex: number, newIndex: number) {
    console.log('🔄 reorderCards (local only):', { columnId, oldIndex, newIndex });

    // Ambil snapshot kolom saat ini
    const column = board.columns.find((col) => col.id === columnId);
    if (!column) return;

    const movedCardId = column.cardIds[oldIndex];
    if (!movedCardId) return;

    // Hitung urutan baru di kolom tersebut
    const newCardIds = [...column.cardIds];
    newCardIds.splice(oldIndex, 1);
    newCardIds.splice(newIndex, 0, movedCardId);

    setBoard((prev) => {
      const newColumns = prev.columns.map((col) => {
        if (col.id === columnId) {
          return { ...col, cardIds: newCardIds };
        }
        return col;
      });

      return {
        ...prev,
        columns: newColumns,
      };
    });
  }

  function setColumnColor(columnId: string, color: string) {
    setColumnColors((prev) => {
      const next = { ...prev, [columnId]: color };
      try {
        localStorage.setItem('kanban_column_colors', JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to persist column colors:', e);
      }
      return next;
    });
  }

  /* ================= API ================= */

  return {
    board,
    isSyncing,
    isLoading,
    columnColors,
    setColumnColor,
    addCard,
    updateCard,
    removeCard,
    addColumn,
    removeColumn,
    moveCard,
    reorderColumns,
    reorderCards,
    refreshBoard: loadBoard, // Expose untuk manual refresh
  };
}
