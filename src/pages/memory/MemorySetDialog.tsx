import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button
} from '@mui/material';
import { useForm } from 'react-hook-form';
import {
  useCreateSet, useUpdateSet
} from '../../features/memory/hooks';
import type {
  MemorySetDTO, CreateMemorySetDTO, UpdateMemorySetDTO
} from '../../api/memory/memory.types';

type FormValues = { title:string; id?:string };

interface Props {
  open: boolean;
  onClose: () => void;
  editing: MemorySetDTO | null;
}

export default function MemorySetDialog({ open, onClose, editing }: Props) {
  const { register, handleSubmit, reset, formState:{ errors } } =
    useForm<FormValues>({
      defaultValues: editing
        ? { title: editing.title, id: editing.id }
        : { title:'', id:'' }
    });

  const create = useCreateSet();
  const update = useUpdateSet();

  const submit = handleSubmit(async (data) => {
    if (editing) {
      await update.mutateAsync({ id: editing.id, dto: data as UpdateMemorySetDTO });
    } else {
      await create.mutateAsync(data as CreateMemorySetDTO);
    }
    reset(); onClose();
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editing ? 'Editar set' : 'Nuevo set'}</DialogTitle>

      <form onSubmit={submit}>
        <DialogContent sx={{ display:'flex', flexDirection:'column', gap:2 }}>
          {!editing && (
            <TextField
              label="ID (snake_case)"
              {...register('id', { required:true })}
              error={!!errors.id}
            />
          )}
          <TextField
            label="Título visible"
            {...register('title', { required:true })}
            error={!!errors.title}
          />
        </DialogContent>

        <DialogActions sx={{ pr:3, pb:2 }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="contained" type="submit"
            disabled={create.isPending || update.isPending}>
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
