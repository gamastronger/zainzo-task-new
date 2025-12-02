import { Box } from '@mui/material';
import { useState } from 'react';
import PageContainer from 'src/components/container/PageContainer';
import KanbanBoard from './KanbanBoard';

const KanbanPage = () => {
  const [addListHandler, setAddListHandler] = useState<(() => void) | null>(null);

  // This will be called when Header's Add List button is available
  if (typeof window !== 'undefined') {
    (window as any).__kanbanAddListHandler = addListHandler;
  }

  return (
    <PageContainer title="Kanban" description="Manage work with the Kanban board">
      <Box sx={{ 
        position: 'fixed',
        top: '64px',
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 1,
      }}>
        <KanbanBoard onRequestAddColumn={(handler) => setAddListHandler(() => handler)} />
      </Box>
    </PageContainer>
  );
};

export { KanbanPage };
export default KanbanPage;
