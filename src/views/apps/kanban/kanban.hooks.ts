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

/* ================= TYPES ================= */

export interface Card {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  labels?: string[];
  image?: string;
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

export interface BoardData {
  columns: Column[];
  cards: Record<string, Card>;
}

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

  /* ================= LOAD ================= */

  useEffect(() => {
    loadBoard();
  }, []);

  async function loadBoard() {
    try {
      const lists = await fetchTaskLists();

      const columns: Column[] = [];
      const cards: Record<string, Card> = {};

      for (const list of lists) {
        const tasks: GoogleTask[] = await fetchTasks(list.id);

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

      setBoard({ columns, cards });
    } catch (err) {
      console.error('Gagal load Google Tasks', err);
    }
  }

  /* ================= ADD ================= */

  async function addCard(columnId: string, cardData: Omit<Card, 'id' | 'completed'>) {
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

    const task = await createTask(columnId, { 
      title: cardData.title,
      notes,
      due: cardData.dueDate || undefined,
    });
    console.log('Created task', task);

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

  /* ================= API ================= */

  return {
    board,
    addCard,
    updateCard,
    removeCard,
    addColumn,
    removeColumn,
  };
}
