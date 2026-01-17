import { Box } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import PageContainer from 'src/components/container/PageContainer';
import KanbanBoard from './KanbanBoard';

const KanbanPage = () => {
  const [addListHandler, setAddListHandler] = useState<(() => void) | null>(null);

  // Expose handler to window for Header's Add List button
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as unknown as { __kanbanAddListHandler?: (() => void) | null }).__kanbanAddListHandler = addListHandler;
    }
  }, [addListHandler]);

  // Memoize callback to prevent infinite loop
  const handleRequestAddColumn = useCallback((handler: () => void) => {
    setAddListHandler(() => handler);
  }, []);

  return (
    <PageContainer title="Zainzo Task" description="Manage work with the Kanban board">
      <Box sx={{ 
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <KanbanBoard onRequestAddColumn={handleRequestAddColumn} />
      </Box>
    </PageContainer>
  );
};

export { KanbanPage };
export default KanbanPage;
