import { useState } from 'react';
import {
  Box, Typography, IconButton, Tooltip
} from '@mui/material';
import { DataGrid, GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import AddIcon    from '@mui/icons-material/Add';
import EditIcon   from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon  from '@mui/icons-material/Image';

import {
  useMemorySets, useDeleteSet
} from '../../features/memory/hooks';
import MemorySetDialog   from './MemorySetDialog';
import MemoryPairsDialog from './MemoryPairsDialog';
import type { MemorySetDTO } from '../../api/memory/memory.types';

export default function MemorySetsPage() {
  const { data: sets = [] } = useMemorySets();
  const removeSet = useDeleteSet();

  /* dialogs */
  const [setDlg,   openSetDlg]   = useState<MemorySetDTO | null>(null);
  const [pairDlg,  openPairDlg]  = useState<MemorySetDTO | null>(null);

  const cols: GridColDef[] = [
    { field:'title', headerName:'Título', flex:1 },
    { field:'total', headerName:'Pares',  width:100 },
    {
      field:'actions',
      type:'actions',
      getActions:({ row }) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon/>}
          label="Editar"
          onClick={() => openSetDlg(row)}
        />,
        <GridActionsCellItem
          key="pairs"
          icon={<ImageIcon/>}
          label="Pares"
          onClick={() => openPairDlg(row)}
        />,
        <GridActionsCellItem
          key="del"
          icon={<DeleteIcon/>}
          label="Eliminar"
          onClick={() => removeSet.mutate(row.id)}
          showInMenu
        />
      ]
    }
  ];

  return (
    <Box sx={{ height: 560 }}>
      <Box sx={{ mb:2, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <Typography variant="h5" fontWeight={600}>Memoria – Sets</Typography>
        <Tooltip title="Nuevo set">
          <IconButton color="primary" onClick={() => openSetDlg({ id: '', title: '', total: 0 } as MemorySetDTO)}>
            <AddIcon/>
          </IconButton>
        </Tooltip>
      </Box>

      <DataGrid
        rows={sets}
        columns={cols}
        getRowId={(r) => r.id}
        disableRowSelectionOnClick
        pageSizeOptions={[5,10,25]}
      />

      {setDlg !== null && (
        <MemorySetDialog
          open
          onClose={() => openSetDlg(null)}
          editing={'id' in setDlg ? setDlg : null}
        />
      )}

      {pairDlg !== null && (
        <MemoryPairsDialog
          open
          onClose={() => openPairDlg(null)}
          set={pairDlg}
        />
      )}
    </Box>
  );
}
