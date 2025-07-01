import dayjs from 'dayjs';
import type { GridColDef } from '@mui/x-data-grid';

export const createdAtCol = (field = 'createdAt'): GridColDef => ({
  field,
  headerName: 'Creado',
  width: 140,
  valueFormatter: ({ value }) => dayjs(value).format('DD/MM/YY HH:mm')
});

export const updatedAtCol = (field = 'updatedAt'): GridColDef => ({
  field,
  headerName: 'Modificado',
  width: 140,
  valueFormatter: ({ value }) => dayjs(value).format('DD/MM/YY HH:mm')
});
