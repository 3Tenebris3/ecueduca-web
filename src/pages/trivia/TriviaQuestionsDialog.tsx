import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box
} from '@mui/material';
import {
  DataGrid, type GridColDef, GridActionsCellItem
} from '@mui/x-data-grid';
import EditIcon   from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon    from '@mui/icons-material/AddCircle';

import {
  useQuestions, useDeleteQuestion
} from '../../features/trivia/hooks';
import QuestionDialog from './QuestionDialog';
import { useState } from 'react';
import type { TriviaSetDTO, TriviaQuestionDTO } from '../../api/trivia/trivia.types';

interface Props {
  open: boolean;
  set: TriviaSetDTO;
  onClose: () => void;
}

export default function TriviaQuestionsDialog({ open, onClose, set }: Props) {
  const { data: qs = [] } = useQuestions(set.id);
  const removeQ = useDeleteQuestion(set.id);

  /* dialog add/edit */
  const [qDlg, setQDlg] = useState<TriviaQuestionDTO | null>(null);

  const cols: GridColDef[] = [
    { field:'text', headerName:'Pregunta', flex:1 },
    { field:'answer', headerName:'Respuesta', width:180 },
    {
      field:'actions',
      type:'actions',
      width:90,
      getActions:({ row }) => [
        <GridActionsCellItem
          icon={<EditIcon/>}
          label="Editar"
          onClick={() => setQDlg(row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon/>}
          label="Eliminar"
          onClick={() => removeQ.mutate(row.id)}
          showInMenu
        />
      ]
    }
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Preguntas – {set.title}</DialogTitle>

      <DialogContent>
        <Box sx={{ height: 400 }}>
          <DataGrid
            rows={qs as readonly TriviaQuestionDTO[]}
            columns={cols}
            getRowId={(r) => r.id}
            disableRowSelectionOnClick
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ pr:3, pb:2 }}>
        <Button startIcon={<AddIcon/>}
          onClick={() => setQDlg({} as TriviaQuestionDTO /* ← crear */)}>
          Añadir pregunta
        </Button>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>

      {qDlg !== null && (
        <QuestionDialog
          open
          onClose={() => setQDlg(null)}
          setId={set.id}
          editing={('id' in qDlg) ? qDlg : null}
        />
      )}
    </Dialog>
  );
}
