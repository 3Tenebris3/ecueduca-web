/* --------------------------------------------------------------------------
   UsersTable.tsx  –  lista de usuarios con todas las acciones
   -------------------------------------------------------------------------- */

import { useState } from 'react';
import {
  Box,
  Button,
  Typography
} from '@mui/material';
import {
  DataGrid,
  type GridColDef,
  GridActionsCellItem
} from '@mui/x-data-grid';

import EditIcon     from '@mui/icons-material/Edit';
import DeleteIcon   from '@mui/icons-material/Delete';
import VpnKeyIcon   from '@mui/icons-material/VpnKey';
import FaceIcon     from '@mui/icons-material/Face';
import SchoolIcon   from '@mui/icons-material/School';

import {
  useUsers,
  useDeleteUser,
  useAssignTeacher,
  useTeachers
} from '../../features/users/hooks';

import UsersDialog   from './UsersDialog';
import ResetPwdDialog from './ResetPwdDialog';
import AvatarDialog   from './AvatarDialog';
import AssignDialog   from './AssignDialog';

import type { UserDTO } from '../../api/users/users.types';

/* ------------------------------------------------------------------ */

export default function UsersTable() {
  /* datos */
  const { data: rows = [] } = useUsers();
  const delUser   = useDeleteUser();
  const assignT   = useAssignTeacher();
  const { data: teachers = [] } = useTeachers();

  /* diálogos */
  const [crudOpen, setCrud] = useState(false);
  const [editing,  setEdit] = useState<UserDTO | null>(null);

  const [dlg, setDlg] = useState<
    | { type:'reset'  ; user:UserDTO }
    | { type:'avatar' ; user:UserDTO }
    | { type:'assign' ; user:UserDTO }
    | null
  >(null);

  /* columnas */
  const cols: GridColDef[] = [
    { field: 'displayName', headerName: 'Nombre', flex: 1 },
    { field: 'email',       headerName: 'Correo', flex: 1 },
    { 
      field: 'role',        
      headerName: 'Rol',    
      width: 120,
      valueGetter: ({ value }) => {
        switch (value) {
          case 'admin': return 'Administrador';
          case 'student': return 'Estudiante';
          case 'teacher': return 'Profesor';
          default: return 'Hola';
        }
      }
    },
    {
      field: 'actions',
      type:  'actions',
      width: 110,
      getActions: ({ row }) => {
        const actions = [
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
            onClick={() => delUser.mutate(row.id)}
            showInMenu
          />,
          <GridActionsCellItem
            key="reset"
            icon={<VpnKeyIcon />}
            label="Reset contraseña"
            onClick={() => setDlg({ type: 'reset', user: row })}
            showInMenu
          />,
          <GridActionsCellItem
            key="avatar"
            icon={<FaceIcon />}
            label="Cambiar avatar"
            onClick={() => setDlg({ type: 'avatar', user: row })}
            showInMenu
          />
        ];

        /* asignar profesor solo a estudiantes */
        if (row.role === 'student') {
          actions.push(
            <GridActionsCellItem
              key="assign"
              icon={<SchoolIcon />}
              label="Asignar profesor"
              onClick={() => setDlg({ type: 'assign', user: row })}
              showInMenu
            />
          );
        }
        return actions;
      }
    }
  ];

  /* render */
  return (
    <Box sx={{ height: 560 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5" fontWeight={600}>Usuarios</Typography>
        <Button variant="contained" onClick={() => { setEdit(null); setCrud(true); }}>
          Nuevo
        </Button>
      </Box>

      <DataGrid
        rows={rows}
        columns={cols}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
      />

      {/* CRUD diálogo */}
      {crudOpen && (
        <UsersDialog
          open={crudOpen}
          onClose={() => setCrud(false)}
          editing={editing}
        />
      )}

      {/* Reset contraseña */}
      {dlg?.type === 'reset' && (
        <ResetPwdDialog
          open
          onClose={() => setDlg(null)}
          id={dlg.user.id}
        />
      )}

      {/* Avatar */}
      {dlg?.type === 'avatar' && (
        <AvatarDialog
          open
          onClose={() => setDlg(null)}
          id={dlg.user.id}
        />
      )}

      {/* Asignar profesor */}
      {dlg?.type === 'assign' && (
        <AssignDialog
          open
          onClose={() => setDlg(null)}
          teachers={teachers}
          onAssign={(teacherId: string) =>
            assignT.mutate({ studentId: dlg.user.id, teacherId })
          }
        />
      )}
    </Box>
  );
}
