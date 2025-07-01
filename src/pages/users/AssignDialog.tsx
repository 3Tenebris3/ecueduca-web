/* --------------------------------------------------------------------------
   AssignDialog.tsx  –  elegir profesor para un estudiante
   -------------------------------------------------------------------------- */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem
} from '@mui/material';
import { useState } from 'react';
import type { UserDTO } from '../../api/users/users.types';

interface Props {
  open: boolean;
  onClose: () => void;
  teachers: UserDTO[];                // ← listado recibido desde la tabla
  onAssign: (teacherId: string) => void; // ← callback que dispara la mutación
}

export default function AssignDialog({
  open,
  onClose,
  teachers,
  onAssign
}: Props) {
  const [teacherId, setTeacherId] = useState('');

  const save = () => {
    if (teacherId) onAssign(teacherId);
    setTeacherId('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Asignar profesor</DialogTitle>

      <DialogContent sx={{ mt: 1 }}>
        <TextField
          select
          fullWidth
          label="Profesor"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
        >
          {teachers.map((t) => (
            <MenuItem key={t.id} value={t.id}>
              {t.displayName} – {t.email}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={save}
          disabled={!teacherId}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
