import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Avatar
} from '@mui/material';
import {
  DataGrid, type GridColDef, GridActionsCellItem
} from '@mui/x-data-grid';
import EditIcon   from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon    from '@mui/icons-material/AddCircle';
import { useState } from 'react';

import { usePairs, useDeletePair } from '../../features/memory/hooks';
import PairDialog from './PairDialog';
import type { MemorySetDTO, MemoryPairDTO } from '../../api/memory/memory.types';

interface Props {
  open: boolean;
  set: MemorySetDTO;
  onClose: () => void;
}

export default function MemoryPairsDialog({ open, onClose, set }: Props) {
  const { data: pairs = [] } = usePairs(set.id);
  const removePair = useDeletePair(set.id);

  const [editing, setEditing] = useState<MemoryPairDTO|null>(null);

  const cols: GridColDef[] = [
    {
      field:'img',
      headerName:'Img',
      width:70,
      renderCell:({ row }) => <Avatar src={row.imgUrl} variant="rounded" />
    },
    { field:'name', headerName:'Nombre', flex:1 },
    {
      field:'actions',
      type:'actions',
      width:90,
      getActions:({ row }) => [
        <GridActionsCellItem
          icon={<EditIcon/>}
          label="Editar"
          onClick={() => setEditing(row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon/>}
          label="Eliminar"
          onClick={() => removePair.mutate(row.id)}
          showInMenu
        />
      ]
    }
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Pares – {set.title}</DialogTitle>

      <DialogContent>
        <Box sx={{ height: 420 }}>
          <DataGrid
            rows={pairs}
            columns={cols}
            getRowId={(r) => r.id}
            disableRowSelectionOnClick
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ pr:3, pb:2 }}>
        <Button startIcon={<AddIcon/>}
          onClick={() => setEditing({ id: '', name: '', imgUrl: '' })}>
          Añadir par
        </Button>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>

      {editing !== null && (
        <PairDialog
          open
          setId={set.id}
          editing={('id' in editing) ? editing : null}
          onClose={() => setEditing(null)}
        />
      )}
    </Dialog>
  );
}
