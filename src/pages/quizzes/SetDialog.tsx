import { Dialog, DialogTitle, DialogContent, DialogActions,
         TextField, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useCreateSet, useUpdateSet } from '../../features/quizzes/hooks';
import type { QuizSetDTO, CreateQuizSetDTO } from '../../api/quizzes/quizzes.types';

interface Props{ open:boolean; onClose:()=>void; editing?:QuizSetDTO }

export default function SetDialog({open,onClose,editing}:Props){
  const {register,handleSubmit,formState:{errors},reset}=useForm<CreateQuizSetDTO>({
    defaultValues: editing??{title:''}
  });
  const create=useCreateSet(); const update=useUpdateSet();
  const submit=handleSubmit( async d=>{
    if (editing) {
      await update.mutateAsync({ id: editing.id, dto: d });
    } else {
      await create.mutateAsync(d);
    }
    reset(); onClose();
  });

  return(
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editing?'Editar quiz':'Nuevo quiz'}</DialogTitle>
      <form onSubmit={submit}>
        <DialogContent>
          <TextField fullWidth label="Título" {...register('title',{required:true})}
                     error={!!errors.title}/>
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
