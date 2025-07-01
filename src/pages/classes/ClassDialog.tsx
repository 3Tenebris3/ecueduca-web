import { Dialog, DialogTitle, DialogContent, DialogActions,
         TextField, Button, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTeachers } from '../../features/users/hooks';
import { useCreateClass, useUpdateClass } from '../../features/classes/hooks';
import type { ClassDTO, CreateClassDTO, UpdateClassDTO } from '../../api/classes/classes.types';

interface Props {
  open: boolean;
  onClose: () => void;
  editing?: ClassDTO | null;
}

export default function ClassDialog({ open, onClose, editing }: Props) {
  const {
    register, handleSubmit, formState:{errors}, reset
  } = useForm<CreateClassDTO | UpdateClassDTO>({
    defaultValues: editing ?? { name:'', grade:'', teacherId:'' }
  });

  const { data: teachers=[] } = useTeachers();
  const create = useCreateClass();
  const update = useUpdateClass();

  const submit = handleSubmit(async data => {
    if (editing)
      await update.mutateAsync({ id: editing.id, dto: data as UpdateClassDTO });
    else
      await create.mutateAsync(data as CreateClassDTO);
    reset(); onClose();
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{editing ? 'Editar clase' : 'Nueva clase'}</DialogTitle>
      <form onSubmit={submit}>
        <DialogContent sx={{ display:'flex', flexDirection:'column', gap:2 }}>
          <TextField label="Nombre" {...register('name',{required:true})}
                     error={!!errors.name}/>
          <TextField label="Grado" {...register('grade',{required:true})}
                     error={!!errors.grade}/>
          <TextField select label="Profesor" {...register('teacherId',{required:true})}
                     error={!!errors.teacherId}>
            {teachers.map(t=>(
              <MenuItem key={t.id} value={t.id}>{t.displayName}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
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
