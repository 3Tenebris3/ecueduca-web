import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack
} from '@mui/material';
import { useForm } from 'react-hook-form';
import {
  useCreateScene,
  useUpdateScene
} from '../../features/scenarios/hooks';
import type {
  CreateSceneDTO,
  SceneMetaDTO
} from '../../api/scenarios/scenarios.types';

interface Props {
  open: boolean;
  onClose: () => void;
  editing?: SceneMetaDTO;
}

export default function SceneDialog({ open, onClose, editing }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateSceneDTO>({
    defaultValues: editing
      ? {
          id: editing.id,
          title: editing.title,
          preview: editing.preview,
          glbUrl: '',     // ❶ si quieres precargarlo guarda la URL en el set
          audio: '',
          desc: ''        // ❷ idem
        }
      : {
          id: '',
          title: '',
          preview: '',
          glbUrl: '',
          audio: '',
          desc: ''
        }
  });

  const create = useCreateScene();
  const update = useUpdateScene();

  const submit = handleSubmit(async (d) => {
    if (editing) {
      const { id, ...rest } = d;
      await update.mutateAsync({ id, dto: rest });
    } else {
      await create.mutateAsync(d);
    }
    onClose();
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editing ? 'Editar escenario' : 'Nuevo escenario'}
      </DialogTitle>

      <form onSubmit={submit}>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Slug único"
              disabled={!!editing}
              {...register('id', { required: true })}
              error={!!errors.id}
            />
            <TextField
              label="Título"
              {...register('title', { required: true })}
              error={!!errors.title}
            />
            <TextField
              label="Descripción"
              multiline
              rows={3}
              {...register('desc', { required: true })}
              error={!!errors.desc}
            />
            <TextField
              label="URL miniatura"
              {...register('preview', { required: true })}
              error={!!errors.preview}
            />
            <TextField
              label="URL modelo (.glb)"
              {...register('glbUrl', { required: true })}
              error={!!errors.glbUrl}
            />
            <TextField
              label="Audio (opcional)"
              {...register('audio')}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="contained" type="submit">
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
