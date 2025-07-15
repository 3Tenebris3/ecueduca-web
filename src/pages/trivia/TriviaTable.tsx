/* --------------------------------------------------------------------------
   TriviaTable.tsx  –  lista de sets de trivia
   -------------------------------------------------------------------------- */
import { useState } from 'react';
import {
  Box, Button, Typography
} from '@mui/material';
import {
  DataGrid, type GridColDef, GridActionsCellItem
} from '@mui/x-data-grid';
import EditIcon   from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import QuizIcon   from '@mui/icons-material/Quiz';

import {
  useTriviaSets, useDeleteSet
} from '../../features/trivia/hooks';

import TriviaSetDialog        from './TriviaSetDialog';
import TriviaQuestionsDialog  from './TriviaQuestionsDialog';
import type { TriviaSetDTO }  from '../../api/trivia/trivia.types';

export default function TriviaTable() {
  /* data */
  const { data: sets = [] } = useTriviaSets();
  const delSet = useDeleteSet();

  /* dialogs */
  const [crudOpen, setCrud] = useState(false);
  const [editing,  setEdit] = useState<TriviaSetDTO | null>(null);

  const [qDlg, setQDlg] = useState<{ open: boolean; set: TriviaSetDTO | null }>({
    open: false,
    set : null
  });

  /* columns */
  const cols: GridColDef[] = [
    { field: 'title', headerName: 'Título', flex: 1 },
    {
      field: 'actions',
      type:  'actions',
      getActions: ({ row }) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Editar"
          onClick={() => { setEdit(row); setCrud(true); }}
        />,
        <GridActionsCellItem
          key="del"
          icon={<DeleteIcon />}
          label="Eliminar"
          onClick={() => delSet.mutate(row.id)}
          showInMenu
        />,
        <GridActionsCellItem
          key="qs"
          icon={<QuizIcon />}
          label="Preguntas"
          onClick={() => setQDlg({ open: true, set: row })}
          showInMenu
        />
      ]
    }
  ];

  return (
    <Box sx={{ height: 560 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5" fontWeight={600}>Trivias</Typography>
        <Button variant="contained" onClick={() => { setEdit(null); setCrud(true); }}>
          Nuevo set
        </Button>
      </Box>

      <DataGrid
        rows={sets}
        columns={cols}
        getRowId={(r) => r.id}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
      />

      {/* CRUD set */}
      {crudOpen && (
        <TriviaSetDialog
          open={crudOpen}
          onClose={() => setCrud(false)}
          editing={editing}
        />
      )}

      {/* Gestión de preguntas */}
      {qDlg.open && qDlg.set && (
        <TriviaQuestionsDialog
          open
          set={qDlg.set}
          onClose={() => setQDlg({ open:false, set:null })}
        />
      )}
    </Box>
  );
}
