import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Grid
} from '@mui/material';
import { useForm, Controller, useWatch } from 'react-hook-form';
import {
  useAddQuestion, useUpdateQuestion
} from '../../features/trivia/hooks';
import type {
  TriviaQuestionDTO,
  CreateQuestionDTO, UpdateQuestionDTO
} from '../../api/trivia/trivia.types';

interface Props {
  open: boolean;
  onClose: () => void;
  setId: string;
  editing: TriviaQuestionDTO | null;
}

type FormValues = {
  text: string;
  opt0: string; opt1: string; opt2: string; opt3: string;
  answer: string;
};

export default function QuestionDialog({ open, onClose, setId, editing }: Props) {
  const { control, handleSubmit, register, reset, formState:{ errors } } = useForm<FormValues>({
    defaultValues: editing ? {
      text   : editing.text,
      opt0   : editing.options[0],
      opt1   : editing.options[1],
      opt2   : editing.options[2],
      opt3   : editing.options[3],
      answer : editing.answer
    } : { text:'', opt0:'', opt1:'', opt2:'', opt3:'', answer:'' }
  });

  const addQ  = useAddQuestion(setId);
  const upQ   = useUpdateQuestion(setId);

  const submit = handleSubmit(async (d) => {
    const dto = {
      text: d.text,
      options: [d.opt0, d.opt1, d.opt2, d.opt3] as [string,string,string,string],
      answer: d.answer
    };

    if (editing) {
      await upQ.mutateAsync({ id: editing.id, dto: dto as UpdateQuestionDTO });
    } else {
      await addQ.mutateAsync(dto as CreateQuestionDTO);
    }
    reset(); onClose();
  });

  const opts = useWatch({ control, name: ['opt0', 'opt1', 'opt2', 'opt3'] });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editing ? 'Editar pregunta' : 'Nueva pregunta'}</DialogTitle>

      <form onSubmit={submit}>
        <DialogContent sx={{ display:'flex', flexDirection:'column', gap:2 }}>
          <TextField
            label="Texto de la pregunta"
            multiline rows={3}
            {...register('text', { required:true })}
            error={!!errors.text}
          />

          <Grid container spacing={2}>
            {['opt0','opt1','opt2','opt3'].map((name, idx) => (
              <div key={name}>
                <TextField
                  label={`Opción ${idx+1}`}
                  {...register(name as keyof FormValues, { required:true })}
                  error={!!errors[name as keyof FormValues]}
                  fullWidth
                />
              </div>
            ))}
          </Grid>

          {/* selección de respuesta correcta */}
          <Controller
            name="answer"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                select
                label="Respuesta correcta"
                {...field}
                error={!!errors.answer}
                disabled={!opts.some(o => o?.trim())} 
              >
                {opts.map((opt, i) => (
                  <MenuItem key={i} value={opt} disabled={!opt?.trim()}>
                    {opt || `Opción ${i + 1}`}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </DialogContent>

        <DialogActions sx={{ pr:3, pb:2 }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="contained" type="submit"
            disabled={addQ.isPending || upQ.isPending}>
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
