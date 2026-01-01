// src/views/apps/kanban/KanbanBoard.tsx

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useKanban } from './kanban.hooks';
import KanbanColumn from './KanbanColumn';
import { useEffect, useState } from 'react';

type KanbanBoardProps = {
  onRequestAddColumn?: (handler: () => void) => void;
};

export default function KanbanBoard({ onRequestAddColumn }: KanbanBoardProps) {
  const { board, addCard, updateCard, removeCard, addColumn, removeColumn } = useKanban();
  const [addOpen, setAddOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');

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

  return (
    <>
      <Box display="flex" gap={2} p={2} sx={{ overflowX: 'auto', height: '100%' }}>
        {board.columns.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            cards={col.cardIds.map((id) => board.cards[id])}
            onAddCard={(columnId, card) => addCard(columnId, card)}
            onUpdateCard={updateCard}
            onRemoveCard={removeCard}
            onRemoveColumn={removeColumn}
          />
        ))}
      </Box>

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
