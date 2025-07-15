import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button
} from '@mui/material';
import { useForm } from 'react-hook-form';
import {
  useCreateSet, useUpdateSet
} from '../../features/trivia/hooks';
import type {
  TriviaSetDTO, CreateTriviaSetDTO, UpdateTriviaSetDTO
} from '../../api/trivia/trivia.types';

type FormValues = { title: string };

interface Props {
  open: boolean;
  onClose: () => void;
  editing?: TriviaSetDTO | null;
}

export default function TriviaSetDialog({ open, onClose, editing }: Props) {
  const { register, handleSubmit, reset, formState:{ errors } } = useForm<FormValues>({
    defaultValues: editing ? { title: editing.title } : { title: '' }
  });

  const create = useCreateSet();
  const update = useUpdateSet();

  const submit = handleSubmit(async (data) => {
    if (editing) {
      await update.mutateAsync({ id: editing.id, dto: data as UpdateTriviaSetDTO });
    } else {
      await create.mutateAsync(data as CreateTriviaSetDTO);
    }
    reset(); onClose();
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editing ? 'Editar trivia' : 'Nueva trivia'}</DialogTitle>

      <form onSubmit={submit}>
        <DialogContent sx={{ display:'flex', flexDirection:'column', gap:2 }}>
          <TextField
            label="Título"
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
