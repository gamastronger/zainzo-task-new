import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type InboxType = 'created' | 'assigned' | 'due' | 'overdue' | 'moved' | 'completed';

export interface InboxItem {
  id: string; // stable id for de-dup or event id
  type: InboxType;
  title: string; // short summary
  message?: string; // optional details
  taskId?: string;
  columnId?: string;
  timestamp: number; // ms epoch
  unread: boolean;
}

export interface InboxState {
  items: InboxItem[];
}

const STORAGE_KEY = 'kanban_inbox_items_v1';

function loadFromStorage(): InboxItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as InboxItem[]) : [];
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

function persist(items: InboxItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

const initialState: InboxState = {
  items: loadFromStorage(),
};

const inboxSlice = createSlice({
  name: 'inbox',
  initialState,
  reducers: {
    upsert(state, action: PayloadAction<InboxItem>) {
      const idx = state.items.findIndex((i) => i.id === action.payload.id);
      if (idx >= 0) {
        // preserve original timestamp and unread when updating existing item
        state.items[idx] = {
          ...state.items[idx],
          ...action.payload,
          timestamp: state.items[idx].timestamp,
          unread: state.items[idx].unread,
        };
      } else {
        state.items.push(action.payload);
      }
      state.items.sort((a, b) => b.timestamp - a.timestamp);
      persist(state.items);
    },
    markRead(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.unread = false;
      persist(state.items);
    },
    markAllRead(state) {
      state.items.forEach((i) => (i.unread = false));
      persist(state.items);
    },
    clear(state) {
      state.items = [];
      persist(state.items);
    },
  },
});

export const inboxActions = inboxSlice.actions;
export default inboxSlice.reducer;
