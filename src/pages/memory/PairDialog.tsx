import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack, Avatar
} from '@mui/material';
import { useForm } from 'react-hook-form';
import {
  useAddPair, useUpdatePair
} from '../../features/memory/hooks';
import type {
  MemoryPairDTO, CreatePairDTO, UpdatePairDTO
} from '../../api/memory/memory.types';
import { useState } from 'react';

/* reemplázala con tu uploader real si usas Firebase Storage */
async function uploadImageAndGetUrl(file: File): Promise<string> {
  /* Demo: convierte a object URL local */
  return URL.createObjectURL(file);
}

interface Props {
  open: boolean;
  onClose: () => void;
  setId: string;
  editing: MemoryPairDTO | null;
}

type FormValues = { id?:string; name:string; imgUrl:string; file?:FileList };

export default function PairDialog({ open, onClose, setId, editing }: Props) {
  const { register, handleSubmit, reset, watch, formState:{ errors } } =
    useForm<FormValues>({
      defaultValues: editing
        ? { name:editing.name, imgUrl:editing.imgUrl }
        : { name:'', imgUrl:'' }
    });

  const addPair    = useAddPair(setId);
  const updatePair = useUpdatePair(setId);

  /* vista previa */
  const [preview, setPreview] = useState(editing?.imgUrl ?? '');

  const submit = handleSubmit(async (data) => {
    let imgUrl = editing?.imgUrl ?? '';

    if (data.file?.length) {
      imgUrl = await uploadImageAndGetUrl(data.file[0]);
    } else if (data.imgUrl) {
      imgUrl = data.imgUrl;
    }

    if (editing) {
      await updatePair.mutateAsync({
        id : editing.id,
        dto: { name:data.name, imgUrl } as UpdatePairDTO
      });
    } else {
      await addPair.mutateAsync({
        id : data.id!.trim(),
        name: data.name,
        imgUrl
      } as CreatePairDTO);
    }
    reset(); onClose();
  });

  /* watcher para imgUrl text */
  const imgUrlVal = watch('imgUrl');
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editing ? 'Editar par' : 'Nuevo par'}</DialogTitle>
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
            label="Nombre"
            {...register('name', { required:true })}
            error={!!errors.name}
          />

          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={imgUrlVal || preview}
              variant="rounded"
              sx={{ width:64, height:64 }}
            />
            <TextField
              label="URL de la imagen"
              fullWidth
              {...register('imgUrl')}
            />
          </Stack>

          <input
            type="file"
            accept="image/*"
            {...register('file')}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setPreview(URL.createObjectURL(f));
            }}
          />
        </DialogContent>

        <DialogActions sx={{ pr:3, pb:2 }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="contained" type="submit"
            disabled={addPair.isPending || updatePair.isPending}>
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
