import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { QuizQuestionDTO } from '../../api/quizzes/quizzes.types';

/** estructura que enviará el formulario */
type QuestionForm = {
  prompt: string;
  answer: number;
};

interface Props {
  open: boolean;
  onClose: () => void;
  initial?: QuizQuestionDTO | null;
  onSave: (d: { prompt: string; choices: string[]; answer: number }) => void;
}

export default function QuestionDialog({
  open,
  onClose,
  initial,
  onSave
}: Props) {
  /* Opciones en estado local */
  const [choices, setChoices] = useState<string[]>(
    initial ? [...initial.choices] : ['', '']
  );

  /* RHF para prompt y answer */
  const {
    register,
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<QuestionForm>({
    defaultValues: {
      prompt: initial?.prompt ?? '',
      answer: initial?.answer ?? 0
    }
  });

  /* helpers */
  const addChoice = () => setChoices((c) => [...c, '']);
  const removeChoice = (idx: number) => {
    setChoices((c) => c.filter((_, i) => i !== idx));
    /* reajustar answer si quedó fuera de rango */
    const newAnswer = watch('answer') >= idx ? Math.max(watch('answer') - 1, 0) : watch('answer');
    setValue('answer', newAnswer);
  };

  const submit = handleSubmit(({ prompt, answer }) => {
    if (choices.length < 2) return; // al menos 2 opciones
    onSave({ prompt, choices, answer });
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initial ? 'Editar pregunta' : 'Nueva pregunta'}</DialogTitle>

      <form onSubmit={submit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Enunciado"
            {...register('prompt', { required: true })}
            error={!!errors.prompt}
            fullWidth
          />

          {/* ——— opciones + radigroup controlado por RHF ——— */}
          <Controller
            name="answer"
            control={control}
            render={({ field }) => (
              <RadioGroup
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              >
                {choices.map((choice, idx) => (
                  <Box
                    key={idx}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
                  >
                    <FormControlLabel
                      value={idx}
                      control={<Radio />}
                      label=""
                    />

                    <TextField
                      value={choice}
                      required
                      fullWidth
                      label={`Opción ${idx + 1}`}
                      onChange={(e) =>
                        setChoices((c) =>
                          c.map((v, i) => (i === idx ? e.target.value : v))
                        )
                      }
                    />

                    {choices.length > 2 && (
                      <Tooltip title="Eliminar">
                        <IconButton size="small" onClick={() => removeChoice(idx)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                ))}
              </RadioGroup>
            )}
          />

          <Button
            startIcon={<AddIcon />}
            onClick={addChoice}
            sx={{ alignSelf: 'flex-start', mt: 1 }}
          >
            Añadir opción
          </Button>
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
