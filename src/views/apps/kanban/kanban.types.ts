export type Card = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  dueDate?: string;
  labels?: string[];
  completed: boolean;
};

export type Column = {
  id: string;
  title: string;
  color?: string;
  cardIds: string[];
};

export type BoardData = {
  columns: Column[];
  cards: Record<string, Card>;
};

export type MoveCardPayload = {
  cardId: string;
  fromColumnId: string;
  toColumnId: string;
  toIndex: number;
};
